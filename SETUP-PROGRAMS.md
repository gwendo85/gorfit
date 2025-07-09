# 🏆 Configuration des Parcours GorFit

## 📋 Prérequis

1. **Supabase configuré** avec les variables d'environnement
2. **Accès admin** à la base de données Supabase
3. **Node.js** installé pour exécuter les scripts

## 🚀 Méthode 1 : Via l'interface Supabase (Recommandée)

### 1. Aller dans l'interface Supabase
- Ouvrir ton projet Supabase
- Aller dans **SQL Editor**

### 2. Exécuter le script SQL
Copier et coller le contenu de `scripts/setup-programs.sql` dans l'éditeur SQL et exécuter.

### 3. Vérifier les tables créées
- Aller dans **Table Editor**
- Vérifier que les tables `workout_programs` et `user_programs` existent
- Vérifier que les 5 parcours sont présents dans `workout_programs`

## 🛠️ Méthode 2 : Via script Node.js

### 1. Configurer les variables d'environnement
```bash
export NEXT_PUBLIC_SUPABASE_URL="ton-url-supabase"
export SUPABASE_SERVICE_ROLE_KEY="ton-service-role-key"
```

### 2. Exécuter le script
```bash
cd gorfit
node scripts/setup-programs.js
```

## ✅ Vérification

### 1. Tester l'application
- Aller sur `http://localhost:3000/programs`
- Vérifier que les 5 parcours s'affichent
- Tester le démarrage d'un parcours

### 2. Vérifier les données
```sql
-- Vérifier les parcours
SELECT * FROM workout_programs;

-- Vérifier les politiques RLS
SELECT * FROM pg_policies WHERE tablename = 'workout_programs';
```

## 🔧 Dépannage

### Erreur "Table doesn't exist"
- Vérifier que le script SQL a bien été exécuté
- Vérifier les permissions dans Supabase

### Erreur "RLS policy"
- Vérifier que les politiques RLS sont créées
- Vérifier que l'authentification fonctionne

### Parcours ne s'affichent pas
- Vérifier la console du navigateur pour les erreurs
- Vérifier les logs de l'application
- Tester avec les données de test intégrées

## 📊 Structure des données

### Table `workout_programs`
```sql
id: UUID (clé primaire)
name: VARCHAR (nom du parcours)
objective: VARCHAR (objectif)
duration_weeks: INTEGER (durée en semaines)
sessions_per_week: INTEGER (séances par semaine)
description: TEXT (description détaillée)
image_url: VARCHAR (URL de l'image)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

### Table `user_programs`
```sql
id: UUID (clé primaire)
user_id: UUID (référence auth.users)
program_id: UUID (référence workout_programs)
started_at: TIMESTAMP
completed_at: TIMESTAMP (nullable)
current_week: INTEGER
current_session: INTEGER
total_sessions_completed: INTEGER
```

### Modifications de `sessions`
```sql
program_id: UUID (référence workout_programs, nullable)
program_week: INTEGER (semaine dans le programme)
program_session: INTEGER (séance dans la semaine)
```

## 🎯 Parcours disponibles

1. **💪 Prise de Masse Power** (4 semaines, 4 séances/semaine)
2. **🔥 Full Body Summer** (3 semaines, 3 séances/semaine)
3. **🍃 Sèche Définition** (3 semaines, 4 séances/semaine)
4. **🍑 Spécial Fessiers** (4 semaines, 3 séances/semaine)
5. **⚔️ Gladiateur Intensif** (5 semaines, 5 séances/semaine)

## 🔒 Sécurité

- **RLS activé** sur toutes les tables
- **Politiques restrictives** pour `user_programs`
- **Lecture publique** pour `workout_programs`
- **Accès utilisateur** uniquement à ses propres données

## 🚀 Prochaines étapes

1. **Tester** tous les parcours
2. **Personnaliser** les descriptions si besoin
3. **Ajouter** de nouveaux parcours via l'interface Supabase
4. **Optimiser** les performances si nécessaire 