'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Session, Exercise, UserStats } from '@/types'
import { formatDate, calculateTotalVolume } from '@/lib/utils'
import { getUserStats } from '@/lib/sessionUtils'
import { Plus, Calendar, BarChart3, Settings, LogOut, CheckCircle, Clock } from 'lucide-react'
import CreateSessionForm from '@/components/CreateSessionForm'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const loadDashboard = async () => {
      const supabase = createClient()
      
      try {
        // Récupérer l'utilisateur
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) {
          router.push('/auth')
          return
        }
        setUser(user)

        // Charger les séances
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(10)

        if (sessionsError) throw sessionsError
        setSessions(sessionsData || [])

        // Charger les statistiques utilisateur
        const stats = await getUserStats()
        setUserStats(stats)

      } catch (error) {
        console.error('Erreur lors du chargement du dashboard:', error)
        toast.error('Erreur lors du chargement du dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const handleSessionCreated = (newSession: Session) => {
    setSessions([newSession, ...sessions])
    setShowCreateForm(false)
    toast.success('Séance créée avec succès !')
  }

  const getSessionStatus = (session: Session) => {
    if (session.completed) {
      return { 
        status: 'Terminée', 
        icon: <CheckCircle className="w-4 h-4" />, 
        color: 'bg-green-100 text-green-800',
        bgColor: 'bg-green-50'
      }
    }
    return { 
      status: 'En cours', 
      icon: <Clock className="w-4 h-4" />, 
      color: 'bg-blue-100 text-blue-800',
      bgColor: 'bg-blue-50'
    }
  }

  const getCompletedSessionsCount = () => {
    return sessions.filter(s => s.completed).length
  }

  const getTotalVolume = () => {
    return userStats ? Math.round(userStats.total_volume / 1000) : 0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">GorFit</h1>
              <p className="text-sm text-gray-600">Ton coach fitness personnel</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/statistics')}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Statistiques
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Séances Terminées</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userStats?.sessions_completed || 0}
            </div>
            <p className="text-sm text-gray-600">
              Bravo pour ta régularité !
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Volume Total</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {getTotalVolume()} tonnes
            </div>
            <p className="text-sm text-gray-600">
              {userStats?.total_reps || 0} répétitions au total
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Taux de Réussite</h3>
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {sessions.length > 0 ? Math.round((getCompletedSessionsCount() / sessions.length) * 100) : 0}%
            </div>
            <p className="text-sm text-gray-600">
              Séances terminées vs créées
            </p>
          </div>
        </div>

        {/* Actions principales */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mes Séances</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle Séance
          </button>
        </div>

        {/* Formulaire de création de séance */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <CreateSessionForm
                onSessionCreated={handleSessionCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          </div>
        )}

        {/* Liste des séances */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-800">Séances Récentes</h3>
          </div>
          
          {sessions.length > 0 ? (
            <div className="divide-y">
              {sessions.map((session) => {
                const status = getSessionStatus(session)
                return (
                  <div 
                    key={session.id} 
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${status.bgColor}`}
                    onClick={() => router.push(`/session/${session.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-800">
                            Séance du {formatDate(session.date)}
                          </h4>
                          <span className={`px-2 py-1 ${status.color} text-xs rounded-full flex items-center`}>
                            {status.icon}
                            <span className="ml-1">{status.status}</span>
                          </span>
                          {session.type && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              {session.type}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          Objectif: {session.objectif}
                        </p>
                        
                        {session.completed && (
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
                        )}
                        
                        {session.notes && (
                          <p className="text-sm text-gray-600 mt-2 italic">
                            &quot;{session.notes}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-4xl mb-4">🏋️</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Aucune séance créée
              </h3>
              <p className="text-gray-600 mb-4">
                Commence par créer ta première séance d'entraînement !
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Créer ma première séance
              </button>
            </div>
          )}
        </div>

        {/* Conseils et motivation */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            💪 Conseils pour bien commencer
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>🎯 Commence doucement:</strong> 2-3 séances par semaine suffisent
              </p>
              <p className="text-gray-700">
                <strong>📱 Utilise le Mode Rapide:</strong> Parfait pour débuter
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>⏰ Sois régulier:</strong> Mieux vaut 30 min que 2h occasionnelles
              </p>
              <p className="text-gray-700">
                <strong>📊 Suis ta progression:</strong> Consulte tes statistiques régulièrement
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 