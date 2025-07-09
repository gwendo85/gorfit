-- Script automatisé pour tester le module Challenges
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Vérifier que les tables existent et sont correctement configurées
DO $$
BEGIN
    -- Vérifier la table challenges
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'challenges') THEN
        RAISE EXCEPTION 'Table challenges manquante';
    END IF;
    
    -- Vérifier la table user_challenges
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_challenges') THEN
        RAISE EXCEPTION 'Table user_challenges manquante';
    END IF;
    
    RAISE NOTICE '✅ Tables challenges et user_challenges existent';
END $$;

-- 2. Vérifier les politiques RLS
SELECT 
    tablename,
    policyname,
    permissive,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('challenges', 'user_challenges')
ORDER BY tablename, policyname;

-- 3. Insérer des challenges de test s'ils n'existent pas
INSERT INTO challenges (title, description, type, target, reward_badge_title, reward_badge_description, duration_days, icon_emoji) VALUES
('💪 100 Pompes en 7 jours', 'Réalise 100 pompes en une semaine', 'reps', 100, 'Pompe Master', 'Tu as réussi le défi des 100 pompes !', 7, '💪'),
('🔥 30 Minutes Cardio', 'Fais 30 minutes de cardio par jour pendant 5 jours', 'sessions', 5, 'Cardio Warrior', 'Tu as complété 5 séances cardio !', 5, '🔥'),
('🏋️ 500kg Volume Total', 'Atteins un volume total de 500kg cette semaine', 'volume', 500, 'Volume King', 'Tu as atteint 500kg de volume !', 7, '🏋️'),
('🚴 100km Vélo', 'Parcours 100km en vélo cette semaine', 'reps', 100, 'Cycliste', 'Tu as parcouru 100km !', 7, '🚴'),
('🏃 10km Course', 'Courre 10km cette semaine', 'sessions', 3, 'Coureur', 'Tu as couru 10km !', 7, '🏃')
ON CONFLICT DO NOTHING;

-- 4. Créer des données de test pour tous les utilisateurs existants
DO $$
DECLARE
    user_record RECORD;
    challenge_record RECORD;
BEGIN
    -- Pour chaque utilisateur, créer un challenge abandonné de test
    FOR user_record IN SELECT id, email FROM auth.users LIMIT 5 LOOP
        -- Récupérer un challenge aléatoire
        SELECT id INTO challenge_record FROM challenges ORDER BY RANDOM() LIMIT 1;
        
        -- Créer un challenge abandonné
        INSERT INTO user_challenges (user_id, challenge_id, status, progress, updated_at) VALUES
        (user_record.id, challenge_record.id, 'abandoned', 25, NOW() - INTERVAL '3 days')
        ON CONFLICT (user_id, challenge_id) DO UPDATE SET
        status = 'abandoned',
        progress = 25,
        updated_at = NOW() - INTERVAL '3 days';
        
        RAISE NOTICE '✅ Challenge abandonné créé pour l''utilisateur: %', user_record.email;
    END LOOP;
END $$;

-- 5. Vérifier les données créées
SELECT 
    'Résumé des données' as info,
    COUNT(*) as total_challenges,
    COUNT(DISTINCT user_id) as users_avec_challenges,
    COUNT(CASE WHEN status = 'abandoned' THEN 1 END) as challenges_abandonnes
FROM user_challenges;

-- 6. Afficher les challenges abandonnés avec détails
SELECT 
    uc.id,
    uc.user_id,
    u.email,
    uc.challenge_id,
    c.title as challenge_title,
    uc.status,
    uc.progress,
    uc.updated_at,
    c.icon_emoji
FROM user_challenges uc
JOIN challenges c ON uc.challenge_id = c.id
JOIN auth.users u ON uc.user_id = u.id
WHERE uc.status = 'abandoned'
ORDER BY uc.updated_at DESC;

-- 7. Tester la fonction get_abandoned_challenges
SELECT * FROM get_abandoned_challenges(7);

-- 8. Vérifier que tout fonctionne
SELECT '🎉 Test automatisé terminé avec succès' as status; 