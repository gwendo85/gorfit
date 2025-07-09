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

// Définir les exercices variés par type de programme et séance
const exercisePrograms = {
  '⚔️ Gladiateur Intensif': {
    sessions: {
      1: [ // Séance 1 - Cardio explosif
        { name: 'Burpees', type: 'Poids du corps', sets: 4, reps: 15, weight: 0, notes: 'Explosif' },
        { name: 'Mountain climbers', type: 'Poids du corps', sets: 3, reps: 30, weight: 0, notes: 'Cardio' },
        { name: 'Jumping jacks', type: 'Poids du corps', sets: 3, reps: 50, weight: 0, notes: 'Échauffement' },
        { name: 'High knees', type: 'Poids du corps', sets: 3, reps: 40, weight: 0, notes: 'Cardio' },
        { name: 'Plank to down dog', type: 'Poids du corps', sets: 3, reps: 20, weight: 0, notes: 'Core' }
      ],
      2: [ // Séance 2 - Haut du corps
        { name: 'Pompes diamant', type: 'Poids du corps', sets: 4, reps: 12, weight: 0, notes: 'Triceps' },
        { name: 'Dips sur chaise', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Triceps' },
        { name: 'Pompes inclinées', type: 'Poids du corps', sets: 3, reps: 20, weight: 0, notes: 'Volume' },
        { name: 'Pike push-ups', type: 'Poids du corps', sets: 3, reps: 10, weight: 0, notes: 'Épaules' },
        { name: 'Diamond hold', type: 'Poids du corps', sets: 3, reps: 30, weight: 0, notes: 'Isométrique' }
      ],
      3: [ // Séance 3 - Bas du corps
        { name: 'Squats sautés', type: 'Poids du corps', sets: 4, reps: 20, weight: 0, notes: 'Explosif' },
        { name: 'Fentes sautées', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Unilatéral' },
        { name: 'Wall sit', type: 'Poids du corps', sets: 3, reps: 60, weight: 0, notes: 'Isométrique' },
        { name: 'Calf raises', type: 'Poids du corps', sets: 3, reps: 25, weight: 0, notes: 'Mollets' },
        { name: 'Single leg squats', type: 'Poids du corps', sets: 3, reps: 10, weight: 0, notes: 'Équilibre' }
      ],
      4: [ // Séance 4 - Core
        { name: 'Plank', type: 'Poids du corps', sets: 3, reps: 60, weight: 0, notes: 'Stabilité' },
        { name: 'Russian twists', type: 'Poids du corps', sets: 3, reps: 30, weight: 0, notes: 'Rotation' },
        { name: 'Leg raises', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Bas ventre' },
        { name: 'Bicycle crunches', type: 'Poids du corps', sets: 3, reps: 25, weight: 0, notes: 'Obliques' },
        { name: 'Side plank', type: 'Poids du corps', sets: 3, reps: 30, weight: 0, notes: 'Latéral' }
      ],
      5: [ // Séance 5 - Circuit complet
        { name: 'Burpees', type: 'Poids du corps', sets: 4, reps: 12, weight: 0, notes: 'Explosif' },
        { name: 'Pompes', type: 'Poids du corps', sets: 3, reps: 15, weight: 0, notes: 'Haut corps' },
        { name: 'Squats', type: 'Poids du corps', sets: 3, reps: 20, weight: 0, notes: 'Bas corps' },
        { name: 'Mountain climbers', type: 'Poids du corps', sets: 3, reps: 25, weight: 0, notes: 'Cardio' },
        { name: 'Plank', type: 'Poids du corps', sets: 3, reps: 45, weight: 0, notes: 'Core' }
      ]
    }
  },
  '💪 Hypertrophie Pro Max': {
    sessions: {
      1: [ // Séance 1 - Push (Pectoraux/Triceps/Épaules)
        { name: 'Développé couché', type: 'Charges externes', sets: 4, reps: 8, weight: 60, notes: 'Lourd' },
        { name: 'Développé militaire', type: 'Charges externes', sets: 3, reps: 10, weight: 30, notes: 'Épaules' },
        { name: 'Dips lestés', type: 'Poids du corps', sets: 3, reps: 8, weight: 0, notes: 'Triceps' },
        { name: 'Pompes diamant', type: 'Poids du corps', sets: 3, reps: 12, weight: 0, notes: 'Triceps' },
        { name: 'Lateral raises', type: 'Charges externes', sets: 3, reps: 12, weight: 8, notes: 'Isolation' }
      ],
      2: [ // Séance 2 - Pull (Dos/Biceps)
        { name: 'Tractions', type: 'Poids du corps', sets: 4, reps: 8, weight: 0, notes: 'Dos large' },
        { name: 'Row haltères', type: 'Charges externes', sets: 3, reps: 12, weight: 20, notes: 'Dos épais' },
        { name: 'Curl biceps', type: 'Charges externes', sets: 3, reps: 12, weight: 15, notes: 'Biceps' },
        { name: 'Face pulls', type: 'Charges externes', sets: 3, reps: 15, weight: 10, notes: 'Arrière épaules' },
        { name: 'Hammer curls', type: 'Charges externes', sets: 3, reps: 10, weight: 12, notes: 'Avant-bras' }
      ],
      3: [ // Séance 3 - Legs (Jambes)
        { name: 'Squats avec barre', type: 'Charges externes', sets: 4, reps: 10, weight: 50, notes: 'Quadriceps' },
        { name: 'Deadlift roumain', type: 'Charges externes', sets: 3, reps: 12, weight: 40, notes: 'Ischio' },
        { name: 'Leg press', type: 'Charges externes', sets: 3, reps: 15, weight: 80, notes: 'Volume' },
        { name: 'Calf raises', type: 'Charges externes', sets: 4, reps: 20, weight: 30, notes: 'Mollets' },
        { name: 'Leg extensions', type: 'Charges externes', sets: 3, reps: 15, weight: 25, notes: 'Isolation' }
      ],
      4: [ // Séance 4 - Push (Volume)
        { name: 'Développé incliné', type: 'Charges externes', sets: 4, reps: 10, weight: 45, notes: 'Haut pectoraux' },
        { name: 'Développé haltères', type: 'Charges externes', sets: 3, reps: 12, weight: 25, notes: 'Stabilité' },
        { name: 'Overhead press', type: 'Charges externes', sets: 3, reps: 8, weight: 35, notes: 'Force' },
        { name: 'Tricep extensions', type: 'Charges externes', sets: 3, reps: 15, weight: 12, notes: 'Isolation' },
        { name: 'Pec deck', type: 'Charges externes', sets: 3, reps: 12, weight: 30, notes: 'Isolation' }
      ],
      5: [ // Séance 5 - Pull (Volume)
        { name: 'Tractions lestées', type: 'Poids du corps', sets: 4, reps: 6, weight: 0, notes: 'Force' },
        { name: 'Row barre', type: 'Charges externes', sets: 3, reps: 12, weight: 40, notes: 'Dos épais' },
        { name: 'Lat pulldown', type: 'Charges externes', sets: 3, reps: 12, weight: 50, notes: 'Dos large' },
        { name: 'Curl haltères', type: 'Charges externes', sets: 3, reps: 12, weight: 18, notes: 'Biceps' },
        { name: 'Shrugs', type: 'Charges externes', sets: 3, reps: 15, weight: 35, notes: 'Trapèzes' }
      ]
    }
  },
  '🏋️ Force & Powerlifting': {
    sessions: {
      1: [ // Séance 1 - Squat focus
        { name: 'Squat complet', type: 'Charges externes', sets: 5, reps: 5, weight: 80, notes: 'Force pure' },
        { name: 'Squat pause', type: 'Charges externes', sets: 3, reps: 3, weight: 70, notes: 'Technique' },
        { name: 'Box squats', type: 'Charges externes', sets: 3, reps: 5, weight: 60, notes: 'Explosif' },
        { name: 'Good mornings', type: 'Charges externes', sets: 3, reps: 8, weight: 30, notes: 'Ischio' },
        { name: 'Calf raises', type: 'Charges externes', sets: 3, reps: 15, weight: 40, notes: 'Accessoire' }
      ],
      2: [ // Séance 2 - Bench focus
        { name: 'Développé couché', type: 'Charges externes', sets: 5, reps: 5, weight: 70, notes: 'Force' },
        { name: 'Pause bench', type: 'Charges externes', sets: 3, reps: 3, weight: 60, notes: 'Technique' },
        { name: 'Incline press', type: 'Charges externes', sets: 3, reps: 8, weight: 50, notes: 'Volume' },
        { name: 'Dips lestés', type: 'Poids du corps', sets: 3, reps: 8, weight: 0, notes: 'Triceps' },
        { name: 'Lateral raises', type: 'Charges externes', sets: 3, reps: 12, weight: 8, notes: 'Accessoire' }
      ],
      3: [ // Séance 3 - Deadlift focus
        { name: 'Soulevé de terre', type: 'Charges externes', sets: 3, reps: 5, weight: 100, notes: 'Force' },
        { name: 'Romanian deadlift', type: 'Charges externes', sets: 3, reps: 8, weight: 60, notes: 'Ischio' },
        { name: 'Rack pulls', type: 'Charges externes', sets: 3, reps: 5, weight: 120, notes: 'Grip' },
        { name: 'Barbell rows', type: 'Charges externes', sets: 3, reps: 8, weight: 50, notes: 'Dos' },
        { name: 'Shrugs', type: 'Charges externes', sets: 3, reps: 12, weight: 40, notes: 'Trapèzes' }
      ],
      4: [ // Séance 4 - Overhead focus
        { name: 'Overhead press', type: 'Charges externes', sets: 4, reps: 6, weight: 40, notes: 'Force' },
        { name: 'Push press', type: 'Charges externes', sets: 3, reps: 5, weight: 50, notes: 'Explosif' },
        { name: 'Développé militaire', type: 'Charges externes', sets: 3, reps: 8, weight: 35, notes: 'Volume' },
        { name: 'Lateral raises', type: 'Charges externes', sets: 3, reps: 12, weight: 10, notes: 'Isolation' },
        { name: 'Face pulls', type: 'Charges externes', sets: 3, reps: 15, weight: 12, notes: 'Arrière' }
      ]
    }
  }
}

async function main() {
  console.log('🏋️ Ajout d\'exercices variés selon la séance...')
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
          const sessionExercises = programConfig.sessions[session as keyof typeof programConfig.sessions]
          
          if (!sessionExercises) {
            console.log(`⚠️ Pas d'exercices configurés pour la séance ${session}`)
            continue
          }

          // Supprimer les templates existants pour cette séance
          const { error: deleteError } = await supabase
            .from('exercise_templates')
            .delete()
            .eq('program_id', prog.id)
            .eq('week_number', week)
            .eq('session_number', session)
          
          if (deleteError) {
            console.error(`❌ Erreur suppression templates S${week} Séance${session}:`, deleteError)
          }

          // Ajouter les exercices variés pour cette séance
          for (let i = 0; i < sessionExercises.length; i++) {
            const exercise = sessionExercises[i]
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
    
    console.log(`\n🎉 Personnalisation terminée ! ${exercisesAdded} exercices variés ajoutés`)
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

main().catch(e => { 
  console.error('❌ Erreur fatale:', e)
  process.exit(1) 
}) 