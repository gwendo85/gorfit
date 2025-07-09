# 🚀 Système de Relance Multi-Canaux - GorFit

## Vue d'ensemble

Le système de relance multi-canaux permet de relancer automatiquement les utilisateurs qui ont abandonné leurs challenges après 7 jours (configurable). Il supporte les notifications in-app, email et push selon les préférences utilisateur.

## 🏗️ Architecture

### Base de données

#### Tables principales
- `challenge_reminders` : Tracking des relances envoyées
- `users.notification_preferences` : Préférences de notification par utilisateur
- `user_challenges.status` : Support du statut 'abandoned'

#### Fonctions SQL
- `get_abandoned_challenges(days_threshold)` : Récupère les challenges abandonnés
- `resume_challenge(user_uuid, challenge_uuid)` : Reprend un challenge abandonné
- `mark_reminder_clicked(user_uuid, challenge_uuid)` : Marque un reminder comme cliqué
- `get_reminder_stats(user_uuid)` : Statistiques de relance

### Frontend

#### Composants React
- `AbandonedChallengesSection.tsx` : Affichage des challenges abandonnés
- `ChallengeCard.tsx` : Support du bouton "Abandonner"
- `ChallengesSection.tsx` : Intégration de la section abandonnés

#### Services TypeScript
- `reminderService.ts` : Logique métier des relances
- `challengeService.ts` : Fonctions d'abandon et reprise

### Backend

#### Edge Function Supabase
- `supabase/functions/challenge-reminders/index.ts` : Relance automatique
- Déclenchement : CRON ou appel manuel
- Support multi-canaux : in-app, email, push

## 🎯 Fonctionnalités

### 1. Section "Challenges abandonnés"
- Affichage des challenges abandonnés avec progression
- Bouton "Reprendre" pour relancer un challenge
- Design cohérent avec le reste de l'interface
- Message motivationnel si aucun abandon

### 2. Relance automatique
- Détection automatique après 7 jours d'abandon
- Respect des préférences de notification utilisateur
- Évite les doublons (pas de relance récente)
- Tracking complet des interactions

### 3. Notifications multi-canaux
- **In-app** : Toast immédiat si utilisateur connecté
- **Email** : Template HTML responsive avec design GorFit
- **Push** : Notification mobile via OneSignal/Firebase

### 4. Gestion des préférences
- Interface utilisateur pour configurer les canaux
- Sauvegarde en JSONB dans la table users
- Désactivation possible par canal

## 📊 Payload JSON standardisé

```json
{
  "user_id": "user-uuid",
  "channel": ["in_app", "email", "push"],
  "title": "💪 Reprends ton challenge GorFit !",
  "body": "Tu avais commencé le challenge Force Brute et tu es déjà à 40%. Prêt à reprendre ?",
  "action_url": "https://app.gorfit.com/dashboard/challenges?resume=challenge-uuid",
  "challenge_id": "challenge-uuid"
}
```

## 🎨 Templates

### Email HTML
- Design responsive et moderne
- Barre de progression visuelle
- Bouton CTA "Reprendre maintenant"
- Variables : {{first_name}}, {{challenge_name}}, {{progress}}, {{action_url}}

### Push Notification
- Titre : "💪 Reprends ton challenge GorFit !"
- Corps : Message personnalisé avec progression
- Action : Ouvre l'app sur /dashboard/challenges

## 🔧 Configuration

### Variables d'environnement
```env
# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (SendGrid/Postmark)
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_TEMPLATE_ID=your-template-id

# Push (OneSignal)
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_REST_API_KEY=your-onesignal-key

# App
GORFIT_APP_URL=https://app.gorfit.com
```

### Déploiement Edge Function
```bash
# Déployer l'Edge Function
supabase functions deploy challenge-reminders

# Tester la fonction
curl -X POST https://your-project.supabase.co/functions/v1/challenge-reminders \
  -H "Authorization: Bearer your-anon-key"
```

## 📈 Statistiques et Analytics

### Métriques trackées
- Nombre total de relances envoyées
- Taux de clic sur les relances
- Taux de reprise après relance
- Délai moyen de reprise
- Performance par canal

### Dashboard Admin
- Vue d'ensemble des statistiques
- Filtres par période, canal, challenge
- Export des données
- Optimisation des stratégies

## 🚀 Utilisation

### 1. Déploiement initial
```sql
-- Exécuter le script de déploiement
\i scripts/deploy-reminders.sql
```

### 2. Configuration des préférences
```typescript
// Mettre à jour les préférences utilisateur
await updateNotificationPreferences(userId, {
  in_app: true,
  email: true,
  push: false
})
```

### 3. Test manuel
```typescript
// Tester la relance pour un utilisateur
const abandoned = await getAbandonedChallenges(1) // 1 jour
const payload = generateReminderPayload(abandoned[0], ['email'])
await sendMultiChannelNotification(payload)
```

### 4. Planification automatique
```bash
# CRON job pour relance quotidienne
0 9 * * * curl -X POST https://your-project.supabase.co/functions/v1/challenge-reminders
```

## 🎯 Optimisations futures

### 1. Personnalisation avancée
- Messages adaptés au type de challenge
- Timing optimal selon l'historique utilisateur
- A/B testing des messages

### 2. Intégrations étendues
- Slack/Discord pour les communautés
- SMS pour les utilisateurs premium
- Notifications push natives iOS/Android

### 3. Intelligence artificielle
- Prédiction du meilleur moment de relance
- Messages générés automatiquement
- Optimisation continue des taux de conversion

## 🔍 Dépannage

### Problèmes courants
1. **Relances non envoyées** : Vérifier les préférences utilisateur
2. **Emails non reçus** : Contrôler la configuration SendGrid
3. **Push non reçus** : Vérifier les tokens OneSignal
4. **Erreurs Edge Function** : Consulter les logs Supabase

### Logs et monitoring
```bash
# Voir les logs Edge Function
supabase functions logs challenge-reminders

# Vérifier les reminders en base
SELECT * FROM challenge_reminders ORDER BY sent_at DESC LIMIT 10;
```

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Système de relance multi-canaux complet
- ✅ Section challenges abandonnés
- ✅ Edge Function automatique
- ✅ Templates email et push
- ✅ Tracking et statistiques
- ✅ Gestion des préférences utilisateur

---

**GorFit - Ton coach fitness intelligent** 🏋️‍♂️ 