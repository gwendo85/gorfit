-- Script de déploiement du système de relance multi-canaux
-- À exécuter dans Supabase SQL Editor

-- 1. Ajouter la colonne notification_preferences aux utilisateurs
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"in_app": true, "email": true, "push": false}'::jsonb;

-- 2. Créer la table challenge_reminders
CREATE TABLE IF NOT EXISTS challenge_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'push')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,
  resumed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_challenge_reminders_user_challenge ON challenge_reminders(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_reminders_sent_at ON challenge_reminders(sent_at);
CREATE INDEX IF NOT EXISTS idx_challenge_reminders_channel ON challenge_reminders(channel);

-- 4. Fonction pour récupérer les challenges abandonnés depuis X jours
CREATE OR REPLACE FUNCTION get_abandoned_challenges(days_threshold INTEGER DEFAULT 7)
RETURNS TABLE (
  user_id UUID,
  challenge_id UUID,
  challenge_title TEXT,
  progress INTEGER,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  notification_preferences JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uc.user_id,
    uc.challenge_id,
    c.title,
    uc.progress,
    uc.updated_at as abandoned_at,
    u.notification_preferences
  FROM user_challenges uc
  JOIN challenges c ON uc.challenge_id = c.id
  JOIN users u ON uc.user_id = u.id
  WHERE uc.status = 'abandoned'
    AND uc.updated_at <= NOW() - INTERVAL '1 day' * days_threshold
    AND NOT EXISTS (
      SELECT 1 FROM challenge_reminders cr 
      WHERE cr.user_id = uc.user_id 
        AND cr.challenge_id = uc.challenge_id
        AND cr.sent_at >= NOW() - INTERVAL '1 day' * days_threshold
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Fonction pour reprendre un challenge abandonné
CREATE OR REPLACE FUNCTION resume_challenge(user_uuid UUID, challenge_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_challenges 
  SET 
    status = 'in_progress',
    updated_at = NOW()
  WHERE user_id = user_uuid 
    AND challenge_id = challenge_uuid 
    AND status = 'abandoned';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 6. Fonction pour marquer un reminder comme cliqué
CREATE OR REPLACE FUNCTION mark_reminder_clicked(user_uuid UUID, challenge_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE challenge_reminders 
  SET clicked_at = NOW()
  WHERE user_id = user_uuid 
    AND challenge_id = challenge_uuid
    AND clicked_at IS NULL;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- 7. Fonction pour obtenir les statistiques de relance
CREATE OR REPLACE FUNCTION get_reminder_stats(user_uuid UUID DEFAULT NULL)
RETURNS TABLE (
  total_sent BIGINT,
  total_clicked BIGINT,
  total_resumed BIGINT,
  click_rate NUMERIC,
  resume_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_sent,
    COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::BIGINT as total_clicked,
    COUNT(CASE WHEN resumed_at IS NOT NULL THEN 1 END)::BIGINT as total_resumed,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as click_rate,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(CASE WHEN resumed_at IS NOT NULL THEN 1 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as resume_rate
  FROM challenge_reminders
  WHERE (user_uuid IS NULL OR user_id = user_uuid);
END;
$$ LANGUAGE plpgsql;

-- 8. Politique RLS pour challenge_reminders
ALTER TABLE challenge_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reminders" ON challenge_reminders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reminders" ON challenge_reminders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reminders" ON challenge_reminders
  FOR UPDATE USING (auth.uid() = user_id);

-- 9. Politique RLS pour les préférences de notification
CREATE POLICY "Users can update their notification preferences" ON users
  FOR UPDATE USING (auth.uid() = id);

-- 10. Insérer des données de test (optionnel)
-- INSERT INTO challenge_reminders (user_id, challenge_id, channel, sent_at)
-- VALUES 
--   ('user-uuid-here', 'challenge-uuid-here', 'email', NOW()),
--   ('user-uuid-here', 'challenge-uuid-here', 'in_app', NOW());

-- Message de confirmation
SELECT 'Système de relance multi-canaux déployé avec succès !' as status; 