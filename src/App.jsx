import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './layouts/sidebar'
import Home from './pages/home'
import Dashboard from './pages/dashboard'
import AddTask from './pages/add-task'
import Categories from './pages/categories'
import Alerts from './pages/alerts'

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route element={<Sidebar />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/alerts" element={<Alerts />} />
        </Route>

      </Routes>
    </BrowserRouter>
  )
}