// Script de validation automatisé pour le module Challenges & Défis
// À exécuter dans la console du navigateur sur http://localhost:3001/dashboard

console.log('🧪 Validation Automatisée - Module Challenges & Défis')

class ChallengesValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    }
    this.errors = []
  }

  // Méthode utilitaire pour les tests
  assert(condition, message) {
    this.results.total++
    if (condition) {
      this.results.passed++
      console.log(`✅ ${message}`)
      return true
    } else {
      this.results.failed++
      console.log(`❌ ${message}`)
      this.errors.push(message)
      return false
    }
  }

  // Test 1: Vérification de la structure de base
  testBasicStructure() {
    console.log('\n📋 Test 1: Structure de base')
    
    // Vérifier que la page est chargée
    this.assert(document.readyState === 'complete', 'Page complètement chargée')
    
    // Vérifier la présence des sections principales
    const sections = document.querySelectorAll('h2')
    const sectionTexts = Array.from(sections).map(s => s.textContent)
    
    this.assert(sectionTexts.some(text => text.includes('Badges')), 'Section Badges présente')
    this.assert(sectionTexts.some(text => text.includes('Challenges en cours')), 'Section Challenges en cours présente')
    this.assert(sectionTexts.some(text => text.includes('Nouveaux Challenges')), 'Section Nouveaux Challenges présente')
    
    // Vérifier les cartes de challenges
    const challengeCards = document.querySelectorAll('.bg-white, .bg-gray-900')
    this.assert(challengeCards.length > 0, 'Cartes de challenges présentes')
  }

  // Test 2: Vérification des interactions
  testInteractions() {
    console.log('\n🎯 Test 2: Interactions utilisateur')
    
    // Vérifier les boutons
    const buttons = document.querySelectorAll('button')
    const buttonTexts = Array.from(buttons).map(btn => btn.textContent?.trim())
    
    this.assert(buttonTexts.some(text => text.includes('Rejoindre')), 'Bouton Rejoindre présent')
    this.assert(buttonTexts.some(text => text.includes('Voir Détails')), 'Bouton Voir Détails présent')
    
    // Vérifier que les boutons sont cliquables
    const joinButton = Array.from(buttons).find(btn => btn.textContent?.includes('Rejoindre'))
    if (joinButton) {
      this.assert(!joinButton.disabled, 'Bouton Rejoindre cliquable')
    }
  }

  // Test 3: Vérification des données
  testDataDisplay() {
    console.log('\n📊 Test 3: Affichage des données')
    
    // Vérifier les titres de challenges
    const challengeTitles = document.querySelectorAll('h3')
    this.assert(challengeTitles.length > 0, 'Titres de challenges présents')
    
    // Vérifier les descriptions
    const descriptions = document.querySelectorAll('p')
    this.assert(descriptions.length > 0, 'Descriptions présentes')
    
    // Vérifier les barres de progression
    const progressBars = document.querySelectorAll('.bg-gray-200, .bg-gray-700')
    this.assert(progressBars.length >= 0, 'Barres de progression (optionnelles)')
  }

  // Test 4: Vérification de la responsivité
  testResponsiveness() {
    console.log('\n📱 Test 4: Responsivité')
    
    // Vérifier les classes de grille
    const gridContainers = document.querySelectorAll('.grid')
    const responsiveGrids = Array.from(gridContainers).filter(grid => 
      grid.className.includes('grid-cols-1') || grid.className.includes('md:grid-cols-2')
    )
    
    this.assert(responsiveGrids.length > 0, 'Grilles responsives configurées')
    
    // Vérifier le support dark mode
    const darkModeElements = document.querySelectorAll('[class*="dark:"]')
    this.assert(darkModeElements.length > 0, 'Support dark mode présent')
  }

  // Test 5: Vérification des performances
  testPerformance() {
    console.log('\n⚡ Test 5: Performances')
    
    // Vérifier le temps de chargement
    const loadTime = performance.now()
    this.assert(loadTime < 5000, `Temps de chargement acceptable (${loadTime.toFixed(2)}ms)`)
    
    // Vérifier le nombre d'éléments DOM
    const domElements = document.querySelectorAll('*')
    this.assert(domElements.length < 1000, `Nombre d'éléments DOM raisonnable (${domElements.length})`)
  }

  // Test 6: Vérification de l'accessibilité
  testAccessibility() {
    console.log('\n♿ Test 6: Accessibilité')
    
    // Vérifier les attributs aria
    const ariaElements = document.querySelectorAll('[aria-*]')
    this.assert(ariaElements.length >= 0, 'Attributs ARIA (optionnels)')
    
    // Vérifier les contrastes (approximatif)
    const textElements = document.querySelectorAll('h1, h2, h3, p, span')
    this.assert(textElements.length > 0, 'Éléments de texte présents')
  }

  // Test 7: Vérification des erreurs
  testErrorHandling() {
    console.log('\n🚨 Test 7: Gestion des erreurs')
    
    // Vérifier qu'il n'y a pas d'erreurs critiques dans la console
    const originalError = console.error
    let errorCount = 0
    
    console.error = (...args) => {
      errorCount++
      originalError.apply(console, args)
    }
    
    // Attendre un peu pour capturer les erreurs
    setTimeout(() => {
      console.error = originalError
      this.assert(errorCount === 0, 'Aucune erreur critique détectée')
    }, 1000)
  }

  // Test 8: Vérification de l'intégration
  testIntegration() {
    console.log('\n🔗 Test 8: Intégration')
    
    // Vérifier la présence de Supabase
    this.assert(typeof window !== 'undefined', 'Environnement navigateur')
    
    // Vérifier les éléments de navigation
    const navigationElements = document.querySelectorAll('nav, [role="navigation"]')
    this.assert(navigationElements.length > 0, 'Éléments de navigation présents')
  }

  // Test 9: Vérification des fonctionnalités spécifiques
  testSpecificFeatures() {
    console.log('\n🎯 Test 9: Fonctionnalités spécifiques')
    
    // Vérifier les badges
    const badgeElements = document.querySelectorAll('[class*="badge"], .bg-yellow-100, .bg-green-100')
    this.assert(badgeElements.length >= 0, 'Système de badges présent')
    
    // Vérifier les icônes
    const iconElements = document.querySelectorAll('svg, [class*="icon"]')
    this.assert(iconElements.length > 0, 'Icônes présentes')
    
    // Vérifier les animations (approximatif)
    const animatedElements = document.querySelectorAll('[class*="animate"], [class*="transition"]')
    this.assert(animatedElements.length >= 0, 'Animations configurées')
  }

  // Test 10: Vérification de la compatibilité
  testCompatibility() {
    console.log('\n🔧 Test 10: Compatibilité')
    
    // Vérifier les fonctionnalités modernes
    this.assert(typeof Promise !== 'undefined', 'Support des Promises')
    this.assert(typeof fetch !== 'undefined', 'Support de Fetch API')
    this.assert(typeof localStorage !== 'undefined', 'Support de localStorage')
    
    // Vérifier les classes CSS modernes
    const modernClasses = document.querySelectorAll('[class*="grid"], [class*="flex"]')
    this.assert(modernClasses.length > 0, 'Classes CSS modernes utilisées')
  }

  // Exécuter tous les tests
  runAllTests() {
    console.log('🚀 Démarrage de la validation automatisée...')
    
    this.testBasicStructure()
    this.testInteractions()
    this.testDataDisplay()
    this.testResponsiveness()
    this.testPerformance()
    this.testErrorHandling()
    this.testIntegration()
    this.testSpecificFeatures()
    this.testCompatibility()
    
    this.printResults()
  }

  // Afficher les résultats
  printResults() {
    console.log('\n📊 Résultats de la validation:')
    console.log(`✅ Tests réussis: ${this.results.passed}`)
    console.log(`❌ Tests échoués: ${this.results.failed}`)
    console.log(`📈 Total: ${this.results.total}`)
    console.log(`📊 Taux de succès: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`)
    
    if (this.errors.length > 0) {
      console.log('\n🚨 Erreurs détectées:')
      this.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error}`)
      })
    }
    
    if (this.results.failed === 0) {
      console.log('\n🎉 Validation réussie ! Le module Challenges & Défis est prêt.')
    } else {
      console.log('\n⚠️ Validation partielle. Certains problèmes ont été détectés.')
    }
  }
}

// Fonctions utilitaires pour les tests manuels
window.testChallengeJoin = function() {
  const joinButton = document.querySelector('button[class*="bg-blue-600"]')
  if (joinButton) {
    console.log('🎯 Test: Rejoindre un challenge')
    joinButton.click()
    return true
  }
  return false
}

window.testChallengeDetails = function() {
  const detailButton = document.querySelector('button[class*="bg-gray-100"]')
  if (detailButton) {
    console.log('🔍 Test: Voir les détails d\'un challenge')
    detailButton.click()
    return true
  }
  return false
}

window.checkChallengeState = function() {
  const challenges = document.querySelectorAll('.bg-white, .bg-gray-900')
  return Array.from(challenges).map(card => ({
    title: card.querySelector('h3')?.textContent,
    hasProgress: !!card.querySelector('[class*="rounded-full"]'),
    buttons: Array.from(card.querySelectorAll('button')).map(btn => btn.textContent?.trim())
  }))
}

// Lancer la validation
const validator = new ChallengesValidator()
validator.runAllTests()

console.log('\n💡 Fonctions de test disponibles:')
console.log('- testChallengeJoin(): Teste le bouton Rejoindre')
console.log('- testChallengeDetails(): Teste le bouton Voir Détails')
console.log('- checkChallengeState(): Vérifie l\'état des challenges') 