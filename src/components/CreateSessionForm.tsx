'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, X } from 'lucide-react'
import { sessionSchema, exerciseSchema, SessionFormData, ExerciseFormData } from '@/lib/validations'
import { createClient } from '@/lib/supabase'
import { Exercise } from '@/types'
import toast from 'react-hot-toast'

interface CreateSessionFormProps {
  onSessionCreated: () => void
  onCancel: () => void
}

export default function CreateSessionForm({ onSessionCreated, onCancel }: CreateSessionFormProps) {
  const [exercises, setExercises] = useState<Partial<Exercise>[]>([])
  const [showExerciseForm, setShowExerciseForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register: registerSession,
    handleSubmit: handleSessionSubmit,
    formState: { errors: sessionErrors },
    reset: resetSession
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema)
  })

  const {
    register: registerExercise,
    handleSubmit: handleExerciseSubmit,
    formState: { errors: exerciseErrors },
    reset: resetExercise
  } = useForm<ExerciseFormData>({
    resolver: zodResolver(exerciseSchema)
  })

  const addExercise = (data: ExerciseFormData) => {
    const newExercise: Partial<Exercise> = {
      name: data.name,
      sets: data.sets,
      reps: data.reps,
      weight: data.weight,
      note: data.note,
      completed: false
    }
    setExercises([...exercises, newExercise])
    resetExercise()
    setShowExerciseForm(false)
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const createSession = async (data: SessionFormData) => {
    if (exercises.length === 0) {
      toast.error('Ajoutez au moins un exercice')
      return
    }

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Vous devez être connecté')
        return
      }

      // Créer la séance
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          date: data.date,
          objectif: data.objectif,
          notes: data.notes
        })
        .select()
        .single()

      if (sessionError) throw sessionError

      // Créer les exercices
      const exercisesToInsert = exercises.map(exercise => ({
        session_id: session.id,
        name: exercise.name!,
        sets: exercise.sets!,
        reps: exercise.reps!,
        weight: exercise.weight!,
        note: exercise.note,
        completed: false
      }))

      const { error: exercisesError } = await supabase
        .from('exercises')
        .insert(exercisesToInsert)

      if (exercisesError) throw exercisesError

      toast.success('Séance créée avec succès !')
      resetSession()
      setExercises([])
      onSessionCreated()
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error)
      toast.error('Erreur lors de la création de la séance')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🏋️ Créer une nouvelle séance</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSessionSubmit(createSession)} className="space-y-6">
        {/* Informations de la séance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de la séance
            </label>
            <input
              type="date"
              {...registerSession('date')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {sessionErrors.date && (
              <p className="text-red-500 text-sm mt-1">{sessionErrors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objectif
            </label>
            <select
              {...registerSession('objectif')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Sélectionner un objectif</option>
              <option value="force">Force</option>
              <option value="musculation">Musculation</option>
              <option value="endurance">Endurance</option>
              <option value="cardio">Cardio</option>
              <option value="flexibilite">Flexibilité</option>
            </select>
            {sessionErrors.objectif && (
              <p className="text-red-500 text-sm mt-1">{sessionErrors.objectif.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optionnel)
          </label>
          <textarea
            {...registerSession('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Notes sur la séance..."
          />
        </div>

        {/* Liste des exercices */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Exercices</h3>
            <button
              type="button"
              onClick={() => setShowExerciseForm(true)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ajouter un exercice
            </button>
          </div>

          {exercises.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Aucun exercice ajouté. Cliquez sur &quot;Ajouter un exercice&quot; pour commencer.
            </p>
          )}

          {exercises.map((exercise, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{exercise.name}</h4>
                  <p className="text-sm text-gray-600">
                    {exercise.sets} séries × {exercise.reps} reps @ {exercise.weight}kg
                  </p>
                  {exercise.note && (
                    <p className="text-sm text-gray-500 mt-1 italic">
                      &quot;{exercise.note}&quot;
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeExercise(index)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons de soumission */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Création...' : 'Créer la séance'}
          </button>
        </div>
      </form>

      {/* Formulaire d'ajout d'exercice totalement séparé */}
      {showExerciseForm && (
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mt-6">
          <h4 className="font-medium text-gray-800 mb-4">Nouvel exercice</h4>
          <form
            onSubmit={handleExerciseSubmit((data) => {
              addExercise(data)
            })}
            className="space-y-4"
            action="#"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;exercice
                </label>
                <input
                  type="text"
                  {...registerExercise('name')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ex: Développé couché"
                />
                {exerciseErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{exerciseErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Poids (kg)
                </label>
                <input
                  type="number"
                  {...registerExercise('weight', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
                {exerciseErrors.weight && (
                  <p className="text-red-500 text-sm mt-1">{exerciseErrors.weight.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Séries
                </label>
                <input
                  type="number"
                  {...registerExercise('sets', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="3"
                />
                {exerciseErrors.sets && (
                  <p className="text-red-500 text-sm mt-1">{exerciseErrors.sets.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Répétitions
                </label>
                <input
                  type="number"
                  {...registerExercise('reps', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10"
                />
                {exerciseErrors.reps && (
                  <p className="text-red-500 text-sm mt-1">{exerciseErrors.reps.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <input
                type="text"
                {...registerExercise('note')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ex: Technique à améliorer"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ajouter
              </button>
              <button
                type="button"
                onClick={() => setShowExerciseForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
} 