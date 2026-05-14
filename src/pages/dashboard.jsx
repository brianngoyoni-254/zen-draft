import { useEffect, useState } from 'react'
import { ChartColumnStacked } from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const API = 'http://localhost:3001'

const COLORS = [
  '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
  '#3B82F6', '#EC4899', '#14B8A6', '#F97316',
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Stat Card
function StatCard({ label, value, dotColor }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <p className="text-xs text-gray-400 font-medium">{label}</p>
      </div>
      <p className="text-3xl font-light text-gray-900">{value}</p>
    </div>
  )
}

// Chart Card
function ChartCard({ title, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <p className="text-sm font-medium text-gray-800 mb-5">{title}</p>
      {children}
    </div>
  )
}

// Main Component

export default function Dashboard() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

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

  // Retrieved Data
  const completed = tasks.filter((t) => t.completed)
  const pending = tasks.filter((t) => !t.completed)

  const weeklyData = DAYS.map((day, i) => ({
    day,
    tasks: completed.filter(
      (t) => t.deadline && new Date(t.deadline).getDay() === i
    ).length,
  }))

  const maxTasks = Math.max(...weeklyData.map((d) => d.tasks), 1)

  const monthlyData = MONTHS.map((month, i) => ({
    name: month,
    value: completed.filter(
      (t) => t.deadline && new Date(t.deadline).getMonth() === i
    ).length,
  }))

  const categoryMap = {}
  tasks.forEach((t) => {
    const cat = t.category || 'Uncategorized'
    categoryMap[cat] = (categoryMap[cat] || 0) + 1
  })
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }))

  // Tooltip Style
  const tooltipStyle = {
    contentStyle: {
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      fontSize: '12px',
      boxShadow: 'none',
    },
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 px-6 py-8">
        <p className="text-sm text-gray-300">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ChartColumnStacked size={18} className="text-emerald-500" />
          <h1 className="text-sm font-semibold text-gray-800">Dashboard</h1>
        </div>
        <p className="text-xs text-gray-400">
          Weekly, monthly and category reports.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total tasks" value={tasks.length} dotColor="bg-gray-400" />
        <StatCard label="Completed" value={completed.length} dotColor="bg-emerald-500" />
        <StatCard label="Pending" value={pending.length} dotColor="bg-orange-400" />
      </div>

      {/* Weekly + Monthly */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

        <ChartCard title="Weekly report">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  allowDecimals={false}
                  domain={[0, maxTasks]}
                  ticks={Array.from({ length: maxTasks + 1 }, (_, i) => i)}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="tasks" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Monthly report">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={monthlyData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%">
                  {monthlyData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      {/* Categories overview */}
      <ChartCard title="Categories overview">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="70%">
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

    </div>
  )
}