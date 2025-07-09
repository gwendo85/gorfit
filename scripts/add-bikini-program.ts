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

// Interface pour les exercices détaillés
interface DetailedExercise {
  name: string
  type: 'Poids du corps' | 'Charges externes'
  sets: number
  reps: string
  weight: number
  notes: string
  rest_time?: string
  tips?: string
}

// Interface pour une séance détaillée
interface DetailedSession {
  name: string
  focus: string
  exercises: DetailedExercise[]
  tips?: string
}

// Interface pour une semaine détaillée
interface DetailedWeek {
  week_number: number
  title: string
  goal: string
  sessions: DetailedSession[]
}

// Interface pour un programme détaillé
interface DetailedProgram {
  name: string
  emoji: string
  duration_weeks: number
  sessions_per_week: number
  objective: string
  frequency: string
  session_duration: string
  rest_time: string
  weeks: DetailedWeek[]
}

// Programme Shape Bikini
const bikiniProgram: DetailedProgram = {
  name: "Shape Bikini",
  emoji: "👙",
  duration_weeks: 5,
  sessions_per_week: 4,
  objective: "Tonifier et affiner la silhouette, renforcer le bas du corps et le core, améliorer posture et confiance en soi.",
  frequency: "4 séances/semaine",
  session_duration: "45 à 60 min",
  rest_time: "45-60 sec entre les exercices, 90 sec entre circuits",
  weeks: [
    {
      week_number: 1,
      title: "Mise en route et activation",
      goal: "Activer les chaînes musculaires, améliorer la technique et la posture.",
      sessions: [
        {
          name: "Full Body",
          focus: "Full Body",
          exercises: [
            {
              name: "Air Squats",
              type: "Poids du corps",
              sets: 4,
              reps: "15",
              weight: 0,
              notes: "Technique",
              rest_time: "60 sec",
              tips: "Amplitude complète, respiration contrôlée"
            },
            {
              name: "Push-ups",
              type: "Poids du corps",
              sets: 4,
              reps: "12",
              weight: 0,
              notes: "Haut du corps",
              rest_time: "60 sec"
            },
            {
              name: "Rowing élastique",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 5,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 30,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ],
          tips: "Amplitude complète, respiration contrôlée, contraction des abdos"
        },
        {
          name: "Bas du corps",
          focus: "Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 15,
              notes: "Technique",
              rest_time: "60 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 4,
              reps: "12/jambe",
              weight: 10,
              notes: "Unilatéral",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 35,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Abductions avec élastique",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "45 sec"
            },
            {
              name: "Mollets debout",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 25,
              notes: "Mollets",
              rest_time: "45 sec"
            }
          ]
        },
        {
          name: "Haut du corps",
          focus: "Upper Body",
          exercises: [
            {
              name: "Développé militaire haltères",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 15,
              notes: "Épaules",
              rest_time: "60 sec"
            },
            {
              name: "Rowing unilatéral haltère",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 12,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Élévations latérales",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 8,
              notes: "Épaules",
              rest_time: "45 sec"
            },
            {
              name: "Curl biceps",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 10,
              notes: "Biceps",
              rest_time: "45 sec"
            },
            {
              name: "Triceps poulie",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 8,
              notes: "Triceps",
              rest_time: "45 sec"
            }
          ]
        },
        {
          name: "Cardio + Core",
          focus: "Cardio + Core",
          exercises: [
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "20 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Jumping jacks, burpees, mountain climbers, high knees",
              rest_time: "0 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Russian Twists",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Gainage latéral",
              type: "Poids du corps",
              sets: 3,
              reps: "30 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 2,
      title: "Progression volume",
      goal: "Passer à 4x15-20 reps sur les exercices poids du corps. Légère augmentation des charges pour les exercices avec haltères. Accent sur la qualité d'exécution.",
      sessions: [
        {
          name: "Full Body",
          focus: "Full Body",
          exercises: [
            {
              name: "Air Squats",
              type: "Poids du corps",
              sets: 4,
              reps: "20",
              weight: 0,
              notes: "Technique",
              rest_time: "60 sec"
            },
            {
              name: "Push-ups",
              type: "Poids du corps",
              sets: 4,
              reps: "15",
              weight: 0,
              notes: "Haut du corps",
              rest_time: "60 sec"
            },
            {
              name: "Rowing élastique",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 8,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 40,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche",
              type: "Poids du corps",
              sets: 3,
              reps: "60 sec",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ]
        },
        {
          name: "Bas du corps",
          focus: "Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 20,
              notes: "Technique",
              rest_time: "60 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 4,
              reps: "15/jambe",
              weight: 15,
              notes: "Unilatéral",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 45,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Abductions avec élastique",
              type: "Charges externes",
              sets: 3,
              reps: "25",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "45 sec"
            },
            {
              name: "Mollets debout",
              type: "Charges externes",
              sets: 3,
              reps: "25",
              weight: 30,
              notes: "Mollets",
              rest_time: "45 sec"
            }
          ]
        },
        {
          name: "Haut du corps",
          focus: "Upper Body",
          exercises: [
            {
              name: "Développé militaire haltères",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 18,
              notes: "Épaules",
              rest_time: "60 sec"
            },
            {
              name: "Rowing unilatéral haltère",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 15,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Élévations latérales",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 10,
              notes: "Épaules",
              rest_time: "45 sec"
            },
            {
              name: "Curl biceps",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 12,
              notes: "Biceps",
              rest_time: "45 sec"
            },
            {
              name: "Triceps poulie",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 10,
              notes: "Triceps",
              rest_time: "45 sec"
            }
          ]
        },
        {
          name: "Cardio + Core",
          focus: "Cardio + Core",
          exercises: [
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "25 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Jumping jacks, burpees, mountain climbers, high knees",
              rest_time: "0 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "25",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Russian Twists",
              type: "Poids du corps",
              sets: 3,
              reps: "25",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Gainage latéral",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 3,
      title: "Intensification",
      goal: "Inclure des supersets : Squat + Fentes, Push-ups + Rowing. Réduire le temps de repos à 45 sec entre les séries.",
      sessions: [
        {
          name: "Full Body (Supersets)",
          focus: "Full Body",
          exercises: [
            {
              name: "Air Squats",
              type: "Poids du corps",
              sets: 4,
              reps: "15",
              weight: 0,
              notes: "Superset avec Fentes",
              rest_time: "45 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 4,
              reps: "12/jambe",
              weight: 15,
              notes: "Superset avec Squats",
              rest_time: "45 sec"
            },
            {
              name: "Push-ups",
              type: "Poids du corps",
              sets: 4,
              reps: "12",
              weight: 0,
              notes: "Superset avec Rowing",
              rest_time: "45 sec"
            },
            {
              name: "Rowing élastique",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 10,
              notes: "Superset avec Push-ups",
              rest_time: "45 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 50,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche",
              type: "Poids du corps",
              sets: 3,
              reps: "60 sec",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            }
          ],
          tips: "Supersets : Squat + Fentes, Push-ups + Rowing"
        },
        {
          name: "Bas du corps (Supersets)",
          focus: "Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 25,
              notes: "Superset avec Fentes",
              rest_time: "45 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 4,
              reps: "12/jambe",
              weight: 20,
              notes: "Superset avec Squats",
              rest_time: "45 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 55,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Abductions avec élastique",
              type: "Charges externes",
              sets: 3,
              reps: "30",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "45 sec"
            },
            {
              name: "Mollets debout",
              type: "Charges externes",
              sets: 3,
              reps: "30",
              weight: 35,
              notes: "Mollets",
              rest_time: "45 sec"
            }
          ]
        },
        {
          name: "Haut du corps (Supersets)",
          focus: "Upper Body",
          exercises: [
            {
              name: "Développé militaire haltères",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 20,
              notes: "Épaules",
              rest_time: "60 sec"
            },
            {
              name: "Rowing unilatéral haltère",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 18,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Élévations latérales",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 12,
              notes: "Épaules",
              rest_time: "45 sec"
            },
            {
              name: "Curl biceps",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 15,
              notes: "Biceps",
              rest_time: "45 sec"
            },
            {
              name: "Triceps poulie",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 12,
              notes: "Triceps",
              rest_time: "45 sec"
            }
          ]
        },
        {
          name: "Cardio + Core",
          focus: "Cardio + Core",
          exercises: [
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "30 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Jumping jacks, burpees, mountain climbers, high knees",
              rest_time: "0 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "30",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Russian Twists",
              type: "Poids du corps",
              sets: 3,
              reps: "30",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Gainage latéral",
              type: "Poids du corps",
              sets: 3,
              reps: "60 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 4,
      title: "Cardio & Cut",
      goal: "Ajouter 10-15 min HIIT à la fin des séances (corde, burpees, mountain climbers). Maintenir le volume sur les exercices de renforcement.",
      sessions: [
        {
          name: "Full Body + Cardio",
          focus: "Full Body + Cardio",
          exercises: [
            {
              name: "Air Squats",
              type: "Poids du corps",
              sets: 4,
              reps: "20",
              weight: 0,
              notes: "Technique",
              rest_time: "60 sec"
            },
            {
              name: "Push-ups",
              type: "Poids du corps",
              sets: 4,
              reps: "15",
              weight: 0,
              notes: "Haut du corps",
              rest_time: "60 sec"
            },
            {
              name: "Rowing élastique",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 12,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 60,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche",
              type: "Poids du corps",
              sets: 3,
              reps: "60 sec",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "15 min",
              weight: 0,
              notes: "Corde, burpees, mountain climbers",
              rest_time: "0 sec"
            }
          ],
          tips: "Ajouter 10-15 min HIIT à la fin des séances"
        },
        {
          name: "Bas du corps + Cardio",
          focus: "Lower Body + Cardio",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 30,
              notes: "Technique",
              rest_time: "60 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 4,
              reps: "15/jambe",
              weight: 25,
              notes: "Unilatéral",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 65,
              notes: "Fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Abductions avec élastique",
              type: "Charges externes",
              sets: 3,
              reps: "30",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "45 sec"
            },
            {
              name: "Mollets debout",
              type: "Charges externes",
              sets: 3,
              reps: "30",
              weight: 40,
              notes: "Mollets",
              rest_time: "45 sec"
            },
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "15 min",
              weight: 0,
              notes: "Corde, burpees, mountain climbers",
              rest_time: "0 sec"
            }
          ]
        },
        {
          name: "Haut du corps + Cardio",
          focus: "Upper Body + Cardio",
          exercises: [
            {
              name: "Développé militaire haltères",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 22,
              notes: "Épaules",
              rest_time: "60 sec"
            },
            {
              name: "Rowing unilatéral haltère",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 20,
              notes: "Dos",
              rest_time: "60 sec"
            },
            {
              name: "Élévations latérales",
              type: "Charges externes",
              sets: 3,
              reps: "25",
              weight: 15,
              notes: "Épaules",
              rest_time: "45 sec"
            },
            {
              name: "Curl biceps",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 18,
              notes: "Biceps",
              rest_time: "45 sec"
            },
            {
              name: "Triceps poulie",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 15,
              notes: "Triceps",
              rest_time: "45 sec"
            },
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "15 min",
              weight: 0,
              notes: "Corde, burpees, mountain climbers",
              rest_time: "0 sec"
            }
          ]
        },
        {
          name: "Cardio + Core Intensif",
          focus: "Cardio + Core",
          exercises: [
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "35 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Jumping jacks, burpees, mountain climbers, high knees",
              rest_time: "0 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "35",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Russian Twists",
              type: "Poids du corps",
              sets: 3,
              reps: "35",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Gainage latéral",
              type: "Poids du corps",
              sets: 3,
              reps: "90 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 5,
      title: "Deload actif",
      goal: "Récupération active tout en maintenant la régularité. Réduire les charges à 50-60% RM. Faire 3x12-15 reps par exercice. Focus sur mobilité, étirements et respiration.",
      sessions: [
        {
          name: "Full Body (Deload)",
          focus: "Full Body",
          exercises: [
            {
              name: "Air Squats",
              type: "Poids du corps",
              sets: 3,
              reps: "15",
              weight: 0,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Push-ups",
              type: "Poids du corps",
              sets: 3,
              reps: "12",
              weight: 0,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Rowing élastique",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 5,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 30,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Planche",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mobilité et étirements",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Mobilité, étirements et respiration",
              rest_time: "0 sec"
            }
          ],
          tips: "Deload : réduction des charges à 50-60% RM"
        },
        {
          name: "Bas du corps (Deload)",
          focus: "Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 15,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 3,
              reps: "12/jambe",
              weight: 10,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 35,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Abductions avec élastique",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "45 sec"
            },
            {
              name: "Mollets debout",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 25,
              notes: "Mollets",
              rest_time: "45 sec"
            },
            {
              name: "Mobilité et étirements",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Mobilité, étirements et respiration",
              rest_time: "0 sec"
            }
          ]
        },
        {
          name: "Haut du corps (Deload)",
          focus: "Upper Body",
          exercises: [
            {
              name: "Développé militaire haltères",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 12,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Rowing unilatéral haltère",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 10,
              notes: "Deload",
              rest_time: "60 sec"
            },
            {
              name: "Élévations latérales",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 8,
              notes: "Épaules",
              rest_time: "45 sec"
            },
            {
              name: "Curl biceps",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 10,
              notes: "Biceps",
              rest_time: "45 sec"
            },
            {
              name: "Triceps poulie",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 8,
              notes: "Triceps",
              rest_time: "45 sec"
            },
            {
              name: "Mobilité et étirements",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Mobilité, étirements et respiration",
              rest_time: "0 sec"
            }
          ]
        },
        {
          name: "Cardio + Core (Deload)",
          focus: "Cardio + Core",
          exercises: [
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "20 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Jumping jacks, burpees, mountain climbers, high knees",
              rest_time: "0 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Russian Twists",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Gainage latéral",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "45 sec"
            },
            {
              name: "Mobilité et étirements",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Mobilité, étirements et respiration",
              rest_time: "0 sec"
            }
          ]
        }
      ]
    }
  ]
}

async function main() {
  console.log('👙 Ajout du programme Shape Bikini...')
  console.log(`📡 Connexion à: ${supabaseUrl}`)

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    const program = bikiniProgram
    console.log(`\n🏋️ Programme: ${program.emoji} ${program.name}`)
    console.log(`📅 ${program.frequency} - ${program.session_duration}`)
    console.log(`🎯 ${program.objective}`)
    console.log(`⏱️ Repos: ${program.rest_time}`)

    // Créer ou mettre à jour le programme
    const { data: existingProgram, error: progError } = await supabase
      .from('workout_programs')
      .select('id')
      .eq('name', `${program.emoji} ${program.name}`)
      .single()

    let programId: string

    if (existingProgram) {
      programId = existingProgram.id
      console.log(`✅ Programme existant trouvé: ${programId}`)
    } else {
      // Créer le nouveau programme
      const { data: newProgram, error: createError } = await supabase
        .from('workout_programs')
        .insert({
          name: `${program.emoji} ${program.name}`,
          description: `${program.objective}\n\n📅 ${program.frequency}\n⏱️ ${program.session_duration}\n🛑 ${program.rest_time}`,
          duration_weeks: program.duration_weeks,
          sessions_per_week: program.sessions_per_week,
          difficulty_level: 'Intermédiaire',
          category: 'Musculation'
        })
        .select('id')
        .single()

      if (createError) {
        console.error(`❌ Erreur création programme ${program.name}:`, createError)
        return
      }

      programId = newProgram.id
      console.log(`✅ Nouveau programme créé: ${programId}`)
    }

    // Supprimer tous les templates existants pour ce programme
    const { error: deleteError } = await supabase
      .from('exercise_templates')
      .delete()
      .eq('program_id', programId)

    if (deleteError) {
      console.error(`❌ Erreur suppression templates:`, deleteError)
    }

    let exercisesAdded = 0

    // Ajouter les exercices pour chaque semaine
    for (const week of program.weeks) {
      console.log(`\n📅 Semaine ${week.week_number}: ${week.title}`)
      console.log(`🎯 ${week.goal}`)

      for (let sessionIndex = 0; sessionIndex < week.sessions.length; sessionIndex++) {
        const session = week.sessions[sessionIndex]
        const sessionNumber = sessionIndex + 1

        console.log(`\n💪 Séance ${sessionNumber}: ${session.name}`)
        console.log(`🎯 Focus: ${session.focus}`)

        // Ajouter les exercices pour cette séance
        for (let exerciseIndex = 0; exerciseIndex < session.exercises.length; exerciseIndex++) {
          const exercise = session.exercises[exerciseIndex]
          
          const notes = [
            exercise.notes,
            exercise.rest_time ? `Repos: ${exercise.rest_time}` : null,
            exercise.tips ? `Conseil: ${exercise.tips}` : null
          ].filter(Boolean).join(' | ')

          // Convertir les répétitions en nombre pour la base de données
          let repsNumber = 10 // valeur par défaut
          if (exercise.reps.includes('/')) {
            // Pour "10/jambe", prendre le premier nombre
            repsNumber = parseInt(exercise.reps.split('/')[0])
          } else if (exercise.reps.includes('min')) {
            // Pour "1 min", convertir en secondes
            const minutes = parseInt(exercise.reps.split(' ')[0])
            repsNumber = minutes * 60
          } else {
            // Nombre normal
            repsNumber = parseInt(exercise.reps)
          }

          const { error: insertError } = await supabase
            .from('exercise_templates')
            .insert({
              program_id: programId,
              week_number: week.week_number,
              session_number: sessionNumber,
              exercise_name: exercise.name,
              exercise_type: exercise.type,
              sets: exercise.sets,
              reps: repsNumber,
              weight: exercise.weight,
              notes: notes,
              order_index: exerciseIndex + 1
            })

          if (insertError) {
            console.error(`❌ Erreur insertion ${exercise.name}:`, insertError)
          } else {
            console.log(`✅ ${exercise.name} - ${exercise.sets}x${exercise.reps} @ ${exercise.weight}kg`)
            exercisesAdded++
          }
        }

        if (session.tips) {
          console.log(`💡 ${session.tips}`)
        }
      }
    }

    console.log(`\n🎉 Programme ${program.name} terminé ! ${exercisesAdded} exercices ajoutés`)
    console.log('\n🎉 Programme Shape Bikini ajouté avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

main().catch(e => { 
  console.error('❌ Erreur fatale:', e)
  process.exit(1) 
}) 