import React from 'react'
import { ChartColumnStacked, CirclePlus, Folders, Bell, Icon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const navLinks = [

    { label: 'Dashboard', sub: 'Check Reports', icon: ChartColumnStacked, path: '/dashboard', color:'text-emerald-600 bgg-emerald-50' },
    { label: 'Add Task', sub: 'Add a New Task', icon: CirclePlus, path: '/add-task', color:'text-amber-600 bg-amber-50' },
    { label: 'Categories', sub: 'Browse Categories', icon: Folders, path: '/categories', color:'text-violet-600 bg-violet-50' },
    { label: 'Alerts', sub: 'Check alerts', icon: Bell, path: '/alerts', color: 'text-rose-600 bg-rose-50' },

]

export default function QuickNav() {
    const navigate = useNavigate()

  return (
    <div>
      
      <p className='text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4'>
        What would you like to do today?
      </p>

      <div className='grid grid-cols-4 sm:grid-cols-4 gap-4'>
        {navLinks.map(({label, sub, icon: Icon, path, color}) => (
            <button
                className='bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-emerald-400 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5'
                key={path}
                onClick={() => navigate(path)}
            >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon size={20} />
                </div>

                <p className="text-sm font-medium text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </button>
        ))}
      </div>

    </div>
  )
}
