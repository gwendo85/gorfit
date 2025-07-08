'use client'

import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'

interface TimerProps {
  duration: number // en secondes
  onComplete?: () => void
}

export default function Timer({ duration, onComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = useCallback(() => {
    setIsRunning(true)
    setIsCompleted(false)
  }, [])

  const pauseTimer = useCallback(() => {
    setIsRunning(false)
  }, [])

  const resetTimer = useCallback(() => {
    setTimeLeft(duration)
    setIsRunning(false)
    setIsCompleted(false)
  }, [duration])

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/notification.mp3')
      audio.play()
    } catch {
      // Impossible de jouer le son de notification
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsCompleted(true)
            playNotificationSound()
            onComplete?.()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, onComplete, playNotificationSound])

  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Pause</h3>
        <Volume2 className="w-5 h-5 text-gray-600" />
      </div>

      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-gray-900 mb-2">
          {formatTime(timeLeft)}
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        {!isRunning && timeLeft > 0 && !isCompleted && (
          <button
            onClick={startTimer}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Démarrer
          </button>
        )}

        {isRunning && (
          <button
            onClick={pauseTimer}
            className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </button>
        )}

        <button
          onClick={resetTimer}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </button>
      </div>

      {isCompleted && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
          ⏰ Pause terminée ! Prêt pour la série suivante ?
        </div>
      )}
    </div>
  )
} 