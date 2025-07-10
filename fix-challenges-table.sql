-- Script pour vérifier et corriger la structure de la table challenges

-- 1. Vérifier la structure actuelle de la table challenges
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'challenges' 
ORDER BY ordinal_position;

-- 2. Vérifier si la table challenges existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'challenges'
) as challenges_table_exists;

-- 3. Créer la table challenges si elle n'existe pas
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

-- 4. Ajouter les colonnes manquantes si elles n'existent pas
DO $$ 
BEGIN
    -- Ajouter target_exercises si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' 
        AND column_name = 'target_exercises'
    ) THEN
        ALTER TABLE challenges ADD COLUMN target_exercises INTEGER NOT NULL DEFAULT 30;
        RAISE NOTICE 'Colonne target_exercises ajoutée';
    ELSE
        RAISE NOTICE 'Colonne target_exercises existe déjà';
    END IF;

    -- Ajouter reward_points si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' 
        AND column_name = 'reward_points'
    ) THEN
        ALTER TABLE challenges ADD COLUMN reward_points INTEGER NOT NULL DEFAULT 100;
        RAISE NOTICE 'Colonne reward_points ajoutée';
    ELSE
        RAISE NOTICE 'Colonne reward_points existe déjà';
    END IF;

    -- Ajouter updated_at si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' 
        AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE challenges ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Colonne updated_at ajoutée';
    ELSE
        RAISE NOTICE 'Colonne updated_at existe déjà';
    END IF;
END $$;

-- 5. Créer le trigger pour updated_at sur challenges
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Vérifier la structure finale
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'challenges' 
ORDER BY ordinal_position;

-- 7. Insérer des données de test
INSERT INTO challenges (id, title, description, duration_days, target_exercises, reward_points, created_at)
VALUES 
    ('challenge-30-days', 'Défi 30 Jours', 'Faites de l''exercice pendant 30 jours consécutifs', 30, 30, 100, NOW()),
    ('challenge-100-exercises', '100 Exercices', 'Complétez 100 exercices au total', 60, 100, 200, NOW()),
    ('challenge-strength', 'Force Pure', 'Concentrez-vous sur les exercices de force pendant 2 semaines', 14, 20, 150, NOW())
ON CONFLICT (id) DO NOTHING;

-- 8. Vérification finale
SELECT 'Structure de la table challenges corrigée' as status;
SELECT COUNT(*) as total_challenges FROM challenges; 