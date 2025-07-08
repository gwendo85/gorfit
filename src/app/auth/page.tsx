'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from '@/lib/validations'
import toast from 'react-hot-toast'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLogin
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignup
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema)
  })

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (error) throw error

      toast.success('Connexion réussie !')
      router.push('/dashboard')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erreur lors de la connexion')
      } else {
        toast.error('Erreur lors de la connexion')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (data: SignupFormData) => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password
      })

      if (authError) throw authError

      // Créer le profil utilisateur
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: data.email,
            username: data.username
          })

        if (profileError) throw profileError
      }

      toast.success('Compte créé avec succès ! Vérifiez votre email.')
      setIsLogin(true)
      resetSignup()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Erreur lors de l\'inscription')
      } else {
        toast.error('Erreur lors de l\'inscription')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    resetLogin()
    resetSignup()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏋️ GorFit
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit(handleLogin)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...registerLogin('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
              {loginErrors.email && (
                <p className="text-red-500 text-sm mt-1">{loginErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                {...registerLogin('password')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {loginErrors.password && (
                <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit(handleSignup)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d&apos;utilisateur
              </label>
              <input
                type="text"
                {...registerSignup('username')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Votre nom"
              />
              {signupErrors.username && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...registerSignup('email')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="votre@email.com"
              />
              {signupErrors.email && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                {...registerSignup('password')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {signupErrors.password && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Création...' : 'Créer un compte'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? 'Pas encore de compte ? S&apos;inscrire' : 'Déjà un compte ? Se connecter'}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-500">
            En créant un compte, vous acceptez nos conditions d&apos;utilisation et notre politique de confidentialité.
          </p>
        </div>
      </div>
    </div>
  )
} 