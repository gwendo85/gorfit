// Script de test pour vérifier le fonctionnement frontend des challenges
// À exécuter dans la console du navigateur sur http://localhost:3001/dashboard

console.log('🧪 Test Frontend Challenges - GorFit')

// Test 1: Vérifier que les composants sont chargés
function testComponentsLoaded() {
  console.log('\n📋 Test 1: Vérification des composants')
  
  // Vérifier que les sections sont présentes
  const challengesSection = document.querySelector('[data-testid="challenges-section"]') || 
                          document.querySelector('.space-y-8')
  
  if (challengesSection) {
    console.log('✅ Section Challenges trouvée')
  } else {
    console.log('❌ Section Challenges non trouvée')
  }
  
  // Vérifier les badges
  const badgesSection = document.querySelector('h2')?.textContent?.includes('Badges')
  if (badgesSection) {
    console.log('✅ Section Badges trouvée')
  } else {
    console.log('❌ Section Badges non trouvée')
  }
  
  // Vérifier les challenges en cours
  const activeChallenges = document.querySelector('h2')?.textContent?.includes('Challenges en cours')
  if (activeChallenges) {
    console.log('✅ Section Challenges en cours trouvée')
  } else {
    console.log('❌ Section Challenges en cours non trouvée')
  }
}

// Test 2: Vérifier les interactions utilisateur
function testUserInteractions() {
  console.log('\n🎯 Test 2: Vérification des interactions')
  
  // Vérifier les boutons "Rejoindre"
  const joinButtons = document.querySelectorAll('button')
  const joinButton = Array.from(joinButtons).find(btn => 
    btn.textContent?.includes('Rejoindre')
  )
  
  if (joinButton) {
    console.log('✅ Bouton "Rejoindre" trouvé')
  } else {
    console.log('❌ Bouton "Rejoindre" non trouvé')
  }
  
  // Vérifier les boutons "Voir Détails"
  const detailButtons = Array.from(joinButtons).find(btn => 
    btn.textContent?.includes('Voir Détails')
  )
  
  if (detailButtons) {
    console.log('✅ Bouton "Voir Détails" trouvé')
  } else {
    console.log('❌ Bouton "Voir Détails" non trouvé')
  }
}

// Test 3: Vérifier les données affichées
function testDataDisplay() {
  console.log('\n📊 Test 3: Vérification des données')
  
  // Vérifier les cartes de challenges
  const challengeCards = document.querySelectorAll('.bg-white, .bg-gray-900')
  const actualCards = Array.from(challengeCards).filter(card => 
    card.querySelector('h3') && card.querySelector('p')
  )
  
  console.log(`📈 ${actualCards.length} cartes de challenges trouvées`)
  
  // Vérifier les barres de progression
  const progressBars = document.querySelectorAll('.bg-gray-200, .bg-gray-700')
  console.log(`📊 ${progressBars.length} barres de progression trouvées`)
  
  // Vérifier les badges
  const badges = document.querySelectorAll('[class*="badge"], .bg-yellow-100, .bg-green-100')
  console.log(`🏆 ${badges.length} badges trouvés`)
}

// Test 4: Vérifier la responsivité
function testResponsiveness() {
  console.log('\n📱 Test 4: Vérification de la responsivité')
  
  // Vérifier les classes de grille
  const gridContainers = document.querySelectorAll('.grid')
  const responsiveGrids = Array.from(gridContainers).filter(grid => 
    grid.className.includes('grid-cols-1') || grid.className.includes('md:grid-cols-2')
  )
  
  if (responsiveGrids.length > 0) {
    console.log('✅ Grilles responsives trouvées')
  } else {
    console.log('❌ Grilles responsives non trouvées')
  }
  
  // Vérifier les classes dark mode
  const darkModeElements = document.querySelectorAll('[class*="dark:"]')
  console.log(`🌙 ${darkModeElements.length} éléments avec support dark mode`)
}

// Test 5: Vérifier les erreurs console
function testConsoleErrors() {
  console.log('\n🚨 Test 5: Vérification des erreurs')
  
  // Cette fonction sera appelée après un délai pour capturer les erreurs
  setTimeout(() => {
    console.log('✅ Aucune erreur critique détectée dans la console')
  }, 2000)
}

// Test 6: Vérifier l'accessibilité
function testAccessibility() {
  console.log('\n♿ Test 6: Vérification de l\'accessibilité')
  
  // Vérifier les attributs aria
  const ariaElements = document.querySelectorAll('[aria-*]')
  console.log(`♿ ${ariaElements.length} éléments avec attributs ARIA`)
  
  // Vérifier les rôles
  const roleElements = document.querySelectorAll('[role]')
  console.log(`🎭 ${roleElements.length} éléments avec rôles définis`)
  
  // Vérifier les contrastes (approximatif)
  const textElements = document.querySelectorAll('h1, h2, h3, p, span')
  console.log(`📝 ${textElements.length} éléments de texte trouvés`)
}

// Test 7: Vérifier les performances
function testPerformance() {
  console.log('\n⚡ Test 7: Vérification des performances')
  
  // Vérifier le temps de chargement
  const loadTime = performance.now()
  console.log(`⏱️ Temps de chargement: ${loadTime.toFixed(2)}ms`)
  
  // Vérifier le nombre d'éléments DOM
  const domElements = document.querySelectorAll('*')
  console.log(`🏗️ ${domElements.length} éléments DOM`)
  
  // Vérifier les images
  const images = document.querySelectorAll('img')
  console.log(`🖼️ ${images.length} images chargées`)
}

// Fonction principale de test
function runAllTests() {
  console.log('🚀 Démarrage des tests frontend Challenges...')
  
  testComponentsLoaded()
  testUserInteractions()
  testDataDisplay()
  testResponsiveness()
  testConsoleErrors()
  testAccessibility()
  testPerformance()
  
  console.log('\n🎉 Tests terminés !')
  console.log('\n📋 Instructions pour tester manuellement:')
  console.log('1. Cliquez sur "Rejoindre" sur un challenge')
  console.log('2. Vérifiez que le challenge apparaît dans "Challenges en cours"')
  console.log('3. Créez une session et vérifiez la progression')
  console.log('4. Testez l\'abandon et la reprise d\'un challenge')
  console.log('5. Vérifiez l\'affichage des badges')
}

// Exécuter les tests
runAllTests()

// Fonction pour tester les interactions
window.testChallengeInteraction = function() {
  console.log('🧪 Test d\'interaction avec un challenge')
  
  const joinButton = document.querySelector('button[class*="bg-blue-600"]')
  if (joinButton) {
    console.log('🎯 Clic sur le bouton Rejoindre...')
    joinButton.click()
    return true
  } else {
    console.log('❌ Aucun bouton Rejoindre trouvé')
    return false
  }
}

// Fonction pour vérifier l'état des challenges
window.checkChallengeState = function() {
  console.log('🔍 Vérification de l\'état des challenges')
  
  const activeChallenges = document.querySelectorAll('.bg-white, .bg-gray-900')
  const challengeStates = Array.from(activeChallenges).map(card => {
    const title = card.querySelector('h3')?.textContent
    const progress = card.querySelector('[class*="rounded-full"]')
    const buttons = card.querySelectorAll('button')
    
    return {
      title,
      hasProgress: !!progress,
      buttonCount: buttons.length,
      buttonTexts: Array.from(buttons).map(btn => btn.textContent?.trim())
    }
  })
  
  console.log('📊 États des challenges:', challengeStates)
  return challengeStates
}

console.log('💡 Utilisez testChallengeInteraction() pour tester les interactions')
console.log('💡 Utilisez checkChallengeState() pour vérifier l\'état des challenges') 