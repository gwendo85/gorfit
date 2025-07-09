-- Migration corrigée pour créer la table exercise_templates
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer la table exercise_templates si elle n'existe pas
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

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_exercise_templates_lookup 
ON exercise_templates (program_id, week_number, session_number, order_index);

-- Ajouter des politiques RLS pour exercise_templates
ALTER TABLE exercise_templates ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous
CREATE POLICY "Allow read access to exercise_templates" ON exercise_templates
  FOR SELECT USING (true);

-- Politique pour permettre l'insertion aux utilisateurs authentifiés
CREATE POLICY "Allow insert access to exercise_templates" ON exercise_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Politique pour permettre la mise à jour aux utilisateurs authentifiés
CREATE POLICY "Allow update access to exercise_templates" ON exercise_templates
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Politique pour permettre la suppression aux utilisateurs authentifiés
CREATE POLICY "Allow delete access to exercise_templates" ON exercise_templates
  FOR DELETE USING (auth.uid() IS NOT NULL);

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

-- Insérer les templates d'exercices pour tous les parcours
-- Hypertrophie Pro Max - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Développé couché', 'Charges externes', 4, 8, 60, 'Focus sur la technique', 1
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Squat', 'Charges externes', 4, 8, 80, 'Profondeur complète', 2
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Tractions', 'Poids du corps', 4, 8, NULL, 'Avec élastique si nécessaire', 3
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Développé militaire', 'Charges externes', 3, 10, 40, 'Contrôlé', 4
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Hypertrophie Pro Max'),
  1, 1, 'Curl biceps', 'Charges externes', 3, 12, 20, 'Isolation', 5
);

-- Force & Powerlifting - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Squat', 'Charges externes', 5, 5, 100, 'Focus force', 1
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Développé couché', 'Charges externes', 5, 5, 70, 'Pause sur la poitrine', 2
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Soulevé de terre', 'Charges externes', 3, 5, 120, 'Technique parfaite', 3
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Force & Powerlifting'),
  1, 1, 'Overhead press', 'Charges externes', 3, 8, 45, 'Contrôlé', 4
);

-- Shape Bikini - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Squat sumo', 'Charges externes', 4, 12, 40, 'Focus fessiers', 1
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Shape Bikini'),
  1, 1, 'Hip thrust', 'Charges externes', 4, 15, 50, 'Isolation fessiers', 2
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

-- Cross Training Intense - Semaine 1, Séance 1
SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Burpees', 'Poids du corps', 5, 10, NULL, 'Explosif', 1
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Thrusters', 'Charges externes', 4, 12, 30, 'Complet', 2
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Box jumps', 'Poids du corps', 4, 15, NULL, 'Hauteur adaptée', 3
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Wall balls', 'Charges externes', 4, 20, 9, 'Cible haute', 4
);

SELECT insert_exercise_template_if_not_exists(
  (SELECT id FROM workout_programs WHERE name = 'Cross Training Intense'),
  1, 1, 'Row machine', 'Charges externes', 3, 500, NULL, 'En mètres', 5
);

-- Vérification finale
SELECT COUNT(*) as total_templates FROM exercise_templates; 