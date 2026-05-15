import { useState, useEffect } from 'react'
import { Check, ChevronDown, CirclePlus, Plus } from 'lucide-react'

//  IMPORT API FUNCTIONS
import {
  createTask,
  getCategories,
  createCategory,
} from '../services/api'

// Constants
const PRIORITY_OPTIONS = [
  {
    label: 'High',
    dot: 'bg-red-500',
    text: 'text-red-600',
    hoverBg: 'hover:bg-red-50',
    activeBg: 'bg-red-50',
    hint: 'Urgent attention needed',
  },
  {
    label: 'Medium',
    dot: 'bg-amber-400',
    text: 'text-amber-600',
    hoverBg: 'hover:bg-amber-50',
    activeBg: 'bg-amber-50',
    hint: 'Can wait a little',
  },
  {
    label: 'Low',
    dot: 'bg-emerald-500',
    text: 'text-emerald-600',
    hoverBg: 'hover:bg-emerald-50',
    activeBg: 'bg-emerald-50',
    hint: 'Low urgency',
  },
]

const DEFAULT_CATEGORIES = [
  'Labs',
  'Quizzes',
  'Assignments',
]

// Field Wrapper
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">

      <label className="text-xs font-semibold tracking-widest uppercase text-gray-400">
        {label}
      </label>

      {children}

      {error && (
        <p className="text-red-500 text-xs font-medium">
          {error}
        </p>
      )}

    </div>
  )
}

// Main Component
export default function AddTask({ onTaskAdded }) {

  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [deadline, setDeadline] = useState('')
  const [reminder, setReminder] = useState('')

  //  STATE 
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES)

  const [selectedCategory, setSelectedCategory] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const selectedPriority = PRIORITY_OPTIONS.find(
    (p) => p.label === priority
  )

  // LOAD SERVER CATEGORIES
  useEffect(() => {
    async function loadCats() {
      try {
        const data = await getCategories()
        if (data && Array.isArray(data)) {
          setCategories(data)
        }
      } catch (err) {
        console.error('Could not load categories:', err)
      }
    }

    loadCats()
  }, [])

  function validate() {

    const e = {}

    if (!task.trim()) {
      e.task = 'Task name is required.'
    }

    if (!priority) {
      e.priority = 'Please select a priority.'
    }

    if (!deadline) {
      e.deadline = 'Please pick a deadline.'
    }

    if (!selectedCategory) {
      e.category = 'Please select a category.'
    }

    return e
  }

  async function handleSubmit() {

    const errs = validate()

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setErrors({})
    setSubmitting(true)

    try {

      const newTask = {
        name: task,
        priority: priority.toLowerCase(),
        deadline,
        reminder,
        category: selectedCategory,
        completed: false,
        createdAt: new Date().toISOString(),
      }

      const saved = await createTask(newTask)

      if (onTaskAdded) {
        onTaskAdded(saved)
      }

      setTask('')
      setPriority('')
      setDeadline('')
      setReminder('')
      setSelectedCategory('')

      setSubmitted(true)

      setTimeout(() => {
        setSubmitted(false)
      }, 3000)

    } catch {

      setErrors({
        submit:
          'Could not save — is json-server running on port 3001?',
      })

    } finally {

      setSubmitting(false)
    }
  }

  async function handleAddCategory() {

    const trimmed = newCategory.trim()

    if (!trimmed || categories.some((c) => c.name === trimmed)) {
      setNewCategory('')
      setIsAdding(false)
      return
    }

    try {

      const categoryData = {
        id: trimmed.toLowerCase().replace(/\s+/g, '_'),
        name: trimmed,
      }

      const saved = await createCategory(categoryData)

      // keeping server format consistent
      setCategories((prev) => [...prev, saved])

      setSelectedCategory(saved.name)

    } catch (err) {

      console.error('Could not create category:', err)
    }

    setNewCategory('')
    setIsAdding(false)
  }

  const baseInput =
    'w-full rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-150 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100'

  const errorInput =
    'w-full rounded-xl bg-red-50 border border-red-300 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition duration-150 focus:ring-2 focus:ring-red-100'

  return (

    <div className="min-h-screen bg-gray-50 px-6 py-8">

      {/* Page header */}
      <div className="mb-6">

        <div className="flex items-center gap-2 mb-1">
          <CirclePlus
            size={18}
            className="text-amber-500"
          />

          <h1 className="text-sm font-semibold text-gray-800">
            Add Task
          </h1>
        </div>

        <p className="text-xs text-gray-400">
          Fill in the details below to add a new task
          to your planner.
        </p>

      </div>

      {/* Form card */}
      <div className="bg-white border border-gray-200 rounded-2xl px-6 py-6 flex flex-col gap-5 max-w-2xl">

        {/* Banners */}
        {submitted && (

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-2.5 text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Task added successfully!
          </div>

        )}

        {errors.submit && (

          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-2.5 text-sm font-medium">
            {errors.submit}
          </div>

        )}

        {/* Task name */}
        <Field label="Task" error={errors.task}>

          <input
            className={errors.task ? errorInput : baseInput}
            placeholder="What do you need to do?"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

        </Field>

        {/* Priority dropdown */}
        <Field label="Priority" error={errors.priority}>

          <div className="relative">

            <button
              type="button"
              onClick={() => setShowDropdown((v) => !v)}
              className={`w-full rounded-xl px-4 py-2.5 text-sm flex items-center justify-between outline-none transition duration-150 border
                ${
                  showDropdown
                    ? 'border-violet-400 bg-white ring-2 ring-violet-100'
                    : errors.priority
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
            >

              <span className="flex items-center gap-2.5">

                {selectedPriority ? (
                  <>
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedPriority.dot}`}
                    />

                    <span
                      className={`font-semibold ${selectedPriority.text}`}
                    >
                      {selectedPriority.label}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-400">
                    Select priority…
                  </span>
                )}

              </span>

              <span
                className={`text-gray-400 text-xs transition-transform duration-200 ${
                  showDropdown ? 'rotate-180' : ''
                }`}
              >
                <ChevronDown />
              </span>

            </button>

            {showDropdown && (

              <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">

                {PRIORITY_OPTIONS.map((opt) => (

                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => {
                      setPriority(opt.label)
                      setShowDropdown(false)
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition duration-100 ${opt.hoverBg} ${
                      priority === opt.label
                        ? opt.activeBg
                        : ''
                    }`}
                  >

                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${opt.dot}`}
                    />

                    <span
                      className={`font-semibold ${opt.text}`}
                    >
                      {opt.label}
                    </span>

                    <span className="text-gray-400 text-xs ml-auto">
                      {opt.hint}
                    </span>

                  </button>

                ))}

              </div>

            )}

          </div>

        </Field>

        {/* Deadline + Reminder */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Field label="Deadline" error={errors.deadline}>

            <input
              type="datetime-local"
              className={errors.deadline ? errorInput : baseInput}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />

          </Field>

          <Field label="Set Reminder">

            <input
              type="datetime-local"
              className={baseInput}
              value={reminder}
              onChange={(e) => setReminder(e.target.value)}
            />

          </Field>

        </div>

        {/* Categories */}
        <Field label="Category" error={errors.category}>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">

            {!isAdding && (

              <button
                type="button"
                onClick={() => setIsAdding(true)}
                title="Add a new category"
                className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-lg leading-none hover:bg-violet-100 hover:border-violet-300 hover:text-violet-600 transition duration-150"
              >
                <Plus />
              </button>

            )}

            {isAdding && (

              <div className="flex items-center gap-1.5">

                <input
                  autoFocus
                  className="rounded-lg border border-violet-400 bg-white px-2.5 py-1.5 text-sm outline-none w-32 focus:ring-2 focus:ring-violet-100 transition duration-150"
                  placeholder="New category…"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={(e) => {

                    if (e.key === 'Enter') {
                      handleAddCategory()
                    }

                    if (e.key === 'Escape') {
                      setIsAdding(false)
                      setNewCategory('')
                    }
                  }}
                />

                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="w-7 h-7 rounded-full bg-violet-600 text-white text-sm flex items-center justify-center hover:bg-violet-700 transition duration-150"
                >
                  <Check />
                </button>

              </div>

            )}

            {categories.map((cat) => (

              <button
                key={cat.id}
                type="button"
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === cat.name ? '' : cat.name
                  )
                }
                className={
                  selectedCategory === cat.name
                    ? 'rounded-full border px-4 py-1 text-sm font-medium bg-violet-600 border-violet-600 text-white transition-all duration-150'
                    : 'rounded-full border px-4 py-1 text-sm font-medium bg-white border-gray-200 text-gray-600 hover:border-violet-300 hover:text-violet-700 transition-all duration-150'
                }
              >
                {cat.name}
              </button>

            ))}

          </div>

        </Field>

        {/* Submit */}
        <div className="pt-1">

          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmit}
            className="w-full rounded-xl bg-violet-600 text-white text-sm font-semibold py-2.5 hover:bg-violet-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Saving…' : 'Add Task'}
          </button>

        </div>

      </div>

    </div>
  )
}