-- Migration Semaine 2 - Tous les parcours
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

-- ===== HYPERTROPHIE PRO MAX - SEMAINE 2 =====

-- Séance 1 - Hypertrophie Progressive
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1,
  'Hypertrophie Progressive - Semaine 2',
  'Progression des charges et intensité pour la croissance musculaire',
  'Intermédiaire',
  65,
  ARRAY['hypertrophie', 'progression', 'volume']
);

-- Séance 2 - Volume Intensifié
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2,
  'Volume Intensifié - Semaine 2',
  'Augmentation du volume avec intensité modérée à élevée',
  'Intermédiaire',
  70,
  ARRAY['volume', 'intensité', 'endurance']
);

-- Séance 3 - Force Hypertrophie Avancée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3,
  'Force Hypertrophie Avancée - Semaine 2',
  'Combinaison force et hypertrophie avec charges progressives',
  'Intermédiaire',
  75,
  ARRAY['force', 'hypertrophie', 'puissance']
);

-- Séance 4 - Récupération Active
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 4,
  'Récupération Active - Semaine 2',
  'Séance de récupération avec exercices légers',
  'Débutant',
  50,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== FORCE & POWERLIFTING - SEMAINE 2 =====

-- Séance 1 - Technique Avancée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 1,
  'Technique Avancée - Semaine 2',
  'Perfectionnement technique avec charges progressives',
  'Intermédiaire',
  80,
  ARRAY['technique', 'progression', 'stabilité']
);

-- Séance 2 - Force Progressive
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2,
  'Force Progressive - Semaine 2',
  'Progression des charges sur les mouvements de base',
  'Intermédiaire',
  85,
  ARRAY['force', 'progression', 'intensité']
);

-- Séance 3 - Assistance Spécialisée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 3,
  'Assistance Spécialisée - Semaine 2',
  'Exercices d''assistance pour renforcer les points faibles',
  'Intermédiaire',
  75,
  ARRAY['assistance', 'équilibre', 'renforcement']
);

-- Séance 4 - Récupération et Mobilité
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 4,
  'Récupération et Mobilité - Semaine 2',
  'Séance de récupération avec travail de mobilité',
  'Débutant',
  55,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== SHAPE BIKINI - SEMAINE 2 =====

-- Séance 1 - Sculpture Avancée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 1,
  'Sculpture Avancée - Semaine 2',
  'Séance intensive pour sculpter la silhouette',
  'Intermédiaire',
  60,
  ARRAY['sculpture', 'tonification', 'définition']
);

-- Séance 2 - Cardio HIIT
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2,
  'Cardio HIIT - Semaine 2',
  'Entraînement cardio haute intensité pour brûler les graisses',
  'Intermédiaire',
  55,
  ARRAY['cardio', 'brûlage', 'endurance']
);

-- Séance 3 - Glutes & Core Intensifié
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 3,
  'Glutes & Core Intensifié - Semaine 2',
  'Focus intensifié sur les fessiers et la ceinture abdominale',
  'Intermédiaire',
  65,
  ARRAY['glutes', 'core', 'tonification']
);

-- Séance 4 - Stretching & Yoga
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 4,
  'Stretching & Yoga - Semaine 2',
  'Séance de stretching et yoga pour la récupération',
  'Débutant',
  45,
  ARRAY['flexibilité', 'récupération', 'équilibre']
);

-- ===== CROSS TRAINING INTENSE - SEMAINE 2 =====

-- Séance 1 - WOD Intensifié
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 1,
  'WOD Intensifié - Semaine 2',
  'Workout of the Day avec intensité progressive',
  'Intermédiaire',
  65,
  ARRAY['conditionnement', 'intensité', 'endurance']
);

-- Séance 2 - Gymnastique Avancée
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2,
  'Gymnastique Avancée - Semaine 2',
  'Travail gymnastique et mouvements au poids du corps avancés',
  'Intermédiaire',
  70,
  ARRAY['gymnastique', 'mobilité', 'contrôle']
);

-- Séance 3 - Métabolique Intensifié
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 3,
  'Métabolique Intensifié - Semaine 2',
  'Entraînement métabolique intensifié pour améliorer la condition',
  'Intermédiaire',
  60,
  ARRAY['métabolique', 'cardio', 'endurance']
);

-- Séance 4 - Récupération Active
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 4,
  'Récupération Active - Semaine 2',
  'Séance de récupération avec exercices légers',
  'Débutant',
  50,
  ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- ===== EXERCICES TEMPLATES - SEMAINE 2 =====

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

-- HYPERTROPHIE PRO MAX - Semaine 2, Séance 1 (Progression +10% charges)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1, 'Développé couché', 'Charges externes', 4, 8, 55, 'Progression charges +10%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1, 'Squat', 'Charges externes', 4, 8, 66, 'Progression charges +10%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Progression, moins d''assistance', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1, 'Développé militaire', 'Charges externes', 3, 10, 33, 'Progression charges +10%', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1, 'Curl biceps', 'Charges externes', 3, 12, 16.5, 'Progression charges +10%', 5
);

-- HYPERTROPHIE PRO MAX - Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Soulevé de terre', 'Charges externes', 4, 8, 77, 'Progression charges +10%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Dips', 'Poids du corps', 4, 10, NULL, 'Progression, moins d''assistance', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Leg press', 'Charges externes', 4, 12, 88, 'Progression charges +10%', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Lateral raises', 'Charges externes', 3, 15, 8.8, 'Progression charges +10%', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Extensions triceps', 'Charges externes', 3, 12, 22, 'Progression charges +10%', 5
);

-- HYPERTROPHIE PRO MAX - Semaine 2, Séance 3
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3, 'Développé couché', 'Charges externes', 4, 8, 60.5, 'Progression charges +10%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3, 'Squat', 'Charges externes', 4, 8, 71.5, 'Progression charges +10%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Progression, moins d''assistance', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3, 'Overhead press', 'Charges externes', 3, 10, 38.5, 'Progression charges +10%', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3, 'Deadlift roumain', 'Charges externes', 3, 10, 66, 'Progression charges +10%', 5
);

-- HYPERTROPHIE PRO MAX - Semaine 2, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 4, 'Planche', 'Poids du corps', 3, 35, NULL, 'Progression durée +5s', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 4, 'Stretching dynamique', 'Poids du corps', 1, 12, NULL, 'Mobilité avancée', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 4, 'Yoga flow', 'Poids du corps', 1, 18, NULL, 'Flexibilité avancée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 4, 'Foam rolling', 'Poids du corps', 1, 12, NULL, 'Récupération avancée', 4
);

-- FORCE & POWERLIFTING - Semaine 2, Séance 1 (Progression +5% charges)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 1, 'Squat', 'Charges externes', 5, 5, 84, 'Progression charges +5%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 1, 'Développé couché', 'Charges externes', 5, 5, 63, 'Progression charges +5%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 1, 'Soulevé de terre', 'Charges externes', 3, 5, 94.5, 'Progression charges +5%', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 1, 'Overhead press', 'Charges externes', 3, 8, 42, 'Progression charges +5%', 4
);

-- FORCE & POWERLIFTING - Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Squat', 'Charges externes', 5, 5, 89.25, 'Progression charges +5%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Développé couché', 'Charges externes', 5, 5, 66.15, 'Progression charges +5%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Soulevé de terre', 'Charges externes', 3, 5, 99.23, 'Progression charges +5%', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Bench press pause', 'Charges externes', 3, 8, 57.75, 'Progression charges +5%', 4
);

-- FORCE & POWERLIFTING - Semaine 2, Séance 3
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 3, 'Squat assistance', 'Charges externes', 4, 8, 73.5, 'Progression charges +5%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 3, 'Dips', 'Poids du corps', 4, 8, NULL, 'Progression, moins d''assistance', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 3, 'Good mornings', 'Charges externes', 3, 10, 52.5, 'Progression charges +5%', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 3, 'Lateral raises', 'Charges externes', 3, 12, 10.5, 'Progression charges +5%', 4
);

-- FORCE & POWERLIFTING - Semaine 2, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 4, 'Stretching dynamique', 'Poids du corps', 1, 18, NULL, 'Mobilité avancée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 4, 'Foam rolling', 'Poids du corps', 1, 12, NULL, 'Récupération avancée', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 4, 'Yoga récupération', 'Poids du corps', 1, 25, NULL, 'Flexibilité avancée', 3
);

-- SHAPE BIKINI - Semaine 2, Séance 1 (Progression +15% charges)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 1, 'Squat sumo', 'Charges externes', 4, 12, 40.25, 'Progression charges +15%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 1, 'Hip thrust', 'Charges externes', 4, 15, 46, 'Progression charges +15%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 1, 'Crunch', 'Poids du corps', 3, 22, NULL, 'Progression reps +2', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 1, 'Planche', 'Poids du corps', 3, 35, NULL, 'Progression durée +5s', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 1, 'Donkey kicks', 'Poids du corps', 3, 17, NULL, 'Progression reps +2', 5
);

-- SHAPE BIKINI - Semaine 2, Séance 2 (Cardio - Poids du corps)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Tapis de course', 'Poids du corps', 1, 25, NULL, 'Intensité progressive', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Vélo stationnaire', 'Poids du corps', 1, 18, NULL, 'Rythme soutenu', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Jumping jacks', 'Poids du corps', 3, 35, NULL, 'HIIT modéré', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Burpees', 'Poids du corps', 3, 12, NULL, 'Intensité progressive', 4
);

-- SHAPE BIKINI - Semaine 2, Séance 3
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 3, 'Hip thrust', 'Charges externes', 4, 15, 51.75, 'Progression charges +15%', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 3, 'Squat bulgare', 'Charges externes', 3, 12, 28.75, 'Progression charges +15%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 3, 'Russian twist', 'Poids du corps', 3, 22, NULL, 'Progression reps +2', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 3, 'Leg raises', 'Poids du corps', 3, 17, NULL, 'Progression reps +2', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 3, 'Fire hydrants', 'Poids du corps', 3, 14, NULL, 'Progression reps +2', 5
);

-- SHAPE BIKINI - Semaine 2, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 4, 'Stretching fessiers', 'Poids du corps', 1, 12, NULL, 'Flexibilité avancée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 4, 'Yoga flow', 'Poids du corps', 1, 18, NULL, 'Équilibre avancé', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 4, 'Méditation', 'Poids du corps', 1, 12, NULL, 'Récupération mentale avancée', 3
);

-- CROSS TRAINING INTENSE - Semaine 2, Séance 1 (Progression intensité)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 1, 'Burpees', 'Poids du corps', 5, 10, NULL, 'Progression intensité', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 1, 'Thrusters', 'Charges externes', 4, 12, 27.5, 'Progression charges +10%', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 1, 'Box jumps', 'Poids du corps', 4, 15, NULL, 'Progression hauteur', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 1, 'Wall balls', 'Charges externes', 4, 18, 6.6, 'Progression charges +10%', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 1, 'Row machine', 'Charges externes', 3, 450, NULL, 'Progression distance +50m', 5
);

-- CROSS TRAINING INTENSE - Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Pull-ups', 'Poids du corps', 4, 6, NULL, 'Progression reps +1', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Dips', 'Poids du corps', 4, 10, NULL, 'Progression reps +2', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Handstand practice', 'Poids du corps', 3, 35, NULL, 'Progression durée +5s', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Ring rows', 'Poids du corps', 4, 12, NULL, 'Progression reps +2', 4
);

-- CROSS TRAINING INTENSE - Semaine 2, Séance 3 (Cardio - Poids du corps)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 3, 'Tapis de course', 'Poids du corps', 1, 18, NULL, 'Intensité progressive', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 3, 'Vélo stationnaire', 'Poids du corps', 1, 12, NULL, 'Rythme soutenu', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 3, 'Rameur', 'Poids du corps', 1, 550, NULL, 'Progression distance +50m', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 3, 'Jump rope', 'Poids du corps', 3, 120, NULL, 'Progression reps +20', 4
);

-- CROSS TRAINING INTENSE - Semaine 2, Séance 4
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 4, 'Stretching dynamique', 'Poids du corps', 1, 12, NULL, 'Mobilité avancée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 4, 'Foam rolling', 'Poids du corps', 1, 12, NULL, 'Récupération avancée', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 4, 'Yoga flow', 'Poids du corps', 1, 18, NULL, 'Flexibilité avancée', 3
);

-- Vérification finale
SELECT COUNT(*) as total_templates_semaine_2 FROM exercise_templates WHERE week_number = 2;
SELECT COUNT(*) as total_sessions_semaine_2 FROM session_templates WHERE week_number = 2; 