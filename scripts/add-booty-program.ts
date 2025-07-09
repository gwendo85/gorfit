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

// Programme Spécial Fessiers
const bootyProgram: DetailedProgram = {
  name: "Spécial Fessiers",
  emoji: "🍑",
  duration_weeks: 5,
  sessions_per_week: 3,
  objective: "Développer et galber les fessiers tout en renforçant les jambes, améliorer posture et tonicité.",
  frequency: "3 séances/semaine",
  session_duration: "60 à 75 min",
  rest_time: "60-90 sec entre les exercices",
  weeks: [
    {
      week_number: 1,
      title: "Mise en route et activation",
      goal: "Activer les fessiers, poser les bases techniques, améliorer la connexion esprit-muscle.",
      sessions: [
        {
          name: "Force & Activation",
          focus: "Fessiers",
          exercises: [
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 40,
              notes: "@ 65% RM",
              rest_time: "90 sec",
              tips: "Focus sur la contraction en haut du hip thrust et sur l'amplitude"
            },
            {
              name: "Squat",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 35,
              notes: "Contrôle du mouvement",
              rest_time: "90 sec"
            },
            {
              name: "Abductions élastique",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Pont fessiers unilatéral",
              type: "Poids du corps",
              sets: 3,
              reps: "15/jambe",
              weight: 0,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Gainage",
              type: "Poids du corps",
              sets: 3,
              reps: "1 min",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ],
          tips: "Focus sur la contraction en haut du hip thrust et sur l'amplitude"
        },
        {
          name: "Fessiers + Ischios",
          focus: "Fessiers + Ischios",
          exercises: [
            {
              name: "Soulevé de terre jambes tendues",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 30,
              notes: "Ischios et fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes marchées",
              type: "Charges externes",
              sets: 4,
              reps: "12/jambe",
              weight: 20,
              notes: "Unilatéral",
              rest_time: "90 sec"
            },
            {
              name: "Leg Curl",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 25,
              notes: "Isolation ischios",
              rest_time: "75 sec"
            },
            {
              name: "Abduction poulie",
              type: "Charges externes",
              sets: 3,
              reps: "15/jambe",
              weight: 8,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche latérale",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ]
        },
        {
          name: "Full Lower Body + Core",
          focus: "Full Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 15,
              notes: "Technique",
              rest_time: "90 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 35,
              notes: "Fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 3,
              reps: "12/jambe",
              weight: 15,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mollets",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 30,
              notes: "Mollets",
              rest_time: "60 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 2,
      title: "Progression volume",
      goal: "Passer sur 4x12-15 reps sur hip thrust, squat et deadlift. Charges légèrement augmentées si exécution maîtrisée. Accent sur lente descente et contraction maximale en haut.",
      sessions: [
        {
          name: "Force & Activation",
          focus: "Fessiers",
          exercises: [
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 45,
              notes: "@ 70% RM",
              rest_time: "90 sec",
              tips: "Lente descente et contraction maximale en haut"
            },
            {
              name: "Squat",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 40,
              notes: "Contrôle du mouvement",
              rest_time: "90 sec"
            },
            {
              name: "Abductions élastique",
              type: "Charges externes",
              sets: 4,
              reps: "25",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Pont fessiers unilatéral",
              type: "Poids du corps",
              sets: 3,
              reps: "20/jambe",
              weight: 0,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Gainage",
              type: "Poids du corps",
              sets: 3,
              reps: "1 min 15 sec",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ],
          tips: "Lente descente et contraction maximale en haut"
        },
        {
          name: "Fessiers + Ischios",
          focus: "Fessiers + Ischios",
          exercises: [
            {
              name: "Soulevé de terre jambes tendues",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 35,
              notes: "Ischios et fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes marchées",
              type: "Charges externes",
              sets: 4,
              reps: "15/jambe",
              weight: 25,
              notes: "Unilatéral",
              rest_time: "90 sec"
            },
            {
              name: "Leg Curl",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 30,
              notes: "Isolation ischios",
              rest_time: "75 sec"
            },
            {
              name: "Abduction poulie",
              type: "Charges externes",
              sets: 3,
              reps: "20/jambe",
              weight: 10,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche latérale",
              type: "Poids du corps",
              sets: 3,
              reps: "60 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ]
        },
        {
          name: "Full Lower Body + Core",
          focus: "Full Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 20,
              notes: "Technique",
              rest_time: "90 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 40,
              notes: "Fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 3,
              reps: "15/jambe",
              weight: 20,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "25",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mollets",
              type: "Charges externes",
              sets: 3,
              reps: "25",
              weight: 35,
              notes: "Mollets",
              rest_time: "60 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 3,
      title: "Intensification",
      goal: "Inclure des supersets : Hip Thrust + Abduction élastique, Squat + Fentes arrière. 4x12-15 reps/exercice.",
      sessions: [
        {
          name: "Force & Activation (Supersets)",
          focus: "Fessiers",
          exercises: [
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 50,
              notes: "Superset avec Abduction",
              rest_time: "90 sec",
              tips: "Superset : Hip Thrust + Abduction élastique"
            },
            {
              name: "Abductions élastique",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 5,
              notes: "Superset avec Hip Thrust",
              rest_time: "90 sec"
            },
            {
              name: "Squat",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 45,
              notes: "Superset avec Fentes",
              rest_time: "90 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 4,
              reps: "12/jambe",
              weight: 20,
              notes: "Superset avec Squat",
              rest_time: "90 sec"
            },
            {
              name: "Pont fessiers unilatéral",
              type: "Poids du corps",
              sets: 3,
              reps: "15/jambe",
              weight: 0,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Gainage",
              type: "Poids du corps",
              sets: 3,
              reps: "1 min",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ],
          tips: "Supersets : Hip Thrust + Abduction élastique, Squat + Fentes arrière"
        },
        {
          name: "Fessiers + Ischios (Supersets)",
          focus: "Fessiers + Ischios",
          exercises: [
            {
              name: "Soulevé de terre jambes tendues",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 40,
              notes: "Superset avec Leg Curl",
              rest_time: "90 sec"
            },
            {
              name: "Leg Curl",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 35,
              notes: "Superset avec Deadlift",
              rest_time: "90 sec"
            },
            {
              name: "Fentes marchées",
              type: "Charges externes",
              sets: 4,
              reps: "12/jambe",
              weight: 30,
              notes: "Unilatéral",
              rest_time: "90 sec"
            },
            {
              name: "Abduction poulie",
              type: "Charges externes",
              sets: 3,
              reps: "15/jambe",
              weight: 12,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche latérale",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            }
          ]
        },
        {
          name: "Full Lower Body + Core",
          focus: "Full Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 25,
              notes: "Technique",
              rest_time: "90 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "12",
              weight: 45,
              notes: "Fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 3,
              reps: "12/jambe",
              weight: 25,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mollets",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 40,
              notes: "Mollets",
              rest_time: "60 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 4,
      title: "Volume élevé et cardio ciblé",
      goal: "Après chaque séance, ajouter : 10 min de marche inclinée ou HIIT 10 min : 30 sec ON (mountain climbers, burpees) / 30 sec OFF.",
      sessions: [
        {
          name: "Force & Activation + Cardio",
          focus: "Fessiers + Cardio",
          exercises: [
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 55,
              notes: "@ 75% RM",
              rest_time: "90 sec"
            },
            {
              name: "Squat",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 50,
              notes: "Contrôle du mouvement",
              rest_time: "90 sec"
            },
            {
              name: "Abductions élastique",
              type: "Charges externes",
              sets: 4,
              reps: "30",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Pont fessiers unilatéral",
              type: "Poids du corps",
              sets: 3,
              reps: "20/jambe",
              weight: 0,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Gainage",
              type: "Poids du corps",
              sets: 3,
              reps: "1 min 30 sec",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Mountain climbers, burpees",
              rest_time: "0 sec"
            }
          ],
          tips: "Ajouter 10 min de cardio après la séance"
        },
        {
          name: "Fessiers + Ischios + Cardio",
          focus: "Fessiers + Ischios + Cardio",
          exercises: [
            {
              name: "Soulevé de terre jambes tendues",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 45,
              notes: "Ischios et fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes marchées",
              type: "Charges externes",
              sets: 4,
              reps: "15/jambe",
              weight: 35,
              notes: "Unilatéral",
              rest_time: "90 sec"
            },
            {
              name: "Leg Curl",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 40,
              notes: "Isolation ischios",
              rest_time: "75 sec"
            },
            {
              name: "Abduction poulie",
              type: "Charges externes",
              sets: 3,
              reps: "20/jambe",
              weight: 15,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche latérale",
              type: "Poids du corps",
              sets: 3,
              reps: "60 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Marche inclinée",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Cardio ciblé",
              rest_time: "0 sec"
            }
          ]
        },
        {
          name: "Full Lower Body + Core + Cardio",
          focus: "Full Lower Body + Cardio",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 4,
              reps: "20",
              weight: 30,
              notes: "Technique",
              rest_time: "90 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 4,
              reps: "15",
              weight: 50,
              notes: "Fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 3,
              reps: "15/jambe",
              weight: 30,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "25",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mollets",
              type: "Charges externes",
              sets: 3,
              reps: "25",
              weight: 45,
              notes: "Mollets",
              rest_time: "60 sec"
            },
            {
              name: "HIIT Cardio",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "30 sec ON / 30 sec OFF - Mountain climbers, burpees",
              rest_time: "0 sec"
            }
          ]
        }
      ]
    },
    {
      week_number: 5,
      title: "Deload actif",
      goal: "Récupération avec maintien de l'activation. Réduction des charges à 50-60% RM. 3x12 reps par exercice. Inclure étirements et mobilité hanche/bassin en fin de séance.",
      sessions: [
        {
          name: "Force & Activation (Deload)",
          focus: "Fessiers",
          exercises: [
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 30,
              notes: "@ 50% RM - Deload",
              rest_time: "90 sec"
            },
            {
              name: "Squat",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 25,
              notes: "Deload",
              rest_time: "90 sec"
            },
            {
              name: "Abductions élastique",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 5,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Pont fessiers unilatéral",
              type: "Poids du corps",
              sets: 3,
              reps: "15/jambe",
              weight: 0,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Gainage",
              type: "Poids du corps",
              sets: 3,
              reps: "1 min",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mobilité hanche/bassin",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Étirements et mobilité",
              rest_time: "0 sec"
            }
          ],
          tips: "Deload : réduction des charges à 50-60% RM"
        },
        {
          name: "Fessiers + Ischios (Deload)",
          focus: "Fessiers + Ischios",
          exercises: [
            {
              name: "Soulevé de terre jambes tendues",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 25,
              notes: "Deload",
              rest_time: "90 sec"
            },
            {
              name: "Fentes marchées",
              type: "Charges externes",
              sets: 3,
              reps: "12/jambe",
              weight: 15,
              notes: "Unilatéral",
              rest_time: "90 sec"
            },
            {
              name: "Leg Curl",
              type: "Charges externes",
              sets: 3,
              reps: "15",
              weight: 20,
              notes: "Isolation ischios",
              rest_time: "75 sec"
            },
            {
              name: "Abduction poulie",
              type: "Charges externes",
              sets: 3,
              reps: "15/jambe",
              weight: 8,
              notes: "Isolation fessiers",
              rest_time: "60 sec"
            },
            {
              name: "Planche latérale",
              type: "Poids du corps",
              sets: 3,
              reps: "45 sec/côté",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mobilité hanche/bassin",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Étirements et mobilité",
              rest_time: "0 sec"
            }
          ]
        },
        {
          name: "Full Lower Body + Core (Deload)",
          focus: "Full Lower Body",
          exercises: [
            {
              name: "Goblet Squat",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 15,
              notes: "Technique",
              rest_time: "90 sec"
            },
            {
              name: "Hip Thrust",
              type: "Charges externes",
              sets: 3,
              reps: "12",
              weight: 30,
              notes: "Fessiers",
              rest_time: "90 sec"
            },
            {
              name: "Fentes arrière",
              type: "Charges externes",
              sets: 3,
              reps: "12/jambe",
              weight: 15,
              notes: "Unilatéral",
              rest_time: "75 sec"
            },
            {
              name: "Crunch",
              type: "Poids du corps",
              sets: 3,
              reps: "20",
              weight: 0,
              notes: "Core",
              rest_time: "60 sec"
            },
            {
              name: "Mollets",
              type: "Charges externes",
              sets: 3,
              reps: "20",
              weight: 30,
              notes: "Mollets",
              rest_time: "60 sec"
            },
            {
              name: "Mobilité hanche/bassin",
              type: "Poids du corps",
              sets: 1,
              reps: "10 min",
              weight: 0,
              notes: "Étirements et mobilité",
              rest_time: "0 sec"
            }
          ]
        }
      ]
    }
  ]
}

async function main() {
  console.log('🍑 Ajout du programme Spécial Fessiers...')
  console.log(`📡 Connexion à: ${supabaseUrl}`)

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    const program = bootyProgram
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
    console.log('\n🎉 Programme Spécial Fessiers ajouté avec succès !')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

main().catch(e => { 
  console.error('❌ Erreur fatale:', e)
  process.exit(1) 
}) 