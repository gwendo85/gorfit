import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const challenges = [
  {
    title: '3 séances/semaine',
    description: 'Réalise 12 séances en 4 semaines pour développer une routine régulière',
    type: 'sessions',
    target: 12,
    reward_badge_title: '🏆 Discipline',
    reward_badge_description: 'Tu as développé une routine d\'entraînement régulière !',
    duration_days: 30,
    icon_emoji: '📅'
  },
  {
    title: '500 burpees',
    description: 'Fais 500 burpees cumulés en 30 jours pour améliorer ton cardio',
    type: 'reps',
    target: 500,
    reward_badge_title: '⚡ Warrior',
    reward_badge_description: 'Tu as survécu à 500 burpees ! Tu es un vrai guerrier !',
    duration_days: 30,
    icon_emoji: '💪'
  },
  {
    title: 'Summer Shred',
    description: '20 séances cardio en 45 jours pour sculpter ton corps avant l\'été',
    type: 'sessions',
    target: 20,
    reward_badge_title: '🔥 Shredder',
    reward_badge_description: 'Ton corps est prêt pour l\'été ! Tu es un vrai shredder !',
    duration_days: 45,
    icon_emoji: '🏖️'
  },
  {
    title: '100k kg soulevés',
    description: 'Soulève 100 000 kg cumulés en 90 jours pour devenir une bête',
    type: 'volume',
    target: 100000,
    reward_badge_title: '🦍 Beast Mode',
    reward_badge_description: 'Tu as soulevé 100 tonnes ! Tu es en mode bête !',
    duration_days: 90,
    icon_emoji: '🏋️‍♂️'
  },
  {
    title: 'Fessiers d\'acier',
    description: '500 Hip Thrusts en 30 jours pour des fessiers en béton',
    type: 'reps',
    target: 500,
    reward_badge_title: '🍑 Glute Queen',
    reward_badge_description: 'Tes fessiers sont maintenant en acier ! Tu es une reine !',
    duration_days: 30,
    icon_emoji: '🍑'
  },
  {
    title: 'Cardio Master',
    description: '15 séances cardio en 21 jours pour améliorer ton endurance',
    type: 'sessions',
    target: 15,
    reward_badge_title: '❤️ Cardio Master',
    reward_badge_description: 'Ton cardio est maintenant au top ! Tu es un master !',
    duration_days: 21,
    icon_emoji: '❤️'
  },
  {
    title: 'Force brute',
    description: '50 000 kg soulevés en 30 jours pour développer ta force',
    type: 'volume',
    target: 50000,
    reward_badge_title: '💪 Force Brute',
    reward_badge_description: 'Tu as développé une force brute ! Tu es une machine !',
    duration_days: 30,
    icon_emoji: '💪'
  },
  {
    title: 'Consistance parfaite',
    description: '30 jours d\'entraînement consécutifs sans manquer un jour',
    type: 'sessions',
    target: 30,
    reward_badge_title: '🎯 Consistance',
    reward_badge_description: '30 jours consécutifs ! Tu as une consistance parfaite !',
    duration_days: 30,
    icon_emoji: '🎯'
  }
]

async function insertChallenges() {
  console.log('🚀 Insertion des challenges...')
  
  for (const challenge of challenges) {
    const { error } = await supabase
      .from('challenges')
      .insert(challenge)
    
    if (error) {
      console.error(`❌ Erreur pour ${challenge.title}:`, error)
    } else {
      console.log(`✅ Challenge ajouté: ${challenge.title}`)
    }
  }
  
  console.log('🎉 Insertion terminée !')
}

insertChallenges().catch(console.error) 