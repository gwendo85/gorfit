"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Trophy, ArrowLeft, Target, Calendar, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  start_date: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  date_completed?: string;
  updated_at?: string;
}

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const challengeId = params.id as string;
  const [challenge, setChallenge] = useState<any>(null);
  const [userChallenge, setUserChallenge] = useState<UserChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      // Récupérer l'utilisateur
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        router.push('/auth');
        return;
      }

      // Récupérer le challenge
      const { data: challengeData, error: challengeError } = await supabase
        .from("challenges")
        .select("*")
        .eq("id", challengeId)
        .single();
        
      if (challengeError) {
        toast.error("Erreur lors du chargement du challenge");
        router.push("/dashboard");
        return;
      }
      setChallenge(challengeData);

      // Récupérer la progression de l'utilisateur pour ce challenge
      const { data: userChallengeData } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_id", challengeId)
        .single();
        
      setUserChallenge(userChallengeData);
      setIsLoading(false);
    };
    
    if (challengeId) fetchData();
  }, [challengeId, router]);

  const getProgressColor = (percentage: number) => {
    if (percentage >= 67) return 'bg-green-500';
    if (percentage >= 34) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'cardio': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'force': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'souplesse': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'endurance': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'débutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermédiaire': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'avancé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = () => {
    switch (challenge?.type) {
      case 'sessions': return <Calendar className="w-5 h-5" />;
      case 'volume': return <TrendingUp className="w-5 h-5" />;
      case 'reps': return <Target className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du challenge...</p>
        </div>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Challenge introuvable</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
          >
            Retour au dashboard
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = userChallenge ? Math.min((userChallenge.progress / challenge.target) * 100, 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-black dark:to-gray-900">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-black/90 shadow-md border-b border-gray-200 dark:border-gray-800 backdrop-blur supports-backdrop-blur:backdrop-blur-md transition-all">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Retour
          </button>
          <h1 className="ml-6 text-2xl font-bold text-black dark:text-white flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500 mr-2" />
            {challenge.title}
          </h1>
        </div>
      </header>
      
      <main className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl">{challenge.icon_emoji || "🏆"}</span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{challenge.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{challenge.description}</p>
            </div>
          </div>

          {/* Catégorie et difficulté */}
          {(challenge.category || challenge.difficulty_level) && (
            <div className="flex items-center space-x-3 mb-6">
              {challenge.category && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(challenge.category)}`}>
                  {challenge.category}
                </span>
              )}
              {challenge.difficulty_level && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty_level)}`}>
                  {challenge.difficulty_level}
                </span>
              )}
            </div>
          )}

          {/* Progression si challenge rejoint */}
          {userChallenge && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Ta Progression
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Progression: {userChallenge.progress.toLocaleString()} / {challenge.target.toLocaleString()}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${getProgressColor(progressPercentage)}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Statut: {userChallenge.status === 'completed' ? '✅ Terminé' : 
                           userChallenge.status === 'abandoned' ? '❌ Abandonné' : '🔄 En cours'}
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <span className="block text-gray-500 text-xs mb-1">Objectif</span>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">{challenge.target.toLocaleString()}</span>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <span className="block text-gray-500 text-xs mb-1">Durée</span>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">{challenge.duration_days} jours</span>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <span className="block text-gray-500 text-xs mb-1">Type</span>
              <div className="flex items-center">
                {getTypeIcon()}
                <span className="font-semibold text-lg text-gray-900 dark:text-white ml-2 capitalize">
                  {challenge.type === 'sessions' ? 'Séances' : 
                   challenge.type === 'volume' ? 'Volume (kg)' : 
                   challenge.type === 'reps' ? 'Répétitions' : 'Objectif'}
                </span>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-lg p-4">
              <span className="block text-gray-500 text-xs mb-1">Créé le</span>
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                {new Date(challenge.created_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Récompense */}
          {challenge.reward_badge_title && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
              <span className="block text-gray-500 text-xs mb-2">Récompense</span>
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-500" />
                <div>
                  <span className="font-semibold text-lg text-gray-900 dark:text-white">{challenge.reward_badge_title}</span>
                  {challenge.reward_badge_description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{challenge.reward_badge_description}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 