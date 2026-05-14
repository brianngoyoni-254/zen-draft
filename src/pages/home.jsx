import { useEffect, useState } from 'react'
import Greeting from '../components/homepage/greeting'
import QuickNav from '../components/homepage/quick-nav'
import ProgressBar from '../components/homepage/progress-bar'
import PendingTasks from '../components/homepage/pending-tasks'
import CompletedTasks from '../components/homepage/completed-tasks'
import { useLocation } from 'react-router-dom'

const API = 'http://localhost:3001'

export default function Home() {

  // STATES
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      try {
        const today = new Date().toLocaleDateString('en-CA')
        const res = await fetch(`${API}/tasks`)
        const data = await res.json()
        
        setTasks(data.filter(t => t.deadline && t.deadline.startsWith(today)))
      } catch (err) {
        console.error('Could not fetch tasks:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [location.key])

  // complete toggle function

  async function handleToggleComplete(task) {
    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ completed: !task.completed }),
      })
      const updates = await res.json()
      setTasks(prev => prev.map(t => t.id === updateYAxisWidth.id ? updated : t))
    } catch (err) {
      console.error('Could not update task:', err)
      
    }
  }

  const pending = tasks
    .filter(t => !t.completed)
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 }
      return order[a.priority] - order[b.priority]
    })

  const completed = tasks.filter(t => t.completed)

  return (

    <div className="min-h-screen w-full bg-gray-50">

      <Greeting />

      <div className="w-full px-6 py-8 space-y-6">

        <QuickNav />
        <ProgressBar total={tasks.length} done={completed.length} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <PendingTasks tasks={pending} loading={loading} />
          <CompletedTasks tasks={completed} loading={loading} />

        </div>

      </div>

    </div>
  )
}