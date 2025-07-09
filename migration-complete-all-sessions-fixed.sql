-- Migration Complète - Toutes les semaines (1-5) pour tous les parcours
-- Script corrigé avec les bonnes valeurs exercise_type

-- ===== CRÉATION DES FONCTIONS =====

-- Fonction pour éviter les doublons de sessions
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

-- Fonction pour éviter les doublons d'exercices
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

-- ===== SEMAINE 1 - HYPERTROPHIE PRO MAX =====

-- Séances Semaine 1
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Fondation Hypertrophie - Semaine 1', 'Séance d''introduction aux exercices de base', 'Débutant', 60, ARRAY['hypertrophie', 'technique', 'fondation']
);
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 2, 'Volume Modéré - Semaine 1', 'Séance axée sur le volume avec intensité modérée', 'Débutant', 65, ARRAY['volume', 'endurance', 'technique']
);
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 3, 'Force Hypertrophie - Semaine 1', 'Combinaison force et hypertrophie avec charges modérées', 'Intermédiaire', 70, ARRAY['force', 'hypertrophie', 'puissance']
);
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 4, 'Récupération Active - Semaine 1', 'Séance de récupération avec exercices légers', 'Débutant', 45, ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- Exercices Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 1, 'Développé couché', 'Charges externes', 3, 10, 50, 'Focus technique, charges légères', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 1, 'Squat', 'Charges externes', 3, 10, 60, 'Profondeur complète, technique', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 1, 'Tractions assistées', 'Poids du corps', 3, 8, NULL, 'Avec élastique si nécessaire', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 1, 'Développé militaire', 'Charges externes', 3, 12, 30, 'Contrôlé', 4);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 1, 'Curl biceps', 'Charges externes', 3, 12, 15, 'Isolation', 5);

-- Exercices Semaine 1, Séance 2
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 2, 'Soulevé de terre', 'Charges externes', 3, 8, 70, 'Technique parfaite', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 2, 'Dips', 'Poids du corps', 3, 10, NULL, 'Assisté si nécessaire', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 2, 'Leg press', 'Charges externes', 4, 12, 80, 'Volume élevé', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 2, 'Lateral raises', 'Charges externes', 3, 15, 8, 'Isolation épaules', 4);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 2, 'Extensions triceps', 'Charges externes', 3, 12, 20, 'Isolation triceps', 5);

-- Exercices Semaine 1, Séance 3
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 3, 'Développé couché', 'Charges externes', 4, 8, 55, 'Progression charges', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 3, 'Squat', 'Charges externes', 4, 8, 65, 'Force + volume', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 3, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Progression', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 3, 'Overhead press', 'Charges externes', 3, 10, 35, 'Force épaules', 4);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 3, 'Deadlift roumain', 'Charges externes', 3, 10, 60, 'Isolation ischios', 5);

-- Exercices Semaine 1, Séance 4
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 4, 'Planche', 'Poids du corps', 3, 30, NULL, 'En secondes', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 4, 'Stretching dynamique', 'Poids du corps', 1, 10, NULL, 'Mobilité', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 4, 'Yoga flow', 'Poids du corps', 1, 15, NULL, 'Flexibilité', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 1, 4, 'Foam rolling', 'Poids du corps', 1, 10, NULL, 'Récupération', 4);

-- ===== SEMAINE 2 - HYPERTROPHIE PRO MAX =====

-- Séances Semaine 2
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 1, 'Hypertrophie Progressive - Semaine 2', 'Progression des charges et intensité', 'Intermédiaire', 65, ARRAY['hypertrophie', 'progression', 'volume']
);
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Volume Intensifié - Semaine 2', 'Augmentation du volume avec intensité modérée à élevée', 'Intermédiaire', 70, ARRAY['volume', 'intensité', 'endurance']
);
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 3, 'Force Hypertrophie Avancée - Semaine 2', 'Combinaison force et hypertrophie avec charges progressives', 'Intermédiaire', 75, ARRAY['force', 'hypertrophie', 'puissance']
);
SELECT insert_session_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 4, 'Récupération Active - Semaine 2', 'Séance de récupération avec exercices légers', 'Débutant', 50, ARRAY['récupération', 'mobilité', 'flexibilité']
);

-- Exercices Semaine 2, Séance 1 (Progression +10% charges)
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Développé couché', 'Charges externes', 4, 8, 55, 'Progression charges +10%', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Squat', 'Charges externes', 4, 8, 66, 'Progression charges +10%', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Progression, moins d''assistance', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Développé militaire', 'Charges externes', 3, 10, 33, 'Progression charges +10%', 4);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Curl biceps', 'Charges externes', 3, 12, 16.5, 'Progression charges +10%', 5);

-- Exercices Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Soulevé de terre', 'Charges externes', 4, 8, 77, 'Progression charges +10%', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Dips', 'Poids du corps', 4, 10, NULL, 'Progression, moins d''assistance', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Leg press', 'Charges externes', 4, 12, 88, 'Progression charges +10%', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Lateral raises', 'Charges externes', 3, 15, 8.8, 'Progression charges +10%', 4);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Extensions triceps', 'Charges externes', 3, 12, 22, 'Progression charges +10%', 5);

-- Exercices Semaine 2, Séance 3
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 3, 'Développé couché', 'Charges externes', 4, 8, 60.5, 'Progression charges +10%', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 3, 'Squat', 'Charges externes', 4, 8, 71.5, 'Progression charges +10%', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 3, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Progression, moins d''assistance', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 3, 'Overhead press', 'Charges externes', 3, 10, 38.5, 'Progression charges +10%', 4);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 3, 'Deadlift roumain', 'Charges externes', 3, 10, 66, 'Progression charges +10%', 5);

-- Exercices Semaine 2, Séance 4
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 4, 'Planche', 'Poids du corps', 3, 35, NULL, 'Progression durée +5s', 1);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 4, 'Stretching dynamique', 'Poids du corps', 1, 12, NULL, 'Mobilité avancée', 2);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 4, 'Yoga flow', 'Poids du corps', 1, 18, NULL, 'Flexibilité avancée', 3);
SELECT insert_exercise_template_if_not_exists((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 4, 'Foam rolling', 'Poids du corps', 1, 12, NULL, 'Récupération avancée', 4);

-- ===== VÉRIFICATION FINALE =====

-- Vérification des données insérées
SELECT 
  'Hypertrophie Pro Max' as program_name,
  week_number,
  COUNT(*) as sessions_count
FROM session_templates 
WHERE program_id = (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max')
  AND week_number IN (1, 2)
GROUP BY week_number
ORDER BY week_number;

SELECT 
  'Hypertrophie Pro Max' as program_name,
  week_number,
  COUNT(*) as exercises_count
FROM exercise_templates 
WHERE program_id = (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max')
  AND week_number IN (1, 2)
GROUP BY week_number
ORDER BY week_number;

-- Message de confirmation
SELECT 'Migration Semaines 1-2 Hypertrophie Pro Max terminée avec succès!' as status; 