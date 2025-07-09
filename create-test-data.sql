-- Script pour créer des données de test pour les challenges abandonnés
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Insérer des challenges de test s'ils n'existent pas
INSERT INTO challenges (title, description, type, target, reward_badge_title, reward_badge_description, duration_days, icon_emoji) VALUES
('💪 100 Pompes en 7 jours', 'Réalise 100 pompes en une semaine', 'reps', 100, 'Pompe Master', 'Tu as réussi le défi des 100 pompes !', 7, '💪'),
('🔥 30 Minutes Cardio', 'Fais 30 minutes de cardio par jour pendant 5 jours', 'sessions', 5, 'Cardio Warrior', 'Tu as complété 5 séances cardio !', 5, '🔥'),
('🏋️ 500kg Volume Total', 'Atteins un volume total de 500kg cette semaine', 'volume', 500, 'Volume King', 'Tu as atteint 500kg de volume !', 7, '🏋️'),
('🚴 100km Vélo', 'Parcours 100km en vélo cette semaine', 'reps', 100, 'Cycliste', 'Tu as parcouru 100km !', 7, '🚴'),
('🏃 10km Course', 'Courre 10km cette semaine', 'sessions', 3, 'Coureur', 'Tu as couru 10km !', 7, '🏃')
ON CONFLICT DO NOTHING;

-- 2. Récupérer le premier utilisateur pour créer des données de test
-- Remplace 'TON_EMAIL' par ton email pour créer des données pour ton compte
DO $$
DECLARE
    test_user_id UUID;
    test_challenge_id UUID;
BEGIN
    -- Récupérer ton user_id (remplace 'TON_EMAIL' par ton email)
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'TON_EMAIL'  -- Remplace par ton email
    LIMIT 1;
    
    -- Récupérer un challenge de test
    SELECT id INTO test_challenge_id 
    FROM challenges 
    LIMIT 1;
    
    -- Créer un challenge abandonné de test
    IF test_user_id IS NOT NULL AND test_challenge_id IS NOT NULL THEN
        INSERT INTO user_challenges (user_id, challenge_id, status, progress, updated_at) VALUES
        (test_user_id, test_challenge_id, 'abandoned', 25, NOW() - INTERVAL '3 days')
        ON CONFLICT (user_id, challenge_id) DO UPDATE SET
        status = 'abandoned',
        progress = 25,
        updated_at = NOW() - INTERVAL '3 days';
        
        RAISE NOTICE 'Données de test créées pour l''utilisateur: %', test_user_id;
    ELSE
        RAISE NOTICE 'Utilisateur ou challenge non trouvé. Vérifie ton email.';
    END IF;
END $$;

-- 3. Vérifier les données créées
SELECT 
    uc.id,
    uc.user_id,
    uc.challenge_id,
    uc.status,
    uc.progress,
    uc.updated_at,
    c.title,
    u.email
FROM user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id
JOIN auth.users u ON uc.user_id = u.id
WHERE uc.status = 'abandoned'
ORDER BY uc.updated_at DESC;

-- 4. Tester la requête avec auth.uid() (doit être exécuté par un utilisateur connecté)
-- SELECT * FROM user_challenges WHERE user_id = auth.uid() AND status = 'abandoned'; 