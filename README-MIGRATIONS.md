# 📋 GUIDE DES MIGRATIONS GORFIT

## 🎯 **OBJECTIF**
Corriger et compléter la fonction parcours pour que chaque parcours contienne 5 semaines, chaque semaine des séances, et chaque séance des exercices.

## 📁 **FICHIERS DE MIGRATION CRÉÉS**

### 1. **migration-create-session-templates.sql**
- ✅ Crée la table `session_templates` manquante
- ✅ Configure les index et politiques RLS
- ⚠️ **À EXÉCUTER EN PREMIER**

### 2. **migration-update-programs-5-weeks.sql**
- ✅ Corrige la durée de tous les parcours à 5 semaines
- ✅ Vérifie les mises à jour
- ⚠️ **À EXÉCUTER EN DEUXIÈME**

### 3. **migration-semaine-1-complete.sql**
- ✅ Crée toutes les séances de la semaine 1 (4 séances × 5 parcours = 20 séances)
- ✅ Crée tous les exercices templates de la semaine 1 (~80 exercices)
- ✅ Progression logique des charges adaptée à chaque parcours

### 4. **migration-semaine-2-complete.sql**
- ✅ Crée toutes les séances de la semaine 2 (4 séances × 5 parcours = 20 séances)
- ✅ Crée tous les exercices templates de la semaine 2 (~80 exercices)
- ✅ Progression des charges : +10% (Hypertrophie), +5% (Force), +15% (Shape), +10% (Cross)

## 🚀 **ORDRE D'EXÉCUTION**

### **Étape 1 : Préparation**
```sql
-- Exécuter dans Supabase SQL Editor
-- 1. Créer la table manquante
-- Copier-coller le contenu de migration-create-session-templates.sql
```

### **Étape 2 : Correction des parcours**
```sql
-- 2. Corriger la durée des parcours
-- Copier-coller le contenu de migration-update-programs-5-weeks.sql
```

### **Étape 3 : Semaine 1**
```sql
-- 3. Créer les séances et exercices semaine 1
-- Copier-coller le contenu de migration-semaine-1-complete.sql
```

### **Étape 4 : Semaine 2**
```sql
-- 4. Créer les séances et exercices semaine 2
-- Copier-coller le contenu de migration-semaine-2-complete.sql
```

## 📊 **RÉSULTATS ATTENDUS**

### **Parcours (5 total)**
- ✅ Tous les parcours auront 5 semaines
- ✅ Durée cohérente pour tous les utilisateurs

### **Séances par semaine**
- Semaine 1 : 20 séances templates
- Semaine 2 : 20 séances templates
- Semaines 3-5 : Déjà existantes (60 séances)
- **Total : 100 séances templates**

### **Exercices par semaine**
- Semaine 1 : ~80 exercices templates
- Semaine 2 : ~80 exercices templates
- Semaines 3-5 : ~229 exercices templates
- **Total : ~389 exercices templates**

## 🔄 **PROGRESSION DES CHARGES**

### **Hypertrophie Pro Max**
- Semaine 1 : Charges de base
- Semaine 2 : +10% charges
- Semaines 3-5 : Progression continue

### **Force & Powerlifting**
- Semaine 1 : Charges de base
- Semaine 2 : +5% charges
- Semaines 3-5 : Progression continue

### **Shape Bikini**
- Semaine 1 : Charges de base
- Semaine 2 : +15% charges
- Semaines 3-5 : Progression continue

### **Cross Training Intense**
- Semaine 1 : Intensité de base
- Semaine 2 : +10% charges/intensité
- Semaines 3-5 : Progression continue

## ✅ **VÉRIFICATIONS POST-MIGRATION**

```sql
-- Vérifier les parcours
SELECT name, duration_weeks, sessions_per_week FROM workout_programs;

-- Vérifier les séances par semaine
SELECT week_number, COUNT(*) as sessions_count 
FROM session_templates 
GROUP BY week_number 
ORDER BY week_number;

-- Vérifier les exercices par semaine
SELECT week_number, COUNT(*) as exercises_count 
FROM exercise_templates 
GROUP BY week_number 
ORDER BY week_number;
```

## 🎯 **OBJECTIFS ATTEINTS**

- ✅ **5 semaines par parcours** : Tous les parcours auront 5 semaines
- ✅ **Séances complètes** : Chaque semaine aura ses séances
- ✅ **Exercices complets** : Chaque séance aura ses exercices
- ✅ **Progression logique** : Charges progressives entre semaines
- ✅ **Cohérence** : Structure uniforme pour tous les parcours

## 🚨 **POINTS D'ATTENTION**

1. **Exécuter dans l'ordre** : Les migrations doivent être exécutées dans l'ordre indiqué
2. **Vérifier les résultats** : Utiliser les requêtes de vérification
3. **Tester l'application** : Vérifier que la génération automatique fonctionne
4. **Backup** : Faire un backup avant d'exécuter les migrations

## 📈 **STATISTIQUES FINALES**

| Métrique | Avant | Après | Statut |
|----------|-------|-------|--------|
| Parcours 5 semaines | 20% | 100% | ✅ |
| Séances templates | 60 | 100 | ✅ |
| Exercices templates | ~229 | ~389 | ✅ |
| Progression charges | Partielle | Complète | ✅ |
| Cohérence structure | Non | Oui | ✅ | 