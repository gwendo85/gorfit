'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { WeeklyStats } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ProgressChartsProps {
  weeklyStats: WeeklyStats[]
}

export default function ProgressCharts({ weeklyStats }: ProgressChartsProps) {
  const formatWeek = (weekKey: string) => {
    return format(new Date(weekKey), 'dd/MM', { locale: fr })
  }

  const volumeData = weeklyStats.map(stat => ({
    week: formatWeek(stat.week),
    volume: Math.round(stat.total_volume / 1000), // Convertir en tonnes
    sessions: stat.session_count
  }))

  const repsData = weeklyStats.map(stat => ({
    week: formatWeek(stat.week),
    reps: stat.total_reps
  }))

  return (
    <div className="space-y-6">
      {/* Graphique du volume hebdomadaire */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📊 Volume hebdomadaire (tonnes)
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Volume (t)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} tonnes`, 'Volume']}
              labelFormatter={(label) => `Semaine du ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="volume" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique du nombre de séances */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🏋️ Nombre de séances par semaine
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={volumeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Séances', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} séances`, 'Nombre de séances']}
              labelFormatter={(label) => `Semaine du ${label}`}
            />
            <Bar 
              dataKey="sessions" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Graphique des répétitions */}
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🔢 Répétitions totales par semaine
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={repsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="week" 
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Répétitions', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value} reps`, 'Répétitions']}
              labelFormatter={(label) => `Semaine du ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="reps" 
              stroke="#f59e0b" 
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 