import { format, startOfWeek } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Session, Exercise, WeeklyStats } from '@/types'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy', { locale: fr })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr })
}

export function calculateTotalVolume(exercises: Exercise[]): number {
  return exercises.reduce((total, exercise) => {
    return total + (exercise.sets * exercise.reps * exercise.weight)
  }, 0)
}

export function calculateTotalReps(exercises: Exercise[]): number {
  return exercises.reduce((total, exercise) => {
    return total + (exercise.sets * exercise.reps)
  }, 0)
}

export function getWeekStats(sessions: Session[], exercises: Exercise[]): WeeklyStats[] {
  const weekStats = new Map<string, WeeklyStats>()

  sessions.forEach(session => {
    const sessionDate = new Date(session.date)
    const weekStart = startOfWeek(sessionDate, { weekStartsOn: 1 })
    const weekKey = format(weekStart, 'yyyy-MM-dd')

    const sessionExercises = exercises.filter(ex => ex.session_id === session.id)
    const sessionVolume = calculateTotalVolume(sessionExercises)
    const sessionReps = calculateTotalReps(sessionExercises)

    if (weekStats.has(weekKey)) {
      const existing = weekStats.get(weekKey)!
      existing.total_volume += sessionVolume
      existing.session_count += 1
      existing.total_reps += sessionReps
    } else {
      weekStats.set(weekKey, {
        week: weekKey,
        total_volume: sessionVolume,
        session_count: 1,
        total_reps: sessionReps
      })
    }
  })

  return Array.from(weekStats.values()).sort((a, b) => a.week.localeCompare(b.week))
}

export function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0

  const today = new Date()
  const sortedSessions = sessions
    .map(s => new Date(s.date))
    .sort((a, b) => b.getTime() - a.getTime())

  let streak = 0
  let currentDate = new Date(today)

  for (const sessionDate of sortedSessions) {
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff <= 1) {
      streak++
      currentDate = sessionDate
    } else {
      break
    }
  }

  return streak
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
} 