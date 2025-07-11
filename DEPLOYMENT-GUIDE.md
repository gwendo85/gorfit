# 🚀 Guide de Déploiement Vercel - GorFit

## ✅ Prérequis

### 1. Compte Vercel
- Créer un compte sur [vercel.com](https://vercel.com)
- Connecter votre compte GitHub

### 2. Projet GitHub
- ✅ Repository : `https://github.com/gwendo85/gorfit.git`
- ✅ Code poussé et à jour

### 3. Projet Supabase
- ✅ Projet Supabase configuré
- ✅ Base de données initialisée
- ✅ Edge Functions déployées

## 🎯 Déploiement Vercel

### Étape 1 : Importer le Projet

1. **Aller sur Vercel Dashboard**
   - Connectez-vous à [vercel.com/dashboard](https://vercel.com/dashboard)

2. **Importer le Repository**
   - Cliquez sur "New Project"
   - Sélectionnez le repository `gwendo85/gorfit`
   - Cliquez sur "Import"

### Étape 2 : Configuration du Projet

#### Variables d'Environnement
Dans Vercel, ajoutez ces variables d'environnement :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://iawknfrcvfteihmfaqnr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Configuration Vercel
NEXT_PUBLIC_VERCEL_URL=https://your-app.vercel.app
```

#### Configuration du Build
- **Framework Preset** : Next.js
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### Étape 3 : Déploiement

1. **Cliquer sur "Deploy"**
   - Vercel va automatiquement :
     - Installer les dépendances
     - Builder le projet
     - Déployer l'application

2. **Attendre le Build**
   - Durée estimée : 2-3 minutes
   - Surveiller les logs en temps réel

3. **Vérifier le Déploiement**
   - URL générée : `https://your-app.vercel.app`
   - Tester l'application

## 🔧 Configuration Post-Déploiement

### 1. Configuration Supabase

#### Autoriser le Domaine Vercel
1. Aller dans votre projet Supabase
2. **Settings** → **API**
3. Dans "Additional Allowed Origins", ajouter :
   ```
   https://your-app.vercel.app
   ```

#### Vérifier les Edge Functions
```bash
# Déployer les Edge Functions
supabase functions deploy challenge-reminders

# Vérifier le statut
supabase functions list
```

### 2. Configuration des Notifications

#### Email (Optionnel)
Si vous utilisez SendGrid/Postmark :
```env
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_TEMPLATE_ID=your_template_id
```

#### Push Notifications (Optionnel)
Si vous utilisez OneSignal :
```env
ONESIGNAL_APP_ID=your_onesignal_app_id
ONESIGNAL_REST_API_KEY=your_onesignal_key
```

### 3. Configuration des Redirections

#### Vercel.json (Déjà configuré)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "regions": ["cdg1"],
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

## 🧪 Tests Post-Déploiement

### 1. Tests Fonctionnels
- [ ] **Authentification** : Inscription/Connexion
- [ ] **Dashboard** : Affichage des séances
- [ ] **Création de séance** : Formulaire et sauvegarde
- [ ] **Déroulement de séance** : Timer et progression
- [ ] **Challenges** : Interface et interactions
- [ ] **Profil utilisateur** : Données personnelles

### 2. Tests de Performance
- [ ] **Temps de chargement** : < 3 secondes
- [ ] **Responsive design** : Mobile/Desktop
- [ ] **PWA** : Installation possible
- [ ] **SEO** : Meta tags et structure

### 3. Tests de Sécurité
- [ ] **HTTPS** : Certificat SSL actif
- [ ] **Headers de sécurité** : CSP, XSS Protection
- [ ] **Authentification** : RLS Supabase
- [ ] **Variables d'environnement** : Non exposées

## 📊 Monitoring et Analytics

### 1. Vercel Analytics
- Activer Vercel Analytics dans le dashboard
- Surveiller les performances en temps réel
- Analyser les erreurs et les métriques

### 2. Supabase Monitoring
- Surveiller les requêtes de base de données
- Vérifier les Edge Functions
- Analyser les logs d'authentification

### 3. Google Analytics (Optionnel)
```typescript
// Ajouter dans _app.tsx ou layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🔄 Déploiements Automatiques

### Configuration GitHub Actions (Optionnel)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Dépannage

### Erreurs Courantes

#### 1. Build Failed
```bash
# Vérifier les erreurs de build
npm run build

# Vérifier les dépendances
npm install

# Vérifier TypeScript
npx tsc --noEmit
```

#### 2. Variables d'Environnement Manquantes
- Vérifier toutes les variables dans Vercel
- Redéployer après ajout de variables

#### 3. Erreurs Supabase
- Vérifier l'URL et la clé API
- Vérifier les autorisations de domaine
- Tester la connexion Supabase

#### 4. Erreurs de Performance
- Optimiser les images
- Réduire la taille du bundle
- Utiliser le lazy loading

## 🎉 Validation Finale

### Checklist de Déploiement
- [ ] **Code poussé** vers GitHub
- [ ] **Projet importé** dans Vercel
- [ ] **Variables d'environnement** configurées
- [ ] **Build réussi** sans erreurs
- [ ] **Application accessible** via l'URL Vercel
- [ ] **Tests fonctionnels** passés
- [ ] **Supabase configuré** avec le domaine Vercel
- [ ] **Edge Functions** déployées
- [ ] **Monitoring** activé

### URLs Importantes
- **Application** : `https://your-app.vercel.app`
- **Dashboard Vercel** : `https://vercel.com/dashboard`
- **Supabase Dashboard** : `https://supabase.com/dashboard`
- **GitHub Repository** : `https://github.com/gwendo85/gorfit`

## 🚀 Prochaines Étapes

1. **Tests en production** pendant 24-48h
2. **Monitoring des performances**
3. **Optimisations** basées sur les métriques
4. **Ajout de fonctionnalités** selon les retours utilisateurs
5. **Mise à jour continue** via les déploiements automatiques

---

## 🎯 Status : **PRÊT POUR DÉPLOIEMENT !**

Votre application GorFit est maintenant prête pour le déploiement en production sur Vercel. Suivez ce guide étape par étape pour un déploiement réussi ! 🚀 