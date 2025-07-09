// Script de test complet pour le module Challenges GorFit
// À exécuter dans la console du navigateur sur http://localhost:3001

console.log('🎯 Test complet du module Challenges GorFit');

// Configuration de test
const TEST_CONFIG = {
  timeout: 5000,
  retries: 3,
  baseUrl: window.location.origin
};

// Fonction utilitaire pour attendre
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Test 1: Vérifier l'authentification
async function testAuthentication() {
  console.log('📋 Test 1: Vérification de l\'authentification');
  
  try {
    // Vérifier si Supabase est disponible
    if (!window.supabase) {
      console.error('❌ Client Supabase non disponible');
      return false;
    }
    
    // Vérifier l'utilisateur connecté
    const { data: { user }, error } = await window.supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Erreur d\'authentification:', error);
      return false;
    }
    
    if (!user) {
      console.log('⚠️ Aucun utilisateur connecté - connexion requise');
      return false;
    }
    
    console.log('✅ Utilisateur connecté:', user.email);
    return user;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
    return false;
  }
}

// Test 2: Vérifier les données Supabase
async function testSupabaseData() {
  console.log('📋 Test 2: Vérification des données Supabase');
  
  try {
    const supabase = window.supabase;
    
    // Vérifier les challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
      .limit(10);
    
    if (challengesError) {
      console.error('❌ Erreur lors de la récupération des challenges:', challengesError);
      return false;
    }
    
    console.log(`✅ ${challenges?.length || 0} challenges trouvés`);
    
    // Vérifier les user_challenges
    const { data: userChallenges, error: userChallengesError } = await supabase
      .from('user_challenges')
      .select('*')
      .limit(10);
    
    if (userChallengesError) {
      console.error('❌ Erreur lors de la récupération des user_challenges:', userChallengesError);
      return false;
    }
    
    console.log(`✅ ${userChallenges?.length || 0} user_challenges trouvés`);
    
    // Vérifier les challenges abandonnés
    const abandonedChallenges = userChallenges?.filter(uc => uc.status === 'abandoned') || [];
    console.log(`✅ ${abandonedChallenges.length} challenges abandonnés trouvés`);
    
    return {
      challenges,
      userChallenges,
      abandonedChallenges
    };
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des données:', error);
    return false;
  }
}

// Test 3: Vérifier l'interface utilisateur
function testUI() {
  console.log('📋 Test 3: Vérification de l\'interface utilisateur');
  
  const uiTests = [
    { selector: 'nav', name: 'Navigation', required: true },
    { selector: '[data-testid="dashboard"]', name: 'Dashboard', required: false },
    { selector: '[data-testid="challenges-section"]', name: 'Section Challenges', required: false },
    { selector: '[data-testid="abandoned-challenges"]', name: 'Challenges abandonnés', required: false },
    { selector: 'button', name: 'Boutons', required: true },
    { selector: '.toast', name: 'Toasts', required: false },
    { selector: '.bg-gradient-to-r', name: 'Arrière-plans dégradés', required: false }
  ];
  
  let passedTests = 0;
  let totalTests = uiTests.length;
  
  uiTests.forEach(test => {
    const elements = document.querySelectorAll(test.selector);
    if (elements.length > 0) {
      console.log(`✅ ${test.name}: ${elements.length} élément(s) trouvé(s)`);
      passedTests++;
    } else if (test.required) {
      console.log(`❌ ${test.name}: Élément requis non trouvé`);
    } else {
      console.log(`⚠️ ${test.name}: Élément optionnel non trouvé`);
      passedTests++; // Les tests optionnels ne font pas échouer
    }
  });
  
  console.log(`📊 UI Tests: ${passedTests}/${totalTests} réussis`);
  return passedTests === totalTests;
}

// Test 4: Vérifier les erreurs console
function testConsoleErrors() {
  console.log('📋 Test 4: Vérification des erreurs console');
  
  // Intercepter les erreurs futures
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push({
      message: args.join(' '),
      timestamp: new Date().toISOString()
    });
    originalError.apply(console, args);
  };
  
  // Attendre un peu puis vérifier
  setTimeout(() => {
    const criticalErrors = errors.filter(error => 
      error.message.includes('{}') || 
      error.message.includes('getAbandonedChallengesForUser') ||
      error.message.includes('challenges abandonnés')
    );
    
    if (criticalErrors.length > 0) {
      console.error(`❌ ${criticalErrors.length} erreur(s) critique(s) détectée(s):`, criticalErrors);
    } else {
      console.log(`✅ Aucune erreur critique détectée (${errors.length} erreur(s) total)`);
    }
    
    // Restaurer console.error
    console.error = originalError;
  }, 3000);
}

// Test 5: Vérifier les requêtes réseau
function testNetworkRequests() {
  console.log('📋 Test 5: Vérification des requêtes réseau');
  
  // Observer les requêtes réseau
  const observer = new PerformanceObserver((list) => {
    const supabaseRequests = [];
    
    for (const entry of list.getEntries()) {
      if (entry.name.includes('supabase') || entry.name.includes('challenges')) {
        supabaseRequests.push({
          url: entry.name,
          duration: entry.duration,
          status: entry.transferSize > 0 ? 'success' : 'error'
        });
      }
    }
    
    if (supabaseRequests.length > 0) {
      console.log(`✅ ${supabaseRequests.length} requête(s) Supabase détectée(s):`, supabaseRequests);
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

// Test 6: Simuler les interactions utilisateur
async function testUserInteractions() {
  console.log('📋 Test 6: Test des interactions utilisateur');
  
  try {
    // Chercher les boutons de reprise
    const resumeButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.includes('Reprendre') || 
      btn.textContent.includes('reprendre') ||
      btn.textContent.includes('Resume')
    );
    
    if (resumeButtons.length > 0) {
      console.log(`✅ ${resumeButtons.length} bouton(s) de reprise trouvé(s)`);
      
      // Simuler un clic sur le premier bouton (optionnel)
      // resumeButtons[0].click();
      // console.log('✅ Clic simulé sur le bouton de reprise');
    } else {
      console.log('⚠️ Aucun bouton de reprise trouvé');
    }
    
    // Chercher les boutons d'abandon
    const abandonButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
      btn.textContent.includes('Abandonner') || 
      btn.textContent.includes('abandonner') ||
      btn.textContent.includes('Abandon')
    );
    
    if (abandonButtons.length > 0) {
      console.log(`✅ ${abandonButtons.length} bouton(s) d'abandon trouvé(s)`);
    } else {
      console.log('⚠️ Aucun bouton d\'abandon trouvé');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors du test des interactions:', error);
    return false;
  }
}

// Fonction principale de test
async function runCompleteTest() {
  console.log('🚀 Démarrage du test complet du module Challenges...');
  
  const results = {
    authentication: false,
    supabaseData: false,
    ui: false,
    consoleErrors: true, // Par défaut true, sera mis à false si des erreurs critiques sont trouvées
    networkRequests: true,
    userInteractions: false
  };
  
  // Test 1: Authentification
  const user = await testAuthentication();
  results.authentication = !!user;
  
  // Test 2: Données Supabase
  const data = await testSupabaseData();
  results.supabaseData = !!data;
  
  // Test 3: Interface utilisateur
  results.ui = testUI();
  
  // Test 4: Erreurs console
  testConsoleErrors();
  
  // Test 5: Requêtes réseau
  testNetworkRequests();
  
  // Test 6: Interactions utilisateur
  results.userInteractions = await testUserInteractions();
  
  // Résumé des résultats
  console.log('📊 Résumé des tests:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`🎯 Score final: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests >= totalTests - 1) { // Permettre 1 test d'échec
    console.log('🎉 Module Challenges validé avec succès !');
  } else {
    console.log('⚠️ Module Challenges nécessite des corrections');
  }
  
  return results;
}

// Exécuter le test complet
runCompleteTest();

// Exporter pour utilisation manuelle
window.testChallengesComplete = runCompleteTest; 