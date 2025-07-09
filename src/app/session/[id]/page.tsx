'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Session, Exercise } from '@/types'
import { formatDate, calculateTotalVolume } from '@/lib/utils'
import { ArrowLeft, Check, X, Timer, Zap, Save } from 'lucide-react'
import TimerComponent from '@/components/Timer'
import toast from 'react-hot-toast'
import { Dialog } from '@headlessui/react'

export default function SessionPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [showTimer, setShowTimer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRapidMode, setIsRapidMode] = useState(false)
  const [rapidTimer, setRapidTimer] = useState(90)
  const [showEndModal, setShowEndModal] = useState(false)
  const [isEndLoading, setIsEndLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const sessionId = params.id as string

  useEffect(() => {
    const loadSession = async () => {
      const supabase = createClient()
      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .single()
        if (sessionError) throw sessionError
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })
        if (exercisesError) throw exercisesError
        setSession(sessionData)
        setExercises(exercisesData || [])
      } catch (error) {
        console.error('Erreur lors du chargement de la séance:', error)
        toast.error('Erreur lors du chargement de la séance')
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }
    loadSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  useEffect(() => {
    if (isRapidMode && exercises.length > 0 && exercises.every(ex => ex.completed)) {
      setShowEndModal(true)
      setIsRapidMode(false)
    }
  }, [exercises, isRapidMode])

  const toggleExerciseCompletion = async (exerciseId: string) => {
    setIsUpdating(true)
    const supabase = createClient()
    try {
      const exercise = exercises.find(ex => ex.id === exerciseId)
      if (!exercise) return
      const { error } = await supabase
        .from('exercises')
        .update({ completed: !exercise.completed })
        .eq('id', exerciseId)
      if (error) throw error
      setExercises(exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      ))
      toast.success(exercise.completed ? 'Exercice marqué comme non terminé' : 'Exercice terminé !')
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setIsUpdating(false)
    }
  }

  const getProgress = () => {
    if (exercises.length === 0) return 0
    const completed = exercises.filter(ex => ex.completed).length
    return Math.round((completed / exercises.length) * 100)
  }

  const getCurrentExercise = () => {
    return exercises[currentExerciseIndex] || null
  }

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
    }
  }

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1)
    }
  }

  // Fonctions pour le Mode Rapide
  const toggleRapidMode = () => {
    setIsRapidMode(!isRapidMode)
    if (!isRapidMode) {
      toast.success('Mode Rapide activé ! ⚡')
    } else {
      toast.success('Mode Rapide désactivé')
    }
  }

  const handleRapidTimerComplete = () => {
    if (isRapidMode && currentExercise) {
      toggleExerciseCompletion(currentExercise.id)
      if (currentExerciseIndex < exercises.length - 1) {
        nextExercise()
        toast.success('Exercice terminé automatiquement ! 🚀')
      } else {
        toast.success('Séance terminée ! 🎉')
        setShowEndModal(true)
        setIsRapidMode(false)
      }
    }
  }

  const startRapidSession = () => {
    setIsRapidMode(true)
    setCurrentExerciseIndex(0)
    toast.success('Mode Rapide démarré ! ⚡')
  }

  async function handleEndSession(save: boolean) {
    setIsEndLoading(true)
    const supabase = createClient()
    try {
      if (save) {
        // Calculs automatiques
        const calculatedVolume = calculateTotalVolume(exercises)
        const calculatedReps = exercises.reduce((acc, ex) => acc + (ex.sets * ex.reps), 0)
        const estimatedDuration = exercises.length * 90 // 90s par exo
        // Marquer la séance comme terminée et enrichir les stats
        await supabase.from('sessions').update({
          completed: true,
          volume_estime: calculatedVolume,
          reps_total: calculatedReps,
          duration_estimate: estimatedDuration
        }).eq('id', sessionId)
        // (Ici tu peux ajouter la logique pour mettre à jour une table user_stats si besoin)
        toast.success('🎉 Séance enregistrée et ajoutée à tes stats !')
      } else {
        // Supprimer la séance
        await supabase.from('sessions').delete().eq('id', sessionId)
        await supabase.from('exercises').delete().eq('session_id', sessionId)
        toast('Séance non enregistrée.')
      }
      setIsEndLoading(false)
      router.push('/dashboard')
    } catch (e) {
      setIsEndLoading(false)
      toast.error("Erreur lors de l'opération.")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de la séance...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Séance non trouvée</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    )
  }

  const totalVolume = calculateTotalVolume(exercises)
  const progress = getProgress()
  const currentExercise = getCurrentExercise()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Séance du {formatDate(session.date)}
                </h1>
                <p className="text-sm text-gray-600 capitalize">
                  Objectif: {session.objectif}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowTimer(!showTimer)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Timer className="w-4 h-4 mr-2" />
                Timer
              </button>
              <button
                onClick={() => setShowEndModal(true)}
                className="flex items-center px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progression */}
        <div className="bg-white rounded-lg p-6 shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Progression</h2>
            <span className="text-sm text-gray-600">
              {exercises.filter(ex => ex.completed).length}/{exercises.length} exercices terminés
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-800">{progress}%</p>
              <p className="text-sm text-gray-600">Terminé</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{Math.round(totalVolume / 1000)}</p>
              <p className="text-sm text-gray-600">Volume (tonnes)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{exercises.length}</p>
              <p className="text-sm text-gray-600">Exercices</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timer */}
          {showTimer && (
            <div className="lg:col-span-1">
              <TimerComponent duration={90} onComplete={nextExercise} />
            </div>
          )}

          {/* Mode Rapide */}
          {isRapidMode && (
            <div className="lg:col-span-1">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-orange-800">⚡ Mode Rapide</h3>
                  <span className="text-sm text-orange-600">Auto-complétion</span>
                </div>
                <p className="text-sm text-orange-700 mb-3">
                  Les exercices se terminent automatiquement après le timer
                </p>
                <TimerComponent duration={rapidTimer} onComplete={handleRapidTimerComplete} />
              </div>
            </div>
          )}

          {/* Exercice en cours */}
          <div className={`${showTimer || isRapidMode ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {currentExercise && (
              <div className="bg-white rounded-lg p-6 shadow-md mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">
                        {currentExercise.name}
                      </h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {currentExercise.type}
                      </span>
                      {isRapidMode && (
                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full flex items-center">
                          <Zap className="w-3 h-3 mr-1" />
                          Mode Rapide
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600">
                      Exercice {currentExerciseIndex + 1} sur {exercises.length}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleExerciseCompletion(currentExercise.id)}
                    disabled={isUpdating}
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      currentExercise.completed
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {currentExercise.completed ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Terminer
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">{currentExercise.sets}</p>
                    <p className="text-sm text-gray-600">Séries</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{currentExercise.reps}</p>
                    <p className="text-sm text-gray-600">Répétitions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">{currentExercise.weight}kg</p>
                    <p className="text-sm text-gray-600">Poids</p>
                  </div>
                </div>

                {currentExercise.note && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-blue-800 italic">&quot;{currentExercise.note}&quot;</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={previousExercise}
                    disabled={currentExerciseIndex === 0}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </button>
                  <button
                    onClick={nextExercise}
                    disabled={currentExerciseIndex === exercises.length - 1}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Suivant
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </button>
                </div>
              </div>
            )}

            {/* Liste des exercices */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Liste des exercices</h3>
              </div>
              <div className="divide-y">
                {exercises.map((exercise, index) => (
                  <div
                    key={exercise.id}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index === currentExerciseIndex ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                    }`}
                    onClick={() => setCurrentExerciseIndex(index)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-500">#{index + 1}</span>
                          <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {exercise.type}
                          </span>
                          {exercise.completed && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Terminé
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {exercise.sets} séries × {exercise.reps} reps @ {exercise.weight}kg
                        </p>
                        {exercise.note && (
                          <p className="text-sm text-gray-500 mt-1 italic">&quot;{exercise.note}&quot;</p>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExerciseCompletion(exercise.id)
                        }}
                        disabled={isUpdating}
                        className={`ml-4 p-2 rounded-lg transition-colors ${
                          exercise.completed
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {exercise.completed ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Notes de la séance */}
        {session.notes && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes de la séance</h3>
            <p className="text-gray-700 italic">&quot;{session.notes}&quot;</p>
          </div>
        )}
      </div>
      <Dialog open={showEndModal} onClose={() => router.push('/dashboard')} className="fixed z-50 inset-0 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="bg-white rounded-xl shadow-xl p-8 z-50 max-w-md mx-auto flex flex-col items-center">
          <div className="text-5xl mb-4">✅</div>
          <Dialog.Title className="text-xl font-bold mb-2 text-center">Enregistrer cette séance&nbsp;?</Dialog.Title>
          <Dialog.Description className="mb-6 text-center text-gray-700">
            Souhaites-tu enregistrer cette séance dans ton planning pour suivre ta progression&nbsp;?
          </Dialog.Description>
          <div className="flex w-full gap-4">
            <button
              className="flex-1 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors text-base font-medium"
              onClick={() => handleEndSession(false)}
              disabled={isEndLoading}
            >
              Non, retour
            </button>
            <button
              className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-base font-medium"
              onClick={() => handleEndSession(true)}
              disabled={isEndLoading}
            >
              Oui, enregistrer
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 