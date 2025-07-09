-- Migration Exercices Templates - Semaine 5
-- Script pour injecter les exercices modèles de la semaine 5 pour tous les programmes

-- Fonction pour éviter les doublons
CREATE OR REPLACE FUNCTION insert_exercise_template_if_not_exists(
  p_program_id UUID,
  p_week_number INTEGER,
  p_session_number INTEGER,
  p_exercise_name TEXT,
  p_exercise_type TEXT,
  p_sets INTEGER,
  p_reps INTEGER,
  p_weight DECIMAL,
  p_notes TEXT,
  p_order_index INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index)
  VALUES (p_program_id, p_week_number, p_session_number, p_exercise_name, p_exercise_type, p_sets, p_reps, p_weight, p_notes, p_order_index)
  ON CONFLICT (program_id, week_number, session_number, order_index) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- ===== HYPERTROPHIE PRO MAX - SEMAINE 5 =====

-- Séance 1 : Hypertrophie Avancée
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 1,
  'Développé couché', 'Charges externes', 4, 8, 75, 'Focus sur la technique et la progression', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 1,
  'Squat', 'Charges externes', 4, 8, 95, 'Profondeur complète, contrôle de la descente', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 1,
  'Tractions', 'Poids du corps', 4, 10, NULL, 'Avec élastique si nécessaire, focus sur la contraction', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 1,
  'Développé militaire', 'Charges externes', 3, 10, 45, 'Debout, contrôle du mouvement', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 1,
  'Curl biceps', 'Charges externes', 3, 12, 25, 'Contrôlé, focus sur la contraction', 5
);

-- Séance 2 : Force Maximale
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 2,
  'Soulevé de terre', 'Charges externes', 4, 6, 120, 'Technique parfaite, progression progressive', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 2,
  'Presse militaire', 'Charges externes', 4, 8, 50, 'Debout, contrôle du mouvement', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 2,
  'Rowing haltère', 'Charges externes', 3, 10, 30, 'Un bras, focus sur la contraction dorsale', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 2,
  'Extensions triceps', 'Charges externes', 3, 12, 20, 'Cable ou haltère, contrôle du mouvement', 4
);

-- Séance 3 : Volume Intense
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 3,
  'Développé couché', 'Charges externes', 5, 6, 80, 'Volume élevé, récupération courte', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 3,
  'Squat', 'Charges externes', 5, 6, 100, 'Volume élevé, focus sur la technique', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 3,
  'Tractions', 'Poids du corps', 4, 12, NULL, 'Volume élevé, élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 3,
  'Dips', 'Poids du corps', 4, 15, NULL, 'Volume élevé, sur barres parallèles', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 3,
  'Curl biceps', 'Charges externes', 4, 15, 20, 'Volume élevé, contrôle du mouvement', 5
);

-- Séance 4 : Récupération Active
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 4,
  'Cardio léger', 'Poids du corps', 1, 20, NULL, 'Course ou vélo, intensité modérée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 4,
  'Stretching', 'Poids du corps', 3, 30, NULL, 'Étirements dynamiques et statiques', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 5, 4,
  'Mobilité', 'Poids du corps', 2, 15, NULL, 'Exercices de mobilité articulaire', 3
);

-- ===== FORCE & POWERLIFTING - SEMAINE 5 =====

-- Séance 1 : Force Maximale
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 1,
  'Squat', 'Charges externes', 5, 3, 140, 'Technique compétition, charge maximale', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 1,
  'Développé couché', 'Charges externes', 5, 3, 100, 'Pause sur la poitrine, technique parfaite', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 1,
  'Soulevé de terre', 'Charges externes', 3, 3, 160, 'Deadlift classique, charge maximale', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 1,
  'Presse militaire', 'Charges externes', 3, 5, 60, 'Debout strict, technique parfaite', 4
);

-- Séance 2 : Assistance Spécialisée
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 2,
  'Squat pause', 'Charges externes', 4, 5, 120, 'Pause de 3 secondes en bas', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 2,
  'Développé couché pause', 'Charges externes', 4, 5, 85, 'Pause de 2 secondes sur la poitrine', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 2,
  'Rowing haltère', 'Charges externes', 3, 8, 35, 'Un bras, focus sur la contraction', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 2,
  'Extensions triceps', 'Charges externes', 3, 10, 25, 'Cable, focus sur la contraction', 4
);

-- Séance 3 : Technique et Volume
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 3,
  'Squat', 'Charges externes', 4, 8, 110, 'Volume modéré, focus technique', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 3,
  'Développé couché', 'Charges externes', 4, 8, 75, 'Volume modéré, technique parfaite', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 3,
  'Soulevé de terre', 'Charges externes', 3, 5, 130, 'Volume modéré, technique parfaite', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 3,
  'Presse militaire', 'Charges externes', 3, 8, 45, 'Volume modéré, technique parfaite', 4
);

-- Séance 4 : Récupération et Mobilité
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 4,
  'Cardio léger', 'Poids du corps', 1, 15, NULL, 'Course ou vélo, intensité faible', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 4,
  'Stretching', 'Poids du corps', 3, 45, NULL, 'Étirements statiques et dynamiques', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 5, 4,
  'Mobilité', 'Poids du corps', 2, 20, NULL, 'Exercices de mobilité articulaire', 3
);

-- ===== SHAPE BIKINI - SEMAINE 5 =====

-- Séance 1 : Sculpture Avancée
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 1,
  'Squat sumo', 'Charges externes', 4, 15, 50, 'Focus fessiers, amplitude complète', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 1,
  'Hip thrust', 'Charges externes', 4, 20, 60, 'Isolation fessiers, contraction maximale', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 1,
  'Crunch', 'Poids du corps', 4, 25, NULL, 'Contrôlé, focus sur la contraction', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 1,
  'Planche', 'Poids du corps', 3, 45, NULL, 'En secondes, gainage complet', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 1,
  'Donkey kicks', 'Poids du corps', 4, 20, NULL, 'Chaque jambe, isolation fessiers', 5
);

-- Séance 2 : Cardio HIIT
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 2,
  'Burpees', 'Poids du corps', 4, 15, NULL, 'Avec pompe, intensité élevée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 2,
  'Mountain climbers', 'Poids du corps', 4, 30, NULL, 'Rythme rapide, cardio intense', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 2,
  'Jumping jacks', 'Poids du corps', 4, 25, NULL, 'Cardio, coordination', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 2,
  'High knees', 'Poids du corps', 4, 30, NULL, 'Cardio, intensité élevée', 4
);

-- Séance 3 : Glutes & Core
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 3,
  'Hip thrust', 'Charges externes', 4, 20, 65, 'Isolation fessiers, charge progressive', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 3,
  'Squat sumo', 'Charges externes', 4, 15, 55, 'Focus fessiers, amplitude complète', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 3,
  'Crunch', 'Poids du corps', 4, 30, NULL, 'Contrôlé, focus sur la contraction', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 3,
  'Planche', 'Poids du corps', 3, 60, NULL, 'En secondes, gainage complet', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 3,
  'Donkey kicks', 'Poids du corps', 4, 25, NULL, 'Chaque jambe, isolation fessiers', 5
);

-- Séance 4 : Stretching & Yoga
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 4,
  'Stretching', 'Poids du corps', 3, 60, NULL, 'Étirements statiques et dynamiques', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 4,
  'Yoga', 'Poids du corps', 1, 30, NULL, 'Séquences de yoga doux', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 5, 4,
  'Mobilité', 'Poids du corps', 2, 20, NULL, 'Exercices de mobilité articulaire', 3
);

-- ===== CROSS TRAINING INTENSE - SEMAINE 5 =====

-- Séance 1 : WOD Intense
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 1,
  'Burpees', 'Poids du corps', 5, 15, NULL, 'Avec pompe, intensité maximale', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 1,
  'Thrusters', 'Charges externes', 4, 15, 35, 'Haltère, intensité élevée', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 1,
  'Box jumps', 'Poids du corps', 4, 20, NULL, 'Hauteur adaptée, explosivité', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 1,
  'Wall balls', 'Charges externes', 4, 25, 8, 'Medecine ball, intensité élevée', 4
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 1,
  'Double-unders', 'Poids du corps', 4, 60, NULL, 'Corde à sauter, coordination', 5
);

-- Séance 2 : Cardio Explosif
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 2,
  'Sprint', 'Poids du corps', 8, 30, NULL, 'Sprint court, récupération complète', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 2,
  'Burpees', 'Poids du corps', 5, 20, NULL, 'Avec pompe, intensité maximale', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 2,
  'Mountain climbers', 'Poids du corps', 4, 45, NULL, 'Rythme rapide, cardio intense', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 2,
  'High knees', 'Poids du corps', 4, 40, NULL, 'Cardio, intensité élevée', 4
);

-- Séance 3 : Force & Endurance
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 3,
  'Squat', 'Charges externes', 4, 10, 80, 'Volume modéré, technique parfaite', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 3,
  'Développé couché', 'Charges externes', 4, 10, 60, 'Volume modéré, technique parfaite', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 3,
  'Tractions', 'Poids du corps', 4, 12, NULL, 'Volume modéré, élastique si nécessaire', 3
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 3,
  'Dips', 'Poids du corps', 4, 15, NULL, 'Volume modéré, sur barres parallèles', 4
);

-- Séance 4 : Récupération Active
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 4,
  'Cardio léger', 'Poids du corps', 1, 25, NULL, 'Course ou vélo, intensité modérée', 1
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 4,
  'Stretching', 'Poids du corps', 3, 60, NULL, 'Étirements statiques et dynamiques', 2
);
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 5, 4,
  'Mobilité', 'Poids du corps', 2, 25, NULL, 'Exercices de mobilité articulaire', 3
);

-- Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS insert_exercise_template_if_not_exists(UUID, INTEGER, INTEGER, TEXT, TEXT, INTEGER, INTEGER, DECIMAL, TEXT, INTEGER);

-- Vérification finale
SELECT 'Migration exercices semaine 5 terminée avec succès' as status;
SELECT COUNT(*) as total_exercices_semaine_5 FROM exercise_templates WHERE week_number = 5; 