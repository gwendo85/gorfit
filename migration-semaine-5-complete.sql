-- Migration Semaine 5 - Tous les parcours
-- Fonction pour éviter les doublons
CREATE OR REPLACE FUNCTION insert_session_template_if_not_exists(
  p_program_id UUID,
  p_week_number INTEGER,
  p_session_number INTEGER,
  p_name TEXT,
  p_description TEXT,
  p_difficulty TEXT,
  p_estimated_duration INTEGER,
  p_focus_areas TEXT[]
) RETURNS VOID AS $$
BEGIN
  INSERT INTO session_templates (program_id, week_number, session_number, name, description, difficulty, estimated_duration, focus_areas)
  VALUES (p_program_id, p_week_number, p_session_number, p_name, p_description, p_difficulty, p_estimated_duration, p_focus_areas)
  ON CONFLICT (program_id, week_number, session_number) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ===== HYPERTROPHIE PRO MAX - SEMAINE 5 =====

-- Séance 1 - Hypertrophie Avancée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 1,
  'Hypertrophie Avancée - Semaine 5',
  'Séance intensive axée sur la croissance musculaire avec techniques avancées',
  'Avancé',
  75,
  ARRAY['hypertrophie', 'force', 'volume']
);

-- Séance 2 - Force Maximale
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 2,
  'Force Maximale - Semaine 5',
  'Développement de la force maximale avec charges lourdes',
  'Avancé',
  70,
  ARRAY['force', 'puissance', 'stabilité']
);

-- Séance 3 - Volume Intense
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 3,
  'Volume Intense - Semaine 5',
  'Séance à haut volume pour maximiser la croissance musculaire',
  'Avancé',
  80,
  ARRAY['hypertrophie', 'endurance', 'volume']
);

-- Séance 4 - Récupération Active
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 4,
  'Récupération Active - Semaine 5',
  'Séance de récupération avec exercices légers et étirements',
  'Intermédiaire',
  45,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== FORCE & POWERLIFTING - SEMAINE 5 =====

-- Séance 1 - Force Maximale
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 1,
  'Force Maximale - Semaine 5',
  'Travail sur les 3 mouvements de base avec charges maximales',
  'Avancé',
  90,
  ARRAY['force', 'technique', 'puissance']
);

-- Séance 2 - Assistance Spécialisée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 2,
  'Assistance Spécialisée - Semaine 5',
  'Exercices d''assistance pour renforcer les points faibles',
  'Avancé',
  75,
  ARRAY['assistance', 'équilibre', 'stabilité']
);

-- Séance 3 - Technique et Volume
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 3,
  'Technique et Volume - Semaine 5',
  'Perfectionnement technique avec volume modéré',
  'Intermédiaire',
  70,
  ARRAY['technique', 'volume', 'endurance']
);

-- Séance 4 - Récupération et Mobilité
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 4,
  'Récupération et Mobilité - Semaine 5',
  'Séance de récupération avec travail de mobilité',
  'Débutant',
  50,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== SHAPE BIKINI - SEMAINE 5 =====

-- Séance 1 - Sculpture Avancée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  5, 1,
  'Sculpture Avancée - Semaine 5',
  'Séance intensive pour sculpter la silhouette',
  'Avancé',
  70,
  ARRAY['sculpture', 'tonification', 'définition']
);

-- Séance 2 - Cardio HIIT
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  5, 2,
  'Cardio HIIT - Semaine 5',
  'Entraînement cardio haute intensité pour brûler les graisses',
  'Avancé',
  60,
  ARRAY['cardio', 'brûlage', 'endurance']
);

-- Séance 3 - Glutes & Core
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  5, 3,
  'Glutes & Core - Semaine 5',
  'Focus sur les fessiers et la ceinture abdominale',
  'Intermédiaire',
  65,
  ARRAY['glutes', 'core', 'tonification']
);

-- Séance 4 - Stretching & Yoga
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  5, 4,
  'Stretching & Yoga - Semaine 5',
  'Séance de stretching et yoga pour la récupération',
  'Débutant',
  45,
  ARRAY['flexibilité', 'récupération', 'équilibre']
);

-- ===== CROSS TRAINING INTENSE - SEMAINE 5 =====

-- Séance 1 - WOD Intense
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 1,
  'WOD Intense - Semaine 5',
  'Workout of the Day intensif avec exercices variés',
  'Avancé',
  75,
  ARRAY['conditionnement', 'force', 'endurance']
);

-- Séance 2 - Gymnastique
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 2,
  'Gymnastique - Semaine 5',
  'Travail gymnastique et mouvements au poids du corps',
  'Avancé',
  70,
  ARRAY['gymnastique', 'mobilité', 'contrôle']
);

-- Séance 3 - Métabolique
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 3,
  'Métabolique - Semaine 5',
  'Entraînement métabolique pour améliorer la condition',
  'Intermédiaire',
  65,
  ARRAY['métabolique', 'cardio', 'endurance']
);

-- Séance 4 - Récupération Active
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 4,
  'Récupération Active - Semaine 5',
  'Séance de récupération avec exercices légers',
  'Débutant',
  50,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- Vérification du nombre de templates ajoutés
SELECT 
  p.name as programme,
  COUNT(st.*) as templates_ajoutes
FROM workout_programs p
LEFT JOIN session_templates st ON p.id = st.program_id AND st.week_number = 5
WHERE p.name IN ('Hypertrophie Pro Max', 'Force & Powerlifting', 'Shape Bikini', 'Cross Training Intense')
GROUP BY p.id, p.name
ORDER BY p.name;

-- Nettoyage de la fonction temporaire
DROP FUNCTION IF EXISTS insert_session_template_if_not_exists(UUID, INTEGER, INTEGER, TEXT, TEXT, TEXT, INTEGER, TEXT[]); 