import { useState, useEffect } from 'react'
import { UserChallenge } from '@/lib/challengeService'
import { getAbandonedChallengesForUser } from '@/lib/challengeService'
import { resumeChallenge } from '@/lib/reminderService'
import { createClient } from '@/lib/supabase'
import { RotateCcw, Calendar, Target, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface AbandonedChallengesSectionProps {
  onChallengeResumed?: () => void
}

export default function AbandonedChallengesSection({ onChallengeResumed }: AbandonedChallengesSectionProps) {
  const [abandonedChallenges, setAbandonedChallenges] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        try {
          const abandoned = await getAbandonedChallengesForUser(user.id)
          setAbandonedChallenges(abandoned)
        } catch (error: any) {
          // Log complet pour debug
          console.error('Erreur lors de la récupération des challenges abandonnés:', error)
          // Affiche un toast uniquement si l’erreur n’est pas un objet vide
          if (error && (error.code || error.message)) {
            toast.error('Erreur lors du chargement des challenges abandonnés. Merci de réessayer plus tard.')
          }
        }
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [])

  const handleResumeChallenge = async (challengeId: string) => {
    if (!user) return
    
    const success = await resumeChallenge(user.id, challengeId)
    if (success) {
      // Recharger les données
      const abandoned = await getAbandonedChallengesForUser(user.id)
      setAbandonedChallenges(abandoned)
      
      // Notifier le parent
      onChallengeResumed?.()
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 60) return 'text-blue-600'
    if (progress >= 40) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  if (abandonedChallenges.length === 0) {
    return (
      <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 dark:from-yellow-900 dark:via-orange-900 dark:to-pink-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
        <div className="flex items-center space-x-3 mb-6">
          <RotateCcw className="w-6 h-6 text-gray-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Challenges abandonnés
          </h2>
        </div>
        
        <div className="text-center py-8 text-gray-700 dark:text-gray-200">
          <RotateCcw className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Aucun challenge abandonné</p>
          <p className="text-sm">Continue comme ça, tu es sur la bonne voie ! 💪</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 dark:from-yellow-900 dark:via-orange-900 dark:to-pink-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors">
      <div className="flex items-center space-x-3 mb-6">
        <RotateCcw className="w-6 h-6 text-gray-500" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Challenges abandonnés
        </h2>
        <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm">
          {abandonedChallenges.length}
        </span>
      </div>
      
      <div className="space-y-4">
        {abandonedChallenges.map((userChallenge) => (
          <div 
            key={userChallenge.id}
            className="bg-white/80 dark:bg-gray-900/80 rounded-lg p-4 border border-gray-200 dark:border-gray-700 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{userChallenge.challenge?.icon_emoji}</span>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {userChallenge.challenge?.title}
                  </h3>
                  <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs">
                    Abandonné
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {userChallenge.challenge?.description}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Abandonné le {formatDate(userChallenge.updated_at || userChallenge.start_date)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>Objectif: {userChallenge.challenge?.target}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span className={getProgressColor(userChallenge.progress)}>
                      Progression: {userChallenge.progress}%
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleResumeChallenge(userChallenge.challenge_id)}
                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reprendre
              </button>
            </div>
            {/* Barre de progression */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    userChallenge.progress >= 80 ? 'bg-green-500' :
                    userChallenge.progress >= 60 ? 'bg-blue-500' :
                    userChallenge.progress >= 40 ? 'bg-yellow-500' :
                    'bg-gray-400'
                  }`}
                  style={{ width: `${Math.min(userChallenge.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 