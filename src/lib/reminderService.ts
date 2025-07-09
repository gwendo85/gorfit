import { createClient } from '@/lib/supabase'
import { 
  AbandonedChallenge, 
  ChallengeReminder, 
  NotificationPreferences, 
  ReminderPayload 
} from '@/types'
import toast from 'react-hot-toast'

// Récupérer les challenges abandonnés depuis X jours
export async function getAbandonedChallenges(daysThreshold: number = 7): Promise<AbandonedChallenge[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('get_abandoned_challenges', { days_threshold: daysThreshold })
  
  if (error) {
    console.error('Erreur lors de la récupération des challenges abandonnés:', error)
    return []
  }
  
  return data || []
}

// Reprendre un challenge abandonné
export async function resumeChallenge(userId: string, challengeId: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .rpc('resume_challenge', { 
      user_uuid: userId, 
      challenge_uuid: challengeId 
    })
  
  if (error) {
    console.error('Erreur lors de la reprise du challenge:', error)
    toast.error('Erreur lors de la reprise du challenge')
    return false
  }
  
  if (data) {
    toast.success('Challenge repris avec succès ! 🚀')
    
    // Enregistrer la reprise dans les reminders
    await supabase.from('challenge_reminders').insert({
      user_id: userId,
      challenge_id: challengeId,
      channel: 'in_app',
      resumed_at: new Date().toISOString()
    })
  }
  
  return !!data
}

// Récupérer les préférences de notification d'un utilisateur
export async function getUserNotificationPreferences(userId: string): Promise<NotificationPreferences> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('notification_preferences')
    .eq('id', userId)
    .single()
  
  if (error || !data) {
    return { in_app: true, email: true, push: false }
  }
  
  return data.notification_preferences || { in_app: true, email: true, push: false }
}

// Mettre à jour les préférences de notification
export async function updateNotificationPreferences(
  userId: string, 
  preferences: NotificationPreferences
): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('users')
    .update({ notification_preferences: preferences })
    .eq('id', userId)
  
  if (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error)
    return false
  }
  
  return true
}

// Envoyer une notification multi-canaux
export async function sendMultiChannelNotification(payload: ReminderPayload): Promise<boolean> {
  const supabase = createClient()
  
  try {
    // Enregistrer les reminders pour chaque canal
    const reminders = payload.channel.map(channel => ({
      user_id: payload.user_id,
      challenge_id: payload.challenge_id,
      channel,
      sent_at: new Date().toISOString()
    }))
    
    const { error } = await supabase
      .from('challenge_reminders')
      .insert(reminders)
    
    if (error) {
      console.error('Erreur lors de l\'enregistrement des reminders:', error)
      return false
    }
    
    // Envoyer selon les canaux
    for (const channel of payload.channel) {
      switch (channel) {
        case 'in_app':
          // Toast in-app (géré côté client)
          break
        case 'email':
          await sendEmailNotification(payload)
          break
        case 'push':
          await sendPushNotification(payload)
          break
      }
    }
    
    return true
  } catch (error) {
    console.error('Erreur lors de l\'envoi multi-canaux:', error)
    return false
  }
}

// Envoyer une notification email
async function sendEmailNotification(payload: ReminderPayload): Promise<void> {
  // Intégration avec SendGrid/Postmark
  // Pour l'instant, on simule l'envoi
  console.log('📧 Email envoyé:', {
    to: payload.user_id,
    subject: payload.title,
    body: payload.body,
    action_url: payload.action_url
  })
}

// Envoyer une notification push
async function sendPushNotification(payload: ReminderPayload): Promise<void> {
  // Intégration avec OneSignal/Firebase
  // Pour l'instant, on simule l'envoi
  console.log('📱 Push envoyé:', {
    user_id: payload.user_id,
    title: payload.title,
    body: payload.body,
    action_url: payload.action_url
  })
}

// Récupérer les statistiques de relance
export async function getReminderStats(userId?: string): Promise<{
  total_sent: number
  total_clicked: number
  total_resumed: number
  click_rate: number
  resume_rate: number
}> {
  const supabase = createClient()
  
  let query = supabase
    .from('challenge_reminders')
    .select('*')
  
  if (userId) {
    query = query.eq('user_id', userId)
  }
  
  const { data, error } = await query
  
  if (error || !data) {
    return {
      total_sent: 0,
      total_clicked: 0,
      total_resumed: 0,
      click_rate: 0,
      resume_rate: 0
    }
  }
  
  const total_sent = data.length
  const total_clicked = data.filter(r => r.clicked_at).length
  const total_resumed = data.filter(r => r.resumed_at).length
  
  return {
    total_sent,
    total_clicked,
    total_resumed,
    click_rate: total_sent > 0 ? (total_clicked / total_sent) * 100 : 0,
    resume_rate: total_sent > 0 ? (total_resumed / total_sent) * 100 : 0
  }
}

// Marquer un reminder comme cliqué
export async function markReminderClicked(userId: string, challengeId: string): Promise<void> {
  const supabase = createClient()
  
  await supabase
    .from('challenge_reminders')
    .update({ clicked_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('challenge_id', challengeId)
    .is('clicked_at', null)
}

// Générer le payload de relance pour un challenge abandonné
export function generateReminderPayload(
  abandonedChallenge: AbandonedChallenge,
  channels: string[]
): ReminderPayload {
  const progress = abandonedChallenge.progress
  const challengeTitle = abandonedChallenge.challenge_title
  
  return {
    user_id: abandonedChallenge.user_id,
    challenge_id: abandonedChallenge.challenge_id,
    channel: channels,
    title: '💪 Reprends ton challenge GorFit !',
    body: `Tu avais commencé le challenge "${challengeTitle}" et tu es déjà à ${progress}% ! C'est le moment parfait pour reprendre et te rapprocher de ton objectif ! 🚀`,
    action_url: `https://app.gorfit.com/dashboard/challenges?resume=${abandonedChallenge.challenge_id}`
  }
} 