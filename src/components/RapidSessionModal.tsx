'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Target } from 'lucide-react'

const rapidSessionSchema = z.object({
  type: z.enum(['Full Body', 'Haut du corps', 'Bas du corps'], {
    required_error: 'Veuillez sélectionner un type de séance'
  }),
  duration: z.enum(['20', '30', '45'], {
    required_error: 'Veuillez sélectionner une durée'
  })
})

type RapidSessionFormData = z.infer<typeof rapidSessionSchema>

interface RapidSessionModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: RapidSessionFormData) => void
  isLoading?: boolean
}

export default function RapidSessionModal({ open, onClose, onSubmit, isLoading = false }: RapidSessionModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<RapidSessionFormData>({
    resolver: zodResolver(rapidSessionSchema)
  })

  const watchedType = watch('type')
  const watchedDuration = watch('duration')

  const handleClose = () => {
    reset()
    onClose()
  }

  const handleFormSubmit = (data: RapidSessionFormData) => {
    onSubmit(data)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-auto transform transition-all duration-300 scale-100 opacity-100">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-600" />
              🎯 Mode Rapide
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Génère ta séance automatiquement selon ton besoin
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Type de séance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de séance
            </label>
            <div className="space-y-3">
              {[
                { value: 'Full Body', label: '💪 Full Body (Corps entier)', desc: 'Entraînement complet' },
                { value: 'Haut du corps', label: '🫱 Haut du corps', desc: 'Bras, épaules, dos, pectoraux' },
                { value: 'Bas du corps', label: '🦵 Bas du corps', desc: 'Jambes, fessiers, mollets' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                    watchedType === option.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('type')}
                    value={option.value}
                    className="mt-1 mr-3 text-blue-600"
                    disabled={isLoading}
                  />
                  <div>
                    <div className="font-medium text-gray-800">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="text-red-500 text-sm mt-2">{errors.type.message}</p>
            )}
          </div>

          {/* Durée */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Durée
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '20', label: '20 min', desc: 'Rapide' },
                { value: '30', label: '30 min', desc: 'Standard' },
                { value: '45', label: '45 min', desc: 'Complet' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    watchedDuration === option.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('duration')}
                    value={option.value}
                    className="sr-only"
                    disabled={isLoading}
                  />
                  <div className="font-medium text-gray-800">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </label>
              ))}
            </div>
            {errors.duration && (
              <p className="text-red-500 text-sm mt-2">{errors.duration.message}</p>
            )}
          </div>

          {/* Boutons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || !watchedType || !watchedDuration}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Génération...
                </>
              ) : (
                'Lancer ma séance 🚀'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 