-- Migration pour corriger la durée des parcours à 5 semaines
-- Mise à jour de la durée de tous les parcours

UPDATE workout_programs 
SET duration_weeks = 5 
WHERE name IN (
  'Hypertrophie Pro Max',
  'Force & Powerlifting', 
  'Shape Bikini',
  'Cross Training Intense'
);

-- Vérification de la mise à jour
SELECT 
  name,
  duration_weeks,
  'Durée corrigée à 5 semaines' as status
FROM workout_programs 
WHERE name IN (
  'Hypertrophie Pro Max',
  'Force & Powerlifting', 
  'Shape Bikini',
  'Cross Training Intense'
);

-- Message de confirmation
SELECT 'Tous les parcours ont été mis à jour à 5 semaines!' as confirmation; 