import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/colleges', label: 'Colleges' },
    { to: '/courses', label: 'Courses' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* ================= LOGO ================= */}
          <Link
  to="/"
  className="flex items-center gap-3 shrink-0"
  onClick={() => setOpen(false)}
>
  <img
    src="/icon.jpeg"
    alt="Your College"
    className="w-11 h-11 object-contain"
  />

  <span className="text-2xl font-bold text-blue-700 tracking-tight whitespace-nowrap">
    YOUR COLLEGE
  </span>
</Link>

          {/* ================= DESKTOP MENU ================= */}
          <div className="hidden md:flex items-center gap-6">

            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <Link
              to="/contact"
              className="btn-primary text-sm py-2 px-4 whitespace-nowrap"
            >
              Get Admission Guidance
            </Link>

          </div>

          {/* ================= MOBILE BUTTON ================= */}
          <button
            className="md:hidden text-gray-600 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3">

          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium py-2 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-blue-600'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}

          <Link
            to="/contact"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm py-2 px-4 text-center"
          >
            Get Admission Guidance
          </Link>

        </div>
      )}
    </nav>
  );
}