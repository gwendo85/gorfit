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
  reps: string // Peut contenir "8", "10/jambe", "1 min", etc.
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

// Programmes détaillés
const detailedPrograms: DetailedProgram[] = [
  {
    name: "Hypertrophie Pro Max",
    emoji: "💪",
    duration_weeks: 5,
    sessions_per_week: 3,
    objective: "Prise de masse musculaire structurée, amélioration de la qualité d'exécution, prévention des blessures.",
    frequency: "3 séances/semaine",
    session_duration: "60 à 75 min",
    rest_time: "60-90 sec entre les séries, 2-3 min entre les exercices lourds.",
    weeks: [
      {
        week_number: 1,
        title: "Adaptation & Technique",
        goal: "maîtriser les mouvements, activer les muscles stabilisateurs.",
        sessions: [
          {
            name: "Haut du corps (Push)",
            focus: "Push",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 60,
                notes: "@ 60% RM",
                rest_time: "90 sec",
                tips: "Concentrez-vous sur une amplitude complète et contrôlée, descente lente, sans rebond."
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 25,
                notes: "Épaules",
                rest_time: "75 sec"
              },
              {
                name: "Dips assistés",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "Triceps",
                rest_time: "75 sec"
              },
              {
                name: "Écarté couché",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 15,
                notes: "Isolation pectoraux",
                rest_time: "60 sec"
              }
            ],
            tips: "Concentrez-vous sur une amplitude complète et contrôlée, descente lente, sans rebond."
          },
          {
            name: "Bas du corps (Quad dominant)",
            focus: "Lower Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 50,
                notes: "@ 60% RM",
                rest_time: "2 min",
                tips: "Contrôlez le mouvement, serrez les abdos et regardez droit devant."
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "12/jambe",
                weight: 20,
                notes: "Unilatéral",
                rest_time: "90 sec"
              },
              {
                name: "Leg extension",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 30,
                notes: "Isolation quadriceps",
                rest_time: "75 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 40,
                notes: "Mollets",
                rest_time: "60 sec"
              }
            ],
            tips: "Contrôlez le mouvement, serrez les abdos et regardez droit devant sur le squat."
          },
          {
            name: "Haut du corps (Pull)",
            focus: "Pull",
            exercises: [
              {
                name: "Tractions assistées",
                type: "Poids du corps",
                sets: 4,
                reps: "8",
                weight: 0,
                notes: "Dos large",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 40,
                notes: "Dos épais",
                rest_time: "90 sec"
              },
              {
                name: "Curl barre",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 25,
                notes: "Biceps",
                rest_time: "75 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 12,
                notes: "Arrière épaules",
                rest_time: "60 sec"
              }
            ],
            tips: "Tirez avec les coudes, non avec les mains, et maintenez le bas du dos neutre."
          }
        ]
      },
      {
        week_number: 2,
        title: "Volume Progressif",
        goal: "augmenter progressivement la charge et le volume.",
        sessions: [
          {
            name: "Push",
            focus: "Push",
            exercises: [
              {
                name: "Développé incliné",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 45,
                notes: "Haut pectoraux",
                rest_time: "90 sec",
                tips: "Sur le développé incliné, contrôler la descente pour activer le haut des pectoraux."
              },
              {
                name: "Élévations latérales",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 8,
                notes: "Isolation épaules",
                rest_time: "60 sec"
              },
              {
                name: "Pompes lestées",
                type: "Poids du corps",
                sets: 3,
                reps: "12",
                weight: 0,
                notes: "Volume",
                rest_time: "75 sec"
              },
              {
                name: "Extension triceps corde",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 15,
                notes: "Isolation triceps",
                rest_time: "60 sec"
              }
            ],
            tips: "Sur le développé incliné, contrôler la descente pour activer le haut des pectoraux."
          },
          {
            name: "Lower Body",
            focus: "Lower Body",
            exercises: [
              {
                name: "Soulevé de terre jambes tendues",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 60,
                notes: "Ischio",
                rest_time: "2 min",
                tips: "Priorité à la technique sur le deadlift, dos droit, hanches en arrière."
              },
              {
                name: "Hip Thrust",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 50,
                notes: "Fessiers",
                rest_time: "90 sec"
              },
              {
                name: "Fentes bulgares",
                type: "Charges externes",
                sets: 3,
                reps: "10/jambe",
                weight: 25,
                notes: "Unilatéral",
                rest_time: "90 sec"
              },
              {
                name: "Crunch lesté",
                type: "Charges externes",
                sets: 3,
                reps: "20",
                weight: 10,
                notes: "Abdos",
                rest_time: "60 sec"
              }
            ],
            tips: "Priorité à la technique sur le deadlift, dos droit, hanches en arrière."
          },
          {
            name: "Pull",
            focus: "Pull",
            exercises: [
              {
                name: "Rowing haltères unilatéral",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 25,
                notes: "Dos épais",
                rest_time: "90 sec"
              },
              {
                name: "Tirage horizontal",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 45,
                notes: "Dos large",
                rest_time: "75 sec"
              },
              {
                name: "Curl marteau",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 15,
                notes: "Biceps",
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
            tips: "Contrôlez chaque répétition, évitez de balancer le corps."
          }
        ]
      }
      // Les semaines 3, 4, 5 peuvent être ajoutées ici
    ]
  },
  {
    name: "Force & Powerlifting",
    emoji: "🏋️",
    duration_weeks: 5,
    sessions_per_week: 3,
    objective: "Développer force maximale sur les 3 mouvements de base : Squat, Développé couché, Soulevé de terre.",
    frequency: "3 séances/semaine",
    session_duration: "75-90 min",
    rest_time: "2-4 min sur les gros lifts, 90 sec sur assistance.",
    weeks: [
      {
        week_number: 1,
        title: "Prise en main des charges",
        goal: "Travailler l'explosivité en montée, descente contrôlée, pas d'échec musculaire cette semaine.",
        sessions: [
          {
            name: "Squat focus",
            focus: "Squat",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 80,
                notes: "@ 70% RM",
                rest_time: "3 min",
                tips: "Travailler l'explosivité en montée, descente contrôlée"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 30,
                notes: "Unilatéral",
                rest_time: "2 min"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 50,
                notes: "Mollets",
                rest_time: "90 sec"
              }
            ],
            tips: "Travailler l'explosivité en montée, descente contrôlée, pas d'échec musculaire cette semaine."
          },
          {
            name: "Bench focus",
            focus: "Bench",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 70,
                notes: "@ 70% RM",
                rest_time: "3 min",
                tips: "Contrôle de la descente, explosivité en montée"
              },
              {
                name: "Développé militaire",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 35,
                notes: "Épaules",
                rest_time: "2 min"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "Triceps",
                rest_time: "90 sec"
              }
            ],
            tips: "Contrôle de la descente, explosivité en montée"
          },
          {
            name: "Deadlift focus",
            focus: "Deadlift",
            exercises: [
              {
                name: "Soulevé de terre",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 100,
                notes: "@ 70% RM",
                rest_time: "4 min",
                tips: "Dos droit, hanches en arrière, contrôle total"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 50,
                notes: "Dos épais",
                rest_time: "2 min"
              },
              {
                name: "Gainage",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "90 sec"
              }
            ],
            tips: "Dos droit, hanches en arrière, contrôle total"
          }
        ]
      },
      {
        week_number: 2,
        title: "Augmentation progressive",
        goal: "Se filmer pour corriger la technique.",
        sessions: [
          {
            name: "Squat focus",
            focus: "Squat",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 85,
                notes: "@ 75% RM",
                rest_time: "3 min"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 35,
                notes: "Unilatéral",
                rest_time: "2 min"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 55,
                notes: "Mollets",
                rest_time: "90 sec"
              }
            ],
            tips: "Se filmer pour corriger la technique"
          },
          {
            name: "Bench focus",
            focus: "Bench",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 75,
                notes: "@ 75% RM",
                rest_time: "3 min"
              },
              {
                name: "Développé militaire",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 40,
                notes: "Épaules",
                rest_time: "2 min"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "Triceps",
                rest_time: "90 sec"
              }
            ],
            tips: "Se filmer pour corriger la technique"
          },
          {
            name: "Deadlift focus",
            focus: "Deadlift",
            exercises: [
              {
                name: "Soulevé de terre",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 110,
                notes: "@ 75% RM",
                rest_time: "4 min"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 55,
                notes: "Dos épais",
                rest_time: "2 min"
              },
              {
                name: "Gainage",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "90 sec"
              }
            ],
            tips: "Se filmer pour corriger la technique"
          }
        ]
      },
      {
        week_number: 3,
        title: "Intensité",
        goal: "Priorité à la qualité du mouvement.",
        sessions: [
          {
            name: "Squat focus",
            focus: "Squat",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 5,
                reps: "3",
                weight: 90,
                notes: "@ 80% RM",
                rest_time: "3 min"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "8",
                weight: 35,
                notes: "Unilatéral",
                rest_time: "2 min"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 55,
                notes: "Mollets",
                rest_time: "90 sec"
              }
            ],
            tips: "Priorité à la qualité du mouvement"
          },
          {
            name: "Bench focus",
            focus: "Bench",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 5,
                reps: "3",
                weight: 80,
                notes: "@ 80% RM",
                rest_time: "3 min"
              },
              {
                name: "Développé militaire",
                type: "Charges externes",
                sets: 3,
                reps: "8",
                weight: 40,
                notes: "Épaules",
                rest_time: "2 min"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "8",
                weight: 0,
                notes: "Triceps",
                rest_time: "90 sec"
              }
            ],
            tips: "Priorité à la qualité du mouvement"
          },
          {
            name: "Deadlift focus",
            focus: "Deadlift",
            exercises: [
              {
                name: "Soulevé de terre",
                type: "Charges externes",
                sets: 5,
                reps: "3",
                weight: 120,
                notes: "@ 80% RM",
                rest_time: "4 min"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 3,
                reps: "8",
                weight: 55,
                notes: "Dos épais",
                rest_time: "2 min"
              },
              {
                name: "Gainage",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "90 sec"
              }
            ],
            tips: "Priorité à la qualité du mouvement"
          }
        ]
      },
      {
        week_number: 4,
        title: "Volume intermédiaire",
        goal: "Accent sur l'explosivité.",
        sessions: [
          {
            name: "Squat focus",
            focus: "Squat",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "5",
                weight: 85,
                notes: "@ 75% RM",
                rest_time: "3 min"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 35,
                notes: "Unilatéral",
                rest_time: "2 min"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 55,
                notes: "Mollets",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur l'explosivité"
          },
          {
            name: "Bench focus",
            focus: "Bench",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "5",
                weight: 75,
                notes: "@ 75% RM",
                rest_time: "3 min"
              },
              {
                name: "Développé militaire",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 40,
                notes: "Épaules",
                rest_time: "2 min"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 4,
                reps: "8",
                weight: 0,
                notes: "Triceps",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur l'explosivité"
          },
          {
            name: "Deadlift focus",
            focus: "Deadlift",
            exercises: [
              {
                name: "Soulevé de terre",
                type: "Charges externes",
                sets: 4,
                reps: "5",
                weight: 110,
                notes: "@ 75% RM",
                rest_time: "4 min"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 55,
                notes: "Dos épais",
                rest_time: "2 min"
              },
              {
                name: "Gainage",
                type: "Poids du corps",
                sets: 4,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur l'explosivité"
          }
        ]
      },
      {
        week_number: 5,
        title: "Deload actif",
        goal: "Travail mobilité, gainage et étirements.",
        sessions: [
          {
            name: "Squat focus",
            focus: "Squat",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 3,
                reps: "5",
                weight: 60,
                notes: "@ 50-60% RM",
                rest_time: "2 min"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "8",
                weight: 25,
                notes: "Unilatéral",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 45,
                notes: "Mollets",
                rest_time: "60 sec"
              }
            ],
            tips: "Travail mobilité, gainage et étirements"
          },
          {
            name: "Bench focus",
            focus: "Bench",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 3,
                reps: "5",
                weight: 50,
                notes: "@ 50-60% RM",
                rest_time: "2 min"
              },
              {
                name: "Développé militaire",
                type: "Charges externes",
                sets: 3,
                reps: "8",
                weight: 30,
                notes: "Épaules",
                rest_time: "90 sec"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "8",
                weight: 0,
                notes: "Triceps",
                rest_time: "60 sec"
              }
            ],
            tips: "Travail mobilité, gainage et étirements"
          },
          {
            name: "Deadlift focus",
            focus: "Deadlift",
            exercises: [
              {
                name: "Soulevé de terre",
                type: "Charges externes",
                sets: 3,
                reps: "5",
                weight: 70,
                notes: "@ 50-60% RM",
                rest_time: "3 min"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 3,
                reps: "8",
                weight: 40,
                notes: "Dos épais",
                rest_time: "90 sec"
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
            tips: "Travail mobilité, gainage et étirements"
          }
        ]
      }
    ]
  }
]

async function main() {
  console.log('🏋️ Ajout de programmes détaillés...')
  console.log(`📡 Connexion à: ${supabaseUrl}`)

  const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    for (const program of detailedPrograms) {
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
          continue
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
    }

    console.log('\n🎉 Tous les programmes détaillés ont été ajoutés !')
    
  } catch (error) {
    console.error('❌ Erreur générale:', error)
  }
}

main().catch(e => { 
  console.error('❌ Erreur fatale:', e)
  process.exit(1) 
}) 