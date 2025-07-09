'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Session, Exercise } from '@/types'
import { formatDate, calculateTotalVolume, calculateVolumeWithType } from '@/lib/utils'
import { saveCompletedSession } from '@/lib/sessionUtils'
import { ArrowLeft, Check, X, Timer, Share2 } from 'lucide-react'
import TimerComponent from '@/components/Timer'
import toast from 'react-hot-toast'

export default function SessionPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [showTimer, setShowTimer] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCongratulations, setShowCongratulations] = useState(false)
  const [isSavingSession, setIsSavingSession] = useState(false)
  const [sessionSaved, setSessionSaved] = useState(false)
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

  const getProgress = () => {
    if (exercises.length === 0) return 0
    const completed = exercises.filter(ex => ex.completed).length
    return Math.round((completed / exercises.length) * 100)
  }

  const getTotalReps = () => {
    return exercises.reduce((total, exercise) => total + (exercise.sets * exercise.reps), 0)
  }

  const getEstimatedDuration = () => {
    // Estimation : 2-3 minutes par série + temps de repos
    const totalSets = exercises.reduce((total, exercise) => total + exercise.sets, 0)
    const estimatedMinutes = Math.round(totalSets * 2.5) // 2.5 min par série en moyenne
    return estimatedMinutes
  }

  const handleSessionCompletion = async () => {
    if (!session || sessionSaved) return
    
    setIsSavingSession(true)
    
    try {
      const result = await saveCompletedSession({
        sessionId,
        exercises,
        session
      })

      if (result.success) {
        setSessionSaved(true)
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast.error('Erreur lors de la sauvegarde de la séance')
    } finally {
      setIsSavingSession(false)
    }
  }

  useEffect(() => {
    const progress = getProgress()
    if (progress === 100 && !showCongratulations) {
      // Délai pour l'animation de félicitations
      setTimeout(() => {
        setShowCongratulations(true)
        // Sauvegarder automatiquement la séance
        handleSessionCompletion()
      }, 500)
    }
  }, [exercises, showCongratulations])

  const handleShare = () => {
    const shareText = `🎉 Je viens de terminer ma séance GorFit !\n💪 ${exercises.length} exercices\n⏱️ ${getEstimatedDuration()} minutes\n🏋️ ${Math.round(volumeInfo.total / 1000)} tonnes soulevées\n\n#GorFit #Musculation #Motivation`
    
    if (navigator.share) {
      navigator.share({
        title: 'Ma séance GorFit terminée !',
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback : copier dans le presse-papier
      navigator.clipboard.writeText(shareText).then(() => {
        toast.success('Texte copié ! Tu peux le coller sur tes réseaux sociaux 📱')
      })
    }
  }

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
  const volumeInfo = calculateVolumeWithType(exercises)
  const progress = getProgress()
  const currentExercise = getCurrentExercise()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sticky */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b z-50">
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
                {sessionSaved && (
                  <p className="text-xs text-green-600 font-medium">
                    ✅ Séance sauvegardée dans ton historique
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isSavingSession && (
                <div className="flex items-center text-blue-600 text-sm">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Sauvegarde...
                </div>
              )}
              <button
                onClick={() => setShowTimer(!showTimer)}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  showTimer 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Timer className="w-4 h-4 mr-2" />
                {showTimer ? 'Masquer Timer' : 'Afficher Timer'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu avec padding-top pour compenser le header fixe */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Timer sticky si activé */}
          {showTimer && (
            <div className="mb-8">
              <TimerComponent duration={90} onComplete={nextExercise} />
            </div>
          )}

          {/* Statistiques de la séance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Progression</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">{progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {exercises.filter(ex => ex.completed).length}/{exercises.length} exercices terminés
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Volume total</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {Math.round(volumeInfo.total / 1000)} tonnes
              </div>
              {volumeInfo.hasBodyWeight && (
                <p className="text-xs text-gray-500">
                  * Estimation poids du corps : 70kg
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Exercices</h3>
              <div className="text-3xl font-bold text-orange-600">{exercises.length}</div>
              <p className="text-sm text-gray-600">Au total</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Exercice en cours */}
            <div className="w-full">
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
                      {currentExercise.weight !== null && currentExercise.weight !== undefined ? (
                        <>
                          <p className="text-3xl font-bold text-orange-600">{currentExercise.weight}kg</p>
                          <p className="text-sm text-gray-600">Poids</p>
                        </>
                      ) : (
                        <>
                          <p className="text-2xl font-bold text-purple-600">💪</p>
                          <p className="text-sm text-gray-600">Poids du corps</p>
                        </>
                      )}
                    </div>
                  </div>

                  {currentExercise.note && (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6">
                      <p className="text-blue-800 font-medium">&quot;{currentExercise.note}&quot;</p>
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
                            {exercise.sets} séries × {exercise.reps} reps 
                            {exercise.weight !== null && exercise.weight !== undefined 
                              ? ` @ ${exercise.weight}kg` 
                              : ' @ Poids du corps'
                            }
                          </p>
                          {exercise.note && (
                            <p className="text-sm text-blue-600 mt-1 font-medium italic">&quot;{exercise.note}&quot;</p>
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

          {/* Temps total estimé */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 shadow-md text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Timer className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">Temps total estimé</h3>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {getEstimatedDuration()} min
            </div>
            <p className="text-sm text-gray-600">
              Basé sur {exercises.reduce((total, ex) => total + ex.sets, 0)} séries au total
            </p>
            {progress === 100 && (
              <div className="mt-4 text-green-600 font-medium">
                🎉 Séance terminée ! Bravo pour ton effort !
              </div>
            )}
          </div>

          {/* Message de félicitations animé */}
          {showCongratulations && progress === 100 && (
            <div className="mt-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg p-8 shadow-lg text-center text-white animate-pulse">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold mb-4">BRAVO !</h2>
              <p className="text-xl mb-4">Tu as terminé ta séance avec brio !</p>
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{exercises.length}</div>
                  <div className="text-sm opacity-90">Exercices</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{getEstimatedDuration()}</div>
                  <div className="text-sm opacity-90">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.round(volumeInfo.total / 1000)}</div>
                  <div className="text-sm opacity-90">Tonnes</div>
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-lg">💪 Continue comme ça, tu es sur la bonne voie !</p>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center mx-auto px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Partager ma réussite
                </button>
                <p className="text-sm opacity-75">Reviens demain pour continuer ta progression !</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 