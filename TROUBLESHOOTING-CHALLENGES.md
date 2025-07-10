# 🔧 Dépannage - Challenges & Défis

## 🚨 Problème: Je ne vois pas les fonctionnalités Challenges

### Étape 1: Vérifier l'authentification
**Problème:** Vous devez être connecté pour voir les challenges

**Solution:**
1. Allez sur http://localhost:3000
2. Connectez-vous avec votre compte
3. Vérifiez que vous êtes bien connecté (pas de bouton "Se connecter")

### Étape 2: Vérifier l'onglet
**Problème:** L'onglet "Challenges & Défis" n'est pas visible

**Solution:**
1. Allez dans le dashboard
2. Cherchez l'onglet "Challenges & Défis" (icône 🏆)
3. Cliquez dessus pour l'activer

### Étape 3: Vérifier la console
**Problème:** Erreurs JavaScript

**Solution:**
1. Ouvrez la console (F12)
2. Vérifiez s'il y a des erreurs rouges
3. Si oui, copiez-les et partagez-les

### Étape 4: Recharger la page
**Problème:** Données non chargées

**Solution:**
1. Rechargez la page (Ctrl+R)
2. Attendez le chargement complet
3. Cliquez à nouveau sur l'onglet Challenges

---

## 🔍 Diagnostic Rapide

### Test 1: Vérifier l'URL
```
✅ Bonne URL: http://localhost:3000/dashboard
❌ Mauvaise URL: http://localhost:3000 (page d'accueil)
```

### Test 2: Vérifier l'authentification
```
✅ Connecté: Bouton "Déconnexion" visible
❌ Non connecté: Bouton "Se connecter" visible
```

### Test 3: Vérifier les onglets
```
✅ Onglets visibles: Planning, Statistiques, Progression, Challenges & Défis
❌ Onglets manquants: Problème de chargement
```

### Test 4: Vérifier le contenu
```
✅ Contenu Challenges: Sections "Mes Badges", "Challenges en cours", etc.
❌ Page vide: Problème de données ou d'authentification
```

---

## 🛠️ Solutions par Problème

### Problème: "Page blanche"
**Cause:** Erreur JavaScript
**Solution:**
```bash
# Redémarrer le serveur
Ctrl+C
cd gorfit
pnpm dev
```

### Problème: "Erreur de base de données"
**Cause:** Problème Supabase
**Solution:**
1. Vérifier la connexion internet
2. Vérifier les variables d'environnement
3. Redémarrer l'application

### Problème: "Onglet non visible"
**Cause:** Problème de rendu
**Solution:**
1. Vider le cache du navigateur
2. Recharger la page
3. Vérifier la console pour les erreurs

### Problème: "Pas de challenges affichés"
**Cause:** Aucun challenge créé
**Solution:**
1. Vérifier que les données de test sont insérées
2. Exécuter le script SQL de test
3. Vérifier les politiques RLS

---

## 📋 Checklist de Vérification

### ✅ Avant de tester les Challenges
- [ ] Serveur démarré sur http://localhost:3000
- [ ] Utilisateur connecté
- [ ] Dashboard accessible
- [ ] Onglets visibles
- [ ] Pas d'erreurs dans la console

### ✅ Test des Challenges
- [ ] Onglet "Challenges & Défis" cliquable
- [ ] Section "Mes Badges" visible
- [ ] Section "Challenges en cours" visible
- [ ] Section "Nouveaux Challenges" visible
- [ ] Boutons "Rejoindre" fonctionnels

### ✅ Test des Interactions
- [ ] Cliquer sur "Rejoindre" un challenge
- [ ] Vérifier que le challenge apparaît dans "Challenges en cours"
- [ ] Créer une session pour tester la progression
- [ ] Vérifier les barres de progression
- [ ] Tester l'abandon et la reprise

---

## 🆘 En cas de problème persistant

### 1. Vérifier les logs
```bash
# Dans le terminal où le serveur tourne
# Vérifier les erreurs de compilation
```

### 2. Vérifier la base de données
```sql
-- Dans Supabase SQL Editor
SELECT * FROM challenges;
SELECT * FROM user_challenges;
```

### 3. Vérifier les composants
```bash
# Vérifier que les fichiers existent
ls src/components/ChallengesSection.tsx
ls src/lib/challengeService.ts
```

### 4. Reinstaller les dépendances
```bash
rm -rf node_modules
pnpm install
pnpm dev
```

---

## 📞 Support

Si le problème persiste :
1. **Copiez les erreurs de la console**
2. **Décrivez ce que vous voyez**
3. **Indiquez votre navigateur et OS**
4. **Partagez les logs du serveur**

---

**Status:** Guide de dépannage créé
**Version:** 2.1.0
**Dernière mise à jour:** $(date) 