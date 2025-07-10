-- Script de diagnostic pour vérifier la structure de la base de données
-- Exécutez ce script dans l'éditeur SQL de Supabase pour diagnostiquer le problème

-- 1. Vérifier l'existence des tables
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name IN ('user_challenges', 'challenges', 'users')
ORDER BY table_name;

-- 2. Vérifier la structure de la table user_challenges
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_challenges'
ORDER BY ordinal_position;

-- 3. Vérifier la structure de la table challenges
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'challenges'
ORDER BY ordinal_position;

-- 4. Vérifier les contraintes de clé étrangère
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
    AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, tc.constraint_name;

-- 5. Vérifier les politiques RLS
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
WHERE tablename IN ('user_challenges', 'challenges')
ORDER BY tablename, policyname;

-- 6. Vérifier les données existantes
SELECT 
    'user_challenges' as table_name,
    COUNT(*) as total_records,
    COUNT(challenge_id) as records_with_challenge_id,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT challenge_id) as unique_challenges
FROM user_challenges
UNION ALL
SELECT 
    'challenges' as table_name,
    COUNT(*) as total_records,
    COUNT(id) as records_with_id,
    COUNT(DISTINCT id) as unique_ids,
    0 as unique_challenges
FROM challenges;

-- 7. Vérifier les enregistrements orphelins
SELECT 
    uc.id as user_challenge_id,
    uc.user_id,
    uc.challenge_id,
    uc.status,
    CASE 
        WHEN c.id IS NULL THEN 'CHALLENGE MANQUANT'
        ELSE 'OK'
    END as status_check
FROM user_challenges uc
LEFT JOIN challenges c ON uc.challenge_id = c.id
WHERE uc.challenge_id IS NOT NULL
LIMIT 10;

-- 8. Test de jointure simple
SELECT 
    COUNT(*) as total_joinable_records
FROM user_challenges uc
INNER JOIN challenges c ON uc.challenge_id = c.id;

-- 9. Vérifier les types de données des colonnes clés
SELECT 
    'user_challenges.challenge_id' as column_info,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_challenges' AND column_name = 'challenge_id'
UNION ALL
SELECT 
    'challenges.id' as column_info,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'challenges' AND column_name = 'id';

-- 10. Test de requête avec des données réelles
SELECT 
    uc.id as user_challenge_id,
    uc.user_id,
    uc.challenge_id,
    uc.status,
    c.title as challenge_title,
    c.description as challenge_description
FROM user_challenges uc
LEFT JOIN challenges c ON uc.challenge_id = c.id
WHERE uc.status = 'in_progress'
LIMIT 5; 