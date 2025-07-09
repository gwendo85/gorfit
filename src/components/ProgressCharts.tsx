'use client'

import { useState, useEffect } from 'react'
import { UserWeeklyProgress } from '@/types'
import { getWeeklyProgress, formatWeeklyDataForCharts } from '@/lib/sessionUtils'
import { BarChart2, TrendingUp, Calendar } from 'lucide-react'

interface ProgressChartsProps {
  className?: string
}

export default function ProgressCharts({ className = '' }: ProgressChartsProps) {
  const [weeklyData, setWeeklyData] = useState<UserWeeklyProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'volume' | 'reps' | 'sessions'>('volume')

  useEffect(() => {
    const loadWeeklyProgress = async () => {
      try {
        const progress = await getWeeklyProgress(8) // 8 dernières semaines
        setWeeklyData(progress)
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWeeklyProgress()
  }, [])

  const chartData = formatWeeklyDataForCharts(weeklyData)

  const getMetricInfo = () => {
    switch (selectedMetric) {
      case 'volume':
        return {
          title: 'Volume Hebdomadaire',
          unit: 'tonnes',
          icon: <BarChart2 className="w-5 h-5" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        }
      case 'reps':
        return {
          title: 'Répétitions Hebdomadaires',
          unit: 'reps',
          icon: <TrendingUp className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        }
      case 'sessions':
        return {
          title: 'Séances Hebdomadaires',
          unit: 'séances',
          icon: <Calendar className="w-5 h-5" />,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        }
    }
  }

  const getMaxValue = () => {
    if (chartData.length === 0) return 0
    return Math.max(...chartData.map(d => d[selectedMetric]))
  }

  const getMetricValue = (data: any) => {
    return data[selectedMetric]
  }

  const metricInfo = getMetricInfo()
  const maxValue = getMaxValue()

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Aucune donnée de progression
          </h3>
          <p className="text-gray-600">
            Termine ta première séance pour voir tes graphiques de progression !
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg p-6 shadow-md ${className}`}>
      {/* En-tête avec sélecteur de métrique */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          {metricInfo.icon}
          <span className="ml-2">{metricInfo.title}</span>
        </h3>
        
        {/* Sélecteur de métrique */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'volume', label: 'Volume', icon: '📊' },
            { key: 'reps', label: 'Reps', icon: '💪' },
            { key: 'sessions', label: 'Séances', icon: '📅' }
          ].map((metric) => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric.key
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-1">{metric.icon}</span>
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Graphique en barres */}
      <div className="space-y-4">
        {chartData.map((data, index) => {
          const value = getMetricValue(data)
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-gray-700">{data.week}</span>
                <span className={`font-bold ${metricInfo.color}`}>
                  {value} {metricInfo.unit}
                </span>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${metricInfo.bgColor} ${metricInfo.borderColor} border`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Statistiques résumées */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-800">
              {chartData.length}
            </div>
            <div className="text-sm text-gray-600">Semaines</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.max(...chartData.map(d => getMetricValue(d)))}
            </div>
            <div className="text-sm text-gray-600">Max {metricInfo.unit}</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(chartData.reduce((sum, d) => sum + getMetricValue(d), 0) / chartData.length)}
            </div>
            <div className="text-sm text-gray-600">Moyenne</div>
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Données basées sur les {chartData.length} dernières semaines d'activité
      </div>
    </div>
  )
} 