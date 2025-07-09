-- Migration pour corriger la durée des parcours à 5 semaines
-- À exécuter dans l'éditeur SQL de Supabase

-- Mettre à jour tous les parcours pour avoir 5 semaines
UPDATE workout_programs 
SET duration_weeks = 5 
WHERE duration_weeks < 5;

-- Vérifier les mises à jour
SELECT 
  name,
  duration_weeks,
  sessions_per_week,
  (duration_weeks * sessions_per_week) as total_sessions
FROM workout_programs 
ORDER BY name;

-- Afficher le résumé des parcours
SELECT 
  COUNT(*) as total_programs,
  COUNT(CASE WHEN duration_weeks = 5 THEN 1 END) as programs_5_weeks,
  COUNT(CASE WHEN duration_weeks < 5 THEN 1 END) as programs_less_than_5_weeks
FROM workout_programs; 