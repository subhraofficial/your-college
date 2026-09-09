import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getLead, updateLead, deleteLead } from '../services/api';
import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STATUSES = ['New', 'Contacted', 'Follow-up', 'Converted', 'Not Interested'];
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Contacted: 'bg-yellow-100 text-yellow-700',
  'Follow-up': 'bg-purple-100 text-purple-700',
  Converted: 'bg-green-100 text-green-700',
  'Not Interested': 'bg-red-100 text-red-700',
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLead(id)
      .then(r => { setLead(r.data.lead); setStatus(r.data.lead.status); setAdminNotes(r.data.lead.adminNotes || ''); })
      .catch(() => toast.error('Lead not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateLead(id, { status, adminNotes });
      toast.success('Changes saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try { await deleteLead(id); toast.success('Lead deleted'); navigate('/admin/leads'); }
    catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;
  if (!lead) return <div className="text-center py-20"><p className="text-gray-500">Lead not found.</p><Link to="/admin/leads" className="mt-4 btn-primary inline-block">Back to Leads</Link></div>;

  const InfoRow = ({ label, value }) => value ? (
    <div className="flex flex-col sm:flex-row sm:items-center py-2.5 border-b last:border-0">
      <span className="text-sm text-gray-500 sm:w-40 font-medium">{label}</span>
      <span className="text-sm text-gray-900 mt-0.5 sm:mt-0">{value}</span>
    </div>
  ) : null;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <Link to="/admin/leads" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm">
          <FiArrowLeft size={14} /> Back to Leads
        </Link>
        <button onClick={handleDelete} className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm">
          <FiTrash2 size={14} /> Delete Lead
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{lead.studentName}</h1>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[lead.status] || 'bg-gray-100 text-gray-600'}`}>{lead.status}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        {/* Student Details */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Student Details</h2>
          <InfoRow label="Name" value={lead.studentName} />
          <InfoRow label="Mobile" value={lead.mobile} />
          <InfoRow label="Email" value={lead.email} />
          <InfoRow label="City" value={lead.city} />
        </div>

        {/* Enquiry Details */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-3 pb-2 border-b">Enquiry Details</h2>
          <InfoRow label="Course" value={lead.course} />
          <InfoRow label="Preferred College" value={lead.college} />
          <InfoRow label="Date & Time" value={new Date(lead.createdAt).toLocaleString('en-IN')} />
          {lead.message && (
            <div className="py-2.5">
              <span className="text-sm text-gray-500 font-medium block mb-1">Message</span>
              <p className="text-sm text-gray-900 bg-gray-50 rounded-lg p-3">{lead.message}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status + Notes */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4 pb-2 border-b">Manage Lead</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Lead Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input-field max-w-xs">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              rows={4}
              className="input-field resize-none"
              placeholder="Add your notes about this student..."
            />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
