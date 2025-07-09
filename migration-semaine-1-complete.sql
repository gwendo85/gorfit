-- Migration Semaine 1 - Tous les parcours
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

-- ===== HYPERTROPHIE PRO MAX - SEMAINE 1 =====

-- Séance 1 - Fondation Hypertrophie
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1,
  'Fondation Hypertrophie - Semaine 1',
  'Séance d''introduction aux exercices de base pour la croissance musculaire',
  'Débutant',
  60,
  ARRAY['hypertrophie', 'technique', 'fondation']
);

-- Séance 2 - Volume Modéré
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2,
  'Volume Modéré - Semaine 1',
  'Séance axée sur le volume avec intensité modérée',
  'Débutant',
  65,
  ARRAY['volume', 'endurance', 'technique']
);

-- Séance 3 - Force Hypertrophie
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3,
  'Force Hypertrophie - Semaine 1',
  'Combinaison force et hypertrophie avec charges modérées',
  'Intermédiaire',
  70,
  ARRAY['force', 'hypertrophie', 'puissance']
);

-- Séance 4 - Récupération Active
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 4,
  'Récupération Active - Semaine 1',
  'Séance de récupération avec exercices légers',
  'Débutant',
  45,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== FORCE & POWERLIFTING - SEMAINE 1 =====

-- Séance 1 - Technique de Base
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1,
  'Technique de Base - Semaine 1',
  'Apprentissage des mouvements fondamentaux avec charges légères',
  'Débutant',
  75,
  ARRAY['technique', 'fondation', 'mobilité']
);

-- Séance 2 - Force Progressive
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 2,
  'Force Progressive - Semaine 1',
  'Progression des charges sur les mouvements de base',
  'Intermédiaire',
  80,
  ARRAY['force', 'progression', 'stabilité']
);

-- Séance 3 - Assistance Fondamentale
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 3,
  'Assistance Fondamentale - Semaine 1',
  'Exercices d''assistance pour renforcer les bases',
  'Intermédiaire',
  70,
  ARRAY['assistance', 'équilibre', 'renforcement']
);

-- Séance 4 - Récupération et Mobilité
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 4,
  'Récupération et Mobilité - Semaine 1',
  'Séance de récupération avec travail de mobilité',
  'Débutant',
  50,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== SHAPE BIKINI - SEMAINE 1 =====

-- Séance 1 - Sculpture de Base
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1,
  'Sculpture de Base - Semaine 1',
  'Séance d''introduction à la tonification et sculpture',
  'Débutant',
  55,
  ARRAY['sculpture', 'tonification', 'fondation']
);

-- Séance 2 - Cardio Légère
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 2,
  'Cardio Légère - Semaine 1',
  'Entraînement cardio modéré pour brûler les graisses',
  'Débutant',
  50,
  ARRAY['cardio', 'brûlage', 'endurance']
);

-- Séance 3 - Glutes & Core
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 3,
  'Glutes & Core - Semaine 1',
  'Focus sur les fessiers et la ceinture abdominale',
  'Débutant',
  60,
  ARRAY['glutes', 'core', 'tonification']
);

-- Séance 4 - Stretching & Yoga
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 4,
  'Stretching & Yoga - Semaine 1',
  'Séance de stretching et yoga pour la récupération',
  'Débutant',
  40,
  ARRAY['flexibilité', 'récupération', 'équilibre']
);

-- ===== CROSS TRAINING INTENSE - SEMAINE 1 =====

-- Séance 1 - WOD Fondamental
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1,
  'WOD Fondamental - Semaine 1',
  'Workout of the Day d''introduction aux mouvements fonctionnels',
  'Débutant',
  60,
  ARRAY['conditionnement', 'fonctionnel', 'endurance']
);

-- Séance 2 - Gymnastique de Base
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 2,
  'Gymnastique de Base - Semaine 1',
  'Travail gymnastique et mouvements au poids du corps',
  'Débutant',
  65,
  ARRAY['gymnastique', 'mobilité', 'contrôle']
);

-- Séance 3 - Métabolique Modéré
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 3,
  'Métabolique Modéré - Semaine 1',
  'Entraînement métabolique pour améliorer la condition',
  'Intermédiaire',
  55,
  ARRAY['métabolique', 'cardio', 'endurance']
);

-- Séance 4 - Récupération Active
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 4,
  'Récupération Active - Semaine 1',
  'Séance de récupération avec exercices légers',
  'Débutant',
  45,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== EXERCICES TEMPLATES - SEMAINE 1 =====

-- Fonction pour insérer les exercices sans doublons
CREATE OR REPLACE FUNCTION insert_exercise_template_if_not_exists(
  p_program_id UUID,
  p_week_number INTEGER,
  p_session_number INTEGER,
  p_exercise_name VARCHAR,
  p_exercise_type TEXT,
  p_sets INTEGER,
  p_reps INTEGER,
  p_weight DECIMAL,
  p_notes TEXT,
  p_order_index INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO exercise_templates (
    program_id, week_number, session_number, exercise_name, 
    exercise_type, sets, reps, weight, notes, order_index
  ) VALUES (
    p_program_id, p_week_number, p_session_number, p_exercise_name,
    p_exercise_type, p_sets, p_reps, p_weight, p_notes, p_order_index
  )
  ON CONFLICT (program_id, week_number, session_number, order_index) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- HYPERTROPHIE PRO MAX - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Développé couché', 'Charges externes', 3, 10, 50, 'Focus technique, charges légères', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Squat', 'Charges externes', 3, 10, 60, 'Profondeur complète, technique', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Tractions assistées', 'Poids du corps', 3, 8, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Développé militaire', 'Charges externes', 3, 12, 30, 'Contrôlé', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Curl biceps', 'Charges externes', 3, 12, 15, 'Isolation', 5
);

-- HYPERTROPHIE PRO MAX - Semaine 1, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2, 'Soulevé de terre', 'Charges externes', 3, 8, 70, 'Technique parfaite', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2, 'Dips', 'Poids du corps', 3, 10, NULL, 'Assisté si nécessaire', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2, 'Leg press', 'Charges externes', 4, 12, 80, 'Volume élevé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2, 'Lateral raises', 'Charges externes', 3, 15, 8, 'Isolation épaules', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2, 'Extensions triceps', 'Charges externes', 3, 12, 20, 'Isolation triceps', 5
);

-- HYPERTROPHIE PRO MAX - Semaine 1, Séance 3
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3, 'Développé couché', 'Charges externes', 4, 8, 55, 'Progression charges', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3, 'Squat', 'Charges externes', 4, 8, 65, 'Force + volume', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Progression', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3, 'Overhead press', 'Charges externes', 3, 10, 35, 'Force épaules', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3, 'Deadlift roumain', 'Charges externes', 3, 10, 60, 'Isolation ischios', 5
);

-- HYPERTROPHIE PRO MAX - Semaine 1, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 4, 'Planche', 'Poids du corps', 3, 30, NULL, 'En secondes', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 4, 'Stretching dynamique', 'Poids du corps', 1, 10, NULL, 'Mobilité', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 4, 'Yoga flow', 'Poids du corps', 1, 15, NULL, 'Flexibilité', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 4, 'Foam rolling', 'Poids du corps', 1, 10, NULL, 'Récupération', 4
);

-- FORCE & POWERLIFTING - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Squat', 'Charges externes', 5, 5, 80, 'Technique parfaite, charges légères', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Développé couché', 'Charges externes', 5, 5, 60, 'Pause sur la poitrine', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Soulevé de terre', 'Charges externes', 3, 5, 90, 'Technique parfaite', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Overhead press', 'Charges externes', 3, 8, 40, 'Contrôlé', 4
);

-- FORCE & POWERLIFTING - Semaine 1, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 2, 'Squat', 'Charges externes', 5, 5, 85, 'Progression charges', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 2, 'Développé couché', 'Charges externes', 5, 5, 65, 'Progression', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 2, 'Soulevé de terre', 'Charges externes', 3, 5, 95, 'Progression', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 2, 'Bench press pause', 'Charges externes', 3, 8, 55, 'Pause 2 secondes', 4
);

-- FORCE & POWERLIFTING - Semaine 1, Séance 3
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 3, 'Squat assistance', 'Charges externes', 4, 8, 70, 'Volume modéré', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 3, 'Dips', 'Poids du corps', 4, 8, NULL, 'Assistance bench', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 3, 'Good mornings', 'Charges externes', 3, 10, 50, 'Isolation ischios', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 3, 'Lateral raises', 'Charges externes', 3, 12, 10, 'Assistance épaules', 4
);

-- FORCE & POWERLIFTING - Semaine 1, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 4, 'Stretching dynamique', 'Poids du corps', 1, 15, NULL, 'Mobilité', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 4, 'Foam rolling', 'Poids du corps', 1, 10, NULL, 'Récupération', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 4, 'Yoga récupération', 'Poids du corps', 1, 20, NULL, 'Flexibilité', 3
);

-- SHAPE BIKINI - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Squat sumo', 'Charges externes', 4, 12, 35, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Hip thrust', 'Charges externes', 4, 15, 40, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Crunch', 'Poids du corps', 3, 20, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Planche', 'Poids du corps', 3, 30, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Donkey kicks', 'Poids du corps', 3, 15, NULL, 'Chaque jambe', 5
);

-- SHAPE BIKINI - Semaine 1, Séance 2 (Cardio - Poids du corps)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 2, 'Tapis de course', 'Poids du corps', 1, 20, NULL, 'Intensité modérée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 2, 'Vélo stationnaire', 'Poids du corps', 1, 15, NULL, 'Rythme soutenu', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 2, 'Jumping jacks', 'Poids du corps', 3, 30, NULL, 'HIIT léger', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 2, 'Burpees', 'Poids du corps', 3, 10, NULL, 'Intensité progressive', 4
);

-- SHAPE BIKINI - Semaine 1, Séance 3
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 3, 'Hip thrust', 'Charges externes', 4, 15, 45, 'Progression charges', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 3, 'Squat bulgare', 'Charges externes', 3, 12, 25, 'Unilatéral', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 3, 'Russian twist', 'Poids du corps', 3, 20, NULL, 'Rotation', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 3, 'Leg raises', 'Poids du corps', 3, 15, NULL, 'Isolation abdos', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 3, 'Fire hydrants', 'Poids du corps', 3, 12, NULL, 'Chaque jambe', 5
);

-- SHAPE BIKINI - Semaine 1, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 4, 'Stretching fessiers', 'Poids du corps', 1, 10, NULL, 'Flexibilité', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 4, 'Yoga flow', 'Poids du corps', 1, 15, NULL, 'Équilibre', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 4, 'Méditation', 'Poids du corps', 1, 10, NULL, 'Récupération mentale', 3
);

-- CROSS TRAINING INTENSE - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Burpees', 'Poids du corps', 5, 8, NULL, 'Technique correcte', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Thrusters', 'Charges externes', 4, 10, 25, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Box jumps', 'Poids du corps', 4, 12, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Wall balls', 'Charges externes', 4, 15, 6, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Row machine', 'Charges externes', 3, 400, NULL, 'En mètres', 5
);

-- CROSS TRAINING INTENSE - Semaine 1, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 2, 'Pull-ups', 'Poids du corps', 4, 5, NULL, 'Assisté si nécessaire', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 2, 'Dips', 'Poids du corps', 4, 8, NULL, 'Assisté si nécessaire', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 2, 'Handstand practice', 'Poids du corps', 3, 30, NULL, 'Contre le mur', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 2, 'Ring rows', 'Poids du corps', 4, 10, NULL, 'Gymnastique', 4
);

-- CROSS TRAINING INTENSE - Semaine 1, Séance 3 (Cardio - Poids du corps)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 3, 'Tapis de course', 'Poids du corps', 1, 15, NULL, 'Intensité modérée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 3, 'Vélo stationnaire', 'Poids du corps', 1, 10, NULL, 'Rythme soutenu', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 3, 'Rameur', 'Poids du corps', 1, 500, NULL, 'En mètres', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 3, 'Jump rope', 'Poids du corps', 3, 100, NULL, 'Double unders', 4
);

-- CROSS TRAINING INTENSE - Semaine 1, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 4, 'Stretching dynamique', 'Poids du corps', 1, 10, NULL, 'Mobilité', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 4, 'Foam rolling', 'Poids du corps', 1, 10, NULL, 'Récupération', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 4, 'Yoga flow', 'Poids du corps', 1, 15, NULL, 'Flexibilité', 3
);

-- Vérification finale
SELECT COUNT(*) as total_templates_semaine_1 FROM exercise_templates WHERE week_number = 1;
SELECT COUNT(*) as total_sessions_semaine_1 FROM session_templates WHERE week_number = 1; 