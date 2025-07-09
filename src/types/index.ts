export interface User {
  id: string
  email: string
  username: string
  created_at: string
}

export interface Session {
  id: string
  user_id: string
  date: string
  notes?: string
  objectif: string
  type?: string
  completed?: boolean
  duration_estimate?: number
  volume_estime?: number
  reps_total?: number
  created_at: string
}

export interface Exercise {
  id: string
  session_id: string
  name: string
  type?: string
  sets: number
  reps: number
  weight?: number | null
  note?: string
  completed: boolean
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_volume: number
  total_reps: number
  sessions_completed: number
  last_session_date?: string
  created_at: string
  updated_at: string
}

export interface UserWeeklyProgress {
  id: string
  user_id: string
  week_number: number
  year: number
  volume_week: number
  reps_week: number
  sessions_week: number
  created_at: string
  updated_at: string
}

export interface Progression {
  id: string
  user_id: string
  week: string
  total_volume: number
  total_reps: number
  streak_days: number
  created_at: string
}

export interface SessionWithExercises extends Session {
  exercises: Exercise[]
  total_volume: number
  exercise_count: number
}

export interface WeeklyStats {
  week: string
  total_volume: number
  session_count: number
  total_reps: number
} 