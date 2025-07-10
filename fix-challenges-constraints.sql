-- Script pour nettoyer les données et corriger les contraintes CHECK
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier les données existantes qui posent problème
SELECT 
    id,
    title,
    type,
    target
FROM challenges 
WHERE type NOT IN ('workout', 'streak', 'distance', 'calories', 'time', 'custom');

-- 2. Nettoyer les données existantes problématiques
DELETE FROM challenges 
WHERE type NOT IN ('workout', 'streak', 'distance', 'calories', 'time', 'custom')
   OR type IS NULL;

-- 3. Mettre à jour les types invalides vers des valeurs valides
UPDATE challenges 
SET type = 'workout' 
WHERE type NOT IN ('workout', 'streak', 'distance', 'calories', 'time', 'custom')
   OR type IS NULL;

-- 4. Supprimer les contraintes CHECK existantes
ALTER TABLE challenges 
DROP CONSTRAINT IF EXISTS challenges_type_check;

ALTER TABLE challenges 
DROP CONSTRAINT IF EXISTS challenges_difficulty_level_check;

-- 5. Ajouter les nouvelles contraintes CHECK
ALTER TABLE challenges 
ADD CONSTRAINT challenges_type_check 
CHECK (type IN ('workout', 'streak', 'distance', 'calories', 'time', 'custom'));

ALTER TABLE challenges 
ADD CONSTRAINT challenges_difficulty_level_check 
CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert'));

-- 6. Vérifier que tout est correct
SELECT 
    'Data cleaned and constraints applied successfully' as status,
    COUNT(*) as total_challenges,
    COUNT(CASE WHEN type IN ('workout', 'streak', 'distance', 'calories', 'time', 'custom') THEN 1 END) as valid_types,
    COUNT(CASE WHEN difficulty_level IN ('easy', 'medium', 'hard', 'expert') THEN 1 END) as valid_difficulties
FROM challenges; 