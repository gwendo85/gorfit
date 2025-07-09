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
  },
  {
    name: "Cross Training Intense",
    emoji: "⚡",
    duration_weeks: 5,
    sessions_per_week: 4,
    objective: "Améliorer la condition physique globale (force, cardio, endurance musculaire), booster le métabolisme et la mobilité.",
    frequency: "4 séances/semaine",
    session_duration: "45 à 60 min",
    rest_time: "30-60 sec entre les exercices, 2 min entre les circuits.",
    weeks: [
      {
        week_number: 1,
        title: "Phase de mise en route",
        goal: "Créer les bases, améliorer la technique et préparer le corps à l'intensité.",
        sessions: [
          {
            name: "Full Body – AMRAP",
            focus: "AMRAP",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min - Maintenir une cadence régulière",
                rest_time: "30 sec",
                tips: "Maintenir une cadence régulière, privilégier la bonne posture"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min",
                rest_time: "30 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min",
                rest_time: "30 sec"
              },
              {
                name: "Kettlebell Swings",
                type: "Charges externes",
                sets: 1,
                reps: "10",
                weight: 12,
                notes: "Modéré - AMRAP 20 min",
                rest_time: "30 sec"
              },
              {
                name: "Course 100m",
                type: "Poids du corps",
                sets: 1,
                reps: "100m",
                weight: 0,
                notes: "Ou 30 sec corde à sauter",
                rest_time: "30 sec"
              }
            ],
            tips: "Maintenir une cadence régulière, privilégier la bonne posture"
          },
          {
            name: "Metcon",
            focus: "For Time",
            exercises: [
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 1,
                reps: "21-15-9",
                weight: 0,
                notes: "For Time 15 min",
                rest_time: "30 sec"
              },
              {
                name: "Lunges",
                type: "Poids du corps",
                sets: 1,
                reps: "21-15-9",
                weight: 0,
                notes: "Chaque jambe - For Time 15 min",
                rest_time: "30 sec"
              },
              {
                name: "Jumping Pull-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "21-15-9",
                weight: 0,
                notes: "For Time 15 min",
                rest_time: "30 sec"
              }
            ],
            tips: "Réduire les pauses, conserver un rythme respiratoire régulier"
          },
          {
            name: "HIIT",
            focus: "HIIT",
            exercises: [
              {
                name: "Box Jumps",
                type: "Poids du corps",
                sets: 1,
                reps: "30 sec ON",
                weight: 0,
                notes: "30 sec ON / 30 sec OFF x 20 min",
                rest_time: "30 sec OFF"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "30 sec ON",
                weight: 0,
                notes: "30 sec ON / 30 sec OFF x 20 min",
                rest_time: "30 sec OFF"
              },
              {
                name: "Mountain Climbers",
                type: "Poids du corps",
                sets: 1,
                reps: "30 sec ON",
                weight: 0,
                notes: "30 sec ON / 30 sec OFF x 20 min",
                rest_time: "30 sec OFF"
              },
              {
                name: "Dumbbell Snatches",
                type: "Charges externes",
                sets: 1,
                reps: "30 sec ON",
                weight: 8,
                notes: "Léger - 30 sec ON / 30 sec OFF x 20 min",
                rest_time: "30 sec OFF"
              }
            ],
            tips: "Aller à intensité maximale pendant les 30 sec ON, récupération active pendant les 30 sec OFF"
          },
          {
            name: "Core & Mobility",
            focus: "Core",
            exercises: [
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Gainage latéral",
                type: "Poids du corps",
                sets: 3,
                reps: "45 sec",
                weight: 0,
                notes: "Par côté - Core",
                rest_time: "60 sec"
              },
              {
                name: "Hollow hold",
                type: "Poids du corps",
                sets: 3,
                reps: "30 sec",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "Hanche, épaules, bas du dos",
                rest_time: "0 sec"
              }
            ],
            tips: "Focus sur la mobilité et le core"
          }
        ]
      },
      {
        week_number: 2,
        title: "Intensification",
        goal: "Augmenter l'intensité et réduire les temps de repos.",
        sessions: [
          {
            name: "WOD – For Time",
            focus: "For Time",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 1,
                reps: "50",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "40",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "30",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 1,
                reps: "20",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Course 400m",
                type: "Poids du corps",
                sets: 1,
                reps: "400m",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              }
            ],
            tips: "Augmenter l'intensité"
          },
          {
            name: "EMOM 20 min",
            focus: "EMOM",
            exercises: [
              {
                name: "Kettlebell Swings",
                type: "Charges externes",
                sets: 5,
                reps: "10",
                weight: 12,
                notes: "Min 1 - EMOM 20 min",
                rest_time: "60 sec"
              },
              {
                name: "Box Jumps",
                type: "Poids du corps",
                sets: 5,
                reps: "10",
                weight: 0,
                notes: "Min 2 - EMOM 20 min",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 5,
                reps: "10",
                weight: 0,
                notes: "Min 3 - EMOM 20 min",
                rest_time: "60 sec"
              },
              {
                name: "Jumping Lunges",
                type: "Poids du corps",
                sets: 5,
                reps: "10",
                weight: 0,
                notes: "Min 4 - EMOM 20 min",
                rest_time: "60 sec"
              }
            ],
            tips: "Chaque minute un exercice différent, répéter 5 fois"
          },
          {
            name: "Circuit",
            focus: "Circuit",
            exercises: [
              {
                name: "Goblet Squats",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 12,
                notes: "3 rounds",
                rest_time: "1 min"
              },
              {
                name: "Dumbbell Push Press",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 10,
                notes: "3 rounds",
                rest_time: "1 min"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "3 rounds",
                rest_time: "1 min"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "3 rounds",
                rest_time: "1 min"
              }
            ],
            tips: "3 rounds avec repos 1 min entre les tours"
          },
          {
            name: "Mobility & Core",
            focus: "Core",
            exercises: [
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Gainage latéral",
                type: "Poids du corps",
                sets: 3,
                reps: "45 sec",
                weight: 0,
                notes: "Par côté - Core",
                rest_time: "60 sec"
              },
              {
                name: "Hollow hold",
                type: "Poids du corps",
                sets: 3,
                reps: "30 sec",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "Hanche, épaules, bas du dos",
                rest_time: "0 sec"
              }
            ],
            tips: "Identique semaine 1 avec progression du temps de gainage"
          }
        ]
      },
      {
        week_number: 3,
        title: "Volume et Complexité",
        goal: "Introduire des mouvements complexes et allonger les WOD.",
        sessions: [
          {
            name: "Chipper",
            focus: "Chipper",
            exercises: [
              {
                name: "Sauts corde à sauter",
                type: "Poids du corps",
                sets: 1,
                reps: "100",
                weight: 0,
                notes: "Chipper",
                rest_time: "30 sec"
              },
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 1,
                reps: "50",
                weight: 0,
                notes: "Chipper",
                rest_time: "30 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "40",
                weight: 0,
                notes: "Chipper",
                rest_time: "30 sec"
              },
              {
                name: "Kettlebell Swings",
                type: "Charges externes",
                sets: 1,
                reps: "30",
                weight: 12,
                notes: "Chipper",
                rest_time: "30 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 1,
                reps: "20",
                weight: 0,
                notes: "Chipper",
                rest_time: "30 sec"
              },
              {
                name: "Pull-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "Chipper",
                rest_time: "30 sec"
              }
            ],
            tips: "Introduire des mouvements complexes"
          },
          {
            name: "EMOM 24 min",
            focus: "EMOM",
            exercises: [
              {
                name: "Dumbbell Thrusters",
                type: "Charges externes",
                sets: 6,
                reps: "12",
                weight: 10,
                notes: "Min 1 - EMOM 24 min",
                rest_time: "60 sec"
              },
              {
                name: "Box Jumps",
                type: "Poids du corps",
                sets: 6,
                reps: "10",
                weight: 0,
                notes: "Min 2 - EMOM 24 min",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 6,
                reps: "12",
                weight: 0,
                notes: "Min 3 - EMOM 24 min",
                rest_time: "60 sec"
              },
              {
                name: "Mountain Climbers",
                type: "Poids du corps",
                sets: 6,
                reps: "12",
                weight: 0,
                notes: "Par jambe - Min 4 - EMOM 24 min",
                rest_time: "60 sec"
              }
            ],
            tips: "Chaque minute un exercice différent, répéter 6 fois"
          },
          {
            name: "HIIT",
            focus: "HIIT",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 4,
                reps: "40 sec ON",
                weight: 0,
                notes: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours",
                rest_time: "20 sec OFF"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "40 sec ON",
                weight: 0,
                notes: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours",
                rest_time: "20 sec OFF"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 4,
                reps: "40 sec ON",
                weight: 0,
                notes: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours",
                rest_time: "20 sec OFF"
              },
              {
                name: "Russian Twists",
                type: "Poids du corps",
                sets: 4,
                reps: "40 sec ON",
                weight: 0,
                notes: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours",
                rest_time: "20 sec OFF"
              },
              {
                name: "Jumping Lunges",
                type: "Poids du corps",
                sets: 4,
                reps: "40 sec ON",
                weight: 0,
                notes: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours",
                rest_time: "20 sec OFF"
              },
              {
                name: "Mountain Climbers",
                type: "Poids du corps",
                sets: 4,
                reps: "40 sec ON",
                weight: 0,
                notes: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours",
                rest_time: "20 sec OFF"
              }
            ],
            tips: "40 sec ON / 20 sec OFF x 6 exercices, 4 tours"
          },
          {
            name: "Mobility & Core",
            focus: "Core",
            exercises: [
              {
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "Mobilité complète",
                rest_time: "0 sec"
              },
              {
                name: "Core",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "Core complet",
                rest_time: "0 sec"
              }
            ],
            tips: "15 min mobilité + 15 min core"
          }
        ]
      },
      {
        week_number: 4,
        title: "Peak Intensity",
        goal: "Pousser le cardio et l'endurance musculaire au maximum.",
        sessions: [
          {
            name: "Hero WOD modifié (Murph)",
            focus: "For Time",
            exercises: [
              {
                name: "Course 800m",
                type: "Poids du corps",
                sets: 1,
                reps: "800m",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Pull-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "50",
                weight: 0,
                notes: "Ou jumping - For Time",
                rest_time: "30 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "100",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 1,
                reps: "150",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              },
              {
                name: "Course 800m",
                type: "Poids du corps",
                sets: 1,
                reps: "800m",
                weight: 0,
                notes: "For Time",
                rest_time: "30 sec"
              }
            ],
            tips: "Partitionner 5-10-15 pour pull-up/push-up/squat"
          },
          {
            name: "Ladder 10-1",
            focus: "Ladder",
            exercises: [
              {
                name: "Kettlebell Swings",
                type: "Charges externes",
                sets: 10,
                reps: "10-1",
                weight: 12,
                notes: "Ladder 10-1",
                rest_time: "30 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 10,
                reps: "10-1",
                weight: 0,
                notes: "Ladder 10-1",
                rest_time: "30 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 10,
                reps: "10-1",
                weight: 0,
                notes: "Ladder 10-1",
                rest_time: "30 sec"
              }
            ],
            tips: "Commencer à 10 reps et descendre à 1 rep"
          },
          {
            name: "AMRAP 20 min",
            focus: "AMRAP",
            exercises: [
              {
                name: "Box Jumps",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min",
                rest_time: "30 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min",
                rest_time: "30 sec"
              },
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min",
                rest_time: "30 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 1,
                reps: "10",
                weight: 0,
                notes: "AMRAP 20 min",
                rest_time: "30 sec"
              }
            ],
            tips: "AMRAP 20 min"
          },
          {
            name: "Mobility & Core",
            focus: "Core",
            exercises: [
              {
                name: "Repos actif",
                type: "Poids du corps",
                sets: 1,
                reps: "30 min",
                weight: 0,
                notes: "Repos actif",
                rest_time: "0 sec"
              },
              {
                name: "Étirements dynamiques",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "Étirements dynamiques",
                rest_time: "0 sec"
              }
            ],
            tips: "Repos actif, étirements dynamiques"
          }
        ]
      },
      {
        week_number: 5,
        title: "Deload Actif",
        goal: "Récupération active sans perdre l'habitude d'entraînement.",
        sessions: [
          {
            name: "Cardio léger",
            focus: "Cardio",
            exercises: [
              {
                name: "Marche rapide",
                type: "Poids du corps",
                sets: 1,
                reps: "30 min",
                weight: 0,
                notes: "Ou vélo à allure modérée",
                rest_time: "0 sec"
              }
            ],
            tips: "30 min marche rapide ou vélo à allure modérée"
          },
          {
            name: "EMOM technique 20 min",
            focus: "EMOM",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 20,
                reps: "5",
                weight: 0,
                notes: "EMOM technique 20 min",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 20,
                reps: "5",
                weight: 0,
                notes: "EMOM technique 20 min",
                rest_time: "60 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 20,
                reps: "5",
                weight: 0,
                notes: "EMOM technique 20 min",
                rest_time: "60 sec"
              }
            ],
            tips: "EMOM technique 20 min"
          },
          {
            name: "Mobility & Core",
            focus: "Core",
            exercises: [
              {
                name: "Mobilité complète",
                type: "Poids du corps",
                sets: 1,
                reps: "20 min",
                weight: 0,
                notes: "Corps entier",
                rest_time: "0 sec"
              },
              {
                name: "Gainage léger",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Gainage léger",
                rest_time: "0 sec"
              }
            ],
            tips: "Mobilité complète corps entier + gainage léger"
          }
        ]
      }
    ]
  },
  {
    name: "Prise de Masse Power",
    emoji: "💪",
    duration_weeks: 5,
    sessions_per_week: 4,
    objective: "Développer la masse musculaire de qualité tout en maintenant et améliorant la force sur les principaux mouvements.",
    frequency: "4 séances/semaine",
    session_duration: "60 à 75 min",
    rest_time: "90 sec à 2 min selon l'exercice et la charge.",
    weeks: [
      {
        week_number: 1,
        title: "Mise en place technique et volume modéré",
        goal: "maîtriser les mouvements, activer les muscles stabilisateurs.",
        sessions: [
          {
            name: "Push (Pecs, Epaules, Triceps)",
            focus: "Push",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 65,
                notes: "65% RM - repos 2 min",
                rest_time: "120 sec",
                tips: "Contrôler la descente sur le bench, éviter les rebonds"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 25,
                notes: "Push",
                rest_time: "90 sec",
                tips: "Contracter les abdos sur le développé militaire"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Élévations latérales",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 8,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Extension triceps corde",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 15,
                notes: "Push",
                rest_time: "90 sec"
              }
            ],
            tips: "Contrôler la descente sur le bench, éviter les rebonds, contracter les abdos sur le développé militaire"
          },
          {
            name: "Pull (Dos, Biceps)",
            focus: "Pull",
            exercises: [
              {
                name: "Tractions",
                type: "Poids du corps",
                sets: 4,
                reps: "8",
                weight: 0,
                notes: "Ou assistées - Pull",
                rest_time: "120 sec",
                tips: "Tirez avec les coudes, gardez la poitrine sortie"
              },
              {
                name: "Rowing barre pronation",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 45,
                notes: "Pull",
                rest_time: "90 sec",
                tips: "Tirez avec les coudes, gardez la poitrine sortie"
              },
              {
                name: "Rowing unilatéral haltère",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 20,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Curl barre",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 25,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 12,
                notes: "Pull",
                rest_time: "90 sec"
              }
            ],
            tips: "Tirez avec les coudes, gardez la poitrine sortie sur les rows"
          },
          {
            name: "Jambes (Quadriceps, Ischios, Mollets)",
            focus: "Lower Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 65,
                notes: "65% RM - Lower Body",
                rest_time: "120 sec",
                tips: "Descente contrôlée sur le squat, gainage actif"
              },
              {
                name: "Soulevé de terre jambes tendues",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 60,
                notes: "Lower Body",
                rest_time: "120 sec",
                tips: "Descente contrôlée, gainage actif pendant les mouvements"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 20,
                notes: "Par jambe - Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Leg extension",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 35,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 45,
                notes: "Lower Body",
                rest_time: "90 sec"
              }
            ],
            tips: "Descente contrôlée sur le squat, gainage actif pendant les mouvements"
          },
          {
            name: "Full Body léger + Core/Cardio",
            focus: "Full Body",
            exercises: [
              {
                name: "Kettlebell swings",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 12,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "20",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Air squats",
                type: "Poids du corps",
                sets: 3,
                reps: "20",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Cardio modéré",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Cardio modéré",
                rest_time: "0 sec"
              }
            ],
            tips: "Full Body léger avec focus sur le core et cardio"
          }
        ]
      },
      {
        week_number: 2,
        title: "Progression des charges",
        goal: "augmenter progressivement la charge et le volume.",
        sessions: [
          {
            name: "Push",
            focus: "Push",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 70,
                notes: "+5% - Push",
                rest_time: "120 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 28,
                notes: "+3kg - Push",
                rest_time: "90 sec"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Élévations latérales",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 10,
                notes: "+2kg - Push",
                rest_time: "90 sec"
              },
              {
                name: "Extension triceps corde",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 18,
                notes: "+3kg - Push",
                rest_time: "90 sec"
              }
            ],
            tips: "Augmenter les charges de +2,5 à 5% sur les gros lifts"
          },
          {
            name: "Pull",
            focus: "Pull",
            exercises: [
              {
                name: "Tractions",
                type: "Poids du corps",
                sets: 4,
                reps: "8",
                weight: 0,
                notes: "Pull",
                rest_time: "120 sec"
              },
              {
                name: "Rowing barre pronation",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 50,
                notes: "+5kg - Pull",
                rest_time: "90 sec"
              },
              {
                name: "Rowing unilatéral haltère",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 22,
                notes: "+2kg - Pull",
                rest_time: "90 sec"
              },
              {
                name: "Curl barre",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 28,
                notes: "+3kg - Pull",
                rest_time: "90 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 15,
                notes: "+3kg - Pull",
                rest_time: "90 sec"
              }
            ],
            tips: "Conserver le même nombre de séries et de répétitions"
          },
          {
            name: "Jambes",
            focus: "Lower Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 70,
                notes: "+5% - Lower Body",
                rest_time: "120 sec"
              },
              {
                name: "Soulevé de terre jambes tendues",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 65,
                notes: "+5kg - Lower Body",
                rest_time: "120 sec"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 22,
                notes: "+2kg - Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Leg extension",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 40,
                notes: "+5kg - Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 50,
                notes: "+5kg - Lower Body",
                rest_time: "90 sec"
              }
            ],
            tips: "Maintenir les temps de repos identiques"
          },
          {
            name: "Full Body léger + Core/Cardio",
            focus: "Full Body",
            exercises: [
              {
                name: "Kettlebell swings",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 14,
                notes: "+2kg - Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "20",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Air squats",
                type: "Poids du corps",
                sets: 3,
                reps: "20",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Cardio modéré",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Cardio modéré",
                rest_time: "0 sec"
              }
            ],
            tips: "Accent sur l'exécution parfaite"
          }
        ]
      },
      {
        week_number: 3,
        title: "Intensification",
        goal: "introduire des mouvements complexes et allonger les WOD.",
        sessions: [
          {
            name: "Push",
            focus: "Push",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 75,
                notes: "70-75% RM - Push",
                rest_time: "120 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 30,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 4,
                reps: "8",
                weight: 0,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Élévations latérales",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 12,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Extension triceps corde",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 20,
                notes: "Push",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur la force en début de séance, volume en fin"
          },
          {
            name: "Pull",
            focus: "Pull",
            exercises: [
              {
                name: "Tractions",
                type: "Poids du corps",
                sets: 5,
                reps: "5",
                weight: 0,
                notes: "Pull",
                rest_time: "120 sec"
              },
              {
                name: "Rowing barre pronation",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 55,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Rowing unilatéral haltère",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 25,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Curl barre",
                type: "Charges externes",
                sets: 4,
                reps: "8",
                weight: 30,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 18,
                notes: "Pull",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur la force en début de séance, volume en fin"
          },
          {
            name: "Jambes",
            focus: "Lower Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 5,
                reps: "5",
                weight: 80,
                notes: "70-75% RM - Lower Body",
                rest_time: "120 sec"
              },
              {
                name: "Soulevé de terre",
                type: "Charges externes",
                sets: 4,
                reps: "6",
                weight: 100,
                notes: "Lower Body",
                rest_time: "120 sec"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "10",
                weight: 25,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Leg extension",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 45,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 55,
                notes: "Lower Body",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur la force en début de séance, volume en fin"
          },
          {
            name: "Full Body léger + Core/Cardio",
            focus: "Full Body",
            exercises: [
              {
                name: "Kettlebell swings",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 16,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Air squats",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 4,
                reps: "45 sec",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Cardio modéré",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Cardio modéré",
                rest_time: "0 sec"
              }
            ],
            tips: "Accent sur la force en début de séance, volume en fin"
          }
        ]
      },
      {
        week_number: 4,
        title: "Volume élevé",
        goal: "pousser le cardio et l'endurance musculaire au maximum.",
        sessions: [
          {
            name: "Push",
            focus: "Push",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 60,
                notes: "60-65% RM - Push",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 22,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 4,
                reps: "12",
                weight: 0,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Élévations latérales",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 8,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Extension triceps corde",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 15,
                notes: "Push",
                rest_time: "90 sec"
              }
            ],
            tips: "Revenir sur du 4x10-12 sur les exercices principaux avec une charge légèrement réduite"
          },
          {
            name: "Pull",
            focus: "Pull",
            exercises: [
              {
                name: "Tractions",
                type: "Poids du corps",
                sets: 4,
                reps: "10",
                weight: 0,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre pronation",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 40,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Rowing unilatéral haltère",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 18,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Curl barre",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 22,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 4,
                reps: "18",
                weight: 10,
                notes: "Pull",
                rest_time: "90 sec"
              }
            ],
            tips: "Augmenter légèrement le volume sur les accessoires"
          },
          {
            name: "Jambes",
            focus: "Lower Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 60,
                notes: "60-65% RM - Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Soulevé de terre jambes tendues",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 55,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 18,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Leg extension",
                type: "Charges externes",
                sets: 4,
                reps: "18",
                weight: 35,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 45,
                notes: "Lower Body",
                rest_time: "90 sec"
              }
            ],
            tips: "Cardio léger post-séance 10-15 min"
          },
          {
            name: "Full Body léger + Core/Cardio",
            focus: "Full Body",
            exercises: [
              {
                name: "Kettlebell swings",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 14,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Air squats",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 4,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Cardio léger",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "Cardio léger post-séance",
                rest_time: "0 sec"
              }
            ],
            tips: "Cardio léger post-séance 10-15 min"
          }
        ]
      },
      {
        week_number: 5,
        title: "Deload actif",
        goal: "récupérer tout en conservant le rythme.",
        sessions: [
          {
            name: "Push",
            focus: "Push",
            exercises: [
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 50,
                notes: "50-60% RM - Push",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 18,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Dips",
                type: "Poids du corps",
                sets: 3,
                reps: "8",
                weight: 0,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Élévations latérales",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 6,
                notes: "Push",
                rest_time: "90 sec"
              },
              {
                name: "Extension triceps corde",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 12,
                notes: "Push",
                rest_time: "90 sec"
              }
            ],
            tips: "Réduire les charges à 50-60% RM, faire 3x8-10 par exercice"
          },
          {
            name: "Pull",
            focus: "Pull",
            exercises: [
              {
                name: "Tractions",
                type: "Poids du corps",
                sets: 3,
                reps: "8",
                weight: 0,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre pronation",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 35,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Rowing unilatéral haltère",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 15,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Curl barre",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 18,
                notes: "Pull",
                rest_time: "90 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 8,
                notes: "Pull",
                rest_time: "90 sec"
              }
            ],
            tips: "Accent sur la mobilité et le contrôle du mouvement"
          },
          {
            name: "Jambes",
            focus: "Lower Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 50,
                notes: "50-60% RM - Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Soulevé de terre jambes tendues",
                type: "Charges externes",
                sets: 3,
                reps: "10",
                weight: 45,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 15,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Leg extension",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 25,
                notes: "Lower Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 35,
                notes: "Lower Body",
                rest_time: "90 sec"
              }
            ],
            tips: "Séances plus courtes (~45 min)"
          },
          {
            name: "Full Body léger + Core/Cardio",
            focus: "Full Body",
            exercises: [
              {
                name: "Kettlebell swings",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 12,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "Full Body",
                rest_time: "60 sec"
              },
              {
                name: "Air squats",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "Full Body",
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
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Mobilité et étirements",
                rest_time: "0 sec"
              }
            ],
            tips: "Accent sur la mobilité et le contrôle du mouvement"
          }
        ]
      }
    ]
  },
  {
    name: "Full Body Summer",
    emoji: "🔥",
    duration_weeks: 5,
    sessions_per_week: 3,
    objective: "Sculpter le corps avant l'été, réduire le taux de masse grasse tout en maintenant le muscle, améliorer la condition physique générale.",
    frequency: "3 séances/semaine",
    session_duration: "60 min",
    rest_time: "60 sec entre les exercices, 90 sec entre les circuits.",
    weeks: [
      {
        week_number: 1,
        title: "Phase de démarrage",
        goal: "Réactiver le corps et poser les bases techniques.",
        sessions: [
          {
            name: "Full Body Force",
            focus: "Full Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 60,
                notes: "60% RM - Full Body",
                rest_time: "90 sec",
                tips: "Concentrer sur une exécution propre, amplitude complète"
              },
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 60,
                notes: "Full Body",
                rest_time: "90 sec",
                tips: "Gainage actif"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 45,
                notes: "Full Body",
                rest_time: "90 sec",
                tips: "Gainage actif"
              },
              {
                name: "Hip Thrust",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 50,
                notes: "Full Body",
                rest_time: "90 sec",
                tips: "Gainage actif"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 45,
                notes: "Full Body",
                rest_time: "90 sec",
                tips: "Gainage actif"
              }
            ],
            tips: "Concentrer sur une exécution propre, amplitude complète, gainage actif"
          },
          {
            name: "Full Body Cardio",
            focus: "Cardio",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 3,
                reps: "20",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Jumping Jacks",
                type: "Poids du corps",
                sets: 3,
                reps: "20",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 3,
                reps: "10",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              }
            ],
            tips: "3 tours avec repos 1 min entre les tours"
          },
          {
            name: "Full Body + Core",
            focus: "Full Body",
            exercises: [
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 20,
                notes: "Par jambe - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 20,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Tirage poulie haute",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 40,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Crunch lesté",
                type: "Charges externes",
                sets: 3,
                reps: "20",
                weight: 10,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 3,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              }
            ],
            tips: "Full Body avec focus sur le core"
          }
        ]
      },
      {
        week_number: 2,
        title: "Augmentation volume",
        goal: "Passer sur 4x12-15 sur tous les exercices.",
        sessions: [
          {
            name: "Full Body Force",
            focus: "Full Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 65,
                notes: "+5kg - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 65,
                notes: "+5kg - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 50,
                notes: "+5kg - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Hip Thrust",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 55,
                notes: "+5kg - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 50,
                notes: "+5kg - Full Body",
                rest_time: "90 sec"
              }
            ],
            tips: "Augmenter légèrement les charges"
          },
          {
            name: "Full Body Cardio",
            focus: "Cardio",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Jumping Jacks",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 4,
                reps: "10",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              }
            ],
            tips: "4 tours avec repos 1 min entre les tours"
          },
          {
            name: "Full Body + Core",
            focus: "Full Body",
            exercises: [
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 22,
                notes: "Par jambe - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 22,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Tirage poulie haute",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 45,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Crunch lesté",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 12,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 4,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              }
            ],
            tips: "Temps de repos identique"
          }
        ]
      },
      {
        week_number: 3,
        title: "Intensification",
        goal: "Inclure des supersets.",
        sessions: [
          {
            name: "Full Body Force",
            focus: "Full Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 70,
                notes: "Superset avec Fentes - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 25,
                notes: "Superset avec Squat - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 70,
                notes: "Superset avec Pompes - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "12",
                weight: 0,
                notes: "Superset avec Développé couché - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 55,
                notes: "Superset avec Face Pull - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Face pull",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 15,
                notes: "Superset avec Rowing - Full Body",
                rest_time: "90 sec"
              }
            ],
            tips: "4x12 reps par exercice enchaîné"
          },
          {
            name: "Full Body Cardio",
            focus: "Cardio",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Jumping Jacks",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 4,
                reps: "10",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              }
            ],
            tips: "4 tours avec repos 1 min entre les tours"
          },
          {
            name: "Full Body + Core",
            focus: "Full Body",
            exercises: [
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 25,
                notes: "Par jambe - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 25,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Tirage poulie haute",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 50,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Crunch lesté",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 15,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 4,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              }
            ],
            tips: "4x12 reps par exercice enchaîné"
          }
        ]
      },
      {
        week_number: 4,
        title: "Cardio & Cut",
        goal: "Ajouter 15 min HIIT fin de séance.",
        sessions: [
          {
            name: "Full Body Force",
            focus: "Full Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 70,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 70,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 55,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Hip Thrust",
                type: "Charges externes",
                sets: 4,
                reps: "15",
                weight: 60,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 55,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "HIIT 15 min",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "30 sec ON / 30 sec OFF - Burpees, mountain climbers, high knees, jumping jacks",
                rest_time: "0 sec"
              }
            ],
            tips: "Garder le même volume sur les exercices"
          },
          {
            name: "Full Body Cardio",
            focus: "Cardio",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Jumping Jacks",
                type: "Poids du corps",
                sets: 4,
                reps: "20",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 4,
                reps: "15",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 4,
                reps: "10",
                weight: 0,
                notes: "4 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "HIIT 15 min",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "30 sec ON / 30 sec OFF - Burpees, mountain climbers, high knees, jumping jacks",
                rest_time: "0 sec"
              }
            ],
            tips: "30 sec ON / 30 sec OFF - Burpees, mountain climbers, high knees, jumping jacks"
          },
          {
            name: "Full Body + Core",
            focus: "Full Body",
            exercises: [
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 25,
                notes: "Par jambe - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 25,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Tirage poulie haute",
                type: "Charges externes",
                sets: 4,
                reps: "12",
                weight: 50,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Crunch lesté",
                type: "Charges externes",
                sets: 4,
                reps: "20",
                weight: 15,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "Planche",
                type: "Poids du corps",
                sets: 4,
                reps: "1 min",
                weight: 0,
                notes: "Core",
                rest_time: "60 sec"
              },
              {
                name: "HIIT 15 min",
                type: "Poids du corps",
                sets: 1,
                reps: "15 min",
                weight: 0,
                notes: "30 sec ON / 30 sec OFF - Burpees, mountain climbers, high knees, jumping jacks",
                rest_time: "0 sec"
              }
            ],
            tips: "30 sec ON / 30 sec OFF - Burpees, mountain climbers, high knees, jumping jacks"
          }
        ]
      },
      {
        week_number: 5,
        title: "Deload actif",
        goal: "Récupération active en gardant le rythme.",
        sessions: [
          {
            name: "Full Body Force",
            focus: "Full Body",
            exercises: [
              {
                name: "Squat",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 50,
                notes: "50-60% RM - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé couché",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 50,
                notes: "50-60% RM - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Rowing barre",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 35,
                notes: "50-60% RM - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Hip Thrust",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 40,
                notes: "50-60% RM - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Mollets debout",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 40,
                notes: "50-60% RM - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Mobilité et étirements",
                rest_time: "0 sec"
              }
            ],
            tips: "Réduire les charges à 50-60% RM, 3x10-12 reps par exercice"
          },
          {
            name: "Full Body Cardio",
            focus: "Cardio",
            exercises: [
              {
                name: "Air Squats",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Push-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "12",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Jumping Jacks",
                type: "Poids du corps",
                sets: 3,
                reps: "15",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Sit-ups",
                type: "Poids du corps",
                sets: 3,
                reps: "12",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Burpees",
                type: "Poids du corps",
                sets: 3,
                reps: "8",
                weight: 0,
                notes: "3 tours - Cardio",
                rest_time: "60 sec"
              },
              {
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Mobilité et étirements",
                rest_time: "0 sec"
              }
            ],
            tips: "3x10-12 reps par exercice"
          },
          {
            name: "Full Body + Core",
            focus: "Full Body",
            exercises: [
              {
                name: "Fentes marchées",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 18,
                notes: "Par jambe - Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Développé militaire haltères",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 18,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Tirage poulie haute",
                type: "Charges externes",
                sets: 3,
                reps: "12",
                weight: 35,
                notes: "Full Body",
                rest_time: "90 sec"
              },
              {
                name: "Crunch lesté",
                type: "Charges externes",
                sets: 3,
                reps: "15",
                weight: 10,
                notes: "Core",
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
                name: "Mobilité",
                type: "Poids du corps",
                sets: 1,
                reps: "10 min",
                weight: 0,
                notes: "Mobilité et étirements",
                rest_time: "0 sec"
              }
            ],
            tips: "Inclure mobilité et étirements en fin de séance"
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