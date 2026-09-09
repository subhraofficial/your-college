import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeads, deleteLead, updateLead } from '../services/api';
import { FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  'Follow-up': 'bg-purple-100 text-purple-700',
  Converted: 'bg-green-100 text-green-700',
  'Not Interested': 'bg-red-100 text-red-700',
};

const STATUSES = ['New', 'Contacted', 'Follow-up', 'Converted', 'Not Interested'];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const r = await getLeads(params);
      setLeads(r.data.leads || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSearch = e => { e.preventDefault(); fetch(); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try { await deleteLead(id); toast.success('Lead deleted'); fetch(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleStatusChange = async (id, status) => {
    try { await updateLead(id, { status }); fetch(); toast.success('Status updated'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Leads</h1>
        <span className="text-sm text-gray-500">{leads.length} lead{leads.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <FiSearch className="ml-3 text-gray-400" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 outline-none text-sm"
              placeholder="Search by name, mobile, college, course..."
            />
          </div>
          <select
            value={statusFilter} onChange={e => { setStatusFilter(e.target.value); }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none sm:w-44"
          >
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit" className="btn-primary py-2 px-5">Filter</button>
          <button type="button" onClick={() => { setSearch(''); setStatusFilter(''); setTimeout(fetch, 0); }}
            className="border border-gray-300 text-gray-600 py-2 px-4 rounded-lg text-sm hover:bg-gray-50">Clear</button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No leads found. Student enquiries will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['Name', 'Mobile', 'Course', 'College', 'Date', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link to={`/admin/leads/${lead._id}`} className="hover:text-blue-600">{lead.studentName}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.mobile}</td>
                    <td className="px-4 py-3 text-gray-600">{lead.course || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{lead.college || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={e => handleStatusChange(lead._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/leads/${lead._id}`} className="text-blue-600 hover:text-blue-800 p-1"><FiEye size={15} /></Link>
                        <button onClick={() => handleDelete(lead._id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
