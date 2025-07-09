# Guide des Migrations - Fonction Parcours GorFit

## Problème Résolu

L'erreur `exercise_templates_exercise_type_check` était causée par l'utilisation de valeurs non autorisées pour `exercise_type`. La contrainte n'accepte que :
- `'Poids du corps'`
- `'Charges externes'`

Mais nous essayions d'insérer `'Cardio'` qui n'était pas autorisé.

## Scripts de Migration Corrigés

### 1. Migration Semaine 1 Complète
**Fichier :** `migration-semaine-1-complete.sql`
- ✅ Toutes les valeurs `exercise_type` corrigées
- ✅ 4 séances par parcours pour la semaine 1
- ✅ Exercices avec progression logique des charges
- ✅ Respect des contraintes SQL

### 2. Migration Semaine 2 Complète  
**Fichier :** `migration-semaine-2-complete.sql`
- ✅ Toutes les valeurs `exercise_type` corrigées
- ✅ 4 séances par parcours pour la semaine 2
- ✅ Progression des charges (+10% pour Hypertrophie, +5% pour Force, +15% pour Shape)
- ✅ Respect des contraintes SQL

### 3. Migration Complète All Sessions Fixed
**Fichier :** `migration-complete-all-sessions-fixed.sql`
- ✅ Script combiné pour les semaines 1-2
- ✅ Toutes les valeurs corrigées
- ✅ Fonctions de prévention des doublons

### 4. Correction Durée Parcours
**Fichier :** `migration-fix-program-duration.sql`
- ✅ Met tous les parcours à 5 semaines
- ✅ Corrige l'incohérence de durée

## Ordre d'Exécution

1. **Exécuter la correction de durée :**
   ```sql
   -- Dans Supabase SQL Editor
   -- Copier-coller le contenu de migration-fix-program-duration.sql
   ```

2. **Exécuter les migrations de contenu :**
   ```sql
   -- Dans Supabase SQL Editor
   -- Copier-coller le contenu de migration-complete-all-sessions-fixed.sql
   ```

3. **Vérifier les résultats :**
   ```sql
   -- Vérification finale
   SELECT 
     p.name as program_name,
     p.duration_weeks,
     COUNT(DISTINCT st.week_number) as weeks_with_sessions,
     COUNT(st.*) as total_sessions,
     COUNT(et.*) as total_exercises
   FROM workout_programs p
   LEFT JOIN session_templates st ON p.id = st.program_id
   LEFT JOIN exercise_templates et ON p.id = et.program_id
   WHERE p.name IN ('Hypertrophie Pro Max', 'Force & Powerlifting', 'Shape Bikini', 'Cross Training Intense')
   GROUP BY p.id, p.name, p.duration_weeks
   ORDER BY p.name;
   ```

## Résultats Attendus

Après exécution, chaque parcours aura :
- ✅ **5 semaines** de durée
- ✅ **4 séances** par semaine (semaines 1-2)
- ✅ **Exercices complets** avec progression logique
- ✅ **Cohérence** entre tous les parcours
- ✅ **Respect des contraintes** SQL

## Vérification

Pour vérifier que tout fonctionne :
1. Aller sur `/programs` dans l'application
2. Sélectionner un parcours
3. Vérifier que les semaines 1-2 ont des séances
4. Vérifier que chaque séance a des exercices

## Notes Techniques

- Les fonctions `insert_session_template_if_not_exists` et `insert_exercise_template_if_not_exists` évitent les doublons
- La progression des charges est cohérente entre les semaines
- Tous les exercices cardio utilisent maintenant `'Poids du corps'` au lieu de `'Cardio'`
- Les contraintes SQL sont respectées 