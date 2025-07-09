-- 🚀 SCRIPT SQL PREMIUM GORFIT
-- Injection SEMAINES 2 à 5, Séance 2, TOUS PARCOURS
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
-- 💪 Hypertrophie Pro Max - Séance 2
----------------------------------------------------

-- Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Développé incliné', 'Charges externes', 4, 8, 55, 'Focus haut de poitrine', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Deadlift', 'Charges externes', 4, 8, 90, 'Technique parfaite', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Dips', 'Poids du corps', 4, 8, NULL, 'Poids du corps', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Curl marteau', 'Charges externes', 3, 12, 18, 'Isolation', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  2, 2, 'Extension triceps', 'Charges externes', 3, 12, 25, 'Cable', 5
);

-- Semaine 3, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Développé couché', 'Charges externes', 4, 6, 75, 'Augmentation poids', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Squat', 'Charges externes', 4, 6, 95, 'Profondeur complète', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Tractions', 'Poids du corps', 4, 6, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Développé militaire', 'Charges externes', 3, 8, 50, 'Contrôlé', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  3, 2, 'Curl biceps', 'Charges externes', 3, 10, 25, 'Isolation', 5
);

-- Semaine 4, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  4, 2, 'Développé couché', 'Charges externes', 4, 4, 80, 'Force maximale', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  4, 2, 'Squat', 'Charges externes', 4, 4, 100, 'Profondeur complète', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  4, 2, 'Tractions', 'Poids du corps', 4, 4, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  4, 2, 'Développé militaire', 'Charges externes', 3, 6, 55, 'Contrôlé', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  4, 2, 'Curl biceps', 'Charges externes', 3, 8, 28, 'Isolation', 5
);

-- Semaine 5, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 2, 'Développé couché', 'Charges externes', 4, 2, 85, 'Force maximale', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 2, 'Squat', 'Charges externes', 4, 2, 105, 'Profondeur complète', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 2, 'Tractions', 'Poids du corps', 4, 2, NULL, 'Avec élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 2, 'Développé militaire', 'Charges externes', 3, 4, 60, 'Contrôlé', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  5, 2, 'Curl biceps', 'Charges externes', 3, 6, 30, 'Isolation', 5
);

----------------------------------------------------
-- 🏋️ Force & Powerlifting - Séance 2
----------------------------------------------------

-- Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Squat', 'Charges externes', 5, 5, 125, 'Profondeur max', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Développé couché', 'Charges externes', 5, 5, 85, 'Pause en bas', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Soulevé de terre', 'Charges externes', 3, 3, 145, 'Forme stricte', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Presse militaire', 'Charges externes', 3, 5, 52, 'Debout strict', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  2, 2, 'Rowing barre', 'Charges externes', 3, 8, 70, 'Dos droit', 5
);

-- Semaine 3, Séance 2
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

-- Semaine 4, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  4, 2, 'Squat pause', 'Charges externes', 5, 5, 120, 'Pause 2s en bas', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  4, 2, 'Développé couché', 'Charges externes', 5, 5, 90, 'Pause en bas', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  4, 2, 'Soulevé de terre classique', 'Charges externes', 3, 3, 155, 'Forme stricte', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  4, 2, 'Développé militaire assis', 'Charges externes', 3, 5, 57, 'Stable', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  4, 2, 'Rowing barre prise inversée', 'Charges externes', 3, 8, 72, 'Contraction bas', 5
);

-- Semaine 5, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 2, 'Squat', 'Charges externes', 5, 3, 130, 'Force max', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 2, 'Développé couché', 'Charges externes', 5, 3, 95, 'Pause', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 2, 'Soulevé de terre', 'Charges externes', 3, 2, 160, 'Max force', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 2, 'Développé militaire', 'Charges externes', 3, 3, 60, 'Strict', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  5, 2, 'Rowing barre', 'Charges externes', 3, 6, 75, 'Strict', 5
);

-- Semaine 6, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  6, 2, 'Squat', 'Charges externes', 5, 1, 135, 'Max force', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  6, 2, 'Développé couché', 'Charges externes', 5, 1, 100, 'Max force', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  6, 2, 'Soulevé de terre', 'Charges externes', 3, 1, 165, 'Max force', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  6, 2, 'Développé militaire', 'Charges externes', 3, 1, 65, 'Max force', 4
);

----------------------------------------------------
-- 👙 Shape Bikini - Séance 2
----------------------------------------------------

-- Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Squat sumo', 'Charges externes', 4, 15, 45, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Hip thrust', 'Charges externes', 4, 20, 55, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Crunch', 'Poids du corps', 4, 25, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Planche', 'Poids du corps', 4, 45, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  2, 2, 'Donkey kicks', 'Poids du corps', 4, 20, NULL, 'Chaque jambe', 5
);

-- Semaine 3, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Squat sumo', 'Charges externes', 4, 18, 50, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Hip thrust', 'Charges externes', 4, 25, 60, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Crunch', 'Poids du corps', 4, 30, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Planche', 'Poids du corps', 4, 60, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  3, 2, 'Donkey kicks', 'Poids du corps', 4, 25, NULL, 'Chaque jambe', 5
);

-- Semaine 4, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  4, 2, 'Squat sumo', 'Charges externes', 4, 20, 55, 'Focus fessiers', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  4, 2, 'Hip thrust', 'Charges externes', 4, 30, 65, 'Isolation fessiers', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  4, 2, 'Crunch', 'Poids du corps', 4, 35, NULL, 'Contrôlé', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  4, 2, 'Planche', 'Poids du corps', 4, 75, NULL, 'En secondes', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  4, 2, 'Donkey kicks', 'Poids du corps', 4, 30, NULL, 'Chaque jambe', 5
);

----------------------------------------------------
-- ⚡ Cross Training Intense - Séance 2
----------------------------------------------------

-- Semaine 2, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Burpees', 'Poids du corps', 5, 15, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Thrusters', 'Charges externes', 4, 15, 35, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Box jumps', 'Poids du corps', 4, 20, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Wall balls', 'Charges externes', 4, 25, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  2, 2, 'Row machine', 'Charges externes', 3, 600, NULL, 'En mètres', 5
);

-- Semaine 3, Séance 2
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

-- Semaine 4, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  4, 2, 'Burpees', 'Poids du corps', 5, 25, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  4, 2, 'Thrusters', 'Charges externes', 4, 20, 45, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  4, 2, 'Box jumps', 'Poids du corps', 4, 30, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  4, 2, 'Wall balls', 'Charges externes', 4, 35, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  4, 2, 'Row machine', 'Charges externes', 3, 800, NULL, 'En mètres', 5
);

-- Semaine 5, Séance 2
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 2, 'Burpees', 'Poids du corps', 5, 30, NULL, 'Explosif', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 2, 'Thrusters', 'Charges externes', 4, 25, 50, 'Complet', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 2, 'Box jumps', 'Poids du corps', 4, 35, NULL, 'Hauteur adaptée', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 2, 'Wall balls', 'Charges externes', 4, 40, 9, 'Cible haute', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  5, 2, 'Row machine', 'Charges externes', 3, 900, NULL, 'En mètres', 5
);

-- ✅ Vérification finale
SELECT COUNT(*) as total_templates_ajoutes FROM exercise_templates;
SELECT '✅ Injection S2-S5 Séance 2 TOUS PARCOURS TERMINÉE' AS status; 