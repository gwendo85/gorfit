-- Migration pour créer la table session_templates manquante
-- À exécuter dans l'éditeur SQL de Supabase

-- Créer la table session_templates si elle n'existe pas
CREATE TABLE IF NOT EXISTS session_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES workout_programs(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  session_number INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  estimated_duration INTEGER,
  focus_areas TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(program_id, week_number, session_number)
);

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_session_templates_lookup 
ON session_templates (program_id, week_number, session_number);

-- Ajouter des politiques RLS pour session_templates (seulement si elles n'existent pas)
ALTER TABLE session_templates ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes si elles existent
DROP POLICY IF EXISTS "Allow read access to session_templates" ON session_templates;
DROP POLICY IF EXISTS "Allow insert access to session_templates" ON session_templates;
DROP POLICY IF EXISTS "Allow update access to session_templates" ON session_templates;
DROP POLICY IF EXISTS "Allow delete access to session_templates" ON session_templates;

-- Créer les nouvelles politiques
CREATE POLICY "Allow read access to session_templates" ON session_templates
  FOR SELECT USING (true);

CREATE POLICY "Allow insert access to session_templates" ON session_templates
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow update access to session_templates" ON session_templates
  FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow delete access to session_templates" ON session_templates
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- Vérification de la création
SELECT COUNT(*) as total_session_templates FROM session_templates; 