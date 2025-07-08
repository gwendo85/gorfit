-- Migration pour ajouter la colonne type à la table exercises
-- À exécuter dans l'éditeur SQL de Supabase

-- Ajouter la colonne type avec une valeur par défaut
ALTER TABLE public.exercises 
ADD COLUMN IF NOT EXISTS type TEXT;

-- Ajouter la contrainte CHECK après avoir ajouté la colonne
ALTER TABLE public.exercises 
ADD CONSTRAINT exercises_type_check 
CHECK (type IN ('Poids du corps', 'Charges externes'));

-- Mettre à jour les exercices existants avec une valeur par défaut
-- On peut déterminer le type basé sur le poids : 0kg = Poids du corps, sinon Charges externes
UPDATE public.exercises 
SET type = CASE 
    WHEN weight = 0 THEN 'Poids du corps'
    ELSE 'Charges externes'
END
WHERE type IS NULL;

-- Rendre la colonne NOT NULL après avoir mis à jour les données existantes
ALTER TABLE public.exercises 
ALTER COLUMN type SET NOT NULL;

-- Commentaire pour la documentation
COMMENT ON COLUMN public.exercises.type IS 'Type d''exercice : Poids du corps ou Charges externes'; 