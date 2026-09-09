import { Link } from 'react-router-dom';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-xl font-bold mb-3">YOUR COLLEGE</h3>
          <p className="text-sm leading-relaxed">Helping students find the right college and get the right admission guidance.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/',  'Home'], ['/colleges', 'Colleges'], ['/courses', 'Courses'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
              <li key={to}><Link to={to} className="hover:text-blue-400 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FiPhone size={14} /> +91 97354 45579</li>
            <li className="flex items-center gap-2"><FiMail size={14} /> info@yourcollege.com</li>
            <li className="flex items-center gap-2"><FiMapPin size={14} /> Kolkata, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        © {new Date().getFullYear()} Your College. All rights reserved.
      </div>
    </footer>
  );
}
