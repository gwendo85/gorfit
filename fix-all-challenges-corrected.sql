-- Script complet corrigé pour corriger toutes les tables challenges et user_challenges

-- 1. Créer la table challenges avec la bonne structure
CREATE TABLE IF NOT EXISTS challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_days INTEGER NOT NULL DEFAULT 30,
    target_exercises INTEGER NOT NULL DEFAULT 30,
    reward_points INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Ajouter les colonnes manquantes à challenges
DO $$ 
BEGIN
    -- Ajouter target_exercises si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' 
        AND column_name = 'target_exercises'
    ) THEN
        ALTER TABLE challenges ADD COLUMN target_exercises INTEGER NOT NULL DEFAULT 30;
        RAISE NOTICE 'Colonne target_exercises ajoutée à challenges';
    END IF;

    -- Ajouter reward_points si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' 
        AND column_name = 'reward_points'
    ) THEN
        ALTER TABLE challenges ADD COLUMN reward_points INTEGER NOT NULL DEFAULT 100;
        RAISE NOTICE 'Colonne reward_points ajoutée à challenges';
    END IF;

    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE challenges ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Colonne updated_at ajoutée à challenges';
    END IF;
END $$;

-- 3. Créer la table user_challenges si elle n'existe pas
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

-- 4. Nettoyer les données existantes dans user_challenges
DELETE FROM user_challenges;

-- 5. Supprimer et recréer la contrainte sur user_challenges
ALTER TABLE user_challenges 
DROP CONSTRAINT IF EXISTS user_challenges_status_check;

ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_status_check 
CHECK (status IN ('active', 'completed', 'abandoned'));

-- 6. Ajouter les colonnes manquantes à user_challenges
DO $$ 
BEGIN
    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE user_challenges ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Colonne updated_at ajoutée à user_challenges';
    END IF;
END $$;

-- 7. Créer les triggers pour updated_at
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

-- 8. Politiques RLS pour challenges
DROP POLICY IF EXISTS "Anyone can view challenges" ON challenges;
CREATE POLICY "Anyone can view challenges" ON challenges
    FOR SELECT USING (true);

-- 9. Politiques RLS pour user_challenges
DROP POLICY IF EXISTS "Users can view their own user challenges" ON user_challenges;
CREATE POLICY "Users can view their own user challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own user challenges" ON user_challenges;
CREATE POLICY "Users can insert their own user challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own user challenges" ON user_challenges;
CREATE POLICY "Users can update their own user challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

-- 10. Activer RLS sur les tables
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

-- 11. Insérer des données de test dans challenges avec des UUID valides
INSERT INTO challenges (id, title, description, duration_days, target_exercises, reward_points, created_at)
VALUES 
    (gen_random_uuid(), 'Défi 30 Jours', 'Faites de l''exercice pendant 30 jours consécutifs', 30, 30, 100, NOW()),
    (gen_random_uuid(), '100 Exercices', 'Complétez 100 exercices au total', 60, 100, 200, NOW()),
    (gen_random_uuid(), 'Force Pure', 'Concentrez-vous sur les exercices de force pendant 2 semaines', 14, 20, 150, NOW());

-- 12. Vérification finale
SELECT 'Toutes les tables challenges ont été corrigées' as status;
SELECT COUNT(*) as total_challenges FROM challenges;
SELECT COUNT(*) as total_user_challenges FROM user_challenges;

-- 13. Afficher les challenges créés
SELECT id, title, description FROM challenges; 