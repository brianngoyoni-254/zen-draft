import { useState, useEffect } from 'react'
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  ChartColumnStacked,
  CirclePlus,
  Folders,
  Bell,
  House,
  Menu,
  X,
} from 'lucide-react'

const navLinks = [
  {
    label: 'Dashboard',
    icon: ChartColumnStacked,
    path: '/dashboard',
    accent: 'emerald',
  },
  {
    label: 'Add Task',
    icon: CirclePlus,
    path: '/add-task',
    accent: 'amber',
  },
  {
    label: 'Categories',
    icon: Folders,
    path: '/categories',
    accent: 'violet',
  },
  {
    label: 'Alerts',
    icon: Bell,
    path: '/alerts',
    accent: 'rose',
  },
]

const ACCENT_STYLES = {
  emerald: {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: 'bg-emerald-100 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  amber: {
    active: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: 'bg-amber-100 text-amber-600',
    dot: 'bg-amber-500',
  },
  violet: {
    active: 'bg-violet-50 text-violet-700 border-violet-200',
    icon: 'bg-violet-100 text-violet-600',
    dot: 'bg-violet-500',
  },
  rose: {
    active: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: 'bg-rose-100 text-rose-600',
    dot: 'bg-rose-500',
  },
}

export default function Sidebar() {

  // STATES
  const [open, setOpen] = useState(false)

  // HOOKS
  const navigate = useNavigate()
  const location = useLocation()

  // CLOSE SIDEBAR ON ROUTE CHANGE
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  // LOCK BODY SCROLL ON MOBILE
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (

    <div className="min-h-screen w-full bg-gray-50 flex">

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-200
          flex flex-col z-30
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:sticky md:top-0
        `}
      >

        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">

          <span className="text-base font-semibold text-violet-600 tracking-tight">
            Zen<span className="text-gray-900">Planner</span>
          </span>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={18} />
          </button>

        </div>

        {/* Home */}
        <div className="px-3 pt-4 pb-2">

          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-800 hover:bg-gray-50 group"
          >

            <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200">
              <House size={16} className="text-gray-500" />
            </span>

            Home

          </button>

        </div>

        {/* Pages divider */}
        <div className="px-5 pb-2">

          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Pages
          </p>

        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">

          {navLinks.map(({ label, icon: Icon, path, accent }) => {

            const styles = ACCENT_STYLES[accent]

            return (

              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm border
                  ${
                    isActive
                      ? `${styles.active} border font-medium`
                      : 'text-gray-500 border-transparent hover:text-gray-800 hover:bg-gray-50'
                  }`
                }
              >

                {({ isActive }) => (
                  <>

                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center
                      ${
                        isActive
                          ? styles.icon
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon size={16} />
                    </span>

                    <span className="flex-1">
                      {label}
                    </span>

                    {isActive && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${styles.dot}`}
                      />
                    )}

                  </>
                )}

              </NavLink>

            )
          })}

        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100">

          <p className="text-xs text-gray-300">
            Zen Planner &copy; {new Date().getFullYear()}
          </p>

        </div>

      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-gray-200">

          <button
            onClick={() => setOpen(true)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>

          <span className="text-sm font-semibold text-gray-900">
            Zen<span className="text-violet-600">Planner</span>
          </span>

          <div className="w-8" />

        </header>

        {/* Page content */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>

      </div>

    </div>
  )
}