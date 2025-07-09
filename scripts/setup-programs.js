const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configuration Supabase (à adapter selon ton projet)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupPrograms() {
  try {
    console.log('🚀 Démarrage de la configuration des parcours GorFit...')
    
    // Lire le fichier SQL
    const sqlPath = path.join(__dirname, 'setup-programs.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    // Exécuter le script SQL
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent })
    
    if (error) {
      console.error('❌ Erreur lors de l\'exécution du script SQL:', error)
      return
    }
    
    console.log('✅ Tables et données des parcours créées avec succès !')
    console.log('📋 Parcours disponibles :')
    console.log('  - 💪 Prise de Masse Power (4 semaines)')
    console.log('  - 🔥 Full Body Summer (3 semaines)')
    console.log('  - 🍃 Sèche Définition (3 semaines)')
    console.log('  - 🍑 Spécial Fessiers (4 semaines)')
    console.log('  - ⚔️ Gladiateur Intensif (5 semaines)')
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error)
  }
}

// Alternative : exécuter les requêtes une par une
async function setupProgramsAlternative() {
  try {
    console.log('🚀 Configuration alternative des parcours...')
    
    // Créer la table workout_programs
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS workout_programs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          objective VARCHAR(255) NOT NULL,
          duration_weeks INTEGER NOT NULL,
          sessions_per_week INTEGER NOT NULL,
          description TEXT NOT NULL,
          image_url VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (createTableError) {
      console.error('Erreur création table workout_programs:', createTableError)
    } else {
      console.log('✅ Table workout_programs créée')
    }
    
    // Insérer les parcours
    const programs = [
      {
        name: '💪 Prise de Masse Power',
        objective: 'Développer la masse musculaire et la force',
        duration_weeks: 4,
        sessions_per_week: 4,
        description: 'Programme intensif de 4 semaines pour prendre de la masse musculaire. Séances progressives avec focus sur les exercices polyarticulaires et la surcharge progressive.',
        image_url: '/images/programs/muscle-gain.jpg'
      },
      {
        name: '🔥 Full Body Summer',
        objective: 'Tonifier tout le corps pour l\'été',
        duration_weeks: 3,
        sessions_per_week: 3,
        description: 'Programme complet de 3 semaines pour sculpter votre corps avant l\'été. Exercices full body avec intensité modérée à élevée.',
        image_url: '/images/programs/summer-body.jpg'
      },
      {
        name: '🍃 Sèche Définition',
        objective: 'Perdre du gras et définir les muscles',
        duration_weeks: 3,
        sessions_per_week: 4,
        description: 'Programme de 3 semaines pour perdre du gras tout en préservant la masse musculaire. Combinaison cardio et musculation.',
        image_url: '/images/programs/definition.jpg'
      },
      {
        name: '🍑 Spécial Fessiers',
        objective: 'Développer et tonifier les fessiers',
        duration_weeks: 4,
        sessions_per_week: 3,
        description: 'Programme spécialisé de 4 semaines pour sculpter et tonifier vos fessiers. Exercices ciblés et progressifs.',
        image_url: '/images/programs/glutes.jpg'
      },
      {
        name: '⚔️ Gladiateur Intensif',
        objective: 'Défi physique complet et intensif',
        duration_weeks: 5,
        sessions_per_week: 5,
        description: 'Programme intensif de 5 semaines pour les athlètes confirmés. Développement de la force, endurance et condition physique générale.',
        image_url: '/images/programs/gladiator.jpg'
      }
    ]
    
    for (const program of programs) {
      const { error: insertError } = await supabase
        .from('workout_programs')
        .insert(program)
      
      if (insertError) {
        console.error(`Erreur insertion ${program.name}:`, insertError)
      } else {
        console.log(`✅ ${program.name} ajouté`)
      }
    }
    
    console.log('🎉 Configuration terminée !')
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration alternative:', error)
  }
}

// Exécuter la configuration
if (require.main === module) {
  setupProgramsAlternative()
} 