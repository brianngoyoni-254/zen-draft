import { useEffect, useState } from 'react'
import Greeting from '../components/homepage/greeting'
import QuickNav from '../components/homepage/quick-nav'
import ProgressBar from '../components/homepage/progress-bar'
import PendingTasks from '../components/homepage/pending-tasks'
import CompletedTasks from '../components/homepage/completed-tasks'
import { useLocation } from 'react-router-dom'

// IMPORT Api
import { getTasks, updateTask } from '../services/api'

export default function Home() {

  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // FETCH TASKS
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)

      try {
        const data = await getTasks()

        const today = new Date().toLocaleDateString('en-CA')

        const todayTasks = data.filter(
          t => t.deadline && t.deadline.startsWith(today)
        )

        setTasks(todayTasks)

      } catch (err) {
        console.error('Could not fetch tasks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [location.key])

  // TOGGLE COMPLETE
  async function handleToggleComplete(task) {
    try {
      const updated = await updateTask(task.id, {
        completed: !task.completed,
      })

      setTasks(prev =>
        prev.map(t => (t.id === updated.id ? updated : t))
      )

    } catch (err) {
      console.error('Could not update task:', err)
    }
  }

  // PENDING TASKS
  const pending = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return (order[a.priority] ?? 3) - (order[b.priority] ?? 3)
    })

  // COMPLETED TASKS
  const completed = tasks.filter(t => t.completed)

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">

      <Greeting />

      {/* WRAPPER */}
      <div className="w-full max-w-full px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5 sm:space-y-6">

        {/* QUICK NAV */}
        <div className="w-full max-w-full overflow-hidden">
          <QuickNav />
        </div>

        {/* PROGRESS */}
        <div className="w-full max-w-full overflow-hidden">
          <ProgressBar
            total={tasks.length}
            done={completed.length}
            loading={loading}
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-full">

          {/* Pending */}
          <div className="min-w-0 w-full overflow-hidden">
            <PendingTasks
              tasks={pending}
              loading={loading}
              onToggle={handleToggleComplete}
            />
          </div>

          {/* Completed */}
          <div className="min-w-0 w-full overflow-hidden">
            <CompletedTasks
              tasks={completed}
              loading={loading}
              onToggle={handleToggleComplete}
            />
          </div>

        </div>

      </div>

    </div>
  )
}