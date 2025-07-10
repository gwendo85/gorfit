// Script de diagnostic pour les challenges
// À exécuter dans la console du navigateur sur http://localhost:3001/test-challenges

console.log('🔍 Diagnostic des Challenges GorFit');

// Test 1: Vérifier Supabase
async function testSupabase() {
  console.log('📋 Test 1: Vérification Supabase');
  
  try {
    if (!window.supabase) {
      console.error('❌ Client Supabase non disponible');
      return false;
    }
    
    const { data: { user }, error } = await window.supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Erreur d\'authentification:', error);
      return false;
    }
    
    if (!user) {
      console.log('⚠️ Aucun utilisateur connecté');
      return false;
    }
    
    console.log('✅ Utilisateur connecté:', user.email);
    return user;
  } catch (error) {
    console.error('❌ Erreur Supabase:', error);
    return false;
  }
}

// Test 2: Vérifier les tables
async function testTables() {
  console.log('📋 Test 2: Vérification des tables');
  
  try {
    const supabase = window.supabase;
    
    // Test challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('count')
      .limit(1);
    
    if (challengesError) {
      console.error('❌ Erreur table challenges:', challengesError);
      return false;
    }
    
    console.log('✅ Table challenges accessible');
    
    // Test user_challenges
    const { data: userChallenges, error: userChallengesError } = await supabase
      .from('user_challenges')
      .select('count')
      .limit(1);
    
    if (userChallengesError) {
      console.error('❌ Erreur table user_challenges:', userChallengesError);
      return false;
    }
    
    console.log('✅ Table user_challenges accessible');
    return true;
  } catch (error) {
    console.error('❌ Erreur tables:', error);
    return false;
  }
}

// Test 3: Vérifier les données
async function testData() {
  console.log('📋 Test 3: Vérification des données');
  
  try {
    const supabase = window.supabase;
    
    // Compter les challenges
    const { count: challengesCount, error: challengesError } = await supabase
      .from('challenges')
      .select('*', { count: 'exact', head: true });
    
    if (challengesError) {
      console.error('❌ Erreur comptage challenges:', challengesError);
      return false;
    }
    
    console.log(`✅ ${challengesCount} challenges trouvés`);
    
    // Compter les user_challenges
    const { count: userChallengesCount, error: userChallengesError } = await supabase
      .from('user_challenges')
      .select('*', { count: 'exact', head: true });
    
    if (userChallengesError) {
      console.error('❌ Erreur comptage user_challenges:', userChallengesError);
      return false;
    }
    
    console.log(`✅ ${userChallengesCount} user_challenges trouvés`);
    
    return { challengesCount, userChallengesCount };
  } catch (error) {
    console.error('❌ Erreur données:', error);
    return false;
  }
}

// Test 4: Vérifier les politiques RLS
async function testRLS() {
  console.log('📋 Test 4: Vérification des politiques RLS');
  
  try {
    const supabase = window.supabase;
    
    // Tester la lecture des challenges
    const { data: challenges, error: challengesError } = await supabase
      .from('challenges')
      .select('*')
      .limit(5);
    
    if (challengesError) {
      console.error('❌ Erreur lecture challenges:', challengesError);
      return false;
    }
    
    console.log('✅ Politique RLS challenges OK');
    
    // Tester la lecture des user_challenges
    const { data: userChallenges, error: userChallengesError } = await supabase
      .from('user_challenges')
      .select('*')
      .limit(5);
    
    if (userChallengesError) {
      console.error('❌ Erreur lecture user_challenges:', userChallengesError);
      return false;
    }
    
    console.log('✅ Politique RLS user_challenges OK');
    return true;
  } catch (error) {
    console.error('❌ Erreur RLS:', error);
    return false;
  }
}

// Fonction principale
async function runDiagnostic() {
  console.log('🚀 Démarrage du diagnostic...');
  
  const results = {
    supabase: false,
    tables: false,
    data: false,
    rls: false
  };
  
  // Test 1: Supabase
  results.supabase = await testSupabase();
  
  // Test 2: Tables
  results.tables = await testTables();
  
  // Test 3: Données
  const dataResult = await testData();
  results.data = !!dataResult;
  
  // Test 4: RLS
  results.rls = await testRLS();
  
  // Résumé
  console.log('📊 Résumé du diagnostic:');
  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASS' : 'FAIL'}`);
  });
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`🎯 Score: ${passedTests}/${totalTests} tests réussis`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Diagnostic réussi ! Les challenges devraient fonctionner.');
  } else {
    console.log('⚠️ Problèmes détectés. Vérifiez les erreurs ci-dessus.');
  }
  
  return results;
}

// Exécuter le diagnostic
runDiagnostic();

// Exporter pour utilisation manuelle
window.diagnosticChallenges = runDiagnostic; 