import { ReactNode } from 'react'

interface Tab {
  label: string
  icon: ReactNode
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
          onClick={() => onSelect(i)}
          className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors
            ${selected === i
              ? 'border-b-2 border-black dark:border-white text-black dark:text-white font-semibold bg-gray-100 dark:bg-gray-900'
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