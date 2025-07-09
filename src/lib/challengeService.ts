import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export interface Challenge {
  id: string
  title: string
  description: string
  type: 'reps' | 'volume' | 'sessions'
  target: number
  reward_badge_title?: string
  reward_badge_description?: string
  duration_days: number
  icon_emoji: string
  created_at: string
}

export interface UserChallenge {
  id: string
  user_id: string
  challenge_id: string
  start_date: string
  progress: number
  status: 'in_progress' | 'completed' | 'abandoned'
  date_completed?: string
  updated_at?: string
  challenge?: Challenge
}

// Rejoindre un challenge
export async function joinChallenge(userId: string, challengeId: string): Promise<boolean> {
  const supabase = createClient()
  
  // Vérifier si l'utilisateur a déjà rejoint ce challenge
  const { data: existing } = await supabase
    .from('user_challenges')
    .select('*')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .single()
  
  if (existing) {
    toast.error('Tu as déjà rejoint ce challenge !')
    return false
  }
  
  const { error } = await supabase.from('user_challenges').insert({
    user_id: userId,
    challenge_id: challengeId,
    start_date: new Date(),
    status: 'in_progress'
  })
  
  if (error) {
    console.error('Erreur lors de l\'inscription au challenge:', error)
    toast.error('Erreur lors de l\'inscription au challenge')
    return false
  }
  
  toast.success('Challenge rejoint avec succès ! 🎯')
  return true
}

// Mettre à jour la progression d'un challenge
export async function updateChallengeProgress(
  userId: string, 
  challengeId: string, 
  increment: number
): Promise<boolean> {
  const supabase = createClient()
  
  // Récupérer le challenge utilisateur
  const { data: userChallenge } = await supabase
    .from('user_challenges')
    .select('progress, status')
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .single()
  
  if (!userChallenge || userChallenge.status === 'completed') {
    return false
  }
  
  // Récupérer les détails du challenge
  const { data: challenge } = await supabase
    .from('challenges')
    .select('target, reward_badge_title, reward_badge_description, title')
    .eq('id', challengeId)
    .single()
  
  if (!challenge) return false
  
  const newProgress = userChallenge.progress + increment
  let completed = false
  
  if (newProgress >= challenge.target) {
    // Marquer comme complété
    const { error: updateError } = await supabase
      .from('user_challenges')
      .update({
        progress: challenge.target,
        status: 'completed',
        date_completed: new Date()
      })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
    
    if (updateError) {
      console.error('Erreur lors de la complétion:', updateError)
      return false
    }
    
    completed = true
    
    // Débloquer le badge associé
    if (challenge.reward_badge_title) {
      const { error: badgeError } = await supabase.from('user_badges').insert({
        user_id: userId,
        parcours_id: null,
        badge_title: challenge.reward_badge_title,
        badge_description: challenge.reward_badge_description || `Challenge "${challenge.title}" complété !`,
        date_unlocked: new Date()
      })
      
      if (!badgeError) {
        // Animation confettis
        if (typeof window !== 'undefined') {
          import('canvas-confetti').then(confetti => {
            confetti.default({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.6 }
            })
          })
        }
        
        toast.success(`🎉 Challenge complété ! Badge "${challenge.reward_badge_title}" débloqué !`)
      }
    }
  } else {
    // Mise à jour simple de la progression
    const { error: updateError } = await supabase
      .from('user_challenges')
      .update({ progress: newProgress })
      .eq('user_id', userId)
      .eq('challenge_id', challengeId)
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour:', updateError)
      return false
    }
  }
  
  return completed
}

// Récupérer tous les challenges disponibles
export async function getAvailableChallenges(): Promise<Challenge[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Erreur lors de la récupération des challenges:', error)
    return []
  }
  
  return data || []
}

// Récupérer les challenges d'un utilisateur
export async function getUserChallenges(userId: string): Promise<UserChallenge[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', userId)
    .order('start_date', { ascending: false })
  
  if (error) {
    console.error('Erreur lors de la récupération des challenges utilisateur:', error)
    return []
  }
  
  return data || []
}

// Récupérer les challenges rejoints par un utilisateur
export async function getJoinedChallenges(userId: string): Promise<UserChallenge[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('user_challenges')
    .select(`
      *,
      challenge:challenges(*)
    `)
    .eq('user_id', userId)
    .eq('status', 'in_progress')
    .order('start_date', { ascending: false })
  
  if (error) {
    console.error('Erreur lors de la récupération des challenges rejoints:', error)
    return []
  }
  
  return data || []
}

// Récupérer les challenges non rejoints par un utilisateur
export async function getAvailableChallengesForUser(userId: string): Promise<Challenge[]> {
  const supabase = createClient()
  
  // Récupérer les IDs des challenges déjà rejoints
  const { data: joinedChallenges } = await supabase
    .from('user_challenges')
    .select('challenge_id')
    .eq('user_id', userId)
  
  const joinedIds = joinedChallenges?.map(uc => uc.challenge_id) || []
  
  // Récupérer tous les challenges sauf ceux déjà rejoints
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .not('id', 'in', `(${joinedIds.join(',')})`)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Erreur lors de la récupération des challenges disponibles:', error)
    return []
  }
  
  return data || []
}

// Abandonner un challenge
export async function abandonChallenge(userId: string, challengeId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('user_challenges')
    .update({ 
      status: 'abandoned',
      updated_at: new Date()
    })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .eq('status', 'in_progress')
  
  if (error) {
    console.error('Erreur lors de l\'abandon du challenge:', error)
    toast.error('Erreur lors de l\'abandon du challenge')
    return false
  }
  
  toast.success('Challenge abandonné. Tu pourras le reprendre plus tard !')
  return true
}

// Récupérer les challenges abandonnés d'un utilisateur
export async function getAbandonedChallengesForUser(userId: string): Promise<UserChallenge[]> {
  const supabase = createClient()
  
  try {
    // Vérifier d'abord si l'utilisateur existe
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()
    
    if (userError) {
      console.error('Erreur lors de la vérification de l\'utilisateur:', userError)
      return []
    }
    
    if (!user) {
      console.error('Utilisateur non trouvé:', userId)
      return []
    }
    
    // Récupérer les challenges abandonnés
    const { data, error } = await supabase
      .from('user_challenges')
      .select(`
        *,
        challenge:challenges(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'abandoned')
      .order('updated_at', { ascending: false })
    
    if (error) {
      console.error('Erreur lors de la récupération des challenges abandonnés:', error)
      console.error('Code d\'erreur:', error.code)
      console.error('Message d\'erreur:', error.message)
      console.error('Détails:', error.details)
      return []
    }
    
    console.log('Challenges abandonnés récupérés:', data?.length || 0)
    return data || []
    
  } catch (error: any) {
    console.error('Erreur inattendue lors de la récupération des challenges abandonnés:', error)
    console.error('Type d\'erreur:', typeof error)
    console.error('Message:', error?.message)
    console.error('Stack:', error?.stack)
    return []
  }
} 