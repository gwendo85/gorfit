import { Challenge, UserChallenge } from '@/lib/challengeService'
import { Trophy, Target, Calendar, TrendingUp, RotateCcw, Sparkles } from 'lucide-react'
import { abandonChallenge } from '@/lib/challengeService'
import { useState } from 'react'

interface ChallengeCardProps {
  challenge: Challenge
  userChallenge?: UserChallenge
  onJoin?: (challengeId: string) => void
  onViewDetails?: (challenge: Challenge) => void
  onAbandon?: (challengeId: string) => void
  showJoinButton?: boolean
  showAbandonButton?: boolean
}

export default function ChallengeCard({ 
  challenge, 
  userChallenge, 
  onJoin, 
  onViewDetails,
  onAbandon,
  showJoinButton = true,
  showAbandonButton = false
}: ChallengeCardProps) {
  const [isJoining, setIsJoining] = useState(false)
  const progress = userChallenge?.progress || 0
  const target = challenge.target
  const progressPercentage = Math.min((progress / target) * 100, 100)
  const isCompleted = userChallenge?.status === 'completed'
  const isAbandoned = (userChallenge && userChallenge.status === 'abandoned')
  
  // Vérifier si le challenge est nouveau (moins de 7 jours)
  const isNew = new Date(challenge.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  
  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (isAbandoned) return 'bg-gray-400'
    if (progressPercentage >= 67) return 'bg-green-500'
    if (progressPercentage >= 34) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  
  const getTypeIcon = () => {
    switch (challenge.type) {
      case 'sessions': return <Calendar className="w-4 h-4" />
      case 'volume': return <TrendingUp className="w-4 h-4" />
      case 'reps': return <Target className="w-4 h-4" />
      default: return <Trophy className="w-4 h-4" />
    }
  }
  
  const getTypeLabel = () => {
    switch (challenge.type) {
      case 'sessions': return 'Séances'
      case 'volume': return 'Volume (kg)'
      case 'reps': return 'Répétitions'
      default: return 'Objectif'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'cardio': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'force': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'souplesse': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'endurance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'avancé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handleAbandon = async () => {
    if (!userChallenge) return
    
    const success = await abandonChallenge(userChallenge.user_id, challenge.id)
    if (success && onAbandon) {
      onAbandon(challenge.id)
    }
  }

  const handleJoin = async () => {
    if (!onJoin || isJoining) return
    
    setIsJoining(true)
    
    // Animation confettis
    if (typeof window !== 'undefined') {
      try {
        const confetti = await import('canvas-confetti')
        confetti.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#000000', '#3b82f6', '#10b981']
        })
      } catch (error) {
        console.log('Confetti non disponible')
      }
    }
    
    // Légère animation du bouton
    const button = document.querySelector(`[data-challenge-id="${challenge.id}"]`)
    if (button) {
      button.classList.add('scale-105')
      setTimeout(() => button.classList.remove('scale-105'), 200)
    }
    
    await onJoin(challenge.id)
    setIsJoining(false)
  }

  return (
    <div className={`relative bg-gradient-to-br from-white/70 to-gray-50/60 dark:from-gray-900/70 dark:to-black/60 rounded-xl shadow-xl border border-white/30 backdrop-blur-md glassmorph p-6 hover:shadow-2xl transition-all duration-300 ${
      isAbandoned ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{challenge.icon_emoji}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                {challenge.title}
              </h3>
              {isNew && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white animate-pulse">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nouveau
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {challenge.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isCompleted && (
            <div className="text-green-500">
              <Trophy className="w-6 h-6" />
            </div>
          )}
          {isAbandoned && (
            <div className="text-gray-500">
              <RotateCcw className="w-6 h-6" />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Catégorie et difficulté */}
        {(challenge.category || challenge.difficulty_level) && (
          <div className="flex items-center space-x-2">
            {challenge.category && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                {challenge.category}
              </span>
            )}
            {challenge.difficulty_level && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty_level)}`}>
                {challenge.difficulty_level}
              </span>
            )}
          </div>
        )}
        
        {/* Informations du challenge */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-2">
            {getTypeIcon()}
            <span>{getTypeLabel()}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Objectif: {target.toLocaleString()}</span>
            <span>Durée: {challenge.duration_days} jours</span>
          </div>
        </div>
        
        {/* Barre de progression */}
        {userChallenge && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Progression: {progress.toLocaleString()} / {target.toLocaleString()}
              </span>
              <span className="font-semibold">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor()}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
        
        {/* Récompense */}
        {challenge.reward_badge_title && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span>Récompense: {challenge.reward_badge_title}</span>
          </div>
        )}
        
        {/* Boutons d'action */}
        <div className="flex space-x-3 pt-2">
          {showJoinButton && !userChallenge && onJoin && (
            <button
              data-challenge-id={challenge.id}
              onClick={handleJoin}
              disabled={isJoining}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? 'Rejointe...' : 'Rejoindre le Challenge'}
            </button>
          )}
          
          {showAbandonButton && userChallenge && !isCompleted && !isAbandoned && onAbandon && (
            <button
              onClick={handleAbandon}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Abandonner
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Voir Détails
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 