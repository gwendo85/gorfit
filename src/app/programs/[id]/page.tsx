'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { WorkoutProgram, UserProgram, Session } from '@/types'
import { ArrowLeft, Play, Trophy, Calendar, Target, Check, Clock, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProgramDetailPage() {
  const [program, setProgram] = useState<WorkoutProgram | null>(null)
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const programId = params.id as string

  useEffect(() => {
    loadProgramData()
  }, [programId])

  const loadProgramData = async () => {
    try {
      const supabase = createClient()
      
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Charger le programme
      const { data: programData, error: programError } = await supabase
        .from('workout_programs')
        .select('*')
        .eq('id', programId)
        .single()

      if (programError) throw programError
      setProgram(programData)

      // Charger le programme de l'utilisateur
      const { data: userProgramData, error: userProgramError } = await supabase
        .from('user_programs')
        .select(`
          *,
          program:workout_programs(*)
        `)
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .single()

      if (userProgramError && userProgramError.code !== 'PGRST116') {
        throw userProgramError
      }
      setUserProgram(userProgramData)

      // Charger les séances du programme
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('program_id', programId)
        .order('program_week')
        .order('program_session')

      if (sessionsError) throw sessionsError
      setSessions(sessionsData || [])

    } catch (error: any) {
      toast.error('Erreur lors du chargement du programme')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const startSession = async (week: number, session: number) => {
    if (!program) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Créer une nouvelle séance pour ce programme
      const sessionData = {
        user_id: user.id,
        date: new Date().toISOString().split('T')[0],
        objectif: `${program.name} - Semaine ${week}, Séance ${session}`,
        completed: false,
        program_id: program.id,
        program_week: week,
        program_session: session
      }

      const { data: newSession, error } = await supabase
        .from('sessions')
        .insert(sessionData)
        .select()
        .single()

      if (error) throw error

      toast.success('Séance créée !')
      router.push(`/session/${newSession.id}`)

    } catch (error: any) {
      toast.error('Erreur lors de la création de la séance')
      console.error(error)
    }
  }

  const getProgressPercentage = () => {
    if (!userProgram || !program) return 0
    const totalSessions = program.duration_weeks * program.sessions_per_week
    return Math.round((userProgram.total_sessions_completed / totalSessions) * 100)
  }

  const isSessionCompleted = (week: number, session: number) => {
    return sessions.some(s => 
      s.program_week === week && 
      s.program_session === session && 
      s.completed
    )
  }

  const getSessionStatus = (week: number, session: number) => {
    const sessionData = sessions.find(s => 
      s.program_week === week && 
      s.program_session === session
    )
    
    if (!sessionData) return 'not_started'
    if (sessionData.completed) return 'completed'
    return 'in_progress'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Programme non trouvé</p>
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
              <button
                onClick={() => router.push('/programs')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-2xl font-bold text-black dark:text-white">{program.name}</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informations du programme */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white mb-2">
                {program.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {program.description}
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">{program.objective}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {program.duration_weeks} semaines
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-gray-600 dark:text-gray-400">
                    {program.sessions_per_week} séances/semaine
                  </span>
                </div>
              </div>
            </div>
            {userProgram && (
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {getProgressPercentage()}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Progression
                </div>
              </div>
            )}
          </div>

          {userProgram && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Progression globale</span>
                <span className="font-medium text-black dark:text-white">
                  {userProgram.total_sessions_completed} / {program.duration_weeks * program.sessions_per_week} séances
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
            </div>
          )}

          {!userProgram && (
            <button
              onClick={() => router.push('/programs')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Commencer ce programme
            </button>
          )}
        </div>

        {/* Calendrier des séances */}
        {userProgram && (
          <div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Calendrier des séances
            </h3>
            
            <div className="space-y-6">
              {Array.from({ length: program.duration_weeks }, (_, weekIndex) => {
                const week = weekIndex + 1
                return (
                  <div key={week} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg">
                    <h4 className="text-lg font-semibold text-black dark:text-white mb-4">
                      Semaine {week}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Array.from({ length: program.sessions_per_week }, (_, sessionIndex) => {
                        const session = sessionIndex + 1
                        const status = getSessionStatus(week, session)
                        
                        return (
                          <div
                            key={session}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              status === 'completed'
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : status === 'in_progress'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h5 className="font-medium text-black dark:text-white">
                                Séance {session}
                              </h5>
                              {status === 'completed' && (
                                <Check className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {status === 'completed' && '✅ Terminée'}
                                {status === 'in_progress' && '🔄 En cours'}
                                {status === 'not_started' && '⏳ À faire'}
                              </div>
                              
                              {status === 'not_started' && (
                                <button
                                  onClick={() => startSession(week, session)}
                                  className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                  <Play className="w-4 h-4 inline mr-1" />
                                  Commencer
                                </button>
                              )}
                              
                              {status === 'in_progress' && (
                                <button
                                  onClick={() => {
                                    const sessionData = sessions.find(s => 
                                      s.program_week === week && 
                                      s.program_session === session
                                    )
                                    if (sessionData) {
                                      router.push(`/session/${sessionData.id}`)
                                    }
                                  }}
                                  className="w-full px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                                >
                                  Continuer
                                </button>
                              )}
                              
                              {status === 'completed' && (
                                <div className="text-sm text-green-600 font-medium">
                                  ✓ Complétée
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Statistiques du programme */}
        {userProgram && (
          <div className="mt-8">
            <h3 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Statistiques du programme
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {userProgram.total_sessions_completed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Séances terminées
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {program.duration_weeks * program.sessions_per_week - userProgram.total_sessions_completed}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Séances restantes
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Math.ceil((userProgram.total_sessions_completed / (program.duration_weeks * program.sessions_per_week)) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Taux de réussite
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 