-- Script de test pour diagnostiquer le problème des challenges abandonnés
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure des tables
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('challenges', 'user_challenges')
ORDER BY table_name, ordinal_position;

-- 2. Vérifier les politiques RLS
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

-- 3. Vérifier si RLS est activé
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('challenges', 'user_challenges');

-- 4. Compter les challenges existants
SELECT 'challenges' as table_name, COUNT(*) as count FROM challenges
UNION ALL
SELECT 'user_challenges' as table_name, COUNT(*) as count FROM user_challenges;

-- 5. Vérifier les challenges abandonnés (sans filtre user_id)
SELECT 
    uc.id,
    uc.user_id,
    uc.challenge_id,
    uc.status,
    uc.progress,
    uc.updated_at,
    c.title
FROM user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id
WHERE uc.status = 'abandoned'
ORDER BY uc.updated_at DESC;

-- 6. Créer des données de test pour un utilisateur spécifique
-- Remplace 'TON_USER_ID' par ton vrai user_id
-- INSERT INTO user_challenges (user_id, challenge_id, status, progress, updated_at) VALUES
-- ('TON_USER_ID', (SELECT id FROM challenges LIMIT 1), 'abandoned', 25, NOW() - INTERVAL '3 days');

-- 7. Tester la requête avec auth.uid() (doit être exécuté par un utilisateur connecté)
-- SELECT * FROM user_challenges WHERE user_id = auth.uid() AND status = 'abandoned';

-- 8. Vérifier les contraintes
SELECT 
    conname,
    contype,
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'user_challenges'::regclass; 