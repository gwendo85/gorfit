-- Script complet pour synchroniser la table challenges avec tous les champs attendus
-- Exécutez ce script dans l'éditeur SQL de Supabase

-- 1. Vérifier la structure actuelle de la table challenges
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'challenges'
ORDER BY ordinal_position;

-- 2. Ajouter les colonnes manquantes
ALTER TABLE challenges
ADD COLUMN IF NOT EXISTS reward_badge_title TEXT,
ADD COLUMN IF NOT EXISTS reward_badge_description TEXT,
ADD COLUMN IF NOT EXISTS difficulty_level TEXT DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'fitness',
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS max_participants INTEGER,
ADD COLUMN IF NOT EXISTS min_participants INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 3. Créer un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_challenges_updated_at ON challenges;
CREATE TRIGGER update_challenges_updated_at
    BEFORE UPDATE ON challenges
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Vérifier et corriger les contraintes CHECK
ALTER TABLE challenges 
DROP CONSTRAINT IF EXISTS challenges_type_check;

ALTER TABLE challenges 
ADD CONSTRAINT challenges_type_check 
CHECK (type IN ('workout', 'streak', 'distance', 'calories', 'time', 'custom'));

ALTER TABLE challenges 
DROP CONSTRAINT IF EXISTS challenges_difficulty_level_check;

ALTER TABLE challenges 
ADD CONSTRAINT challenges_difficulty_level_check 
CHECK (difficulty_level IN ('easy', 'medium', 'hard', 'expert'));

-- 5. Nettoyer les données existantes et insérer des challenges de test
DELETE FROM challenges WHERE title LIKE '%Test%' OR title LIKE '%Challenge%';

INSERT INTO challenges (
    id, 
    title, 
    description, 
    type, 
    target, 
    reward_badge_title, 
    reward_badge_description, 
    duration_days, 
    icon_emoji, 
    difficulty_level,
    category,
    is_active,
    created_at
) VALUES 
(
    gen_random_uuid(),
    'Défi Cardio 30 jours',
    'Complète 30 sessions d''entraînement cardio en 30 jours',
    'workout',
    30,
    'Cardio Warrior',
    'Badge pour avoir complété 30 sessions cardio',
    30,
    '💪',
    'medium',
    'cardio',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Streak de Force',
    'Fais 7 entraînements de musculation d''affilée',
    'streak',
    7,
    'Force Builder',
    'Badge pour 7 jours consécutifs de musculation',
    7,
    '🏋️',
    'hard',
    'strength',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Défi Distance',
    'Parcours 50km en course à pied ce mois',
    'distance',
    50,
    'Distance Runner',
    'Badge pour 50km parcourus',
    30,
    '🏃',
    'medium',
    'running',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Calories Brûlées',
    'Brûle 5000 calories en une semaine',
    'calories',
    5000,
    'Calorie Burner',
    'Badge pour 5000 calories brûlées',
    7,
    '🔥',
    'hard',
    'cardio',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Défi Temps',
    'Fais 10 entraînements de 45 minutes minimum',
    'time',
    10,
    'Time Master',
    'Badge pour 10 entraînements de 45min+',
    14,
    '⏰',
    'easy',
    'general',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Défi Flexibilité',
    'Fais 21 jours d''étirements consécutifs',
    'streak',
    21,
    'Flex Master',
    'Badge pour 21 jours d''étirements',
    21,
    '🧘',
    'medium',
    'flexibility',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Défi HIIT',
    'Complète 15 sessions HIIT en 3 semaines',
    'workout',
    15,
    'HIIT Champion',
    'Badge pour 15 sessions HIIT',
    21,
    '⚡',
    'expert',
    'hiit',
    true,
    NOW()
),
(
    gen_random_uuid(),
    'Défi Yoga',
    'Pratique le yoga 30 jours d''affilée',
    'streak',
    30,
    'Yoga Master',
    'Badge pour 30 jours de yoga',
    30,
    '🧘‍♀️',
    'medium',
    'yoga',
    true,
    NOW()
);

-- 6. Vérifier que tout a été inséré correctement
SELECT 
    id,
    title,
    type,
    target,
    duration_days,
    difficulty_level,
    category,
    is_active
FROM challenges 
ORDER BY created_at DESC;

-- 7. Vérifier les politiques RLS pour challenges
DROP POLICY IF EXISTS "Challenges are viewable by everyone" ON challenges;
CREATE POLICY "Challenges are viewable by everyone" ON challenges
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can create challenges" ON challenges;
CREATE POLICY "Users can create challenges" ON challenges
    FOR INSERT WITH CHECK (auth.uid() = created_by);

DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;
CREATE POLICY "Users can update their own challenges" ON challenges
    FOR UPDATE USING (auth.uid() = created_by);

-- 8. Activer RLS sur la table challenges
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- 9. Vérification finale
SELECT 
    'Challenges table synchronized successfully' as status,
    COUNT(*) as total_challenges,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_challenges
FROM challenges; 