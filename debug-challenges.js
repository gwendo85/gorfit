// Script de diagnostic pour les Challenges
// À exécuter dans la console du navigateur sur http://localhost:3000/dashboard

console.log('🔍 Diagnostic Challenges & Défis')

// 1. Vérifier si on est sur la bonne page
console.log('📍 Page actuelle:', window.location.href)

// 2. Vérifier si on est connecté
const checkAuth = () => {
  // Vérifier les éléments d'authentification
  const authElements = document.querySelectorAll('[class*="auth"], [class*="login"], [class*="signin"]')
  console.log('🔐 Éléments d\'auth trouvés:', authElements.length)
  
  // Vérifier s'il y a un bouton de déconnexion (signe qu'on est connecté)
  const logoutButton = document.querySelector('button[onclick*="logout"], button[onclick*="signout"]')
  console.log('🚪 Bouton déconnexion trouvé:', !!logoutButton)
  
  return !!logoutButton
}

// 3. Vérifier les onglets
const checkTabs = () => {
  const tabs = document.querySelectorAll('[role="tab"], .tab, button[class*="tab"]')
  console.log('📑 Onglets trouvés:', tabs.length)
  
  tabs.forEach((tab, index) => {
    console.log(`  ${index + 1}. ${tab.textContent?.trim()}`)
  })
  
  // Chercher spécifiquement l'onglet Challenges
  const challengesTab = Array.from(tabs).find(tab => 
    tab.textContent?.includes('Challenges') || 
    tab.textContent?.includes('Défis')
  )
  
  console.log('🏆 Onglet Challenges trouvé:', !!challengesTab)
  return challengesTab
}

// 4. Vérifier le contenu des challenges
const checkChallengesContent = () => {
  // Chercher les sections de challenges
  const challengeSections = document.querySelectorAll('h2, h3')
  const challengeElements = Array.from(challengeSections).filter(el => 
    el.textContent?.includes('Challenge') ||
    el.textContent?.includes('Badge') ||
    el.textContent?.includes('Défi')
  )
  
  console.log('🎯 Sections Challenges trouvées:', challengeElements.length)
  challengeElements.forEach((el, index) => {
    console.log(`  ${index + 1}. ${el.textContent?.trim()}`)
  })
  
  return challengeElements.length > 0
}

// 5. Vérifier les erreurs console
const checkErrors = () => {
  console.log('🚨 Vérification des erreurs...')
  // Les erreurs seront visibles dans la console
}

// 6. Vérifier l'état de l'onglet actuel
const checkCurrentTab = () => {
  const activeTab = document.querySelector('[aria-selected="true"], .active, [class*="active"]')
  console.log('📌 Onglet actuel:', activeTab?.textContent?.trim())
  
  // Vérifier le contenu de l'onglet actuel
  const tabContent = document.querySelector('[role="tabpanel"], .tab-content, [class*="content"]')
  console.log('📄 Contenu de l\'onglet:', tabContent?.textContent?.substring(0, 100) + '...')
}

// 7. Fonction pour cliquer sur l'onglet Challenges
const clickChallengesTab = () => {
  const tabs = document.querySelectorAll('[role="tab"], .tab, button[class*="tab"]')
  const challengesTab = Array.from(tabs).find(tab => 
    tab.textContent?.includes('Challenges') || 
    tab.textContent?.includes('Défis')
  )
  
  if (challengesTab) {
    console.log('🖱️ Clic sur l\'onglet Challenges...')
    challengesTab.click()
    return true
  } else {
    console.log('❌ Onglet Challenges non trouvé')
    return false
  }
}

// 8. Fonction pour forcer le rechargement des challenges
const reloadChallenges = () => {
  console.log('🔄 Rechargement de la page...')
  window.location.reload()
}

// Exécuter le diagnostic
console.log('\n🔍 Démarrage du diagnostic...')

const isAuthenticated = checkAuth()
console.log('✅ Authentifié:', isAuthenticated)

const challengesTab = checkTabs()
checkCurrentTab()
checkChallengesContent()
checkErrors()

console.log('\n💡 Instructions:')
console.log('1. Si vous n\'êtes pas connecté, connectez-vous d\'abord')
console.log('2. Cliquez sur l\'onglet "Challenges & Défis"')
console.log('3. Si l\'onglet n\'apparaît pas, utilisez clickChallengesTab()')
console.log('4. Si rien ne s\'affiche, utilisez reloadChallenges()')

// Fonctions disponibles
window.clickChallengesTab = clickChallengesTab
window.reloadChallenges = reloadChallenges

console.log('\n🎯 Fonctions disponibles:')
console.log('- clickChallengesTab(): Clique sur l\'onglet Challenges')
console.log('- reloadChallenges(): Recharge la page') 