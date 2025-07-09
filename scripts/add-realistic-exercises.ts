import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  process.exit(1)
}

// Définir les exercices par type de programme
const exercisePrograms = {
  '⚔️ Gladiateur Intensif': {
    exercises: [
      { name: 'Burpees', type: 'Poids du corps', sets: 4, reps: 15, weight: 0, notes: 'Explosif' },
      { name: 'Pompes diamant', type: 'Poids du corps', sets: 3, reps: 12, weight: 0, notes: 'Triceps' },
      { name: 'Squats sautés', type: 'Poids du corps', sets: 4, reps: 20, weight: 0, notes: 'Cardio' },
      { name: 'Mountain climbers', type: 'Poids du corps', sets: 3, reps: 30, weight: 0, notes: 'Core' },
      { name: 'Dips sur chaise', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Triceps' }
    ]
  },
  '💪 Hypertrophie Pro Max': {
    exercises: [
      { name: 'Développé couché', type: 'Charges externes', sets: 4, reps: 8, weight: 60, notes: 'Progression' },
      { name: 'Squats avec barre', type: 'Charges externes', sets: 4, reps: 10, weight: 50, notes: 'Forme' },
      { name: 'Tractions', type: 'Poids du corps', sets: 3, reps: 8, weight: 0, notes: 'Dos' },
      { name: 'Développé militaire', type: 'Charges externes', sets: 3, reps: 10, weight: 30, notes: 'Épaules' },
      { name: 'Curl biceps', type: 'Charges externes', sets: 3, reps: 12, weight: 15, notes: 'Isolation' }
    ]
  },
  '🏋️ Force & Powerlifting': {
    exercises: [
      { name: 'Squat complet', type: 'Charges externes', sets: 5, reps: 5, weight: 80, notes: 'Force pure' },
      { name: 'Développé couché', type: 'Charges externes', sets: 5, reps: 5, weight: 70, notes: 'Progression' },
      { name: 'Soulevé de terre', type: 'Charges externes', sets: 3, reps: 5, weight: 100, notes: 'Technique' },
      { name: 'Overhead press', type: 'Charges externes', sets: 4, reps: 6, weight: 40, notes: 'Stabilité' },
      { name: 'Row barre', type: 'Charges externes', sets: 4, reps: 8, weight: 50, notes: 'Dos' }
    ]
  },
  '⚡ Cross Training Intense': {
    exercises: [
      { name: 'Thrusters', type: 'Charges externes', sets: 4, reps: 12, weight: 20, notes: 'Cardio' },
      { name: 'Wall balls', type: 'Charges externes', sets: 3, reps: 15, weight: 8, notes: 'Explosif' },
      { name: 'Box jumps', type: 'Poids du corps', sets: 4, reps: 10, weight: 0, notes: 'Plyométrie' },
      { name: 'Kettlebell swings', type: 'Charges externes', sets: 3, reps: 20, weight: 16, notes: 'Hip hinge' },
      { name: 'Burpees', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Endurance' }
    ]
  },
  '💪 Prise de Masse Power': {
    exercises: [
      { name: 'Développé couché', type: 'Charges externes', sets: 4, reps: 8, weight: 65, notes: 'Volume' },
      { name: 'Squats', type: 'Charges externes', sets: 4, reps: 10, weight: 60, notes: 'Masse' },
      { name: 'Tractions lestées', type: 'Poids du corps', sets: 3, reps: 6, weight: 0, notes: 'Dos large' },
      { name: 'Développé militaire', type: 'Charges externes', sets: 3, reps: 10, weight: 35, notes: 'Épaules' },
      { name: 'Curl haltères', type: 'Charges externes', sets: 3, reps: 12, weight: 18, notes: 'Biceps' }
    ]
  },
  '🔥 Full Body Summer': {
    exercises: [
      { name: 'Squats air', type: 'Poids du corps', sets: 3, reps: 20, weight: 0, notes: 'Tonification' },
      { name: 'Pompes', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Haut du corps' },
      { name: 'Planche', type: 'Poids du corps', sets: 3, reps: 45, weight: 0, notes: 'Core' },
      { name: 'Fentes', type: 'Poids du corps', sets: 3, reps: 12, weight: 0, notes: 'Jambes' },
      { name: 'Burpees', type: 'Poids du corps', sets: 3, reps: 10, weight: 0, notes: 'Cardio' }
    ]
  },
  '🍃 Sèche Définition': {
    exercises: [
      { name: 'Circuit cardio', type: 'Poids du corps', sets: 4, reps: 30, weight: 0, notes: 'HIIT' },
      { name: 'Squats avec poids', type: 'Charges externes', sets: 3, reps: 15, weight: 25, notes: 'Endurance' },
      { name: 'Pompes inclinées', type: 'Poids du corps', sets: 3, reps: 20, weight: 0, notes: 'Volume' },
      { name: 'Mountain climbers', type: 'Poids du corps', sets: 3, reps: 40, weight: 0, notes: 'Cardio' },
      { name: 'Jumping jacks', type: 'Poids du corps', sets: 3, reps: 50, weight: 0, notes: 'Brûle graisse' }
    ]
  },
  '🍑 Spécial Fessiers': {
    exercises: [
      { name: 'Squats bulgares', type: 'Charges externes', sets: 4, reps: 12, weight: 15, notes: 'Unilatéral' },
      { name: 'Hip thrusts', type: 'Charges externes', sets: 4, reps: 15, weight: 30, notes: 'Isolation' },
      { name: 'Fentes arrière', type: 'Charges externes', sets: 3, reps: 12, weight: 12, notes: 'Gluteus' },
      { name: 'Donkey kicks', type: 'Poids du corps', sets: 3, reps: 20, weight: 0, notes: 'Isolation' },
      { name: 'Fire hydrants', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Abducteurs' }
    ]
  },
  '👙 Shape Bikini': {
    exercises: [
      { name: 'Squats sumo', type: 'Charges externes', sets: 3, reps: 15, weight: 20, notes: 'Forme' },
      { name: 'Hip thrusts', type: 'Charges externes', sets: 3, reps: 20, weight: 25, notes: 'Gluteus' },
      { name: 'Lunges', type: 'Poids du corps', sets: 3, reps: 12, weight: 0, notes: 'Tonification' },
      { name: 'Glute bridges', type: 'Poids du corps', sets: 3, reps: 25, weight: 0, notes: 'Activation' },
      { name: 'Side lunges', type: 'Poids du corps', sets: 3, reps: 10, weight: 0, notes: 'Adducteurs' }
    ]
  }
}

async function main() {
  console.log('🏋️ Ajout d\'exercices réalistes et personnalisés...')
  console.log(`📡 Connexion à: ${supabaseUrl}`)

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Récupérer tous les programmes
    console.log('📋 Récupération des programmes...')
    const { data: programs, error: progError } = await supabase
      .from('workout_programs')
      .select('id, name, duration_weeks, sessions_per_week')
    
    if (progError) {
      console.error('❌ Erreur lors de la récupération des programmes:', progError)
      return
    }

    console.log(`✅ ${programs?.length || 0} programmes trouvés`)

    let exercisesAdded = 0

    for (const prog of programs || []) {
      const programConfig = exercisePrograms[prog.name as keyof typeof exercisePrograms]
      
      if (!programConfig) {
        console.log(`⚠️ Pas de configuration pour: ${prog.name}`)
        continue
      }

      console.log(`\n🏋️ Programme: ${prog.name} (${prog.duration_weeks} semaines, ${prog.sessions_per_week} séances/semaine)`)
      
      for (let week = 1; week <= prog.duration_weeks; week++) {
        for (let session = 1; session <= prog.sessions_per_week; session++) {
          // Supprimer les templates génériques existants
          const { error: deleteError } = await supabase
            .from('exercise_templates')
            .delete()
            .eq('program_id', prog.id)
            .eq('week_number', week)
            .eq('session_number', session)
            .eq('exercise_name', 'Exercice à définir')
          
          if (deleteError) {
            console.error(`❌ Erreur suppression templates génériques S${week} Séance${session}:`, deleteError)
          }

          // Ajouter les exercices personnalisés
          for (let i = 0; i < programConfig.exercises.length; i++) {
            const exercise = programConfig.exercises[i]
            const { error: insertError } = await supabase
              .from('exercise_templates')
              .insert({
                program_id: prog.id,
                week_number: week,
                session_number: session,
                exercise_name: exercise.name,
                exercise_type: exercise.type,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                notes: exercise.notes,
                order_index: i + 1
              })
            
            if (insertError) {
              console.error(`❌ Erreur insertion exercice ${exercise.name} pour ${prog.name} S${week} Séance${session}:`, insertError)
            } else {
              console.log(`✅ ${exercise.name} ajouté pour ${prog.name} S${week} Séance${session}`)
              exercisesAdded++
            }
          }
        }
      }
    }
    
    console.log(`\n🎉 Personnalisation terminée ! ${exercisesAdded} exercices personnalisés ajoutés`)
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

main().catch(e => { 
  console.error('❌ Erreur fatale:', e)
  process.exit(1) 
}) 