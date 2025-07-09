import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes')
  console.error('Vérifiez que .env.local contient:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY (clé de service, pas la clé anonyme)')
  process.exit(1)
}

async function main() {
  console.log('🔍 Audit et correction des séances sans exercise_templates (mode admin)...')
  console.log(`📡 Connexion à: ${supabaseUrl}`)

  // Utiliser la clé de service pour contourner RLS
  const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // 1. Récupérer tous les programmes
    console.log('📋 Récupération des programmes...')
    const { data: programs, error: progError } = await supabase
      .from('workout_programs')
      .select('id, name, duration_weeks, sessions_per_week')
    
    if (progError) {
      console.error('❌ Erreur lors de la récupération des programmes:', progError)
      return
    }

    console.log(`✅ ${programs?.length || 0} programmes trouvés`)

    let templatesAdded = 0

    for (const prog of programs || []) {
      console.log(`\n🏋️ Programme: ${prog.name} (${prog.duration_weeks} semaines, ${prog.sessions_per_week} séances/semaine)`)
      
      for (let week = 1; week <= prog.duration_weeks; week++) {
        for (let session = 1; session <= prog.sessions_per_week; session++) {
          // 2. Vérifier s'il existe au moins un template pour cette séance
          const { data: templates, error: tempError } = await supabase
            .from('exercise_templates')
            .select('id')
            .eq('program_id', prog.id)
            .eq('week_number', week)
            .eq('session_number', session)
          
          if (tempError) {
            console.error(`❌ Erreur vérification templates S${week} Séance${session}:`, tempError)
            continue
          }
          
          if (!templates || templates.length === 0) {
            // 3. Insérer un template minimal
            const { error: insertError } = await supabase
              .from('exercise_templates')
              .insert({
                program_id: prog.id,
                week_number: week,
                session_number: session,
                exercise_name: 'Exercice à définir',
                exercise_type: 'Poids du corps',
                sets: 3,
                reps: 10,
                weight: 0,
                notes: 'À personnaliser',
                order_index: 1
              })
            
            if (insertError) {
              console.error(`❌ Erreur insertion template pour ${prog.name} S${week} Séance${session}:`, insertError)
            } else {
              console.log(`✅ Template ajouté pour ${prog.name} S${week} Séance${session}`)
              templatesAdded++
            }
          }
        }
      }
    }
    
    console.log(`\n🎉 Correction terminée ! ${templatesAdded} templates ajoutés`)
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

main().catch(e => { 
  console.error('❌ Erreur fatale:', e)
  process.exit(1) 
}) 