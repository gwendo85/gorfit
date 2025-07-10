-- Script pour vérifier les contraintes existantes sur la table challenges

-- 1. Vérifier les contraintes CHECK sur la table challenges
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'challenges'::regclass 
AND contype = 'c';

-- 2. Vérifier la structure de la table challenges
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'challenges'
ORDER BY ordinal_position;

-- 3. Vérifier les valeurs uniques dans la colonne type si elle existe
SELECT DISTINCT type FROM challenges WHERE type IS NOT NULL;

-- 4. Vérifier les contraintes de domaine si elles existent
SELECT 
    domain_name,
    data_type,
    domain_default
FROM information_schema.domains 
WHERE domain_name LIKE '%challenge%' OR domain_name LIKE '%type%'; 