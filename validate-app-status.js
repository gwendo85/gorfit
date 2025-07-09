// Script de validation du statut de l'application GorFit
// À exécuter dans la console du navigateur

console.log('🔍 Validation du statut de l\'application GorFit');

// Fonction pour vérifier les erreurs dans la console
function checkConsoleErrors() {
  console.log('📋 Vérification des erreurs console...');
  
  // Intercepter les erreurs futures
  const originalError = console.error;
  const errors = [];
  
  console.error = function(...args) {
    errors.push(args);
    originalError.apply(console, args);
  };
  
  // Attendre un peu puis vérifier
  setTimeout(() => {
    if (errors.length > 0) {
      console.log(`❌ ${errors.length} erreur(s) détectée(s):`, errors);
    } else {
      console.log('✅ Aucune erreur console détectée');
    }
  }, 2000);
}

// Fonction pour vérifier les requêtes réseau
function checkNetworkRequests() {
  console.log('📋 Vérification des requêtes réseau...');
  
  // Observer les requêtes réseau
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest') {
        console.log(`🌐 Requête: ${entry.name} - ${entry.duration}ms`);
      }
    }
  });
  
  observer.observe({ entryTypes: ['resource'] });
}

// Fonction pour vérifier l'authentification
async function checkAuthentication() {
  console.log('📋 Vérification de l\'authentification...');
  
  try {
    // Vérifier si l'utilisateur est connecté
    const user = await window.supabase?.auth?.getUser();
    if (user?.data?.user) {
      console.log('✅ Utilisateur connecté:', user.data.user.email);
      return user.data.user;
    } else {
      console.log('⚠️ Aucun utilisateur connecté');
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
    return null;
  }
}

// Fonction pour vérifier les données Supabase
async function checkSupabaseData() {
  console.log('📋 Vérification des données Supabase...');
  
  try {
    const supabase = window.supabase;
    if (!supabase) {
      console.log('❌ Client Supabase non disponible');
      return;
    }
    
    // Vérifier les challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
      .limit(5);
    
    if (challengesError) {
      console.error('❌ Erreur lors de la récupération des challenges:', challengesError);
    } else {
      console.log(`✅ ${challenges?.length || 0} challenges trouvés`);
    }
    
    // Vérifier les user_challenges
    const { data: userChallenges, error: userChallengesError } = await supabase
      .from('user_challenges')
      .select('*')
      .limit(5);
    
    if (userChallengesError) {
      console.error('❌ Erreur lors de la récupération des user_challenges:', userChallengesError);
    } else {
      console.log(`✅ ${userChallenges?.length || 0} user_challenges trouvés`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des données:', error);
  }
}

// Fonction pour vérifier l'interface utilisateur
function checkUI() {
  console.log('📋 Vérification de l\'interface utilisateur...');
  
  const checks = [
    { selector: 'nav', name: 'Navigation' },
    { selector: '[data-testid="dashboard"]', name: 'Dashboard' },
    { selector: '[data-testid="challenges-section"]', name: 'Section Challenges' },
    { selector: '[data-testid="abandoned-challenges"]', name: 'Challenges abandonnés' },
    { selector: 'button', name: 'Boutons' },
    { selector: '.toast', name: 'Toasts' }
  ];
  
  checks.forEach(check => {
    const elements = document.querySelectorAll(check.selector);
    if (elements.length > 0) {
      console.log(`✅ ${check.name}: ${elements.length} élément(s) trouvé(s)`);
    } else {
      console.log(`⚠️ ${check.name}: Aucun élément trouvé`);
    }
  });
}

// Fonction principale de validation
async function validateAppStatus() {
  console.log('🚀 Démarrage de la validation de l\'application...');
  
  // Vérifications synchrones
  checkConsoleErrors();
  checkNetworkRequests();
  checkUI();
  
  // Vérifications asynchrones
  const user = await checkAuthentication();
  if (user) {
    await checkSupabaseData();
  }
  
  console.log('🎉 Validation terminée !');
}

// Exécuter la validation
validateAppStatus();

// Exporter pour utilisation manuelle
window.validateAppStatus = validateAppStatus; 