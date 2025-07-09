-- Migration GorFit v2.1.0 - Sauvegarde Automatique des Séances + Progression Hebdomadaire
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Ajouter les nouvelles colonnes à la table sessions
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS duration_estimate INTEGER,
ADD COLUMN IF NOT EXISTS volume_estime DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS reps_total INTEGER,
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Manuelle';

-- 2. Rendre la colonne weight nullable dans exercises (pour poids du corps)
ALTER TABLE public.exercises 
ALTER COLUMN weight DROP NOT NULL;

-- 3. Créer la table user_stats si elle n'existe pas
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

-- 4. Créer la table user_weekly_progress pour les graphiques
CREATE TABLE IF NOT EXISTS public.user_weekly_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL,
    year INTEGER NOT NULL,
    volume_week DECIMAL(10,2) DEFAULT 0,
    reps_week INTEGER DEFAULT 0,
    sessions_week INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, week_number, year)
);

-- 5. Ajouter les index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON public.user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_weekly_progress_user_id ON public.user_weekly_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_weekly_progress_week_year ON public.user_weekly_progress(week_number, year);

-- 6. Activer RLS sur les nouvelles tables
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_weekly_progress ENABLE ROW LEVEL SECURITY;

-- 7. Ajouter les politiques RLS pour user_stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_stats;
CREATE POLICY "Users can view own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_stats;
CREATE POLICY "Users can insert own stats" ON public.user_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own stats" ON public.user_stats;
CREATE POLICY "Users can update own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- 8. Ajouter les politiques RLS pour user_weekly_progress
DROP POLICY IF EXISTS "Users can view own weekly progress" ON public.user_weekly_progress;
CREATE POLICY "Users can view own weekly progress" ON public.user_weekly_progress
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weekly progress" ON public.user_weekly_progress;
CREATE POLICY "Users can insert own weekly progress" ON public.user_weekly_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own weekly progress" ON public.user_weekly_progress;
CREATE POLICY "Users can update own weekly progress" ON public.user_weekly_progress
    FOR UPDATE USING (auth.uid() = user_id);

-- 9. Créer la fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 10. Créer les triggers pour updated_at
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON public.user_stats;
CREATE TRIGGER update_user_stats_updated_at
    BEFORE UPDATE ON public.user_stats
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_weekly_progress_updated_at ON public.user_weekly_progress;
CREATE TRIGGER update_user_weekly_progress_updated_at
    BEFORE UPDATE ON public.user_weekly_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. Mettre à jour la fonction calculate_session_volume pour gérer les poids du corps
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

-- 12. Fonction pour obtenir le numéro de semaine
CREATE OR REPLACE FUNCTION get_week_number(input_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(WEEK FROM input_date);
END;
$$ LANGUAGE plpgsql;

-- 13. Fonction pour obtenir l'année
CREATE OR REPLACE FUNCTION get_year(input_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN EXTRACT(YEAR FROM input_date);
END;
$$ LANGUAGE plpgsql;

-- 14. Fonction pour mettre à jour la progression hebdomadaire
CREATE OR REPLACE FUNCTION update_weekly_progress(
    p_user_id UUID,
    p_session_date DATE,
    p_volume DECIMAL,
    p_reps INTEGER
)
RETURNS VOID AS $$
DECLARE
    v_week_number INTEGER;
    v_year INTEGER;
BEGIN
    v_week_number := get_week_number(p_session_date);
    v_year := get_year(p_session_date);
    
    INSERT INTO public.user_weekly_progress (user_id, week_number, year, volume_week, reps_week, sessions_week)
    VALUES (p_user_id, v_week_number, v_year, p_volume, p_reps, 1)
    ON CONFLICT (user_id, week_number, year)
    DO UPDATE SET
        volume_week = user_weekly_progress.volume_week + p_volume,
        reps_week = user_weekly_progress.reps_week + p_reps,
        sessions_week = user_weekly_progress.sessions_week + 1,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- 15. Initialiser les statistiques pour les utilisateurs existants (optionnel)
-- Cette requête peut être exécutée manuellement si nécessaire
/*
INSERT INTO public.user_stats (user_id, total_volume, total_reps, sessions_completed, last_session_date)
SELECT 
    u.id,
    COALESCE(SUM(e.sets * e.reps * COALESCE(e.weight, 70)), 0) as total_volume,
    COALESCE(SUM(e.sets * e.reps), 0) as total_reps,
    COUNT(DISTINCT s.id) as sessions_completed,
    MAX(s.date) as last_session_date
FROM public.users u
LEFT JOIN public.sessions s ON u.id = s.user_id
LEFT JOIN public.exercises e ON s.id = e.session_id
WHERE NOT EXISTS (SELECT 1 FROM public.user_stats us WHERE us.user_id = u.id)
GROUP BY u.id;
*/

-- Vérification de la migration
SELECT 'Migration v2.1.0 terminée avec succès' as status; 