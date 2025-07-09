'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Session, Exercise, WeeklyStats } from '@/types'
import { formatDate, calculateTotalVolume, getWeekStats, calculateStreak } from '@/lib/utils'
import { Plus, LogOut, TrendingUp, Calendar, Dumbbell, Target, Check, Zap } from 'lucide-react'
import CreateSessionForm from '@/components/CreateSessionForm'
import ProgressCharts from '@/components/ProgressCharts'
import toast from 'react-hot-toast'
import Tabs from '@/components/Tabs'
import { BarChart2 } from 'lucide-react'
import RapidSessionModal from '@/components/RapidSessionModal'

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [tab, setTab] = useState(0)
  const router = useRouter()
  const [showRapidModal, setShowRapidModal] = useState(false)
  const [isRapidLoading, setIsRapidLoading] = useState(false)

  // Fonction pour déterminer la couleur selon le statut et la date
  const getSessionColor = (session: Session) => {
    const today = new Date().toISOString().split('T')[0]
    const sessionDate = session.date
    
    // Séance terminée
    if (session.completed) {
      return {
        border: 'border-red-500',
        bg: 'bg-red-50 dark:bg-red-900/20',
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-500 text-white'
      }
    }
    
    // Séance du jour
    if (sessionDate === today) {
      return {
        border: 'border-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-500 text-white'
      }
    }
    
    // Séance à venir (date future)
    if (sessionDate > today) {
      return {
        border: 'border-green-500',
        bg: 'bg-green-50 dark:bg-green-900/20',
        text: 'text-green-700 dark:text-green-300',
        badge: 'bg-green-500 text-white'
      }
    }
    
    // Séance passée non terminée
    return {
      border: 'border-gray-400',
      bg: 'bg-gray-50 dark:bg-gray-800',
      text: 'text-gray-600 dark:text-gray-400',
      badge: 'bg-gray-500 text-white'
    }
  }

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }
      
      setUser({ id: user.id, email: user.email || '' })
    }
    checkAuth()
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = async () => {
    const supabase = createClient()
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Charger les séances
      const { data: sessionsData } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      // Charger les exercices
      const { data: exercisesData } = await supabase
        .from('exercises')
        .select('*')
        .in('session_id', sessionsData?.map(s => s.id) || [])

      if (sessionsData) setSessions(sessionsData)
      if (exercisesData) setExercises(exercisesData)

      // Calculer les statistiques hebdomadaires
      if (sessionsData && exercisesData) {
        const stats = getWeekStats(sessionsData, exercisesData)
        setWeeklyStats(stats)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth')
  }

  const handleSessionCreated = () => {
    setShowCreateForm(false)
    loadData()
  }

  const getTotalVolume = () => {
    return exercises.reduce((total, exercise) => {
      return total + (exercise.sets * exercise.reps * exercise.weight)
    }, 0)
  }

  const getTotalReps = () => {
    return exercises.reduce((total, exercise) => {
      return total + (exercise.sets * exercise.reps)
    }, 0)
  }

  const getStreak = () => {
    return calculateStreak(sessions)
  }

  // Fonction de génération automatique de séance selon les choix utilisateur
  const handleRapidSession = async (type: string, duration: number) => {
    setIsRapidLoading(true)
    const supabase = createClient()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Vous devez être connecté')
        setIsRapidLoading(false)
        return
      }
      // Générer la séance selon le type et la durée
      const today = new Date().toISOString().split('T')[0]
      let objectif = 'musculation'
      let notes = 'Séance générée automatiquement (Mode Rapide)'
      let exercices: Array<{ name: string; type: string; sets: number; reps: number; weight: number | null; note: string; completed: boolean }> = []
      if (type === 'fullbody') {
        objectif = 'Full Body'
        exercices = [
          { name: 'Pompes', type: 'Poids du corps', sets: 3, reps: 12, weight: null, note: '', completed: false },
          { name: 'Squats', type: 'Poids du corps', sets: 3, reps: 15, weight: null, note: '', completed: false },
          { name: 'Tractions', type: 'Poids du corps', sets: 3, reps: 8, weight: null, note: '', completed: false },
        ]
      } else if (type === 'haut') {
        objectif = 'Haut du corps'
        exercices = [
          { name: 'Pompes', type: 'Poids du corps', sets: 4, reps: 10, weight: null, note: '', completed: false },
          { name: 'Dips', type: 'Poids du corps', sets: 3, reps: 8, weight: null, note: '', completed: false },
          { name: 'Tractions', type: 'Poids du corps', sets: 3, reps: 6, weight: null, note: '', completed: false },
        ]
      } else if (type === 'bas') {
        objectif = 'Bas du corps'
        exercices = [
          { name: 'Squats', type: 'Poids du corps', sets: 4, reps: 15, weight: null, note: '', completed: false },
          { name: 'Fentes', type: 'Poids du corps', sets: 3, reps: 12, weight: null, note: '', completed: false },
          { name: 'Mollets debout', type: 'Poids du corps', sets: 3, reps: 20, weight: null, note: '', completed: false },
        ]
      }
      // Adapter le nombre de sets/reps selon la durée
      if (duration === 20) {
        exercices = exercices.map(ex => ({ ...ex, sets: Math.max(2, Math.round(ex.sets * 0.7)) }))
      } else if (duration === 45) {
        exercices = exercices.map(ex => ({ ...ex, sets: ex.sets + 1 }))
      }
      // Créer la séance
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          date: today,
          objectif,
          notes
        })
        .select()
        .single()
      if (sessionError) throw sessionError
      // Créer les exercices
      const exercisesToInsert = exercices.map(ex => ({
        session_id: session.id,
        ...ex
      }))
      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesToInsert)
      if (exercisesError) throw exercisesError
      toast.success('Séance rapide générée !')
      setShowRapidModal(false)
      setIsRapidLoading(false)
      router.push(`/session/${session.id}`)
    } catch (error: any) {
      setIsRapidLoading(false)
      setShowRapidModal(false)
      toast.error(error.message || 'Erreur lors de la génération rapide')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 shadow-md border-b border-gray-200 dark:border-gray-800 backdrop-blur supports-backdrop-blur:backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black dark:text-white">🏋️ GorFit</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 dark:text-gray-300">Bonjour, {user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-6">
        {/* Onglets */}
        <Tabs
          tabs={[
            { label: 'Planning', icon: <Calendar className="w-5 h-5" /> },
            { label: 'Statistiques', icon: <BarChart2 className="w-5 h-5" /> },
            { label: 'Progression', icon: <TrendingUp className="w-5 h-5" /> },
          ]}
          selected={tab}
          onSelect={setTab}
        />

        <div className="mt-6">
          {/* Onglet Planning */}
          {tab === 0 && (
            <>
              <div className="mb-8 flex flex-col sm:flex-row justify-end gap-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center px-6 py-3 rounded-xl bg-black/70 text-white shadow-lg backdrop-blur-md border border-white/20 hover:bg-black transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer une séance
                </button>
                <button
                  onClick={() => setShowRapidModal(true)}
                  disabled={isRapidLoading}
                  className="flex items-center px-6 py-3 rounded-xl bg-blue-600/80 text-white shadow-lg backdrop-blur-md border border-white/20 hover:bg-blue-700 transition-colors disabled:opacity-60"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Mode Rapide (Séance Auto)
                </button>
              </div>
              <RapidSessionModal
                open={showRapidModal}
                onClose={() => setShowRapidModal(false)}
                onLaunch={handleRapidSession}
                loading={isRapidLoading}
              />
              <h2 className="text-xl font-bold text-black dark:text-white mb-6">📅 Séances récentes</h2>
              
              {/* Légende des couleurs */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🎨 Code Couleur</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Terminées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Aujourd'hui</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">À venir</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Passées</span>
                  </div>
                </div>
              </div>
              
              {sessions.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center shadow-md">
                  <p className="text-gray-500 mb-4">Aucune séance pour le moment</p>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Créer votre première séance
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sessions.map((session) => {
                    const sessionExercises = exercises.filter(ex => ex.session_id === session.id)
                    const totalVolume = calculateTotalVolume(sessionExercises)
                    const color = getSessionColor(session)
                    return (
                      <div
                        key={session.id}
                        onClick={() => router.push(`/session/${session.id}`)}
                        className={`bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer border ${color.border} dark:border-gray-800`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className={`font-semibold ${color.text}`}>
                              {formatDate(session.date)}
                            </h3>
                            <p className={`text-sm capitalize ${color.text}`}>
                              {session.objectif}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {session.completed && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full flex items-center">
                                <Check className="w-3 h-3 mr-1" />
                                Terminée
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${color.badge}`}>
                              {sessionExercises.length} exercices
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className={`${color.text}`}>Volume total:</span>
                            <span className={`font-medium ${color.text}`}>{Math.round(totalVolume / 1000)} tonnes</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className={`${color.text}`}>Exercices complétés:</span>
                            <span className={`font-medium ${color.text}`}>
                              {sessionExercises.filter(ex => ex.completed).length}/{sessionExercises.length}
                            </span>
                          </div>
                        </div>
                        {session.notes && (
                          <p className={`text-sm mt-3 italic ${color.text}`}>
                            &quot;{session.notes}&quot;
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}

          {/* Onglet Statistiques */}
          {tab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md flex flex-col items-center">
                <div className="p-2 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
                  <TrendingUp className="w-6 h-6 text-black dark:text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Volume total</p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {Math.round(getTotalVolume() / 1000)} tonnes
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md flex flex-col items-center">
                <div className="p-2 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
                  <BarChart2 className="w-6 h-6 text-black dark:text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Répétitions</p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {getTotalReps().toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md flex flex-col items-center">
                <div className="p-2 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
                  <Calendar className="w-6 h-6 text-black dark:text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Séances</p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {sessions.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md flex flex-col items-center">
                <div className="p-2 bg-black/10 dark:bg-white/10 rounded-lg mb-2">
                  <TrendingUp className="w-6 h-6 text-black dark:text-white" />
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {getStreak()} jours
                </p>
              </div>
            </div>
          )}

          {/* Onglet Progression */}
          {tab === 2 && (
            <div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-6">📈 Progression hebdomadaire</h2>
              <ProgressCharts weeklyStats={weeklyStats} />
            </div>
          )}
        </div>
      </div>

      {/* Modal de création de séance */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CreateSessionForm
              onSessionCreated={handleSessionCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}