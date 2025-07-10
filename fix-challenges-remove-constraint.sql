-- Script pour supprimer la contrainte problématique et recréer la table challenges

-- 1. Supprimer la contrainte CHECK problématique sur la colonne type
ALTER TABLE challenges 
DROP CONSTRAINT IF EXISTS challenges_type_check;

-- 2. Supprimer toutes les contraintes CHECK sur challenges
DO $$ 
BEGIN
    -- Supprimer toutes les contraintes CHECK sur la table challenges
    FOR r IN (
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'challenges'::regclass 
        AND contype = 'c'
    ) LOOP
        EXECUTE 'ALTER TABLE challenges DROP CONSTRAINT ' || r.conname;
        RAISE NOTICE 'Contrainte supprimée: %', r.conname;
    END LOOP;
END $$;

-- 3. Recréer la table challenges avec une structure propre
DROP TABLE IF EXISTS challenges CASCADE;

CREATE TABLE challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL DEFAULT 'daily',
    target INTEGER NOT NULL DEFAULT 30,
    difficulty VARCHAR(20) DEFAULT 'medium',
    category VARCHAR(50) DEFAULT 'general',
    icon VARCHAR(10) DEFAULT '🏆',
    duration_days INTEGER NOT NULL DEFAULT 30,
    target_exercises INTEGER NOT NULL DEFAULT 30,
    reward_points INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Créer la table user_challenges si elle n'existe pas
CREATE TABLE IF NOT EXISTS user_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    current_progress INTEGER NOT NULL DEFAULT 0,
    target_progress INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- 5. Nettoyer les données existantes dans user_challenges
DELETE FROM user_challenges;

-- 6. Créer les triggers pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour challenges
DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger pour user_challenges
DROP TRIGGER IF EXISTS update_user_challenges_updated_at ON user_challenges;
CREATE TRIGGER update_user_challenges_updated_at
    BEFORE UPDATE ON user_challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Politiques RLS pour challenges
DROP POLICY IF EXISTS "Anyone can view challenges" ON challenges;
CREATE POLICY "Anyone can view challenges" ON challenges
    FOR SELECT USING (true);

-- 8. Politiques RLS pour user_challenges
DROP POLICY IF EXISTS "Users can view their own user challenges" ON user_challenges;
CREATE POLICY "Users can view their own user challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own user challenges" ON user_challenges;
CREATE POLICY "Users can insert their own user challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own user challenges" ON user_challenges;
CREATE POLICY "Users can update their own user challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Activer RLS sur les tables
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- 10. Insérer des données de test dans challenges
INSERT INTO challenges (id, title, description, type, target, difficulty, category, icon, duration_days, target_exercises, reward_points, created_at)
VALUES 
    (gen_random_uuid(), 'Défi 30 Jours', 'Faites de l''exercice pendant 30 jours consécutifs', 'daily', 30, 'medium', 'consistency', '🏆', 30, 30, 100, NOW()),
    (gen_random_uuid(), '100 Exercices', 'Complétez 100 exercices au total', 'total', 100, 'hard', 'endurance', '💪', 60, 100, 200, NOW()),
    (gen_random_uuid(), 'Force Pure', 'Concentrez-vous sur les exercices de force pendant 2 semaines', 'strength', 20, 'medium', 'strength', '🏋️', 14, 20, 150, NOW());

-- 11. Vérification finale
SELECT 'Toutes les tables challenges ont été corrigées' as status;
SELECT COUNT(*) as total_challenges FROM challenges;
SELECT COUNT(*) as total_user_challenges FROM user_challenges;

-- 12. Afficher les challenges créés
SELECT id, title, description, type, target, difficulty, category FROM challenges; 