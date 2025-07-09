-- Migration pour ajouter les colonnes manquantes à la table sessions
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter les nouvelles colonnes à la table sessions
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS duration_estimate INTEGER,
ADD COLUMN IF NOT EXISTS volume_estime DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS reps_total INTEGER,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Manuelle';

-- Rendre la colonne weight nullable dans exercises (pour poids du corps)
ALTER TABLE public.exercises 
ALTER COLUMN weight DROP NOT NULL;

-- Vérification de la migration
SELECT 'Migration sessions terminée avec succès' as status; 