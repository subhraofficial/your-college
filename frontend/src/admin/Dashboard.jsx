import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/api';
import { HiOutlineAcademicCap, HiOutlineBookOpen, HiOutlineUsers, HiOutlineBell } from 'react-icons/hi';

const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  'Follow-up': 'bg-purple-100 text-purple-700',
  Converted: 'bg-green-100 text-green-700',
  'Not Interested': 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Total Colleges', value: data?.stats?.totalColleges ?? '-', icon: HiOutlineAcademicCap, color: 'blue', link: '/admin/colleges' },
    { label: 'Total Courses', value: data?.stats?.totalCourses ?? '-', icon: HiOutlineBookOpen, color: 'indigo', link: '/admin/courses' },
    { label: 'Total Leads', value: data?.stats?.totalLeads ?? '-', icon: HiOutlineUsers, color: 'green', link: '/admin/leads' },
    { label: 'New Leads', value: data?.stats?.newLeads ?? '-', icon: HiOutlineBell, color: 'orange', link: '/admin/leads?status=New' },
  ];

  const colorMap = { blue: 'bg-blue-100 text-blue-600', indigo: 'bg-indigo-100 text-indigo-600', green: 'bg-green-100 text-green-600', orange: 'bg-orange-100 text-orange-600' };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(s => (
          <Link to={s.link} key={s.label} className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[s.color]}`}>
                <s.icon size={20} />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-gray-900">
              {loading ? <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" /> : s.value}
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Student Leads</h2>
          <Link to="/admin/leads" className="text-blue-600 text-sm hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
            </div>
          ) : data?.recentLeads?.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <HiOutlineUsers size={40} className="mx-auto mb-2" />
              <p>No leads yet. They'll appear here when students enquire.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['Student', 'Phone', 'Course', 'College', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.recentLeads?.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      <Link to={`/admin/leads/${lead._id}`} className="hover:text-blue-600">{lead.studentName}</Link>
                    </td>
                    <td className="px-5 py-3 text-gray-600">{lead.mobile}</td>
                    <td className="px-5 py-3 text-gray-600">{lead.course || '-'}</td>
                    <td className="px-5 py-3 text-gray-600 max-w-xs truncate">{lead.college || '-'}</td>
                    <td className="px-5 py-3 text-gray-500">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>{lead.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
