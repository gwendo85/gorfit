-- Script de création des tables pour les parcours GorFit

-- Table des programmes de workout
CREATE TABLE IF NOT EXISTS workout_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  objective VARCHAR(255) NOT NULL,
  duration_weeks INTEGER NOT NULL,
  sessions_per_week INTEGER NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de suivi des programmes par utilisateur
CREATE TABLE IF NOT EXISTS user_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  current_week INTEGER DEFAULT 1,
  current_session INTEGER DEFAULT 1,
  total_sessions_completed INTEGER DEFAULT 0,
  UNIQUE(user_id, program_id)
);

-- Ajouter les colonnes program_id, program_week, program_session à la table sessions existante
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES workout_programs(id) ON DELETE SET NULL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS program_week INTEGER;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS program_session INTEGER;

-- Insérer les parcours par défaut
INSERT INTO workout_programs (id, name, objective, duration_weeks, sessions_per_week, description, image_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', '💪 Prise de Masse Power', 'Développer la masse musculaire et la force', 4, 4, 'Programme intensif de 4 semaines pour prendre de la masse musculaire. Séances progressives avec focus sur les exercices polyarticulaires et la surcharge progressive.', '/images/programs/muscle-gain.jpg'),
('550e8400-e29b-41d4-a716-446655440002', '🔥 Full Body Summer', 'Tonifier tout le corps pour l''été', 3, 3, 'Programme complet de 3 semaines pour sculpter votre corps avant l''été. Exercices full body avec intensité modérée à élevée.', '/images/programs/summer-body.jpg'),
('550e8400-e29b-41d4-a716-446655440003', '🍃 Sèche Définition', 'Perdre du gras et définir les muscles', 3, 4, 'Programme de 3 semaines pour perdre du gras tout en préservant la masse musculaire. Combinaison cardio et musculation.', '/images/programs/definition.jpg'),
('550e8400-e29b-41d4-a716-446655440004', '🍑 Spécial Fessiers', 'Développer et tonifier les fessiers', 4, 3, 'Programme spécialisé de 4 semaines pour sculpter et tonifier vos fessiers. Exercices ciblés et progressifs.', '/images/programs/glutes.jpg'),
('550e8400-e29b-41d4-a716-446655440005', '⚔️ Gladiateur Intensif', 'Défi physique complet et intensif', 5, 5, 'Programme intensif de 5 semaines pour les athlètes confirmés. Développement de la force, endurance et condition physique générale.', '/images/programs/gladiator.jpg')
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS pour la sécurité
ALTER TABLE workout_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_programs ENABLE ROW LEVEL SECURITY;

-- Politique pour workout_programs : lecture publique
CREATE POLICY "workout_programs_read_policy" ON workout_programs
  FOR SELECT USING (true);

-- Politique pour user_programs : accès uniquement à ses propres programmes
CREATE POLICY "user_programs_read_policy" ON user_programs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_programs_insert_policy" ON user_programs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_programs_update_policy" ON user_programs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "user_programs_delete_policy" ON user_programs
  FOR DELETE USING (auth.uid() = user_id); 