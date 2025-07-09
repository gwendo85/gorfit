-- Migration pour corriger les tables challenges et user_challenges
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter le statut 'abandoned' à la contrainte CHECK
ALTER TABLE user_challenges 
DROP CONSTRAINT IF EXISTS user_challenges_status_check;

ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_status_check 
CHECK (status IN ('in_progress', 'completed', 'abandoned'));

-- 2. Ajouter la colonne updated_at si elle n'existe pas
ALTER TABLE user_challenges 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Activer RLS sur les tables challenges et user_challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- 4. Créer les politiques RLS pour challenges
CREATE POLICY "Anyone can view challenges" ON challenges
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert challenges" ON challenges
    FOR INSERT WITH CHECK (auth.uid() IN (
        SELECT id FROM users WHERE email = 'admin@gorfit.com'
    ));

CREATE POLICY "Only admins can update challenges" ON challenges
    FOR UPDATE USING (auth.uid() IN (
        SELECT id FROM users WHERE email = 'admin@gorfit.com'
    ));

CREATE POLICY "Only admins can delete challenges" ON challenges
    FOR DELETE USING (auth.uid() IN (
        SELECT id FROM users WHERE email = 'admin@gorfit.com'
    ));

-- 5. Créer les politiques RLS pour user_challenges
CREATE POLICY "Users can view own challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own challenges" ON user_challenges
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Insérer quelques challenges de test si la table est vide
INSERT INTO challenges (title, description, type, target, reward_badge_title, reward_badge_description, duration_days, icon_emoji) VALUES
('💪 100 Pompes en 7 jours', 'Réalise 100 pompes en une semaine', 'reps', 100, 'Pompe Master', 'Tu as réussi le défi des 100 pompes !', 7, '💪'),
('🔥 30 Minutes Cardio', 'Fais 30 minutes de cardio par jour pendant 5 jours', 'sessions', 5, 'Cardio Warrior', 'Tu as complété 5 séances cardio !', 5, '🔥'),
('🏋️ 500kg Volume Total', 'Atteins un volume total de 500kg cette semaine', 'volume', 500, 'Volume King', 'Tu as atteint 500kg de volume !', 7, '🏋️')
ON CONFLICT DO NOTHING;

-- 7. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_challenges_updated_at 
    BEFORE UPDATE ON user_challenges 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Vérifier que tout fonctionne
SELECT 'Migration terminée avec succès' as status; 