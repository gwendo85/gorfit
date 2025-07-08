// Liste d'exercices optimisée pour le Mode Rapide GorFit
// Organisée par type de séance et durée

export interface RapidExercise {
  name: string
  sets: number
  reps: number
  weight?: number | null
  note?: string
  type: 'Poids du corps' | 'Charges externes'
}

export const RAPID_SESSIONS: Record<string, Record<string, RapidExercise[]>> = {
  'Full Body': {
    '20': [
      { name: 'Pompes', sets: 3, reps: 12, weight: null, type: 'Poids du corps' },
      { name: 'Squats', sets: 3, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Gainage', sets: 3, reps: 30, weight: null, type: 'Poids du corps', note: '30 secondes par série' }
    ],
    '30': [
      { name: 'Pompes', sets: 3, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Squats', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Fentes', sets: 3, reps: 12, weight: null, type: 'Poids du corps', note: 'Par jambe' },
      { name: 'Gainage', sets: 3, reps: 45, weight: null, type: 'Poids du corps', note: '45 secondes par série' }
    ],
    '45': [
      { name: 'Pompes', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Squats', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Fentes', sets: 4, reps: 12, weight: null, type: 'Poids du corps', note: 'Par jambe' },
      { name: 'Dips sur banc', sets: 3, reps: 10, weight: null, type: 'Poids du corps' },
      { name: 'Gainage', sets: 4, reps: 45, weight: null, type: 'Poids du corps', note: '45 secondes par série' }
    ]
  },
  'Haut du corps': {
    '20': [
      { name: 'Pompes', sets: 4, reps: 12, weight: null, type: 'Poids du corps' },
      { name: 'Dips sur banc', sets: 3, reps: 10, weight: null, type: 'Poids du corps' },
      { name: 'Gainage planche', sets: 3, reps: 30, weight: null, type: 'Poids du corps', note: '30 secondes par série' }
    ],
    '30': [
      { name: 'Pompes', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Dips sur banc', sets: 4, reps: 10, weight: null, type: 'Poids du corps' },
      { name: 'Rowing inversé', sets: 3, reps: 12, weight: null, type: 'Poids du corps', note: 'Ou tirage élastique' },
      { name: 'Gainage planche', sets: 3, reps: 45, weight: null, type: 'Poids du corps', note: '45 secondes par série' }
    ],
    '45': [
      { name: 'Pompes', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Dips', sets: 4, reps: 12, weight: null, type: 'Poids du corps' },
      { name: 'Rowing inversé', sets: 4, reps: 12, weight: null, type: 'Poids du corps' },
      { name: 'Élévations latérales', sets: 3, reps: 15, weight: 5, type: 'Charges externes', note: 'Si charges disponibles' },
      { name: 'Gainage planche', sets: 4, reps: 45, weight: null, type: 'Poids du corps', note: '45 secondes par série' }
    ]
  },
  'Bas du corps': {
    '20': [
      { name: 'Squats', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Fentes', sets: 3, reps: 12, weight: null, type: 'Poids du corps', note: 'Par jambe' },
      { name: 'Gainage', sets: 3, reps: 30, weight: null, type: 'Poids du corps', note: '30 secondes par série' }
    ],
    '30': [
      { name: 'Squats', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Fentes', sets: 4, reps: 12, weight: null, type: 'Poids du corps', note: 'Par jambe' },
      { name: 'Hip Thrust', sets: 3, reps: 12, weight: null, type: 'Poids du corps' },
      { name: 'Gainage latéral', sets: 3, reps: 30, weight: null, type: 'Poids du corps', note: '30 secondes par côté' }
    ],
    '45': [
      { name: 'Squats', sets: 4, reps: 15, weight: null, type: 'Poids du corps' },
      { name: 'Fentes', sets: 4, reps: 12, weight: null, type: 'Poids du corps', note: 'Par jambe' },
      { name: 'Hip Thrust', sets: 4, reps: 12, weight: null, type: 'Poids du corps' },
      { name: 'Montées sur banc', sets: 3, reps: 10, weight: null, type: 'Poids du corps', note: 'Par jambe, sur chaise ou banc' },
      { name: 'Gainage latéral', sets: 4, reps: 30, weight: null, type: 'Poids du corps', note: '30 secondes par côté' }
    ]
  }
}

export function getRapidSessionExercises(type: string, duration: string): RapidExercise[] {
  const sessionType = RAPID_SESSIONS[type]
  if (!sessionType) {
    throw new Error(`Type de séance non trouvé: ${type}`)
  }
  
  const exercises = sessionType[duration]
  if (!exercises) {
    throw new Error(`Durée non trouvée pour ${type}: ${duration}`)
  }
  
  return exercises
} 