import { Trophy, Star, CheckCircle } from 'lucide-react'

interface ProgramBadgeProps {
  programName: string
  completedAt: string
  isNew?: boolean
}

export default function ProgramBadge({ programName, completedAt, isNew = false }: ProgramBadgeProps) {
  return (
    <div className={`relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 shadow-lg ${
      isNew ? 'animate-pulse' : ''
    }`}>
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
          NOUVEAU !
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <div className="bg-white/20 rounded-full p-2">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg">{programName}</h3>
          <p className="text-white/80 text-sm">
            Terminé le {new Date(completedAt).toLocaleDateString('fr-FR')}
          </p>
        </div>
        
        <CheckCircle className="w-5 h-5 text-white" />
      </div>
      
      <div className="mt-3 flex items-center space-x-2">
        <Star className="w-4 h-4 text-yellow-300" />
        <span className="text-white/90 text-sm font-medium">
          Parcours GorFit Premium
        </span>
      </div>
    </div>
  )
} 