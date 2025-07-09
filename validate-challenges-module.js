// Script de validation pour le module Challenges
// À exécuter dans la console du navigateur sur http://localhost:3001

console.log('🧪 Test du module Challenges GorFit');

// Fonction pour tester la récupération des challenges abandonnés
async function testAbandonedChallenges() {
  try {
    console.log('📋 Test 1: Récupération des challenges abandonnés');
    
    // Simuler l'appel à getAbandonedChallengesForUser
    const response = await fetch('/api/challenges/abandoned', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Challenges abandonnés récupérés:', data);
      return data;
    } else {
      console.error('❌ Erreur lors de la récupération:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return null;
  }
}

// Fonction pour tester l'abandon d'un challenge
async function testAbandonChallenge(challengeId) {
  try {
    console.log('📋 Test 2: Abandon d\'un challenge');
    
    const response = await fetch('/api/challenges/abandon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challengeId }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Challenge abandonné:', data);
      return data;
    } else {
      console.error('❌ Erreur lors de l\'abandon:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return null;
  }
}

// Fonction pour tester la reprise d'un challenge
async function testResumeChallenge(challengeId) {
  try {
    console.log('📋 Test 3: Reprise d\'un challenge');
    
    const response = await fetch('/api/challenges/resume', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ challengeId }),
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Challenge repris:', data);
      return data;
    } else {
      console.error('❌ Erreur lors de la reprise:', response.status);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return null;
  }
}

// Fonction pour vérifier l'interface utilisateur
function testUI() {
  console.log('📋 Test 4: Vérification de l\'interface utilisateur');
  
  // Vérifier la présence de la section Challenges
  const challengesSection = document.querySelector('[data-testid="challenges-section"]');
  if (challengesSection) {
    console.log('✅ Section Challenges trouvée');
  } else {
    console.log('⚠️ Section Challenges non trouvée');
  }
  
  // Vérifier la présence de la section Challenges abandonnés
  const abandonedSection = document.querySelector('[data-testid="abandoned-challenges"]');
  if (abandonedSection) {
    console.log('✅ Section Challenges abandonnés trouvée');
  } else {
    console.log('⚠️ Section Challenges abandonnés non trouvée');
  }
  
  // Vérifier les boutons
  const buttons = document.querySelectorAll('button');
  const abandonButtons = Array.from(buttons).filter(btn => 
    btn.textContent.includes('Abandonner') || btn.textContent.includes('abandonner')
  );
  const resumeButtons = Array.from(buttons).filter(btn => 
    btn.textContent.includes('Reprendre') || btn.textContent.includes('reprendre')
  );
  
  console.log(`✅ Boutons trouvés: ${abandonButtons.length} abandon, ${resumeButtons.length} reprise`);
}

// Fonction principale de test
async function runAllTests() {
  console.log('🚀 Démarrage des tests du module Challenges...');
  
  // Test 1: Récupération des challenges abandonnés
  const abandonedChallenges = await testAbandonedChallenges();
  
  // Test 2: Interface utilisateur
  testUI();
  
  // Test 3: Abandon d'un challenge (si des challenges sont disponibles)
  if (abandonedChallenges && abandonedChallenges.length > 0) {
    await testAbandonChallenge(abandonedChallenges[0].id);
  }
  
  // Test 4: Reprise d'un challenge (si des challenges abandonnés sont disponibles)
  if (abandonedChallenges && abandonedChallenges.length > 0) {
    await testResumeChallenge(abandonedChallenges[0].id);
  }
  
  console.log('🎉 Tests terminés !');
}

// Exécuter les tests
runAllTests();

// Exporter les fonctions pour utilisation manuelle
window.testChallengesModule = {
  testAbandonedChallenges,
  testAbandonChallenge,
  testResumeChallenge,
  testUI,
  runAllTests
}; 