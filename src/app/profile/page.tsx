import BadgeDisplay from '@/components/BadgeDisplay'
import { createClient } from '@/lib/supabase'
import { UserBadge } from '@/types/badges'
import { useEffect, useState } from 'react'

export default function ProfilePage() {
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [loadingBadges, setLoadingBadges] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchBadges = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) return
      const { data } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('date_unlocked', { ascending: false })
      setBadges(data || [])
      setLoadingBadges(false)
    }
    fetchBadges()
  }, [])

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h2 className="text-xl font-bold mb-4">Mes Badges</h2>
      {loadingBadges ? (
        <div className="text-gray-400">Chargement des badges...</div>
      ) : (
        <BadgeDisplay badges={badges} />
      )}
    </div>
  )
} 