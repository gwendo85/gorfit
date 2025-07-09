-- Script d'initialisation de la base de données GorFit
-- À exécuter dans l'éditeur SQL de Supabase

-- Table des utilisateurs (extension de auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des séances
CREATE TABLE IF NOT EXISTS public.sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    objectif TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des exercices
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('Poids du corps', 'Charges externes')),
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    note TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des progressions (optionnelle pour les statistiques avancées)
CREATE TABLE IF NOT EXISTS public.progressions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    week TEXT NOT NULL,
    total_volume DECIMAL(10,2) DEFAULT 0,
    total_reps INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week)
);

-- Tables pour les parcours GorFit
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

-- Ajouter program_id à la table sessions existante
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS program_id UUID REFERENCES workout_programs(id) ON DELETE SET NULL;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS program_week INTEGER;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS program_session INTEGER;

-- Insérer les parcours par défaut
INSERT INTO workout_programs (name, objective, duration_weeks, sessions_per_week, description, image_url) VALUES
('💪 Prise de Masse Power', 'Développer la masse musculaire et la force', 4, 4, 'Programme intensif de 4 semaines pour prendre de la masse musculaire. Séances progressives avec focus sur les exercices polyarticulaires et la surcharge progressive.', '/images/programs/muscle-gain.jpg'),
('🔥 Full Body Summer', 'Tonifier tout le corps pour l\'été', 3, 3, 'Programme complet de 3 semaines pour sculpter votre corps avant l\'été. Exercices full body avec intensité modérée à élevée.', '/images/programs/summer-body.jpg'),
('🍃 Sèche Définition', 'Perdre du gras et définir les muscles', 3, 4, 'Programme de 3 semaines pour perdre du gras tout en préservant la masse musculaire. Combinaison cardio et musculation.', '/images/programs/definition.jpg'),
('🍑 Spécial Fessiers', 'Développer et tonifier les fessiers', 4, 3, 'Programme spécialisé de 4 semaines pour sculpter et tonifier vos fessiers. Exercices ciblés et progressifs.', '/images/programs/glutes.jpg'),
('⚔️ Gladiateur Intensif', 'Défi physique complet et intensif', 5, 5, 'Programme intensif de 5 semaines pour les athlètes confirmés. Développement de la force, endurance et condition physique générale.', '/images/programs/gladiator.jpg');

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON public.sessions(date);
CREATE INDEX IF NOT EXISTS idx_exercises_session_id ON public.exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_progressions_user_id ON public.progressions(user_id);

-- RLS (Row Level Security) - Sécurité au niveau des lignes
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progressions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les utilisateurs
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Politiques RLS pour les séances
CREATE POLICY "Users can view own sessions" ON public.sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour les exercices
CREATE POLICY "Users can view exercises from own sessions" ON public.exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sessions 
            WHERE sessions.id = exercises.session_id 
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert exercises in own sessions" ON public.exercises
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sessions 
            WHERE sessions.id = exercises.session_id 
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update exercises from own sessions" ON public.exercises
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.sessions 
            WHERE sessions.id = exercises.session_id 
            AND sessions.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete exercises from own sessions" ON public.exercises
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.sessions 
            WHERE sessions.id = exercises.session_id 
            AND sessions.user_id = auth.uid()
        )
    );

-- Politiques RLS pour les progressions
CREATE POLICY "Users can view own progressions" ON public.progressions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progressions" ON public.progressions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progressions" ON public.progressions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progressions" ON public.progressions
    FOR DELETE USING (auth.uid() = user_id);

-- Fonction pour créer automatiquement le profil utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, username)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement le profil utilisateur
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fonction pour calculer le volume total d'une séance
CREATE OR REPLACE FUNCTION calculate_session_volume(session_uuid UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_volume DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(sets * reps * weight), 0)
    INTO total_volume
    FROM public.exercises
    WHERE session_id = session_uuid;
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql;

-- Commentaires pour la documentation
COMMENT ON TABLE public.users IS 'Profils utilisateurs étendus';
COMMENT ON TABLE public.sessions IS 'Séances d''entraînement';
COMMENT ON TABLE public.exercises IS 'Exercices dans les séances';
COMMENT ON TABLE public.progressions IS 'Statistiques de progression hebdomadaire'; 

-- Table pour les préférences de notification utilisateur
ALTER TABLE users ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"in_app": true, "email": true, "push": false}'::jsonb;

-- Table pour le tracking des relances
CREATE TABLE IF NOT EXISTS challenge_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'push')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  clicked_at TIMESTAMP WITH TIME ZONE,
  resumed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes de relance
CREATE INDEX IF NOT EXISTS idx_challenge_reminders_user_challenge ON challenge_reminders(user_id, challenge_id);
CREATE INDEX IF NOT EXISTS idx_challenge_reminders_sent_at ON challenge_reminders(sent_at);

-- Fonction pour récupérer les challenges abandonnés depuis X jours
CREATE OR REPLACE FUNCTION get_abandoned_challenges(days_threshold INTEGER DEFAULT 7)
RETURNS TABLE (
  user_id UUID,
  challenge_id UUID,
  challenge_title TEXT,
  progress INTEGER,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  notification_preferences JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uc.user_id,
    uc.challenge_id,
    c.title,
    uc.progress,
    uc.updated_at as abandoned_at,
    u.notification_preferences
  FROM user_challenges uc
  JOIN challenges c ON uc.challenge_id = c.id
  JOIN users u ON uc.user_id = u.id
  WHERE uc.status = 'abandoned'
    AND uc.updated_at <= NOW() - INTERVAL '1 day' * days_threshold
    AND NOT EXISTS (
      SELECT 1 FROM challenge_reminders cr 
      WHERE cr.user_id = uc.user_id 
        AND cr.challenge_id = uc.challenge_id
        AND cr.sent_at >= NOW() - INTERVAL '1 day' * days_threshold
    );
END;
$$ LANGUAGE plpgsql;

-- Fonction pour reprendre un challenge abandonné
CREATE OR REPLACE FUNCTION resume_challenge(user_uuid UUID, challenge_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_challenges 
  SET 
    status = 'in_progress',
    updated_at = NOW()
  WHERE user_id = user_uuid 
    AND challenge_id = challenge_uuid 
    AND status = 'abandoned';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql; 