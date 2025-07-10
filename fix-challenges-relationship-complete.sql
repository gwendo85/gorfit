-- Script complet pour corriger la relation entre user_challenges et challenges
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('user_challenges', 'challenges')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier les contraintes existantes
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('user_challenges', 'challenges')
ORDER BY tc.table_name, tc.constraint_name;

-- 3. Supprimer la contrainte de clé étrangère existante si elle existe
DO $$
BEGIN
    -- Supprimer la contrainte si elle existe
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'user_challenges_challenge_id_fkey'
    ) THEN
        ALTER TABLE user_challenges DROP CONSTRAINT user_challenges_challenge_id_fkey;
    END IF;
END $$;

-- 4. Vérifier que la colonne challenge_id existe dans user_challenges
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'user_challenges' AND column_name = 'challenge_id'
    ) THEN
        ALTER TABLE user_challenges ADD COLUMN challenge_id UUID;
    END IF;
END $$;

-- 5. Vérifier que la colonne id existe dans challenges
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'challenges' AND column_name = 'id'
    ) THEN
        ALTER TABLE challenges ADD COLUMN id UUID DEFAULT gen_random_uuid() PRIMARY KEY;
    END IF;
END $$;

-- 6. Créer la clé étrangère avec les bonnes options
ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_challenge_id_fkey 
FOREIGN KEY (challenge_id) 
REFERENCES challenges(id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- 7. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON user_challenges(challenge_id);

-- 8. Vérifier que les données sont cohérentes
-- Supprimer les enregistrements orphelins
DELETE FROM user_challenges 
WHERE challenge_id IS NOT NULL 
AND challenge_id NOT IN (SELECT id FROM challenges);

-- 9. Mettre à jour les politiques RLS pour user_challenges
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

-- 10. Mettre à jour les politiques RLS pour challenges
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

-- 11. Vérifier que tout fonctionne
SELECT 
    'user_challenges' as table_name,
    COUNT(*) as total_records,
    COUNT(challenge_id) as records_with_challenge_id,
    COUNT(DISTINCT challenge_id) as unique_challenge_ids
FROM user_challenges
UNION ALL
SELECT 
    'challenges' as table_name,
    COUNT(*) as total_records,
    COUNT(id) as records_with_id,
    COUNT(DISTINCT id) as unique_ids
FROM challenges;

-- 12. Test de jointure
SELECT 
    uc.id as user_challenge_id,
    uc.user_id,
    uc.challenge_id,
    c.title as challenge_title,
    uc.status,
    uc.progress,
    uc.created_at
FROM user_challenges uc
LEFT JOIN challenges c ON uc.challenge_id = c.id
LIMIT 5; 