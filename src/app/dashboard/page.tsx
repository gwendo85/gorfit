'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Session, Exercise, WeeklyStats } from '@/types'
import { formatDate, calculateTotalVolume, calculateVolumeWithType, getWeekStats, calculateStreak } from '@/lib/utils'
import { getRapidSessionExercises } from '@/lib/rapidSessions'
import { Plus, LogOut, TrendingUp, Calendar, Dumbbell, Target } from 'lucide-react'
import CreateSessionForm from '@/components/CreateSessionForm'
import RapidSessionModal from '@/components/RapidSessionModal'
import ProgressCharts from '@/components/ProgressCharts'
import toast from 'react-hot-toast'
import Tabs from '@/components/Tabs'
import { BarChart2 } from 'lucide-react'

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showRapidModal, setShowRapidModal] = useState(false)
  const [isGeneratingRapidSession, setIsGeneratingRapidSession] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [tab, setTab] = useState(0)
  const router = useRouter()

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

  const handleRapidSessionSubmit = async (data: { type: string; duration: string }) => {
    setIsGeneratingRapidSession(true)
    const supabase = createClient()
    
    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Vous devez être connecté')
        return
      }

      // Générer la liste d'exercices selon le type et la durée
      const rapidExercises = getRapidSessionExercises(data.type, data.duration)
      
      // Créer la séance
      const sessionName = `Séance Rapide ${data.type} (${data.duration} min)`
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          date: new Date().toISOString().split('T')[0], // Date du jour
          objectif: `Mode Rapide - ${data.type}`,
          notes: `Séance générée automatiquement - ${data.duration} minutes`
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      // Créer les exercices
      const exercisesToInsert = rapidExercises.map(exercise => ({
        session_id: session.id,
        name: exercise.name,
        type: exercise.type,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        note: exercise.note,
        completed: false
      }))

      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesToInsert)

      if (exercisesError) throw exercisesError

      // Succès : toast + fermeture modal + redirection
      toast.success('🚀 Ta séance rapide est prête ! Bonne séance !')
      setShowRapidModal(false)
      
      // Redirection vers la séance générée
      router.push(`/session/${session.id}`)
      
    } catch (error: any) {
      console.error('Erreur lors de la génération de la séance rapide:', error)
      toast.error(error.message || 'Erreur lors de la génération de la séance')
    } finally {
      setIsGeneratingRapidSession(false)
    }
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
      <header className="bg-white dark:bg-black shadow-sm border-b border-gray-200 dark:border-gray-800">
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
              <div className="mb-8 flex justify-end space-x-4">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Créer une séance
                </button>
                <button
                  onClick={() => setShowRapidModal(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Mode Rapide (Séance Auto)
                </button>
              </div>
              <h2 className="text-xl font-bold text-black dark:text-white mb-6">📅 Séances récentes</h2>
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
                    const volumeInfo = calculateVolumeWithType(sessionExercises)
                    return (
                      <div
                        key={session.id}
                        onClick={() => router.push(`/session/${session.id}`)}
                        className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-black dark:text-white">
                              {formatDate(session.date)}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                              {session.objectif}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-black/10 dark:bg-white/10 text-black dark:text-white text-xs rounded-full">
                            {sessionExercises.length} exercices
                          </span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Volume total:</span>
                            <div className="text-right">
                              <span className="font-medium">{Math.round(volumeInfo.total / 1000)} tonnes</span>
                              {volumeInfo.hasBodyWeight && (
                                <div className="text-xs text-gray-500">*Estimation poids du corps</div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Exercices complétés:</span>
                            <span className="font-medium">
                              {sessionExercises.filter(ex => ex.completed).length}/{sessionExercises.length}
                            </span>
                          </div>
                          {session.notes && (
                            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
                              <span className="text-blue-600 dark:text-blue-400 italic">"{session.notes}"</span>
                            </div>
                          )}
                        </div>
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
        <CreateSessionForm
          onSessionCreated={handleSessionCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {showRapidModal && (
        <RapidSessionModal
          open={showRapidModal}
          onClose={() => setShowRapidModal(false)}
          onSubmit={handleRapidSessionSubmit}
          isLoading={isGeneratingRapidSession}
        />
      )}
    </div>
  )
} 