import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AbandonedChallenge {
  user_id: string
  challenge_id: string
  challenge_title: string
  progress: number
  abandoned_at: string
  notification_preferences: {
    in_app: boolean
    email: boolean
    push: boolean
  }
}

interface ReminderPayload {
  user_id: string
  channel: string[]
  title: string
  body: string
  action_url: string
  challenge_id: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Créer le client Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Récupérer les challenges abandonnés depuis 7 jours
    const { data: abandonedChallenges, error } = await supabase
      .rpc('get_abandoned_challenges', { days_threshold: 7 })

    if (error) {
      console.error('Erreur lors de la récupération des challenges abandonnés:', error)
      return new Response(
        JSON.stringify({ error: 'Erreur lors de la récupération des challenges' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!abandonedChallenges || abandonedChallenges.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Aucun challenge abandonné à relancer' }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const results = []
    const baseUrl = Deno.env.get('GORFIT_APP_URL') || 'https://app.gorfit.com'

    for (const challenge of abandonedChallenges) {
      const { user_id, challenge_id, challenge_title, progress, notification_preferences } = challenge

      // Déterminer les canaux de notification selon les préférences
      const channels = []
      if (notification_preferences.in_app) channels.push('in_app')
      if (notification_preferences.email) channels.push('email')
      if (notification_preferences.push) channels.push('push')

      if (channels.length === 0) {
        console.log(`Aucun canal de notification activé pour l'utilisateur ${user_id}`)
        continue
      }

      // Créer le payload de relance
      const payload: ReminderPayload = {
        user_id,
        challenge_id,
        channel: channels,
        title: '💪 Reprends ton challenge GorFit !',
        body: `Tu avais commencé le challenge "${challenge_title}" et tu es déjà à ${progress}% ! C'est le moment parfait pour reprendre et te rapprocher de ton objectif ! 🚀`,
        action_url: `${baseUrl}/dashboard/challenges?resume=${challenge_id}`
      }

      // Enregistrer les reminders dans la base de données
      const reminders = channels.map(channel => ({
        user_id,
        challenge_id,
        channel,
        sent_at: new Date().toISOString()
      }))

      const { error: reminderError } = await supabase
        .from('challenge_reminders')
        .insert(reminders)

      if (reminderError) {
        console.error(`Erreur lors de l'enregistrement des reminders pour ${user_id}:`, reminderError)
        continue
      }

      // Envoyer les notifications selon les canaux
      for (const channel of channels) {
        try {
          switch (channel) {
            case 'email':
              await sendEmailNotification(payload)
              break
            case 'push':
              await sendPushNotification(payload)
              break
            case 'in_app':
              // Les notifications in-app sont gérées côté client
              console.log(`Notification in-app préparée pour ${user_id}`)
              break
          }
        } catch (error) {
          console.error(`Erreur lors de l'envoi ${channel} pour ${user_id}:`, error)
        }
      }

      results.push({
        user_id,
        challenge_id,
        channels_sent: channels,
        success: true
      })
    }

    return new Response(
      JSON.stringify({
        message: `${results.length} relances envoyées avec succès`,
        results
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Erreur générale:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

// Fonction pour envoyer une notification email
async function sendEmailNotification(payload: ReminderPayload): Promise<void> {
  // Intégration avec SendGrid/Postmark
  // Pour l'instant, on simule l'envoi
  console.log('📧 Email de relance:', {
    to: payload.user_id,
    subject: payload.title,
    body: payload.body,
    action_url: payload.action_url
  })

  // Exemple d'intégration SendGrid :
  /*
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{
        to: [{ email: userEmail }],
        dynamic_template_data: {
          first_name: userFirstName,
          challenge_name: payload.challenge_title,
          progress: payload.progress,
          action_url: payload.action_url
        }
      }],
      from: { email: 'noreply@gorfit.com', name: 'GorFit' },
      template_id: 'd-template-id-here'
    })
  })
  */
}

// Fonction pour envoyer une notification push
async function sendPushNotification(payload: ReminderPayload): Promise<void> {
  // Intégration avec OneSignal/Firebase
  // Pour l'instant, on simule l'envoi
  console.log('📱 Push de relance:', {
    user_id: payload.user_id,
    title: payload.title,
    body: payload.body,
    action_url: payload.action_url
  })

  // Exemple d'intégration OneSignal :
  /*
  const response = await fetch('https://onesignal.com/api/v1/notifications', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Deno.env.get('ONESIGNAL_REST_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      app_id: Deno.env.get('ONESIGNAL_APP_ID'),
      include_external_user_ids: [payload.user_id],
      headings: { en: payload.title },
      contents: { en: payload.body },
      url: payload.action_url,
      data: { challenge_id: payload.challenge_id }
    })
  })
  */
} 