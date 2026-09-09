import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineAcademicCap, HiOutlineBookOpen,
  HiOutlineUsers, HiOutlineCog, HiOutlineMenuAlt2, HiOutlineX, HiOutlineLogout
} from 'react-icons/hi';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: HiOutlineHome, end: true },
  { to: '/admin/colleges', label: 'Colleges', icon: HiOutlineAcademicCap },
  { to: '/admin/courses', label: 'Courses', icon: HiOutlineBookOpen },
  { to: '/admin/leads', label: 'Student Leads', icon: HiOutlineUsers },
  { to: '/admin/settings', label: 'Settings', icon: HiOutlineCog },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/admin/login'); };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`}>
      <div className="p-5 border-b border-blue-800">
        <Link to="/" className="text-white font-bold text-lg">YOUR COLLEGE</Link>
        <p className="text-blue-300 text-xs mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`
            }>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-blue-800">
        <div className="text-blue-300 text-xs mb-2 px-1">Logged in as <span className="text-white">{admin?.name}</span></div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-blue-200 hover:text-white text-sm w-full px-4 py-2 rounded-lg hover:bg-blue-800 transition-colors">
          <HiOutlineLogout size={18} /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-900 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-64 bg-blue-900 z-50">
            <button className="absolute top-4 right-4 text-white" onClick={() => setSidebarOpen(false)}>
              <HiOutlineX size={22} />
            </button>
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm h-14 flex items-center px-4 gap-3">
          <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <HiOutlineMenuAlt2 size={24} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
