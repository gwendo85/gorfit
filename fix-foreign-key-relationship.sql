-- Script pour corriger la relation entre user_challenges et challenges
-- Problème: Clé étrangère manquante entre les tables

-- 1. Vérifier la structure actuelle
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('challenges', 'user_challenges')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier les contraintes existantes
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name IN ('challenges', 'user_challenges')
    AND tc.constraint_type IN ('FOREIGN KEY', 'PRIMARY KEY');

-- 3. Ajouter la clé étrangère manquante
ALTER TABLE user_challenges 
ADD CONSTRAINT fk_user_challenges_challenge_id 
FOREIGN KEY (challenge_id) REFERENCES challenges(id) 
ON DELETE CASCADE;

-- 4. Vérifier que la contrainte a été ajoutée
SELECT 
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN information_schema.constraint_column_usage ccu 
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'user_challenges'
    AND tc.constraint_type = 'FOREIGN KEY';

-- 5. Tester la relation avec une requête simple
SELECT 
    uc.id as user_challenge_id,
    uc.user_id,
    uc.challenge_id,
    c.title as challenge_title,
    c.description as challenge_description
FROM user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id
LIMIT 5;

-- 6. Vérifier les politiques RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('challenges', 'user_challenges');

-- 7. S'assurer que les politiques RLS permettent les jointures
-- Si nécessaire, mettre à jour les politiques pour permettre les jointures

-- 8. Test final - vérifier que tout fonctionne
SELECT 
    'Challenges count' as test,
    COUNT(*) as result
FROM challenges
UNION ALL
SELECT 
    'User challenges count',
    COUNT(*) 
FROM user_challenges
UNION ALL
SELECT 
    'Joined data count',
    COUNT(*) 
FROM user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id; 