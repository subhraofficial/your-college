import { useState, useEffect } from 'react';
import { getColleges, createCollege, updateCollege, deleteCollege } from '../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', image: '', city: '', state: '', location: '', type: 'Private', description: '', courses: '', fees: '', eligibility: '', admissionInfo: '', website: '', featured: false, status: 'active' };

export default function AdminColleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const r = await getColleges({}); setColleges(r.data.colleges || []); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => {
    setEditing(c._id);
    setForm({ ...c, courses: Array.isArray(c.courses) ? c.courses.join(', ') : c.courses });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY); };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('College name is required'); return; }
    setSaving(true);
    try {
      const payload = { ...form, courses: form.courses ? form.courses.split(',').map(s => s.trim()).filter(Boolean) : [] };
      if (editing) { await updateCollege(editing, payload); toast.success('College updated!'); }
      else { await createCollege(payload); toast.success('College added!'); }
      closeModal(); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this college?')) return;
    try { await deleteCollege(id); toast.success('Deleted'); fetch(); } catch { toast.error('Failed to delete'); }
  };

  const toggleStatus = async (c) => {
    try {
      await updateCollege(c._id, { status: c.status === 'active' ? 'inactive' : 'active' });
      fetch();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Colleges</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <FiPlus /> Add College
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : colleges.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No colleges yet. Add your first college!</p>
            <button onClick={openAdd} className="mt-4 btn-primary">Add College</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['College', 'Location', 'Type', 'Featured', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {colleges.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.city}, {c.state}</td>
                    <td className="px-5 py-3 text-gray-600">{c.type}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${c.featured ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.featured ? '⭐ Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={() => toggleStatus(c)}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${c.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {c.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(c)} className="text-blue-600 hover:text-blue-800 p-1"><FiEdit2 size={15} /></button>
                        <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700 p-1"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">{editing ? 'Edit College' : 'Add College'}</h2>
              <button onClick={closeModal}><FiX size={22} className="text-gray-400 hover:text-gray-600" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">College Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Image URL</label>
                <input name="image" value={form.image} onChange={handleChange} className="input-field" placeholder="https://..." />
              </div>
              <div>
                <label className="label">City</label>
                <input name="city" value={form.city} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="label">State</label>
                <input name="state" value={form.state} onChange={handleChange} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Location</label>
                <input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Full address or area" />
              </div>
              <div>
                <label className="label">College Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="input-field">
                  {['Government', 'Private', 'Deemed', 'Autonomous'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Approximate Fees</label>
                <input name="fees" value={form.fees} onChange={handleChange} className="input-field" placeholder="e.g. ₹1-2 Lakhs/Year" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Courses (comma separated)</label>
                <input name="courses" value={form.courses} onChange={handleChange} className="input-field" placeholder="BBA, MBA, BCA" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Eligibility</label>
                <input name="eligibility" value={form.eligibility} onChange={handleChange} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Admission Information</label>
                <textarea name="admissionInfo" value={form.admissionInfo} onChange={handleChange} rows={2} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">College Website</label>
                <input name="website" value={form.website} onChange={handleChange} className="input-field" placeholder="https://" />
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" name="featured" id="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 text-blue-600" />
                <label htmlFor="featured" className="text-sm font-medium text-gray-700">Mark as Featured</label>
              </div>
              <div className="sm:col-span-2 flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update College' : 'Add College'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
