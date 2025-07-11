#!/bin/bash

# 🚀 Script de Vérification Déploiement GorFit
# Vérifie que tout est prêt pour le déploiement Vercel

echo "🔍 Vérification du déploiement GorFit..."
echo "=========================================="

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les résultats
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

echo ""
echo "📦 Vérification des dépendances..."

# Vérifier Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js installé: $NODE_VERSION"
else
    print_status 1 "Node.js non installé"
fi

# Vérifier npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm installé: $NPM_VERSION"
else
    print_status 1 "npm non installé"
fi

echo ""
echo "🏗️ Vérification du build..."

# Vérifier que le build fonctionne
if npm run build &> /dev/null; then
    print_status 0 "Build Next.js réussi"
else
    print_status 1 "Erreur lors du build"
fi

echo ""
echo "📁 Vérification des fichiers critiques..."

# Vérifier les fichiers essentiels
FILES=(
    "package.json"
    "next.config.ts"
    "vercel.json"
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "src/lib/supabase.ts"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Fichier présent: $file"
    else
        print_status 1 "Fichier manquant: $file"
    fi
done

echo ""
echo "🔧 Vérification de la configuration..."

# Vérifier vercel.json
if [ -f "vercel.json" ]; then
    if grep -q "nextjs" vercel.json; then
        print_status 0 "Configuration Vercel correcte"
    else
        print_status 1 "Configuration Vercel incorrecte"
    fi
else
    print_status 1 "Fichier vercel.json manquant"
fi

# Vérifier package.json
if [ -f "package.json" ]; then
    if grep -q "next" package.json; then
        print_status 0 "Next.js configuré dans package.json"
    else
        print_status 1 "Next.js non configuré"
    fi
else
    print_status 1 "package.json manquant"
fi

echo ""
echo "🌐 Vérification des variables d'environnement..."

# Vérifier env.example
if [ -f "env.example" ]; then
    print_status 0 "Fichier env.example présent"
    echo -e "${YELLOW}⚠️  N'oubliez pas de configurer les variables dans Vercel${NC}"
else
    print_status 1 "Fichier env.example manquant"
fi

echo ""
echo "📊 Vérification des composants..."

# Vérifier les composants principaux
COMPONENTS=(
    "src/components/ChallengesSection.tsx"
    "src/components/AbandonedChallengesSection.tsx"
    "src/components/ChallengeCard.tsx"
    "src/components/Timer.tsx"
    "src/components/ProgressCharts.tsx"
)

for component in "${COMPONENTS[@]}"; do
    if [ -f "$component" ]; then
        print_status 0 "Composant présent: $(basename $component)"
    else
        print_status 1 "Composant manquant: $(basename $component)"
    fi
done

echo ""
echo "🗄️ Vérification des services..."

# Vérifier les services
SERVICES=(
    "src/lib/challengeService.ts"
    "src/lib/reminderService.ts"
    "src/lib/supabase.ts"
)

for service in "${SERVICES[@]}"; do
    if [ -f "$service" ]; then
        print_status 0 "Service présent: $(basename $service)"
    else
        print_status 1 "Service manquant: $(basename $service)"
    fi
done

echo ""
echo "📝 Vérification de la documentation..."

# Vérifier la documentation
DOCS=(
    "README.md"
    "DEPLOYMENT-GUIDE.md"
    "CHALLENGES-FINAL-SUMMARY.md"
    "REMINDER-SYSTEM-README.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        print_status 0 "Documentation présente: $doc"
    else
        print_status 1 "Documentation manquante: $doc"
    fi
done

echo ""
echo "🔍 Vérification Git..."

# Vérifier le statut Git
if git status --porcelain | grep -q .; then
    echo -e "${YELLOW}⚠️  Il y a des modifications non commitées${NC}"
    git status --short
else
    print_status 0 "Tous les changements sont commités"
fi

# Vérifier la branche
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" = "main" ]; then
    print_status 0 "Sur la branche main"
else
    echo -e "${YELLOW}⚠️  Sur la branche: $CURRENT_BRANCH${NC}"
fi

echo ""
echo "🚀 Résumé du déploiement..."

echo ""
echo "📋 Checklist de déploiement Vercel:"
echo "1. ✅ Code poussé vers GitHub"
echo "2. ⏳ Importer le projet dans Vercel"
echo "3. ⏳ Configurer les variables d'environnement"
echo "4. ⏳ Déployer l'application"
echo "5. ⏳ Configurer Supabase avec le domaine Vercel"
echo "6. ⏳ Déployer les Edge Functions"
echo "7. ⏳ Tester l'application"

echo ""
echo "🔗 URLs importantes:"
echo "- GitHub: https://github.com/gwendo85/gorfit"
echo "- Vercel Dashboard: https://vercel.com/dashboard"
echo "- Supabase Dashboard: https://supabase.com/dashboard"

echo ""
echo "🎯 Prochaines étapes:"
echo "1. Aller sur https://vercel.com/dashboard"
echo "2. Cliquer sur 'New Project'"
echo "3. Importer le repository gwendo85/gorfit"
echo "4. Configurer les variables d'environnement"
echo "5. Cliquer sur 'Deploy'"

echo ""
echo -e "${GREEN}🎉 Vérification terminée ! Votre projet est prêt pour le déploiement.${NC}" 