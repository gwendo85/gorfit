import { Trophy, Star, CheckCircle } from 'lucide-react'

interface ProgramBadgeProps {
  programName: string
  completedAt: string
  isNew?: boolean
  glass?: boolean // Ajout de la prop glass
}

export default function ProgramBadge({ programName, completedAt, isNew = false, glass = false }: ProgramBadgeProps) {
  return (
    <div className={
      glass
        ? `relative glassmorph rounded-xl p-4 shadow-xl border border-white/40 dark:border-gray-700/60`
        : `relative bg-gradient-to-br from-white/80 via-gray-100/70 to-gray-200/60 dark:from-gray-900/80 dark:via-gray-800/70 dark:to-black/60 rounded-xl p-4 shadow-xl border border-white/40 dark:border-gray-700/60 backdrop-blur-md`
    }>
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-400/90 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-md border border-white/20">
          NOUVEAU !
        </div>
      )}
      
      <div className="flex items-center space-x-3">
        <div className="bg-white/30 rounded-full p-2 shadow-sm">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-white text-lg drop-shadow-sm">{programName}</h3>
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