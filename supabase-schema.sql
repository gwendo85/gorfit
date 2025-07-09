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
    completed BOOLEAN DEFAULT FALSE,
    duration_estimate INTEGER,
    volume_estime DECIMAL(10,2),
    reps_total INTEGER,
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
    weight DECIMAL(5,2),
    note TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des statistiques utilisateur
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    total_volume DECIMAL(10,2) DEFAULT 0,
    total_reps INTEGER DEFAULT 0,
    sessions_completed INTEGER DEFAULT 0,
    last_session_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
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

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON public.sessions(date);
CREATE INDEX IF NOT EXISTS idx_exercises_session_id ON public.exercises(session_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_progressions_user_id ON public.progressions(user_id);

-- RLS (Row Level Security) - Sécurité au niveau des lignes
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
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

-- Politiques RLS pour les statistiques utilisateur
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

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
    SELECT COALESCE(SUM(sets * reps * COALESCE(weight, 70)), 0)
    INTO total_volume
    FROM public.exercises
    WHERE session_id = session_uuid;
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour automatiquement updated_at sur user_stats
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour la documentation
COMMENT ON TABLE public.users IS 'Profils utilisateurs étendus';
COMMENT ON TABLE public.sessions IS 'Séances d''entraînement';
COMMENT ON TABLE public.exercises IS 'Exercices dans les séances';
COMMENT ON TABLE public.user_stats IS 'Statistiques globales des utilisateurs';
COMMENT ON TABLE public.progressions IS 'Statistiques de progression hebdomadaire'; 