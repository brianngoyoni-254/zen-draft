const API = 'http://localhost:3001'


//TASKS


// GET all tasks
export async function getTasks() {
  const res = await fetch(`${API}/tasks`)
  if (!res.ok) throw new Error('Failed to fetch tasks')
  return res.json()
}

// CREATE task
export async function createTask(task) {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  })
  if (!res.ok) throw new Error('Failed to create task')
  return res.json()
}

// UPDATE task
export async function updateTask(id, updates) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error('Failed to update task')
  return res.json()
}

// DELETE task
export async function deleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete task')
  return res.json()
}


// GET categories
export async function getCategories() {
  const res = await fetch(`${API}/categories`)
  if (!res.ok) throw new Error('Failed to fetch categories')
  return res.json() // [{id, name}]
}

// CREATE category
export async function createCategory(category) {
  const res = await fetch(`${API}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category), // MUST be {id, name}
  })
  if (!res.ok) throw new Error('Failed to create category')
  return res.json()
}

// DELETE category
export async function deleteCategory(id) {
  const res = await fetch(`${API}/categories/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete category')
  return res.json()
}

//alerts

export async function getAlerts() {
  const res = await fetch(`${API}/alerts`)
  if (!res.ok) throw new Error('Failed to fetch alerts')
  return res.json()
}