'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserStats, Session } from '@/types'
import { getUserStats, getWeeklyProgress } from '@/lib/sessionUtils'
import { createClient } from '@/lib/supabase'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Trophy, TrendingUp, Calendar, Target, Zap } from 'lucide-react'
import ProgressCharts from '@/components/ProgressCharts'
import toast from 'react-hot-toast'

export default function StatisticsPage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [recentSessions, setRecentSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        // Charger les statistiques utilisateur
        const stats = await getUserStats()
        setUserStats(stats)

        // Charger les séances récentes
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          const { data: sessions, error } = await supabase
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('completed', true)
            .order('date', { ascending: false })
            .limit(5)

          if (!error && sessions) {
            setRecentSessions(sessions)
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error)
        toast.error('Erreur lors du chargement des statistiques')
      } finally {
        setIsLoading(false)
      }
    }

    loadStatistics()
  }, [])

  const getAchievementLevel = () => {
    if (!userStats) return { level: 'Débutant', icon: '🌱', color: 'text-green-600' }
    
    const sessions = userStats.sessions_completed
    if (sessions >= 50) return { level: 'Expert', icon: '🏆', color: 'text-purple-600' }
    if (sessions >= 30) return { level: 'Avancé', icon: '💪', color: 'text-blue-600' }
    if (sessions >= 15) return { level: 'Intermédiaire', icon: '🔥', color: 'text-orange-600' }
    if (sessions >= 5) return { level: 'Débutant+', icon: '⭐', color: 'text-yellow-600' }
    return { level: 'Débutant', icon: '🌱', color: 'text-green-600' }
  }

  const getVolumeInTons = () => {
    return userStats ? Math.round(userStats.total_volume / 1000) : 0
  }

  const getLastSessionInfo = () => {
    if (!userStats?.last_session_date) return null
    
    const lastSession = recentSessions[0]
    return {
      date: userStats.last_session_date,
      type: lastSession?.type || 'Manuelle',
      volume: lastSession?.volume_estime ? Math.round(lastSession.volume_estime / 1000) : 0
    }
  }

  const achievement = getAchievementLevel()
  const lastSession = getLastSessionInfo()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Mes Statistiques</h1>
              <p className="text-gray-600">Suivi de ta progression et de tes performances</p>
            </div>
          </div>
        </div>

        {/* Statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Volume total */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Volume Total</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {getVolumeInTons()} tonnes
            </div>
            <p className="text-sm text-gray-600">
              {userStats?.total_reps || 0} répétitions au total
            </p>
          </div>

          {/* Séances complétées */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Séances Terminées</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {userStats?.sessions_completed || 0}
            </div>
            <p className="text-sm text-gray-600">
              Bravo pour ta régularité !
            </p>
          </div>

          {/* Niveau d'achievement */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ton Niveau</h3>
            <div className={`text-3xl font-bold mb-2 ${achievement.color}`}>
              {achievement.icon} {achievement.level}
            </div>
            <p className="text-sm text-gray-600">
              Continue comme ça !
            </p>
          </div>

          {/* Dernière séance */}
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Dernière Séance</h3>
            {lastSession ? (
              <>
                <div className="text-lg font-bold text-orange-600 mb-1">
                  {formatDate(lastSession.date)}
                </div>
                <p className="text-sm text-gray-600">
                  {lastSession.type} • {lastSession.volume} tonnes
                </p>
              </>
            ) : (
              <div className="text-gray-500">
                Aucune séance terminée
              </div>
            )}
          </div>
        </div>

        {/* Graphiques de progression */}
        <div className="mb-8">
          <ProgressCharts />
        </div>

        {/* Séances récentes */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Séances Récentes
            </h3>
          </div>
          
          {recentSessions.length > 0 ? (
            <div className="divide-y">
              {recentSessions.map((session) => (
                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-gray-800">
                          Séance du {formatDate(session.date)}
                        </h4>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          ✅ Terminée
                        </span>
                        {session.type && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {session.type}
                          </span>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Volume:</span>
                          <span className="ml-2 font-medium">
                            {session.volume_estime ? Math.round(session.volume_estime / 1000) : 0} tonnes
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Reps:</span>
                          <span className="ml-2 font-medium">
                            {session.reps_total || 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Durée:</span>
                          <span className="ml-2 font-medium">
                            {session.duration_estimate || 0} min
                          </span>
                        </div>
                      </div>
                      
                      {session.notes && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          &quot;{session.notes}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Aucune séance terminée
              </h3>
              <p className="text-gray-600 mb-4">
                Termine ta première séance pour voir tes statistiques !
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer une séance
              </button>
            </div>
          )}
        </div>

        {/* Conseils et motivation */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            💡 Conseils pour progresser
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>🎯 Objectif réaliste:</strong> Commence par 2-3 séances par semaine
              </p>
              <p className="text-gray-700">
                <strong>📈 Progression:</strong> Augmente progressivement les poids
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>⏰ Régularité:</strong> Mieux vaut 30 min régulières que 2h occasionnelles
              </p>
              <p className="text-gray-700">
                <strong>🎉 Célébration:</strong> Fête tes petites victoires !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 