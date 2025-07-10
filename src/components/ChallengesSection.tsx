"use client"

import { useState, useEffect } from 'react'
import { Challenge, UserChallenge } from '@/lib/challengeService'
import { 
  getAvailableChallengesForUser, 
  getJoinedChallenges, 
  joinChallenge,
  getUserChallenges,
  getAbandonedChallengesForUser
} from '@/lib/challengeService'
import { createClient } from '@/lib/supabase'
import ChallengeCard from './ChallengeCard'
import BadgeDisplay from './BadgeDisplay'
import AbandonedChallengesSection from './AbandonedChallengesSection'
import { UserBadge } from '@/types/badges'
import { Trophy, Target, Calendar, TrendingUp, Users, RotateCcw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ChallengesSection() {
  const [availableChallenges, setAvailableChallenges] = useState<Challenge[]>([])
  const [joinedChallenges, setJoinedChallenges] = useState<UserChallenge[]>([])
  const [abandonedChallenges, setAbandonedChallenges] = useState<UserChallenge[]>([])
  const [userBadges, setUserBadges] = useState<UserBadge[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      
      if (user) {
        const [available, joined, abandoned, badges] = await Promise.all([
          getAvailableChallengesForUser(user.id),
          getJoinedChallenges(user.id),
          getAbandonedChallengesForUser(user.id),
          fetchUserBadges(user.id)
        ])
        
        setAvailableChallenges(available)
        setJoinedChallenges(joined)
        setAbandonedChallenges(abandoned)
        setUserBadges(badges)
      }
      
      setLoading(false)
    }
    
    fetchData()
  }, [])

  const fetchUserBadges = async (userId: string) => {
    const supabase = createClient()
    const { data } = await supabase
      .from('user_badges')
      .select('*')
      .eq('user_id', userId)
      .order('date_unlocked', { ascending: false })
    
    return data || []
  }

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) return
    
    const success = await joinChallenge(user.id, challengeId)
    if (success) {
      // Recharger les données
      const [available, joined] = await Promise.all([
        getAvailableChallengesForUser(user.id),
        getJoinedChallenges(user.id)
      ])
      setAvailableChallenges(available)
      setJoinedChallenges(joined)
    }
  }

  const handleChallengeResumed = async () => {
    if (!user) return
    
    // Recharger les données après reprise d'un challenge
    const [available, joined, abandoned] = await Promise.all([
      getAvailableChallengesForUser(user.id),
      getJoinedChallenges(user.id),
      getAbandonedChallengesForUser(user.id)
    ])
    setAvailableChallenges(available)
    setJoinedChallenges(joined)
    setAbandonedChallenges(abandoned)
  }

  const handleViewDetails = (challenge: Challenge) => {
    router.push(`/challenges/${challenge.id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Section Mes Badges */}
      <div className="bg-gradient-to-br from-white/70 to-gray-50/60 dark:from-gray-900/70 dark:to-black/60 rounded-xl shadow-xl border border-white/30 backdrop-blur-md glassmorph p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Mes Badges
          </h2>
        </div>
        <BadgeDisplay badges={userBadges} />
      </div>

      {/* Section Challenges en cours */}
      <div className="bg-gradient-to-br from-white/70 to-gray-50/60 dark:from-gray-900/70 dark:to-black/60 rounded-xl shadow-xl border border-white/30 backdrop-blur-md glassmorph p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Challenges en cours
          </h2>
          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {joinedChallenges.length}
          </span>
        </div>
        
        {joinedChallenges.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium mb-2">Aucun challenge en cours</p>
            <p className="text-sm">Rejoins un challenge pour commencer ton aventure !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {joinedChallenges.map((userChallenge) => (
              <ChallengeCard
                key={userChallenge.id}
                challenge={userChallenge.challenge!}
                userChallenge={userChallenge}
                onViewDetails={handleViewDetails}
                showJoinButton={false}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section Challenges abandonnés */}
      <AbandonedChallengesSection onChallengeResumed={handleChallengeResumed} />

      {/* Section Nouveaux Challenges */}
      <div className="bg-gradient-to-br from-white/70 to-gray-50/60 dark:from-gray-900/70 dark:to-black/60 rounded-xl shadow-xl border border-white/30 backdrop-blur-md glassmorph p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Nouveaux Challenges
          </h2>
          <span className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
            {availableChallenges.length}
          </span>
        </div>
        
        {availableChallenges.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-lg font-medium mb-2">Tous les challenges ont été rejoints !</p>
            <p className="text-sm">Bravo, tu es un vrai champion ! 🏆</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={handleJoinChallenge}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </div>

      {/* Section Classement (optionnel) */}
      <div className="bg-gradient-to-br from-white/70 to-gray-50/60 dark:from-gray-900/70 dark:to-black/60 rounded-xl shadow-xl border border-white/30 backdrop-blur-md glassmorph p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Classement Communautaire
          </h2>
        </div>
        
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 opacity-50" />
          </div>
          <p className="text-lg font-medium mb-2">Fonctionnalité à venir</p>
          <p className="text-sm">Bientôt disponible ! 🚀</p>
        </div>
      </div>
    </div>
  )
} 