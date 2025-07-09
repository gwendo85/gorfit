-- Migration complémentaire pour ajouter les exercices des semaines 2+
-- À exécuter APRÈS le script principal migration-exercise-templates.sql

-- 💪 Hypertrophie Pro Max - Semaine 2, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Développé couché', 'Charges externes', 4, 6, 70, 'Augmentation poids', 1),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Squat', 'Charges externes', 4, 6, 90, 'Profondeur complète', 2),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Tractions', 'Poids du corps', 4, 6, NULL, 'Avec élastique si nécessaire', 3),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Dips', 'Poids du corps', 4, 8, NULL, 'Sur barres parallèles', 4),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 1, 'Curl biceps', 'Charges externes', 4, 10, 25, 'Contrôlé', 5);

-- 💪 Hypertrophie Pro Max - Semaine 2, Séance 2
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Soulevé de terre', 'Charges externes', 4, 5, 110, 'Technique parfaite', 1),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Presse militaire', 'Charges externes', 4, 6, 45, 'Debout', 2),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Rowing haltère', 'Charges externes', 4, 8, 30, 'Un bras', 3),
((SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'), 2, 2, 'Extensions triceps', 'Charges externes', 4, 10, 18, 'Cable ou haltère', 4);

-- 🏋️ Force & Powerlifting - Semaine 2, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 2, 1, 'Squat', 'Charges externes', 5, 3, 130, 'Technique compétition', 1),
((SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 2, 1, 'Développé couché', 'Charges externes', 5, 3, 85, 'Pause sur la poitrine', 2),
((SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 2, 1, 'Soulevé de terre', 'Charges externes', 3, 2, 150, 'Deadlift classique', 3),
((SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'), 2, 1, 'Presse militaire', 'Charges externes', 3, 3, 55, 'Debout strict', 4);

-- Shape Bikini - Semaine 2, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 2, 1, 'Squat sumo', 'Charges externes', 4, 10, 45, 'Focus fessiers', 1),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 2, 1, 'Hip thrust', 'Charges externes', 4, 12, 55, 'Isolation fessiers', 2),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 2, 1, 'Crunch', 'Poids du corps', 4, 15, NULL, 'Contrôlé', 3),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 2, 1, 'Planche', 'Poids du corps', 4, 45, NULL, 'En secondes', 4),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 2, 1, 'Donkey kicks', 'Poids du corps', 4, 12, NULL, 'Chaque jambe', 5);

-- Cross Training Intense - Semaine 2, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 2, 1, 'Burpees', 'Poids du corps', 5, 12, NULL, 'Avec pompe', 1),
((SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 2, 1, 'Thrusters', 'Charges externes', 5, 10, 35, 'Haltère', 2),
((SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 2, 1, 'Box jumps', 'Poids du corps', 4, 18, NULL, 'Hauteur adaptée', 3),
((SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 2, 1, 'Wall balls', 'Charges externes', 4, 25, 8, 'Medecine ball', 4),
((SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'), 2, 1, 'Double-unders', 'Poids du corps', 4, 60, NULL, 'Corde à sauter', 5);

-- Vérification
SELECT 'Migration semaine 2+ terminée avec succès' as status;
SELECT COUNT(*) as total_templates FROM exercise_templates; 