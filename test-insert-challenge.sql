-- Script pour tester l'insertion d'un user_challenge valide
-- Remplace TON-USER-ID par ton vrai user_id

-- 1. Vérifier que la contrainte fonctionne
SELECT 'Test de la contrainte status' as test;

-- 2. Essayer d'insérer un user_challenge avec un statut valide
INSERT INTO user_challenges (
    id, 
    user_id, 
    challenge_id, 
    status, 
    current_progress, 
    target_progress, 
    started_at, 
    created_at
)
VALUES (
    gen_random_uuid(), 
    'TON-USER-ID', -- Remplace par ton vrai user_id
    'challenge-30-days', 
    'active', -- Statut valide
    0, 
    30, 
    NOW(), 
    NOW()
);

-- 3. Vérifier que l'insertion a fonctionné
SELECT 'User challenge inséré avec succès' as result;
SELECT COUNT(*) as total_user_challenges FROM user_challenges;

-- 4. Essayer d'insérer un user_challenge abandonné
INSERT INTO user_challenges (
    id, 
    user_id, 
    challenge_id, 
    status, 
    current_progress, 
    target_progress, 
    started_at, 
    created_at
)
VALUES (
    gen_random_uuid(), 
    'TON-USER-ID', -- Remplace par ton vrai user_id
    'challenge-100-exercises', 
    'abandoned', -- Statut valide
    5, 
    100, 
    NOW() - INTERVAL '10 days', 
    NOW()
);

-- 5. Vérifier les données finales
SELECT 'Test terminé avec succès' as final_result;
SELECT status, COUNT(*) as count FROM user_challenges GROUP BY status; 