'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { WorkoutProgram, UserProgram } from '@/types'
import { ArrowLeft, Play, Trophy, Calendar, Target, Users } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([])
  const [userPrograms, setUserPrograms] = useState<UserProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null)
  const [showStartModal, setShowStartModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadPrograms()
  }, [])

  const loadPrograms = async () => {
    try {
      const supabase = createClient()
      
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      // Charger tous les programmes
      const { data: programsData, error: programsError } = await supabase
        .from('workout_programs')
        .select('*')
        .order('name')

      if (programsError) {
        console.error('Erreur programmes:', programsError)
        // Si la table n'existe pas, utiliser des données de test
        const testPrograms = [
          {
            id: '1',
            name: '💪 Prise de Masse Power',
            objective: 'Développer la masse musculaire et la force',
            duration_weeks: 4,
            sessions_per_week: 4,
            description: 'Programme intensif de 4 semaines pour prendre de la masse musculaire. Séances progressives avec focus sur les exercices polyarticulaires et la surcharge progressive.',
            image_url: '/images/programs/muscle-gain.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            name: '🔥 Full Body Summer',
            objective: 'Tonifier tout le corps pour l\'été',
            duration_weeks: 3,
            sessions_per_week: 3,
            description: 'Programme complet de 3 semaines pour sculpter votre corps avant l\'été. Exercices full body avec intensité modérée à élevée.',
            image_url: '/images/programs/summer-body.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            name: '🍃 Sèche Définition',
            objective: 'Perdre du gras et définir les muscles',
            duration_weeks: 3,
            sessions_per_week: 4,
            description: 'Programme de 3 semaines pour perdre du gras tout en préservant la masse musculaire. Combinaison cardio et musculation.',
            image_url: '/images/programs/definition.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '4',
            name: '🍑 Spécial Fessiers',
            objective: 'Développer et tonifier les fessiers',
            duration_weeks: 4,
            sessions_per_week: 3,
            description: 'Programme spécialisé de 4 semaines pour sculpter et tonifier vos fessiers. Exercices ciblés et progressifs.',
            image_url: '/images/programs/glutes.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '5',
            name: '⚔️ Gladiateur Intensif',
            objective: 'Défi physique complet et intensif',
            duration_weeks: 5,
            sessions_per_week: 5,
            description: 'Programme intensif de 5 semaines pour les athlètes confirmés. Développement de la force, endurance et condition physique générale.',
            image_url: '/images/programs/gladiator.jpg',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
        setPrograms(testPrograms)
      } else {
        setPrograms(programsData || [])
      }

      // Charger les programmes de l'utilisateur
      const { data: userProgramsData, error: userProgramsError } = await supabase
        .from('user_programs')
        .select(`
          *,
          program:workout_programs(*)
        `)
        .eq('user_id', user.id)

      if (userProgramsError) {
        console.error('Erreur user_programs:', userProgramsError)
        setUserPrograms([])
      } else {
        setUserPrograms(userProgramsData || [])
      }

    } catch (error: any) {
      console.error('Erreur complète:', error)
      toast.error('Erreur lors du chargement des programmes')
    } finally {
      setIsLoading(false)
    }
  }

  const startProgram = async () => {
    if (!selectedProgram) return

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Vérifier si l'utilisateur a déjà ce programme
      const existingProgram = userPrograms.find(up => up.program_id === selectedProgram.id)
      if (existingProgram) {
        toast.error('Vous suivez déjà ce programme')
        return
      }

      // Créer l'entrée user_program
      const { error } = await supabase
        .from('user_programs')
        .insert({
          user_id: user.id,
          program_id: selectedProgram.id,
          current_week: 1,
          current_session: 1,
          total_sessions_completed: 0
        })

      if (error) throw error

      toast.success(`Programme "${selectedProgram.name}" démarré !`)
      setShowStartModal(false)
      setSelectedProgram(null)
      
      // Rediriger vers la page du programme
      router.push(`/programs/${selectedProgram.id}`)

    } catch (error: any) {
      toast.error('Erreur lors du démarrage du programme')
      console.error(error)
    }
  }

  const getProgressPercentage = (userProgram: UserProgram) => {
    const totalSessions = userProgram.program!.duration_weeks * userProgram.program!.sessions_per_week
    return Math.round((userProgram.total_sessions_completed / totalSessions) * 100)
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

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 shadow-md border-b border-gray-200 dark:border-gray-800 backdrop-blur supports-backdrop-blur:backdrop-blur-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <h1 className="text-2xl font-bold text-black dark:text-white">🏆 Parcours GorFit</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Programmes en cours */}
        {userPrograms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center">
              <Play className="w-5 h-5 mr-2 text-blue-600" />
              Mes parcours en cours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPrograms.map((userProgram) => (
                <div
                  key={userProgram.id}
                  onClick={() => router.push(`/programs/${userProgram.program_id}`)}
                  className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {userProgram.program?.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Semaine {userProgram.current_week}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {userProgram.program?.objective}
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Progression</span>
                      <span className="font-medium text-black dark:text-white">
                        {getProgressPercentage(userProgram)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${getProgressPercentage(userProgram)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {userProgram.total_sessions_completed} séances terminées
                    </span>
                    <span className="text-blue-600 font-medium">
                      Continuer →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catalogue des programmes */}
        <div>
          <h2 className="text-xl font-bold text-black dark:text-white mb-6 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-600" />
            Catalogue des parcours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => {
              const isActive = userPrograms.some(up => up.program_id === program.id)
              
              return (
                <div
                  key={program.id}
                  className={`bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border transition-all ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-200 dark:border-gray-700 hover:shadow-xl'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {program.name}
                    </h3>
                    {isActive && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                        En cours
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {program.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm">
                      <Target className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {program.objective}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {program.duration_weeks} semaines • {program.sessions_per_week} séances/semaine
                      </span>
                    </div>
                  </div>
                  
                  {!isActive ? (
                    <button
                      onClick={() => {
                        setSelectedProgram(program)
                        setShowStartModal(true)
                      }}
                      className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Commencer ce parcours
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/programs/${program.id}`)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Continuer le parcours
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal de confirmation */}
      {showStartModal && selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md mx-4">
            <h3 className="text-xl font-bold text-black dark:text-white mb-4">
              Commencer le parcours
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Êtes-vous sûr de vouloir commencer le parcours "{selectedProgram.name}" ?
              Ce programme dure {selectedProgram.duration_weeks} semaines avec {selectedProgram.sessions_per_week} séances par semaine.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowStartModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={startProgram}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 