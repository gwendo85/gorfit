-- Migration pour créer la table exercise_templates
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer la table exercise_templates
CREATE TABLE IF NOT EXISTS exercise_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  session_number INTEGER NOT NULL,
  exercise_name VARCHAR(255) NOT NULL,
  exercise_type TEXT CHECK (exercise_type IN ('Poids du corps', 'Charges externes')),
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  weight DECIMAL(5,2),
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, week_number, session_number, order_index)
);

-- Insérer les templates d'exercices pour tous les parcours

-- 💪 Hypertrophie Pro Max - Semaine 1, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 1, 'Développé couché', 'Charges externes', 4, 8, 60, 'Focus sur la technique', 1),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 1, 'Squat', 'Charges externes', 4, 8, 80, 'Profondeur complète', 2),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 1, 'Tractions', 'Poids du corps', 3, 8, NULL, 'Avec élastique si nécessaire', 3),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 1, 'Dips', 'Poids du corps', 3, 10, NULL, 'Sur barres parallèles', 4),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 1, 'Curl biceps', 'Charges externes', 3, 12, 20, 'Contrôlé', 5);

-- 💪 Hypertrophie Pro Max - Semaine 1, Séance 2
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 2, 'Soulevé de terre', 'Charges externes', 4, 6, 100, 'Technique parfaite', 1),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 2, 'Presse militaire', 'Charges externes', 4, 8, 40, 'Debout', 2),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 2, 'Rowing haltère', 'Charges externes', 3, 10, 25, 'Un bras', 3),
((SELECT id FROM workout_programs WHERE name = '💪 Hypertrophie Pro Max'), 1, 2, 'Extensions triceps', 'Charges externes', 3, 12, 15, 'Cable ou haltère', 4);

-- 🏋️ Force & Powerlifting - Semaine 1, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = '🏋️ Force & Powerlifting'), 1, 1, 'Squat', 'Charges externes', 5, 5, 120, 'Technique compétition', 1),
((SELECT id FROM workout_programs WHERE name = '🏋️ Force & Powerlifting'), 1, 1, 'Développé couché', 'Charges externes', 5, 5, 80, 'Pause sur la poitrine', 2),
((SELECT id FROM workout_programs WHERE name = '🏋️ Force & Powerlifting'), 1, 1, 'Soulevé de terre', 'Charges externes', 3, 3, 140, 'Deadlift classique', 3),
((SELECT id FROM workout_programs WHERE name = '🏋️ Force & Powerlifting'), 1, 1, 'Presse militaire', 'Charges externes', 3, 5, 50, 'Debout strict', 4);

-- Shape Bikini - Semaine 1, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 1, 1, 'Squat sumo', 'Charges externes', 4, 12, 40, 'Focus fessiers', 1),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 1, 1, 'Hip thrust', 'Charges externes', 4, 15, 50, 'Isolation fessiers', 2),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 1, 1, 'Crunch', 'Poids du corps', 3, 20, NULL, 'Contrôlé', 3),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 1, 1, 'Planche', 'Poids du corps', 3, 30, NULL, 'En secondes', 4),
((SELECT id FROM workout_programs WHERE name = 'Shape Bikini'), 1, 1, 'Donkey kicks', 'Poids du corps', 3, 15, NULL, 'Chaque jambe', 5);

-- ⚡ Cross Training Intense - Semaine 1, Séance 1
INSERT INTO exercise_templates (program_id, week_number, session_number, exercise_name, exercise_type, sets, reps, weight, notes, order_index) VALUES
((SELECT id FROM workout_programs WHERE name = '⚡ Cross Training Intense'), 1, 1, 'Burpees', 'Poids du corps', 4, 10, NULL, 'Avec pompe', 1),
((SELECT id FROM workout_programs WHERE name = '⚡ Cross Training Intense'), 1, 1, 'Thrusters', 'Charges externes', 4, 12, 30, 'Haltère', 2),
((SELECT id FROM workout_programs WHERE name = '⚡ Cross Training Intense'), 1, 1, 'Box jumps', 'Poids du corps', 3, 15, NULL, 'Hauteur adaptée', 3),
((SELECT id FROM workout_programs WHERE name = '⚡ Cross Training Intense'), 1, 1, 'Wall balls', 'Charges externes', 3, 20, 6, 'Medecine ball', 4),
((SELECT id FROM workout_programs WHERE name = '⚡ Cross Training Intense'), 1, 1, 'Double-unders', 'Poids du corps', 3, 50, NULL, 'Corde à sauter', 5);

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_exercise_templates_lookup 
ON exercise_templates (program_id, week_number, session_number, order_index);

-- Ajouter des politiques RLS pour exercise_templates
ALTER TABLE exercise_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view exercise templates" ON exercise_templates
    FOR SELECT USING (true);

CREATE POLICY "Only authenticated users can insert exercise templates" ON exercise_templates
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update exercise templates" ON exercise_templates
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete exercise templates" ON exercise_templates
    FOR DELETE USING (auth.role() = 'authenticated');

-- Vérification
SELECT 'Migration exercise_templates terminée avec succès' as status;
SELECT COUNT(*) as total_templates FROM exercise_templates; 