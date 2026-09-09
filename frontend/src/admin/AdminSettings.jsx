import { useState, useEffect } from 'react';
import { getSettings, updateSettings } from '../services/api';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [form, setForm] = useState({ websiteName: '', logo: '', phone: '', email: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSettings().then(r => setForm(r.data.settings)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success('Settings saved!');
    } catch { toast.error('Failed to save settings'); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Basic Settings</h1>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Website Name</label>
            <input name="websiteName" value={form.websiteName || ''} onChange={handleChange} className="input-field" placeholder="Your College" />
          </div>
          <div>
            <label className="label">Logo URL</label>
            <input name="logo" value={form.logo || ''} onChange={handleChange} className="input-field" placeholder="https://..." />
            <p className="text-xs text-gray-400 mt-1">Paste a direct image URL for your logo</p>
          </div>
          <div>
            <label className="label">Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className="input-field" placeholder="+91 98765 43210" />
          </div>
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="input-field" placeholder="info@yourcollege.com" />
          </div>
          <div>
            <label className="label">Address</label>
            <textarea name="address" value={form.address || ''} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Your full address" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full py-3 disabled:opacity-60">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}
