# Zen Planner

**Zen Planner** is a modern student task management and productivity web application designed to help students organize their academic workload efficiently. It provides an intuitive dashboard to manage tasks, track progress, visualize productivity, and stay on top of deadlines.

---

##  Features

*  Task creation, updating, and deletion
*  Mark tasks as completed or pending
*  Priority-based task system (High, Medium, Low)
*  Dynamic category management
*  Analytics dashboard with charts and insights
*  Smart alerts for overdue, due today, and upcoming tasks
* Daily task overview (today-focused view)
*  Progress tracking with visual indicators
* Clean, responsive, student-friendly UI

---

##  Tech Stack & Libraries

###  Frontend

* **React.js** – Component-based UI development
* **React Router DOM** – Page routing and navigation
* **Vite** – Fast development build tool

###  Styling & UI

* **Tailwind CSS** – Utility-first CSS framework for responsive design
* **Lucide React** – Modern icon library

###  Data Visualization

* **Recharts** – Charts for dashboard analytics (bar, pie charts, )

###  API & Data Handling

* **Fetch API** – Native JavaScript API for HTTP requests
* **JSON Server** – Mock REST API backend for tasks and categories

### State Management

* **React Hooks** (`useState`, `useEffect`) – Local state and lifecycle handling

---

## Project Structure

```
src/
│
├── components/
│   └── homepage/
│       ├── completed-tasks.jsx
│       ├── pending-tasks.jsx
│       ├── progress-bar.jsx
│       ├── quick-nav.jsx
│       └── greeting.jsx
│
├── layouts/
│   └── sidebar.jsx
│
├── pages/
│   ├── home.jsx
│   ├── dashboard.jsx
│   ├── add-task.jsx
│   ├── categories.jsx
│   └── alerts.jsx
│
├── services/
│   └── api.js
│
├── App.jsx
└── main.jsx
```

---

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/zen-planner.git
cd zen-planner
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

### 4. Start JSON Server (Mock Backend)

```bash
npm install -g json-server
json-server --watch db.json --port 3001
```

---

##  API Endpoints

### Tasks

* `GET /tasks` – Fetch all tasks
* `POST /tasks` – Create a new task
* `PATCH /tasks/:id` – Update task
* `DELETE /tasks/:id` – Delete task

### Categories

* `GET /categories` – Fetch categories
* `POST /categories` – Create category
* `DELETE /categories/:id` – Delete category

---

##  Key Highlights

* Fully modular React architecture
* Real-time task updates
* Clean separation of UI, logic, and API layer
* Scalable structure for future authentication and backend upgrade
* Optimized for mobile and desktop users

---

##  Future Improvements

* User authentication (login/register system)
* Cloud database integration (MongoDB / Firebase)
* Push notifications for reminders
* Drag-and-drop task organization
* Mobile app version (React Native)

---
## Designed by A Team Of 4 Software Developers
* Mitchelle Wanjugu
* Samson Kangara
* Lynet Murathimi
* Brian Ngoyoni
