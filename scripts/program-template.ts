// Template pour créer un nouveau programme détaillé
// Copie ce template et remplace les informations par celles de ton parcours

export const newProgramTemplate = {
  name: "Nom du Programme", // ex: "Hypertrophie Pro Max"
  emoji: "💪", // emoji du programme
  duration_weeks: 5, // nombre de semaines
  sessions_per_week: 3, // nombre de séances par semaine
  objective: "Objectif principal du programme...", // description détaillée
  frequency: "3 séances/semaine", // fréquence
  session_duration: "60 à 75 min", // durée des séances
  rest_time: "60-90 sec entre les séries, 2-3 min entre les exercices lourds.", // temps de repos
  weeks: [
    {
      week_number: 1, // numéro de la semaine
      title: "Titre de la semaine", // ex: "Adaptation & Technique"
      goal: "Objectif de cette semaine...", // ex: "maîtriser les mouvements, activer les muscles stabilisateurs."
      sessions: [
        {
          name: "Nom de la séance", // ex: "Haut du corps (Push)"
          focus: "Focus de la séance", // ex: "Push", "Pull", "Lower Body", etc.
          exercises: [
            {
              name: "Nom de l'exercice", // ex: "Développé couché"
              type: "Charges externes", // "Poids du corps" ou "Charges externes"
              sets: 4, // nombre de séries
              reps: "10", // répétitions (peut être "10", "10/jambe", "1 min", etc.)
              weight: 60, // poids en kg (0 pour poids du corps)
              notes: "Notes sur l'exercice", // ex: "@ 60% RM", "Isolation pectoraux", etc.
              rest_time: "90 sec", // temps de repos (optionnel)
              tips: "Conseils spécifiques" // conseils pour cet exercice (optionnel)
            }
            // Ajouter d'autres exercices...
          ],
          tips: "Conseils généraux pour cette séance" // conseils pour la séance (optionnel)
        }
        // Ajouter d'autres séances...
      ]
    }
    // Ajouter d'autres semaines...
  ]
}

// Exemple d'utilisation :
/*
export const monProgramme = {
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
            }
            // ... autres exercices
          ],
          tips: "Concentrez-vous sur une amplitude complète et contrôlée, descente lente, sans rebond."
        }
        // ... autres séances
      ]
    }
    // ... autres semaines
  ]
}
*/ 