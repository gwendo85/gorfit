-- Script pour nettoyer complètement les données et réappliquer la contrainte
-- Ce script va supprimer les données problématiques et recréer la contrainte

-- 1. Supprimer toutes les données existantes dans user_challenges
DELETE FROM user_challenges;

-- 2. Supprimer l'ancienne contrainte
ALTER TABLE user_challenges 
DROP CONSTRAINT IF EXISTS user_challenges_status_check;

-- 3. Vérifier qu'il n'y a plus de données
SELECT COUNT(*) as remaining_user_challenges FROM user_challenges;

-- 4. Ajouter la nouvelle contrainte
ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_status_check 
CHECK (status IN ('active', 'completed', 'abandoned'));

-- 5. Ajouter la colonne updated_at si elle n'existe pas
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE user_challenges ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Colonne updated_at ajoutée';
    ELSE
        RAISE NOTICE 'Colonne updated_at existe déjà';
    END IF;
END $$;

-- 6. Créer ou remplacer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_user_challenges_updated_at ON user_challenges;
CREATE TRIGGER update_user_challenges_updated_at
    BEFORE UPDATE ON user_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Politiques RLS pour user_challenges
DROP POLICY IF EXISTS "Users can view their own user challenges" ON user_challenges;
CREATE POLICY "Users can view their own user challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own user challenges" ON user_challenges;
CREATE POLICY "Users can insert their own user challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own user challenges" ON user_challenges;
CREATE POLICY "Users can update their own user challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. Politiques RLS pour challenges
DROP POLICY IF EXISTS "Anyone can view challenges" ON challenges;
CREATE POLICY "Anyone can view challenges" ON challenges
    FOR SELECT USING (true);

-- 9. Activer RLS sur les tables
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 10. Créer des données de test propres
INSERT INTO challenges (id, title, description, duration_days, target_exercises, reward_points, created_at)
VALUES 
    ('challenge-30-days', 'Défi 30 Jours', 'Faites de l''exercice pendant 30 jours consécutifs', 30, 30, 100, NOW()),
    ('challenge-100-exercises', '100 Exercices', 'Complétez 100 exercices au total', 60, 100, 200, NOW()),
    ('challenge-strength', 'Force Pure', 'Concentrez-vous sur les exercices de force pendant 2 semaines', 14, 20, 150, NOW())
ON CONFLICT (id) DO NOTHING;

-- 11. Vérification finale
SELECT 'Nettoyage terminé avec succès' as status;
SELECT COUNT(*) as total_challenges FROM challenges;
SELECT COUNT(*) as total_user_challenges FROM user_challenges;
SELECT status, COUNT(*) as count FROM user_challenges GROUP BY status; 