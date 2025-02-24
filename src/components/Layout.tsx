import { Outlet, NavLink } from 'react-router-dom'
import { Calendar, Clock, LayoutGrid } from 'lucide-react'

const Layout = () => {
  return (
    <div className="min-h-screen flex">
      <nav className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="text-xl font-bold mb-8">Scheduling App</h1>
        <div className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <LayoutGrid size={20} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/event-types"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Calendar size={20} />
            <span>Event Types</span>
          </NavLink>
          <NavLink
            to="/availability"
            className={({ isActive }) =>
              `flex items-center space-x-2 p-2 rounded ${
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <Clock size={20} />
            <span>Availability</span>
          </NavLink>
        </div>
      </nav>
      <main className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
