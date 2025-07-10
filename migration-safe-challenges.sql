-- Migration sécurisée pour les challenges
-- Ce script gère les données existantes avant d'appliquer les nouvelles contraintes

-- 1. Vérifier et corriger les données existantes
DO $$ 
BEGIN
    -- Mettre à jour les statuts invalides vers 'active'
    UPDATE user_challenges 
    SET status = 'active' 
    WHERE status NOT IN ('active', 'completed', 'abandoned');
    
    RAISE NOTICE 'Données existantes corrigées';
END $$;

-- 2. Supprimer l'ancienne contrainte si elle existe
ALTER TABLE user_challenges 
DROP CONSTRAINT IF EXISTS user_challenges_status_check;

-- 3. Ajouter la nouvelle contrainte
ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_status_check 
CHECK (status IN ('active', 'completed', 'abandoned'));

-- 4. Ajouter la colonne updated_at si elle n'existe pas
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

-- 5. Créer ou remplacer le trigger pour updated_at
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

-- 6. Politiques RLS pour user_challenges
DROP POLICY IF EXISTS "Users can view their own user challenges" ON user_challenges;
CREATE POLICY "Users can view their own user challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own user challenges" ON user_challenges;
CREATE POLICY "Users can insert their own user challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own user challenges" ON user_challenges;
CREATE POLICY "Users can update their own user challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- 7. Politiques RLS pour challenges
DROP POLICY IF EXISTS "Anyone can view challenges" ON challenges;
CREATE POLICY "Anyone can view challenges" ON challenges
    FOR SELECT USING (true);

-- 8. Activer RLS sur les tables
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 9. Créer des données de test si nécessaire
INSERT INTO challenges (id, title, description, duration_days, target_exercises, reward_points, created_at)
VALUES 
    ('challenge-30-days', 'Défi 30 Jours', 'Faites de l''exercice pendant 30 jours consécutifs', 30, 30, 100, NOW()),
    ('challenge-100-exercises', '100 Exercices', 'Complétez 100 exercices au total', 60, 100, 200, NOW()),
    ('challenge-strength', 'Force Pure', 'Concentrez-vous sur les exercices de force pendant 2 semaines', 14, 20, 150, NOW())
ON CONFLICT (id) DO NOTHING;

-- 10. Vérification finale
SELECT 'Migration terminée avec succès' as status;
SELECT COUNT(*) as total_challenges FROM challenges;
SELECT COUNT(*) as total_user_challenges FROM user_challenges;
SELECT status, COUNT(*) as count FROM user_challenges GROUP BY status; 