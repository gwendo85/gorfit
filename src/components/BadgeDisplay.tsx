import { UserBadge } from '@/types/badges'

interface BadgeDisplayProps {
  badges: UserBadge[]
}

export default function BadgeDisplay({ badges }: BadgeDisplayProps) {
  if (!badges || badges.length === 0) {
    return <div className="text-gray-400 text-center py-8">Aucun badge débloqué pour l’instant.</div>
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-6">
      {badges.map(badge => (
        <div key={badge.id} className="flex flex-col items-center bg-white dark:bg-gray-900 rounded-xl shadow p-4 border border-gray-100 dark:border-gray-800">
          <div className="text-4xl mb-2">{badge.badge_title.match(/^[^\w\s]+/)?.[0] || '🏅'}</div>
          <div className="font-semibold text-sm text-center mb-1">{badge.badge_title.replace(/^[^\w\s]+\s*/, '')}</div>
          <div className="text-xs text-gray-400">{badge.date_unlocked && new Date(badge.date_unlocked).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  )
} 