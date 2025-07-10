'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Challenge, UserChallenge } from '@/types/challenges'
import toast from 'react-hot-toast'

export default function ChallengesTest() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChallenges = async () => {
      const supabase = createClient()
      try {
        // Charger tous les challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select('*')
          .order('created_at', { ascending: false })

        if (challengesError) {
          console.error('Erreur challenges:', challengesError)
          toast.error('Erreur lors du chargement des challenges')
          return
        }

        setChallenges(challengesData || [])

        // Charger les user_challenges
        const { data: userChallengesData, error: userChallengesError } = await supabase
          .from('user_challenges')
          .select('*')
          .order('created_at', { ascending: false })

        if (userChallengesError) {
          console.error('Erreur user_challenges:', userChallengesError)
          toast.error('Erreur lors du chargement des user_challenges')
          return
        }

        setUserChallenges(userChallengesData || [])
      } catch (error) {
        console.error('Erreur générale:', error)
        toast.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Test Challenges</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Test Challenges</h2>
      
      {/* Challenges */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Challenges ({challenges.length})</h3>
        {challenges.length === 0 ? (
          <p className="text-gray-500">Aucun challenge trouvé</p>
        ) : (
          <div className="space-y-2">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="p-3 bg-white rounded-lg border">
                <h4 className="font-medium">{challenge.title}</h4>
                <p className="text-sm text-gray-600">{challenge.description}</p>
                <p className="text-xs text-gray-500">
                  Durée: {challenge.duration_days} jours | 
                  Objectif: {challenge.target_exercises} exercices
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Challenges */}
      <div>
        <h3 className="text-lg font-semibold mb-3">User Challenges ({userChallenges.length})</h3>
        {userChallenges.length === 0 ? (
          <p className="text-gray-500">Aucun user challenge trouvé</p>
        ) : (
          <div className="space-y-2">
            {userChallenges.map((userChallenge) => (
              <div key={userChallenge.id} className="p-3 bg-white rounded-lg border">
                <p className="font-medium">Challenge ID: {userChallenge.challenge_id}</p>
                <p className="text-sm text-gray-600">Status: {userChallenge.status}</p>
                <p className="text-xs text-gray-500">
                  Progression: {userChallenge.current_progress || 0} / {userChallenge.target_progress || 0}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h4 className="font-medium mb-2">Debug Info</h4>
        <p className="text-sm">Challenges: {challenges.length}</p>
        <p className="text-sm">User Challenges: {userChallenges.length}</p>
        <p className="text-sm">Abandoned: {userChallenges.filter(uc => uc.status === 'abandoned').length}</p>
        <p className="text-sm">Active: {userChallenges.filter(uc => uc.status === 'active').length}</p>
        <p className="text-sm">Completed: {userChallenges.filter(uc => uc.status === 'completed').length}</p>
      </div>
    </div>
  )
} 