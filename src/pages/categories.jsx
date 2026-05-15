import { useState, useRef, useEffect } from 'react'
import { Check, Folders, Pen, Plus, X } from 'lucide-react'

// IMPORT API FUNCTIONS
import {
  getTasks,
  updateTask,
  deleteTask,
  getCategories,
  createCategory,
  deleteCategory,
} from '../services/api'

const TAG_PALETTE = [
  'bg-blue-100 text-blue-800',
  'bg-emerald-100 text-emerald-800',
  'bg-amber-100 text-amber-800',
  'bg-violet-100 text-violet-800',
  'bg-pink-100 text-pink-800',
  'bg-teal-100 text-teal-800',
  'bg-orange-100 text-orange-800',
]

const PRIORITY_STYLES = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-emerald-100 text-emerald-700',
}

function toId(label) {
  return label.trim().toLowerCase().replace(/\s+/g, '_')
}

export default function Categories() {

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
  const [editPriority, setEditPriority] = useState('medium')

  useEffect(() => {

    async function load() {

      try {

        const [cats, taskData] = await Promise.all([
          getCategories(),
          getTasks(),
        ])

        setCategories(Array.isArray(cats) ? cats : [])
        setTasks(Array.isArray(taskData) ? taskData : [])

      } catch (err) {
        console.error('Could not fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    load()

  }, [])

  useEffect(() => {
    if (addingCat) {
      newCatInputRef.current?.focus()
    }
  }, [addingCat])

  // CATEGORY TAG COLORS
  const tagClasses = Object.fromEntries(
    (categories || []).map((c, i) => [
      c?.name,
      TAG_PALETTE[i % TAG_PALETTE.length]
    ])
  )

  // FILTERED TASKS
  const filtered =
    activeFilter === 'All'
      ? tasks
      : tasks.filter((t) => t.category === activeFilter)

  // ADD CATEGORY
  async function handleAddCategory() {

    const label = newCatLabel.trim()

    if (!label) {
      setAddingCat(false)
      setNewCatLabel('')
      return
    }

    const id = toId(label)

    if (categories.find((c) => c.id === id)) {
      setNewCatLabel('')
      setAddingCat(false)
      return
    }

    try {

      const saved = await createCategory({
        id,
        name: label,
      })

      setCategories((prev) => [...prev, saved])

    } catch (err) {
      console.error('Could not add category:', err)
    }

    setNewCatLabel('')
    setAddingCat(false)
  }

  // DELETE CATEGORY
  async function handleDeleteCategory(catId, catName) {

    try {

      await deleteCategory(catId)

      setCategories((prev) =>
        prev.filter((c) => c.id !== catId)
      )

      if (activeFilter === catName) {
        setActiveFilter('All')
      }

    } catch (err) {
      console.error('Could not delete category:', err)
    }
  }

  // EDIT TASK
  function handleEditTask(task) {

    setEditingTaskId(task.id)
    setEditName(task.name)
    setEditCat(task.category)
    setEditPriority(task.priority || 'medium')
  }

  // SAVE TASK
  async function handleSaveTask(id) {

    const updated = {
      name: editName.trim() || 'Untitled',
      category: editCat,
      priority: editPriority,
    }

    try {

      await updateTask(id, updated)

      setTasks((prev) =>
        prev.map((t) =>
          t.id === id
            ? { ...t, ...updated }
            : t
        )
      )

    } catch (err) {
      console.error('Could not update task:', err)
    }

    setEditingTaskId(null)
  }

  // DELETE TASK
  async function handleDeleteTask(id) {

    try {

      await deleteTask(id)

      setTasks((prev) =>
        prev.filter((t) => t.id !== id)
      )

      if (editingTaskId === id) {
        setEditingTaskId(null)
      }

    } catch (err) {
      console.error('Could not delete task:', err)
    }
  }

  return (

    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

      {/* HEADER */}
      <div className="mb-6">

        <div className="flex items-center gap-2 mb-1">

          <Folders
            size={18}
            className="text-violet-500 shrink-0"
          />

          <h1 className="text-sm font-semibold text-gray-800">
            Categories
          </h1>

        </div>

        <p className="text-xs text-gray-400">
          Browse and manage tasks by category.
        </p>

      </div>

      <div className="max-w-2xl w-full">

        {/* FILTER BAR */}
        <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 mb-6 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">

          {/* ADD CATEGORY */}
          {addingCat ? (

            <input
              ref={newCatInputRef}
              value={newCatLabel}
              onChange={(e) => setNewCatLabel(e.target.value)}
              onKeyDown={(e) => {

                if (e.key === 'Enter') {
                  handleAddCategory()
                }

                if (e.key === 'Escape') {
                  setAddingCat(false)
                  setNewCatLabel('')
                }
              }}
              onBlur={handleAddCategory}
              placeholder="Category…"
              className="px-3 py-1.5 text-sm rounded-full border border-violet-400 outline-none w-32 sm:w-36 bg-white shrink-0"
            />

          ) : (

            <button
              onClick={() => setAddingCat(true)}
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 text-gray-400 flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 shrink-0"
            >
              <Plus size={16} />
            </button>

          )}

          {/* ALL */}
          <button
            onClick={() => {
              setActiveFilter('All')
              setEditingTaskId(null)
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm border whitespace-nowrap shrink-0 ${
              activeFilter === 'All'
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            All
          </button>

          {/* CATEGORIES */}
          {categories.map((cat) => (

            <div
              key={cat.id}
              className="relative group flex items-center shrink-0"
            >

              <button
                onClick={() => {
                  setActiveFilter(cat.name)
                  setEditingTaskId(null)
                }}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-sm border whitespace-nowrap pr-6 sm:pr-7 ${
                  activeFilter === cat.name
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-500 border-gray-200'
                }`}
              >
                {cat.name}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteCategory(cat.id, cat.name)
                }}
                className="absolute right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>

            </div>

          ))}

        </div>

        {/* TASK LIST */}
        <div className="flex flex-col gap-3">

          {loading ? (

            <p className="text-sm text-gray-300 text-center py-10">
              Loading...
            </p>

          ) : filtered.length === 0 ? (

            <div className="text-center py-10">

              <Folders
                size={32}
                className="mx-auto text-gray-200 mb-2"
              />

              <p className="text-sm text-gray-300">
                No tasks in this category.
              </p>

            </div>

          ) : (

            filtered.map((task) =>

              editingTaskId === task.id ? (

                <div
                  key={task.id}
                  className="flex flex-col gap-3 bg-white border border-violet-200 rounded-xl px-3 sm:px-4 py-3"
                >

                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="text-sm text-gray-800 outline-none"
                  />

                  <div className="flex flex-wrap gap-2">

                    {/* CATEGORY */}
                    <select
                      value={editCat}
                      onChange={(e) => setEditCat(e.target.value)}
                      className="text-xs rounded-full border px-3 py-1 bg-gray-50"
                    >
                      {categories.map((c) => (
                        <option
                          key={c.id}
                          value={c.name}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>

                    {/* PRIORITY */}
                    <select
                      value={editPriority}
                      onChange={(e) =>
                        setEditPriority(e.target.value)
                      }
                      className="text-xs rounded-full border px-3 py-1 bg-gray-50"
                    >
                      <option value="high">
                        High
                      </option>

                      <option value="medium">
                        Medium
                      </option>

                      <option value="low">
                        Low
                      </option>
                    </select>

                  </div>

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        handleSaveTask(task.id)
                      }
                    >
                      <Check
                        size={16}
                        className="text-emerald-600"
                      />
                    </button>

                    <button
                      onClick={() =>
                        setEditingTaskId(null)
                      }
                    >
                      <X
                        size={16}
                        className="text-gray-400"
                      />
                    </button>

                  </div>

                </div>

              ) : (

                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-3 sm:px-4 py-3"
                >

                  <span className="flex-1 text-sm text-gray-800 min-w-0 truncate">
                    {task.name}
                  </span>

                  {/* CATEGORY */}
                  <span
                    className={`text-xs px-2 sm:px-3 py-1 rounded-full whitespace-nowrap ${
                      tagClasses[task.category]
                      ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {task.category}
                  </span>

                  {/* PRIORITY */}
                  <span
                    className={`text-xs px-2 sm:px-3 py-1 rounded-full capitalize whitespace-nowrap ${
                      PRIORITY_STYLES[task.priority]
                      ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {task.priority || 'medium'}
                  </span>

                  <button
                    onClick={() =>
                      handleEditTask(task)
                    }
                  >
                    <Pen
                      size={14}
                      className="text-gray-400"
                    />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteTask(task.id)
                    }
                  >
                    <X
                      size={14}
                      className="text-gray-400 hover:text-red-500"
                    />
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