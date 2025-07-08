'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

export default function HomePage() {
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/auth')
    }
  }, [router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirection...</p>
      </div>
    </div>
  )
}
