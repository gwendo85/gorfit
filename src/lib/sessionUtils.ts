import { createClient } from './supabase'
import { calculateVolumeWithType } from './utils'
import { Session, Exercise, UserStats, UserWeeklyProgress } from '@/types'

export interface SessionCompletionData {
  sessionId: string
  exercises: Exercise[]
  session: Session
}

export interface SaveSessionResult {
  success: boolean
  message: string
  updatedStats?: UserStats
  weeklyProgress?: UserWeeklyProgress
}

/**
 * Sauvegarde complète d'une séance terminée
 * Met à jour les statistiques utilisateur et la progression hebdomadaire
 */
export async function saveCompletedSession(data: SessionCompletionData): Promise<SaveSessionResult> {
  const supabase = createClient()
  
  try {
    // Récupérer l'utilisateur actuel
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Utilisateur non connecté')
    }

    // Calculer les métriques de la séance
    const volumeInfo = calculateVolumeWithType(data.exercises)
    const totalReps = data.exercises.reduce((total, exercise) => total + (exercise.sets * exercise.reps), 0)
    const totalSets = data.exercises.reduce((total, exercise) => total + exercise.sets, 0)
    const estimatedDuration = Math.round(totalSets * 2.5) // 2.5 min par série en moyenne

    // 1. Marquer la séance comme terminée avec toutes les métriques
    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({
        completed: true,
        duration_estimate: estimatedDuration,
        volume_estime: volumeInfo.total,
        reps_total: totalReps,
        type: data.session.objectif.includes('Mode Rapide') ? 'Mode Rapide' : 
              data.session.objectif.includes('Parcours') ? 'Parcours' : 'Manuelle',
        notes: data.session.notes ? 
          `${data.session.notes} | Séance terminée le ${new Date().toLocaleDateString('fr-FR')}` : 
          `Séance terminée le ${new Date().toLocaleDateString('fr-FR')}`
      })
      .eq('id', data.sessionId)

    if (sessionUpdateError) throw sessionUpdateError

    // 2. Mettre à jour ou créer les statistiques utilisateur
    const { data: existingStats, error: statsFetchError } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    let updatedStats: UserStats | undefined

    if (statsFetchError && statsFetchError.code !== 'PGRST116') {
      throw statsFetchError
    }

    if (existingStats) {
      // Mettre à jour les stats existantes
      const { data: newStats, error: statsUpdateError } = await supabase
        .from('user_stats')
        .update({
          total_volume: (existingStats.total_volume || 0) + volumeInfo.total,
          total_reps: (existingStats.total_reps || 0) + totalReps,
          sessions_completed: (existingStats.sessions_completed || 0) + 1,
          last_session_date: new Date().toISOString().split('T')[0]
        })
        .eq('user_id', user.id)
        .select()
        .single()

      if (statsUpdateError) throw statsUpdateError
      updatedStats = newStats
    } else {
      // Créer de nouvelles stats
      const { data: newStats, error: statsCreateError } = await supabase
        .from('user_stats')
        .insert({
          user_id: user.id,
          total_volume: volumeInfo.total,
          total_reps: totalReps,
          sessions_completed: 1,
          last_session_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single()

      if (statsCreateError) throw statsCreateError
      updatedStats = newStats
    }

    // 3. Mettre à jour la progression hebdomadaire
    const sessionDate = new Date(data.session.date)
    const weekNumber = getWeekNumber(sessionDate)
    const year = sessionDate.getFullYear()

    const { data: existingWeeklyProgress, error: weeklyFetchError } = await supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_number', weekNumber)
      .eq('year', year)
      .single()

    let weeklyProgress: UserWeeklyProgress | undefined

    if (weeklyFetchError && weeklyFetchError.code !== 'PGRST116') {
      throw weeklyFetchError
    }

    if (existingWeeklyProgress) {
      // Mettre à jour la progression existante
      const { data: newWeeklyProgress, error: weeklyUpdateError } = await supabase
        .from('user_weekly_progress')
        .update({
          volume_week: (existingWeeklyProgress.volume_week || 0) + volumeInfo.total,
          reps_week: (existingWeeklyProgress.reps_week || 0) + totalReps,
          sessions_week: (existingWeeklyProgress.sessions_week || 0) + 1
        })
        .eq('user_id', user.id)
        .eq('week_number', weekNumber)
        .eq('year', year)
        .select()
        .single()

      if (weeklyUpdateError) throw weeklyUpdateError
      weeklyProgress = newWeeklyProgress
    } else {
      // Créer une nouvelle progression hebdomadaire
      const { data: newWeeklyProgress, error: weeklyCreateError } = await supabase
        .from('user_weekly_progress')
        .insert({
          user_id: user.id,
          week_number: weekNumber,
          year: year,
          volume_week: volumeInfo.total,
          reps_week: totalReps,
          sessions_week: 1
        })
        .select()
        .single()

      if (weeklyCreateError) throw weeklyCreateError
      weeklyProgress = newWeeklyProgress
    }

    return {
      success: true,
      message: '🎉 Séance sauvegardée dans ton historique et tes statistiques mises à jour !',
      updatedStats,
      weeklyProgress
    }

  } catch (error) {
    console.error('Erreur lors de la sauvegarde de la séance:', error)
    return {
      success: false,
      message: 'Erreur lors de la sauvegarde de la séance'
    }
  }
}

/**
 * Récupère les statistiques utilisateur
 */
export async function getUserStats(): Promise<UserStats | null> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return null

    const { data: stats, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return stats
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return null
  }
}

/**
 * Récupère la progression hebdomadaire pour les graphiques
 */
export async function getWeeklyProgress(weeks: number = 8): Promise<UserWeeklyProgress[]> {
  const supabase = createClient()
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []

    const currentDate = new Date()
    const currentWeek = getWeekNumber(currentDate)
    const currentYear = currentDate.getFullYear()

    const { data: progress, error } = await supabase
      .from('user_weekly_progress')
      .select('*')
      .eq('user_id', user.id)
      .gte('year', currentYear - 1) // Inclure l'année précédente si nécessaire
      .order('year', { ascending: false })
      .order('week_number', { ascending: false })
      .limit(weeks)

    if (error) throw error
    return progress || []
  } catch (error) {
    console.error('Erreur lors de la récupération de la progression hebdomadaire:', error)
    return []
  }
}

/**
 * Calcule le numéro de semaine ISO
 */
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

/**
 * Formate les données pour les graphiques
 */
export function formatWeeklyDataForCharts(progress: UserWeeklyProgress[]) {
  return progress.map(p => ({
    week: `S${p.week_number}/${p.year}`,
    volume: Math.round(p.volume_week / 1000), // En tonnes
    reps: p.reps_week,
    sessions: p.sessions_week
  })).reverse() // Inverser pour avoir l'ordre chronologique
} 