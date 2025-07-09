# 🛠️ Debug - Problème d'Enregistrement GorFit

## 🚨 Problème Identifié

L'erreur d'enregistrement vient du fait que la table `sessions` dans Supabase n'a pas les colonnes nécessaires pour sauvegarder les métriques de la séance terminée.

## ✅ Solution

### 1. Exécuter la Migration

**Ouvre l'éditeur SQL de Supabase** et exécute le fichier `migration-sessions-update.sql` :

```sql
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
```

### 2. Vérifier la Migration

Après exécution, tu devrais voir :
```
Migration sessions terminée avec succès
```

### 3. Tester l'Enregistrement

1. **Crée une séance Mode Rapide**
2. **Termine tous les exercices** (100%)
3. **Clique sur "Oui, enregistrer"** dans le modal
4. **Vérifie la console** pour les logs de debug

## 🔍 Logs de Debug

La fonction `handleSaveSession` affiche maintenant des logs détaillés dans la console :

```
=== DÉBUT ENREGISTREMENT SÉANCE ===
Données utilisateur: { userData: {...}, userError: null, userId: "..." }
Données calculées: { sessionId: "...", totalReps: 120, ... }
Données de mise à jour: { completed: true, volume_estime: 5000, ... }
Résultat Supabase: { data: [...], error: null }
=== ENREGISTREMENT RÉUSSI ===
```

## 🚨 Erreurs Possibles

### Erreur 1: "column does not exist"
**Cause** : Migration non exécutée
**Solution** : Exécuter la migration SQL

### Erreur 2: "permission denied"
**Cause** : Problème de RLS (Row Level Security)
**Solution** : Vérifier que l'utilisateur est authentifié

### Erreur 3: "null value in column"
**Cause** : Valeur manquante dans une colonne requise
**Solution** : Les logs afficheront la valeur problématique

## ✅ Vérification

Après la migration, la table `sessions` devrait avoir ces colonnes :

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'sessions' 
ORDER BY ordinal_position;
```

Résultat attendu :
- `id` (UUID)
- `user_id` (UUID)
- `date` (DATE)
- `notes` (TEXT)
- `objectif` (TEXT)
- `created_at` (TIMESTAMP)
- `completed` (BOOLEAN) ← **NOUVEAU**
- `duration_estimate` (INTEGER) ← **NOUVEAU**
- `volume_estime` (DECIMAL) ← **NOUVEAU**
- `reps_total` (INTEGER) ← **NOUVEAU**
- `type` (TEXT) ← **NOUVEAU**

## 🎯 Test Final

1. **Exécute la migration**
2. **Redémarre l'application** (`pnpm dev`)
3. **Teste l'enregistrement** d'une séance terminée
4. **Vérifie les logs** dans la console
5. **Confirme** que la séance apparaît dans le Dashboard

L'enregistrement devrait maintenant fonctionner correctement ! 🚀 