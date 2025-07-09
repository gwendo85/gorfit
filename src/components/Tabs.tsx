import { ReactNode } from 'react'

interface Tab {
  label: string
  icon: ReactNode
  disabled?: boolean
}

interface TabsProps {
  tabs: Tab[]
  selected: number
  onSelect: (index: number) => void
}

export default function Tabs({ tabs, selected, onSelect }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200 bg-white dark:bg-black">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => !tab.disabled && onSelect(i)}
          disabled={tab.disabled}
          className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors rounded-xl mx-1
            backdrop-blur-md bg-white/40 dark:bg-black/30 border border-white/30 shadow-lg
            ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${selected === i && !tab.disabled
              ? 'border-b-2 border-black dark:border-white text-black dark:text-white font-semibold bg-gray-100/70 dark:bg-gray-900/70'
              : 'text-gray-400 hover:text-black dark:hover:text-white'}
          `}
        >
          <span className="mb-1">{tab.icon}</span>
          <span className="text-xs sm:text-sm">{tab.label}</span>
        </button>
      ))}
    </div>
  )
} 