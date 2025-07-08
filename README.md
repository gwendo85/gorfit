# 🏋️ GorFit - Application de Musculation Professionnelle

Une application complète de musculation pour planifier, suivre et analyser vos séances d'entraînement. Remplaçant Excel et les notes dispersées par une solution moderne et motivante.

## ✨ Fonctionnalités

### 📊 Dashboard
- **Création de séances** avec date, objectifs et exercices
- **Liste des séances passées** avec statistiques
- **Progression hebdomadaire** avec graphiques interactifs
- **Statistiques globales** : volume total, répétitions, streak de jours actifs

### 🏃‍♂️ Déroulement de Séance
- **Gestion des exercices** : nom, séries, reps, poids, notes
- **Timer de pause** paramétrable avec alertes sonores
- **Suivi en temps réel** des exercices complétés
- **Modification possible** en cours de séance

### 🔐 Authentification
- **Inscription/Connexion** sécurisée avec Supabase
- **Profils utilisateurs** personnalisés
- **Sécurité RLS** (Row Level Security)

## 🛠️ Stack Technique

- **Frontend** : Next.js 14 (App Router), React 18, TypeScript
- **Styling** : Tailwind CSS
- **Backend** : Supabase (PostgreSQL, Auth, RLS)
- **Formulaires** : React Hook Form + Zod
- **Graphiques** : Recharts
- **Notifications** : React Hot Toast
- **Icônes** : Lucide React
- **Dates** : date-fns

## 📦 Installation

### 1. Cloner le projet
```bash
git clone <votre-repo>
cd gorfit
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration Supabase

#### A. Créer un projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre `URL` et `anon key`

#### B. Initialiser la base de données
1. Dans votre projet Supabase, allez dans **SQL Editor**
2. Copiez et exécutez le contenu du fichier `supabase-schema.sql`

#### C. Configurer les variables d'environnement
1. Copiez le fichier `env.example` vers `.env.local`
```bash
cp env.example .env.local
```

2. Remplissez les variables dans `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 🗂️ Structure du Projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── auth/              # Page d'authentification
│   ├── dashboard/         # Dashboard principal
│   ├── session/[id]/      # Déroulement de séance
│   ├── globals.css        # Styles globaux
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Page d'accueil
├── components/            # Composants React
│   ├── CreateSessionForm.tsx
│   ├── ProgressCharts.tsx
│   └── Timer.tsx
├── lib/                   # Utilitaires et configuration
│   ├── supabase.ts        # Configuration Supabase
│   ├── utils.ts           # Fonctions utilitaires
│   └── validations.ts     # Schémas Zod
└── types/                 # Types TypeScript
    └── index.ts
```

## 🚀 Déploiement sur Vercel

### 1. Préparer le projet
```bash
# Vérifier que tout fonctionne localement
npm run build
```

### 2. Déployer sur Vercel
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement dans Vercel :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Déployez !

### 3. Configuration finale
- Vérifiez que votre domaine Supabase autorise votre domaine Vercel
- Testez l'authentification et les fonctionnalités

## 📱 Utilisation

### Première connexion
1. Accédez à l'application
2. Créez un compte avec email/mot de passe
3. Vérifiez votre email (optionnel selon la config Supabase)

### Créer une séance
1. Cliquez sur "Créer une séance"
2. Remplissez la date et l'objectif
3. Ajoutez vos exercices (nom, séries, reps, poids)
4. Sauvegardez la séance

### Suivre une séance
1. Cliquez sur une séance dans le dashboard
2. Utilisez le timer pour les pauses (90s par défaut)
3. Marquez les exercices comme terminés
4. Suivez votre progression en temps réel

### Analyser sa progression
- Consultez les graphiques hebdomadaires
- Suivez votre streak de jours actifs
- Analysez le volume total soulevé

## 🔧 Configuration Avancée

### Personnaliser le timer
Modifiez la durée par défaut dans `src/app/session/[id]/page.tsx` :
```typescript
<TimerComponent duration={90} onComplete={nextExercise} />
```

### Ajouter des objectifs
Modifiez les options dans `src/components/CreateSessionForm.tsx` :
```typescript
<option value="force">Force</option>
<option value="musculation">Musculation</option>
// Ajoutez vos objectifs...
```

### Personnaliser les couleurs
Modifiez les classes Tailwind dans les composants selon vos préférences.

## 🐛 Dépannage

### Erreurs courantes

**"Supabase not configured"**
- Vérifiez vos variables d'environnement
- Redémarrez le serveur de développement

**"Authentication failed"**
- Vérifiez que RLS est activé dans Supabase
- Vérifiez les politiques de sécurité

**"Build failed on Vercel"**
- Vérifiez que toutes les variables d'environnement sont configurées
- Vérifiez la compatibilité Node.js (18+ recommandé)

### Logs de débogage
```bash
# Mode développement avec logs détaillés
npm run dev

# Vérifier les erreurs de build
npm run build
```

## 📈 Fonctionnalités Futures

- [ ] Export des données en PDF/Excel
- [ ] Partage de séances entre utilisateurs
- [ ] Notifications push pour les rappels
- [ ] Intégration avec des trackers de fitness
- [ ] Mode sombre
- [ ] Application mobile (PWA)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation Supabase
- Vérifiez les logs de la console

---

**GorFit** - Transformez votre entraînement en données ! 💪
# laye
