import { useEffect, useState } from 'react'
import { Bell, AlertTriangle, Clock, CalendarDays } from 'lucide-react'

const API = 'http://localhost:3001'

// Alerts Sections
const SECTIONS = [
  {
    key: 'overdue',
    label: 'Overdue',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    dotColor: 'bg-red-500',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-600',
    borderColor: 'border-red-100',
    emptyText: 'No overdue tasks',
  },
  {
    key: 'today',
    label: "Due today",
    icon: Clock,
    iconColor: 'text-amber-500',
    dotColor: 'bg-amber-400',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-600',
    borderColor: 'border-amber-100',
    emptyText: 'Nothing due today',
  },
  {
    key: 'upcoming',
    label: 'Upcoming (next 3 days)',
    icon: CalendarDays,
    iconColor: 'text-violet-500',
    dotColor: 'bg-violet-500',
    badgeBg: 'bg-violet-50',
    badgeText: 'text-violet-600',
    borderColor: 'border-violet-100',
    emptyText: 'Nothing coming up',
  },
]

// Helpers
function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function formatDeadline(deadline) {
  return new Date(deadline).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Subcomponents

function TaskItem({ task, accentDot }) {
  return (
    <li className="flex items-start justify-between gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{task.name}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          {task.category && <span>{task.category} · </span>}
          {task.deadline && formatDeadline(task.deadline)}
        </p>
      </div>
      <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${accentDot}`} />
    </li>
  )
}

function AlertSection({ section, tasks, loading }) {
  const Icon = section.icon
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full inline-block ${section.dotColor}`} />
          <p className="text-sm font-medium text-gray-800">{section.label}</p>
        </div>
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {loading ? '—' : tasks.length}
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-gray-300 text-center py-8">Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">
          <Icon size={32} className="mx-auto text-gray-200 mb-2" />
          <p className="text-sm text-gray-300">{section.emptyText}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} accentDot={section.dotColor} />
          ))}
        </ul>
      )}
    </div>
  )
}

// Main Component
export default function Alerts() {

  // STATES
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // HOOKS
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/tasks`)
        const data = await res.json()
        setTasks(data)
      } catch (err) {
        console.error('Could not fetch tasks:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const now = new Date()

  const overdue = tasks.filter((t) => {
    if (!t.deadline || t.completed) return false
    return new Date(t.deadline) < now
  })

  const today = tasks.filter((t) => {
    if (!t.deadline || t.completed) return false
    return isSameDay(new Date(t.deadline), now)
  })

  const upcoming = tasks.filter((t) => {
    if (!t.deadline || t.completed) return false
    const diff = (new Date(t.deadline) - now) / (1000 * 60 * 60 * 24)
    return diff > 0 && diff <= 3
  })

  const grouped = { overdue, today, upcoming }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bell size={18} className="text-rose-500" />
          <h1 className="text-sm font-semibold text-gray-800">Alerts & Notifications</h1>
        </div>
        <p className="text-xs text-gray-400">
          Tasks that need your attention — overdue, due today, and coming up soon.
        </p>
      </div>

      {/* Alert sections */}
      <div className="flex flex-col gap-5 max-w-2xl">
        {SECTIONS.map((section) => (
          <AlertSection
            key={section.key}
            section={section}
            tasks={grouped[section.key]}
            loading={loading}
          />
        ))}
      </div>

    </div>
  )
}