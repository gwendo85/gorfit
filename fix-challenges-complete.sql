-- Script complet pour corriger le problème de relation entre user_challenges et challenges
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Nettoyer les contraintes existantes
DO $$
BEGIN
    -- Supprimer toutes les contraintes de clé étrangère existantes
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_challenges_challenge_id_fkey'
    ) THEN
        ALTER TABLE user_challenges DROP CONSTRAINT user_challenges_challenge_id_fkey;
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_challenges_user_id_fkey'
    ) THEN
        ALTER TABLE user_challenges DROP CONSTRAINT user_challenges_user_id_fkey;
    END IF;
END $$;

-- 2. Vérifier et corriger la structure de la table challenges
DO $$
BEGIN
    -- Ajouter la colonne id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' AND column_name = 'id'
    ) THEN
        ALTER TABLE challenges ADD COLUMN id UUID DEFAULT gen_random_uuid();
    END IF;
    
    -- Définir id comme clé primaire si ce n'est pas déjà fait
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'challenges' AND constraint_type = 'PRIMARY KEY'
    ) THEN
        ALTER TABLE challenges ADD PRIMARY KEY (id);
    END IF;
END $$;

-- 3. Vérifier et corriger la structure de la table user_challenges
DO $$
BEGIN
    -- Ajouter la colonne challenge_id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' AND column_name = 'challenge_id'
    ) THEN
        ALTER TABLE user_challenges ADD COLUMN challenge_id UUID;
    END IF;
    
    -- Ajouter la colonne user_id si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' AND column_name = 'user_id'
    ) THEN
        ALTER TABLE user_challenges ADD COLUMN user_id UUID;
    END IF;
    
    -- Ajouter la colonne updated_at si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE user_challenges ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- 4. Nettoyer les données orphelines
DELETE FROM user_challenges 
WHERE challenge_id IS NOT NULL 
AND challenge_id NOT IN (SELECT id FROM challenges);

-- 5. Créer les clés étrangères
ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_challenge_id_fkey 
FOREIGN KEY (challenge_id) 
REFERENCES challenges(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- 6. Créer les index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_status ON user_challenges(status);

-- 7. Mettre à jour les politiques RLS pour user_challenges
DROP POLICY IF EXISTS "Users can view their own challenges" ON user_challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON user_challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON user_challenges;
DROP POLICY IF EXISTS "Users can delete their own challenges" ON user_challenges;

CREATE POLICY "Users can view their own challenges" ON user_challenges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own challenges" ON user_challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenges" ON user_challenges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own challenges" ON user_challenges
    FOR DELETE USING (auth.uid() = user_id);

-- 8. Mettre à jour les politiques RLS pour challenges
DROP POLICY IF EXISTS "Users can view challenges" ON challenges;
DROP POLICY IF EXISTS "Users can insert challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update challenges" ON challenges;
DROP POLICY IF EXISTS "Users can delete challenges" ON challenges;

CREATE POLICY "Users can view challenges" ON challenges
    FOR SELECT USING (true);

CREATE POLICY "Users can insert challenges" ON challenges
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update challenges" ON challenges
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete challenges" ON challenges
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- 9. Activer RLS sur les tables si ce n'est pas déjà fait
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 10. Insérer des données de test si les tables sont vides
INSERT INTO challenges (id, title, description, type, target, reward_badge_title, reward_badge_description, duration_days, icon_emoji, created_at)
SELECT 
    gen_random_uuid(),
    'Défi 30 Pompes',
    'Fais 30 pompes en une semaine pour débloquer le badge "Force Pure"',
    'reps',
    30,
    'Force Pure',
    'Tu as prouvé ta force avec 30 pompes !',
    7,
    '💪',
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM challenges LIMIT 1);

INSERT INTO challenges (id, title, description, type, target, reward_badge_title, reward_badge_description, duration_days, icon_emoji, created_at)
SELECT 
    gen_random_uuid(),
    'Marathon de Sessions',
    'Complète 10 sessions d''entraînement en 2 semaines',
    'sessions',
    10,
    'Marathonien',
    'Tu as tenu la distance avec 10 sessions !',
    14,
    '🏃',
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title = 'Marathon de Sessions');

INSERT INTO challenges (id, title, description, type, target, reward_badge_title, reward_badge_description, duration_days, icon_emoji, created_at)
SELECT 
    gen_random_uuid(),
    'Volume d''Enfer',
    'Atteins 1000kg de volume total en une semaine',
    'volume',
    1000,
    'Bête de Charge',
    'Tu as soulevé 1000kg, tu es une vraie bête !',
    7,
    '🔥',
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM challenges WHERE title = 'Volume d''Enfer');

-- 11. Vérification finale
SELECT 
    'Structure corrigée' as status,
    COUNT(*) as total_challenges
FROM challenges
UNION ALL
SELECT 
    'Relations vérifiées' as status,
    COUNT(*) as total_user_challenges
FROM user_challenges;

-- 12. Test de jointure
SELECT 
    'Test de jointure réussi' as test_result,
    COUNT(*) as joinable_records
FROM user_challenges uc
INNER JOIN challenges c ON uc.challenge_id = c.id; 