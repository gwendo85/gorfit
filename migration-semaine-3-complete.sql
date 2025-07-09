-- 🚀 SCRIPT SQL PREMIUM GORFIT - SEMAINE 3 COMPLÈTE
-- Injection de toutes les séances de la Semaine 3 pour tous les parcours
-- Utilise la fonction anti-doublons pour éviter les erreurs

-- Fonction pour insérer des templates seulement s'ils n'existent pas
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

----------------------------------------------------
-- 💪 Hypertrophie Pro Max - Semaine 3 (Séances 1-5)
----------------------------------------------------

-- Semaine 3, Séance 1 (Déjà existante, mais ajoutée pour cohérence)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 1, 'Développé couché', 'Charges externes', 4, 6, 75, 'Augmentation poids', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 1, 'Squat', 'Charges externes', 4, 6, 95, 'Profondeur complète', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 1, 'Tractions', 'Poids du corps', 4, 6, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 1, 'Développé militaire', 'Charges externes', 3, 8, 50, 'Contrôlé', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 1, 'Curl biceps', 'Charges externes', 3, 10, 25, 'Isolation', 5
);

-- Semaine 3, Séance 2 (Déjà existante, mais ajoutée pour cohérence)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Développé incliné', 'Charges externes', 4, 8, 55, 'Focus haut de poitrine', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Deadlift', 'Charges externes', 4, 8, 90, 'Technique parfaite', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Dips', 'Poids du corps', 4, 8, NULL, 'Poids du corps', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Curl marteau', 'Charges externes', 3, 12, 18, 'Isolation', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Extension triceps', 'Charges externes', 3, 12, 25, 'Cable', 5
);

-- Semaine 3, Séance 3 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 3, 'Développé couché prise serrée', 'Charges externes', 4, 8, 65, 'Focus triceps', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 3, 'Front squat', 'Charges externes', 4, 8, 85, 'Dos droit', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 3, 'Rowing barre', 'Charges externes', 4, 10, 70, 'Dos droit', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 3, 'Développé haltères', 'Charges externes', 3, 10, 30, 'Chaque main', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 3, 'Curl concentration', 'Charges externes', 3, 12, 15, 'Isolation', 5
);

-- Semaine 3, Séance 4 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 4, 'Développé décliné', 'Charges externes', 4, 8, 60, 'Focus bas de poitrine', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 4, 'Squat bulgare', 'Charges externes', 4, 10, 50, 'Chaque jambe', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 4, 'Tractions prise large', 'Poids du corps', 4, 8, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 4, 'Arnold press', 'Charges externes', 3, 10, 25, 'Rotation', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 4, 'Curl spider', 'Charges externes', 3, 12, 20, 'Isolation', 5
);

-- Semaine 3, Séance 5 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 5, 'Développé couché', 'Charges externes', 4, 4, 80, 'Force maximale', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 5, 'Squat', 'Charges externes', 4, 4, 100, 'Profondeur complète', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 5, 'Tractions', 'Poids du corps', 4, 4, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 5, 'Développé militaire', 'Charges externes', 3, 6, 55, 'Contrôlé', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 5, 'Curl biceps', 'Charges externes', 3, 8, 28, 'Isolation', 5
);

----------------------------------------------------
-- 🏋️ Force & Powerlifting - Semaine 3 (Séances 1-4)
----------------------------------------------------

-- Semaine 3, Séance 1 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 1, 'Squat', 'Charges externes', 5, 3, 115, 'Force maximale', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 1, 'Développé couché', 'Charges externes', 5, 3, 85, 'Pause en bas', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 1, 'Soulevé de terre', 'Charges externes', 3, 3, 140, 'Forme stricte', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 1, 'Overhead press', 'Charges externes', 3, 5, 55, 'Strict', 4
);

-- Semaine 3, Séance 2 (Déjà existante, mais ajoutée pour cohérence)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 2, 'Front Squat', 'Charges externes', 5, 5, 110, 'Dos droit', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 2, 'Développé couché prise serrée', 'Charges externes', 5, 5, 80, 'Triceps focus', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 2, 'Soulevé de terre sumo', 'Charges externes', 3, 3, 150, 'Hanches ouvertes', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 2, 'Développé militaire', 'Charges externes', 3, 5, 55, 'Strict', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 2, 'Rowing unilatéral haltère', 'Charges externes', 3, 8, 30, 'Chaque bras', 5
);

-- Semaine 3, Séance 3 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 3, 'Squat pause', 'Charges externes', 5, 3, 120, 'Pause 2s en bas', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 3, 'Développé couché', 'Charges externes', 5, 3, 90, 'Pause en bas', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 3, 'Soulevé de terre classique', 'Charges externes', 3, 3, 155, 'Forme stricte', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 3, 'Développé militaire assis', 'Charges externes', 3, 5, 57, 'Stable', 4
);

-- Semaine 3, Séance 4 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 4, 'Squat', 'Charges externes', 5, 1, 125, 'Max force', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 4, 'Développé couché', 'Charges externes', 5, 1, 95, 'Max force', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 4, 'Soulevé de terre', 'Charges externes', 3, 1, 160, 'Max force', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  3, 4, 'Développé militaire', 'Charges externes', 3, 1, 60, 'Max force', 4
);

----------------------------------------------------
-- 👙 Shape Bikini - Semaine 3 (Séances 1-4)
----------------------------------------------------

-- Semaine 3, Séance 1 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 1, 'Squat sumo', 'Charges externes', 4, 18, 50, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 1, 'Hip thrust', 'Charges externes', 4, 25, 60, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 1, 'Crunch', 'Poids du corps', 4, 30, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 1, 'Planche', 'Poids du corps', 4, 60, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 1, 'Donkey kicks', 'Poids du corps', 4, 25, NULL, 'Chaque jambe', 5
);

-- Semaine 3, Séance 2 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Squat bulgare', 'Charges externes', 4, 12, 30, 'Chaque jambe', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Hip thrust unilatéral', 'Charges externes', 4, 15, 35, 'Chaque jambe', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Crunch bicyclette', 'Poids du corps', 4, 20, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Planche latérale', 'Poids du corps', 4, 45, NULL, 'Chaque côté', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Fire hydrant', 'Poids du corps', 4, 20, NULL, 'Chaque jambe', 5
);

-- Semaine 3, Séance 3 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 3, 'Squat sumo', 'Charges externes', 4, 20, 55, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 3, 'Hip thrust', 'Charges externes', 4, 30, 65, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 3, 'Crunch', 'Poids du corps', 4, 35, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 3, 'Planche', 'Poids du corps', 4, 75, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 3, 'Donkey kicks', 'Poids du corps', 4, 30, NULL, 'Chaque jambe', 5
);

-- Semaine 3, Séance 4 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 4, 'Squat sumo', 'Charges externes', 4, 15, 60, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 4, 'Hip thrust', 'Charges externes', 4, 20, 70, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 4, 'Crunch', 'Poids du corps', 4, 25, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 4, 'Planche', 'Poids du corps', 4, 90, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 4, 'Donkey kicks', 'Poids du corps', 4, 25, NULL, 'Chaque jambe', 5
);

----------------------------------------------------
-- ⚡ Cross Training Intense - Semaine 3 (Séances 1-4)
----------------------------------------------------

-- Semaine 3, Séance 1 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 1, 'Burpees', 'Poids du corps', 5, 20, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 1, 'Thrusters', 'Charges externes', 4, 18, 40, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 1, 'Box jumps', 'Poids du corps', 4, 25, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 1, 'Wall balls', 'Charges externes', 4, 30, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 1, 'Row machine', 'Charges externes', 3, 700, NULL, 'En mètres', 5
);

-- Semaine 3, Séance 2 (Déjà existante, mais ajoutée pour cohérence)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 2, 'Burpees', 'Poids du corps', 5, 20, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 2, 'Thrusters', 'Charges externes', 4, 18, 40, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 2, 'Box jumps', 'Poids du corps', 4, 25, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 2, 'Wall balls', 'Charges externes', 4, 30, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 2, 'Row machine', 'Charges externes', 3, 700, NULL, 'En mètres', 5
);

-- Semaine 3, Séance 3 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 3, 'Burpees', 'Poids du corps', 5, 25, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 3, 'Thrusters', 'Charges externes', 4, 20, 45, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 3, 'Box jumps', 'Poids du corps', 4, 30, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 3, 'Wall balls', 'Charges externes', 4, 35, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 3, 'Row machine', 'Charges externes', 3, 800, NULL, 'En mètres', 5
);

-- Semaine 3, Séance 4 (NOUVELLE)
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 4, 'Burpees', 'Poids du corps', 5, 30, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 4, 'Thrusters', 'Charges externes', 4, 25, 50, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 4, 'Box jumps', 'Poids du corps', 4, 35, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 4, 'Wall balls', 'Charges externes', 4, 40, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  3, 4, 'Row machine', 'Charges externes', 3, 900, NULL, 'En mètres', 5
);

-- ✅ Vérification finale
SELECT COUNT(*) as total_templates_semaine_3 FROM exercise_templates WHERE week_number = 3;
SELECT '✅ Injection Semaine 3 COMPLÈTE TERMINÉE' AS status; 