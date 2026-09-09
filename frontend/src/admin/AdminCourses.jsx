import { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse } from '../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const EMPTY = { name: '', duration: '', eligibility: '', description: '', status: 'active' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try { const r = await getCourses(); setCourses(r.data.courses || []); } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setShowModal(true); };
  const openEdit = (c) => { setEditing(c._id); setForm({ ...c }); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); setForm(EMPTY); };

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Course name is required'); return; }
    setSaving(true);
    try {
      if (editing) { await updateCourse(editing, form); toast.success('Course updated!'); }
      else { await createCourse(form); toast.success('Course added!'); }
      closeModal(); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try { await deleteCourse(id); toast.success('Deleted'); fetch(); } catch { toast.error('Failed to delete'); }
  };

  const toggleStatus = async (c) => {
    try { await updateCourse(c._id, { status: c.status === 'active' ? 'inactive' : 'active' }); fetch(); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><FiPlus /> Add Course</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p>No courses yet.</p>
            <button onClick={openAdd} className="mt-4 btn-primary">Add Course</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  {['Course Name', 'Duration', 'Eligibility', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.map(c => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-5 py-3 text-gray-600">{c.duration || '-'}</td>
                    <td className="px-5 py-3 text-gray-600">{c.eligibility || '-'}</td>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">{editing ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={closeModal}><FiX size={22} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Course Name *</label>
                <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
              </div>
              <div>
                <label className="label">Duration</label>
                <input name="duration" value={form.duration} onChange={handleChange} className="input-field" placeholder="e.g. 3 Years" />
              </div>
              <div>
                <label className="label">Eligibility</label>
                <input name="eligibility" value={form.eligibility} onChange={handleChange} className="input-field" placeholder="e.g. 10+2" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" />
              </div>
              <div>
                <label className="label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 btn-primary py-2.5 disabled:opacity-60">{saving ? 'Saving...' : editing ? 'Update' : 'Add Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
