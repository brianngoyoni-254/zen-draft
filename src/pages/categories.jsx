import { useState, useRef, useEffect } from 'react'
import { Check, Folders, Pen, Plus, X } from 'lucide-react'

const API = 'http://localhost:3001'

const TAG_PALETTE = [
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-violet-100 text-violet-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
]

function toId(label) {
  return label.trim().toLowerCase().replace(/\s+/g, '_')
}

export default function Categories() {

  // STATES
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  const [activeFilter, setActiveFilter] = useState('All')
  const [addingCat, setAddingCat] = useState(false)
  const [newCatLabel, setNewCatLabel] = useState('')
  const newCatInputRef = useRef(null)

  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCat, setEditCat] = useState('')

  // HOOKS
  useEffect(() => {
    async function load() {
      try {
        const [catRes, taskRes] = await Promise.all([
          fetch(`${API}/categories`),
          fetch(`${API}/tasks`),
        ])
        setCategories(await catRes.json())
        setTasks(await taskRes.json())
      } catch (err) {
        console.error('Could not fetch data:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    if (addingCat) newCatInputRef.current?.focus()
  }, [addingCat])

  // Tag Colours
  const tagClasses = Object.fromEntries(
    categories.map((c, i) => [c.id, TAG_PALETTE[i % TAG_PALETTE.length]])
  )

  const filtered =
    activeFilter === 'All'
      ? tasks
      : tasks.filter((t) => t.category === activeFilter)

  
  // Category Functions
  async function handleAddCategory() {
    const label = newCatLabel.trim()
    if (!label) { setAddingCat(false); setNewCatLabel(''); return }

    const id = toId(label)
    if (categories.find((c) => c.id === id)) {
      setNewCatLabel(''); setAddingCat(false); return
    }

    try {
      const res = await fetch(`${API}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: label }),
      })
      const saved = await res.json()
      setCategories((prev) => [...prev, saved])
    } catch (err) {
      console.error('Could not add category:', err)
    }
    setNewCatLabel('')
    setAddingCat(false)
  }

  async function handleDeleteCategory(catId) {
    try {
      await fetch(`${API}/categories/${catId}`, { method: 'DELETE' })
      setCategories((prev) => prev.filter((c) => c.id !== catId))
      if (activeFilter === catId) setActiveFilter('All')
    } catch (err) {
      console.error('Could not delete category:', err)
    }
  }

  // Task functions
  function handleEditTask(task) {
    setEditingTaskId(task.id)
    setEditName(task.name)
    setEditCat(task.category)
  }

  async function handleSaveTask(id) {
    const updated = { name: editName.trim() || 'Untitled', category: editCat }
    try {
      await fetch(`${API}/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      })
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      )
    } catch (err) {
      console.error('Could not update task:', err)
    }
    setEditingTaskId(null)
  }

  async function handleDeleteTask(id) {
    try {
      await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
      setTasks((prev) => prev.filter((t) => t.id !== id))
      if (editingTaskId === id) setEditingTaskId(null)
    } catch (err) {
      console.error('Could not delete task:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Folders size={18} className="text-violet-500" />
          <h1 className="text-sm font-semibold text-gray-800">Categories</h1>
        </div>
        <p className="text-xs text-gray-400">
          Browse and manage tasks by category.
        </p>
      </div>

      <div className="max-w-2xl">

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-2 mb-6">

          {/* Add category */}
          {addingCat ? (
            <input
              ref={newCatInputRef}
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCategory()
                if (e.key === 'Escape') { setAddingCat(false); setNewCatLabel('') }
              }}
              onBlur={handleAddCategory}
              placeholder="Category name…"
              className="px-3 py-1.5 text-sm rounded-full border border-violet-400 outline-none w-36 focus:ring-2 focus:ring-violet-100 bg-white"
            />
          ) : (
            <button
              onClick={() => setAddingCat(true)}
              title="Add category"
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-400 text-lg flex items-center justify-center hover:bg-violet-100 hover:border-violet-300 hover:text-violet-600 transition"
            >
              <Plus />

            </button>
          )}

          {/* All */}
          <button
            onClick={() => { setActiveFilter('All'); setEditingTaskId(null) }}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              activeFilter === 'All'
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>

          {/* Categories */}
          {categories.map((cat) => (
            <div key={cat.id} className="relative group/pill flex items-center">
              <button
                onClick={() => { setActiveFilter(cat.id); setEditingTaskId(null) }}
                className={`px-4 py-1.5 rounded-full text-sm border transition-all pr-7 ${
                  activeFilter === cat.id
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id) }}
                title={`Delete "${cat.name}"`}
                className={`absolute right-2 text-xs font-bold opacity-0 group-hover/pill:opacity-100 transition-opacity ${
                  activeFilter === cat.id
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <X />
              </button>
            </div>
          ))}
        </div>

        {/* Task list */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <p className="text-sm text-gray-300 text-center py-10">Loading...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10">
              <Folders size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-sm text-gray-300">No tasks in this category.</p>
            </div>
          ) : (
            filtered.map((task) =>
              editingTaskId === task.id ? (

                // Edit row
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-white border border-violet-200 rounded-xl px-4 py-3"
                >
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTask(task.id)
                      if (e.key === 'Escape') setEditingTaskId(null)
                    }}
                    className="flex-1 text-sm text-gray-800 bg-transparent outline-none"
                  />
                  <select
                    value={editCat}
                    onChange={(e) => setEditCat(e.target.value)}
                    className="text-xs rounded-full border border-gray-200 bg-gray-50 text-gray-600 px-3 py-1 outline-none cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleSaveTask(task.id)}
                    className="text-emerald-600 hover:text-emerald-800 text-sm font-medium transition px-1"
                  >
                    <Check />
                  </button>
                  <button
                    onClick={() => setEditingTaskId(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm transition px-1"
                  >
                   <X />
                  </button>
                </div>

              ) : (

                // Display row
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 hover:border-gray-200 transition group"
                >
                  <span className="flex-1 text-sm text-gray-800">{task.name}</span>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${tagClasses[task.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {task.category}
                  </span>
                  <button
                    onClick={() => handleEditTask(task)}
                    title="Edit"
                    className="text-gray-300 hover:text-gray-600 text-sm opacity-0 group-hover:opacity-100 transition"
                  >
                    <Pen />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    title="Delete"
                    className="text-gray-300 hover:text-red-500 text-sm opacity-0 group-hover:opacity-100 transition"
                  >
                    <X />
                  </button>
                </div>
              )
            )
          )}
        </div>

      </div>
    </div>
  )
}