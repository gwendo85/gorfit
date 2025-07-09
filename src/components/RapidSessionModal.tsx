import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Loader2 } from 'lucide-react'

interface RapidSessionModalProps {
  open: boolean
  onClose: () => void
  onLaunch: (type: string, duration: number) => Promise<void>
  loading: boolean
}

const SESSION_TYPES = [
  { key: 'fullbody', label: '💪 Full Body (Corps entier)', desc: 'Entraînement complet' },
  { key: 'haut', label: '🤲 Haut du corps', desc: 'Bras, épaules, dos, pectoraux' },
  { key: 'bas', label: '🦵 Bas du corps', desc: 'Jambes, fessiers, mollets' },
]
const DURATIONS = [
  { value: 20, label: '20 min', desc: 'Rapide' },
  { value: 30, label: '30 min', desc: 'Standard' },
  { value: 45, label: '45 min', desc: 'Complet' },
]

export default function RapidSessionModal({ open, onClose, onLaunch, loading }: RapidSessionModalProps) {
  const [type, setType] = useState('fullbody')
  const [duration, setDuration] = useState(30)

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="bg-white rounded-2xl shadow-xl p-0 w-full max-w-md mx-auto z-50">
        <div className="px-8 pt-8 pb-2 border-b">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold">Mode Rapide</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
          </div>
          <div className="text-gray-500 text-sm mb-2">Génère ta séance automatiquement selon ton besoin</div>
        </div>
        <form
          onSubmit={e => {
            e.preventDefault()
            onLaunch(type, duration)
          }}
          className="px-8 pt-6 pb-8"
        >
          <div className="mb-6">
            <div className="font-semibold mb-2">Type de séance</div>
            <div className="space-y-2">
              {SESSION_TYPES.map(opt => (
                <label key={opt.key} className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${type === opt.key ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name="type"
                    value={opt.key}
                    checked={type === opt.key}
                    onChange={() => setType(opt.key)}
                    className="form-radio accent-blue-600 mr-3"
                  />
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-gray-500">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <div className="font-semibold mb-2">Durée</div>
            <div className="flex gap-3">
              {DURATIONS.map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  className={`flex-1 px-0 py-3 rounded-lg border text-center transition-all ${duration === opt.value ? 'border-blue-500 bg-blue-50 font-bold' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  onClick={() => setDuration(opt.value)}
                >
                  <div className="text-base">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-2 mt-8">
            <button
              type="button"
              className="flex-1 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-bold hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Lancer ma séance 🚀'}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  )
} 