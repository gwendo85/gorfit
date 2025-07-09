import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'

export async function checkAndUnlockBadge(userId: string, parcoursId: string) {
  const supabase = createClient()
  // Vérifier si badge déjà obtenu
  const { data: existing } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)
    .eq('parcours_id', parcoursId)
    .single()

  if (existing) return false

  // Récupérer le titre du badge selon le parcours
  const badgeTitle = getBadgeTitleFromParcoursId(parcoursId)
  const { error } = await supabase.from('user_badges').insert({
    user_id: userId,
    parcours_id: parcoursId,
    badge_title: badgeTitle,
    date_unlocked: new Date()
  })

  if (!error) {
    notifyUserBadgeUnlocked(badgeTitle)
    return true
  }
  return false
}

export function getBadgeTitleFromParcoursId(parcoursId: string) {
  const mapping: Record<string, string> = {
    'hypertrophie-id': '🏆 Hypertrophie Master',
    'cross-training-id': '⚡ Cross Training Warrior',
    'full-body-summer-id': '🔥 Summer Shredder',
    'special-fessiers-id': '🍑 Glute Queen',
    'shape-bikini-id': '👙 Bikini Ready',
    'seche-definition-id': '🍃 Dry Cut Finisher'
  }
  return mapping[parcoursId] || '🏅 Champion GorFit'
}

export function notifyUserBadgeUnlocked(badgeTitle: string) {
  toast.success(`🎉 Badge débloqué : ${badgeTitle}`)
  if (typeof window !== 'undefined') {
    import('canvas-confetti').then(confetti => {
      confetti.default({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
        zIndex: 9999
      })
    })
  }
} 