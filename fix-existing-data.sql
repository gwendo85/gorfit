-- Script pour corriger les données existantes avant d'appliquer la nouvelle contrainte
-- Ce script doit être exécuté AVANT migration-challenges-fix.sql

-- 1. Vérifier les statuts existants
SELECT DISTINCT status FROM user_challenges;

-- 2. Mettre à jour les statuts invalides vers 'active'
UPDATE user_challenges 
SET status = 'active' 
WHERE status NOT IN ('active', 'completed', 'abandoned');

-- 3. Vérifier qu'il n'y a plus de statuts invalides
SELECT DISTINCT status FROM user_challenges;

-- 4. Maintenant on peut appliquer la contrainte
ALTER TABLE user_challenges 
DROP CONSTRAINT IF EXISTS user_challenges_status_check;

ALTER TABLE user_challenges 
ADD CONSTRAINT user_challenges_status_check 
CHECK (status IN ('active', 'completed', 'abandoned'));

-- 5. Vérifier que la contrainte fonctionne
SELECT COUNT(*) as total_user_challenges FROM user_challenges;
SELECT status, COUNT(*) as count FROM user_challenges GROUP BY status; 