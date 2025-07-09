export interface Challenge {
  id: string
  title: string
  description: string
  type: 'reps' | 'volume' | 'sessions'
  target: number
  reward_badge_title?: string
  reward_badge_description?: string
  duration_days: number
  icon_emoji: string
  created_at: string
} 