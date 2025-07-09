import { Challenge, UserChallenge } from '@/lib/challengeService'
import { Trophy, Target, Calendar, TrendingUp, RotateCcw } from 'lucide-react'
import { abandonChallenge } from '@/lib/challengeService'

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
  const progress = userChallenge?.progress || 0
  const target = challenge.target
  const progressPercentage = Math.min((progress / target) * 100, 100)
  const isCompleted = userChallenge?.status === 'completed'
  const isAbandoned = (userChallenge && userChallenge.status === 'abandoned')
  
  const getProgressColor = () => {
    if (isCompleted) return 'bg-green-500'
    if (isAbandoned) return 'bg-gray-400'
    if (progressPercentage >= 75) return 'bg-orange-500'
    if (progressPercentage >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
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

  const handleAbandon = async () => {
    if (!userChallenge) return
    
    const success = await abandonChallenge(userChallenge.user_id, challenge.id)
    if (success && onAbandon) {
      onAbandon(challenge.id)
    }
  }

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow ${
      isAbandoned ? 'opacity-75' : ''
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{challenge.icon_emoji}</div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {challenge.title}
            </h3>
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
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
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
              onClick={() => onJoin(challenge.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Rejoindre le Challenge
            </button>
          )}
          
          {showAbandonButton && userChallenge && !isCompleted && !isAbandoned && onAbandon && (
            <button
              onClick={handleAbandon}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Abandonner
            </button>
          )}
          
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(challenge)}
              className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Voir Détails
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 