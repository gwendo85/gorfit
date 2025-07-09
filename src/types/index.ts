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
  objectif: string
  notes?: string
  completed: boolean
  created_at: string
  updated_at: string
  program_id?: string
  program_week?: number
  program_session?: number
}

export interface Exercise {
  id: string
  session_id: string
  name: string
  type?: string
  sets: number
  reps: number
  weight: number
  note?: string
  completed: boolean
  created_at: string
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

export interface WorkoutProgram {
  id: string
  name: string
  objective: string
  duration_weeks: number
  sessions_per_week: number
  description: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface UserProgram {
  id: string
  user_id: string
  program_id: string
  started_at: string
  completed_at?: string
  current_week: number
  current_session: number
  total_sessions_completed: number
  program?: WorkoutProgram
}

export interface ExerciseTemplate {
  id: string
  program_id: string
  week_number: number
  session_number: number
  exercise_name: string
  exercise_type: string
  sets: number
  reps: number
  weight?: number
  notes?: string
  order_index: number
  created_at: string
} 