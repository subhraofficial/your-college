import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { createLead, getCourses } from '../services/api';
import toast from 'react-hot-toast';

export default function EnquiryModal({ show, onClose, preselectedCollege = '' }) {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    studentName: '', mobile: '', email: '', course: '', college: preselectedCollege, city: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (show) {
      setForm(f => ({ ...f, college: preselectedCollege }));
      setSubmitted(false);
      getCourses().then(r => setCourses(r.data.courses || [])).catch(() => {});
    }
  }, [show, preselectedCollege]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.studentName.trim() || !form.mobile.trim()) {
      toast.error('Name and mobile number are required');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, ''))) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      await createLead(form);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Get Admission Guidance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={24} /></button>
        </div>
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">Your enquiry has been submitted successfully. Our team will contact you soon.</p>
              <button onClick={onClose} className="mt-6 btn-primary">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Student Name <span className="text-red-500">*</span></label>
                  <input name="studentName" value={form.studentName} onChange={handleChange} className="input-field" placeholder="Your full name" required />
                </div>
                <div>
                  <label className="label">Mobile Number <span className="text-red-500">*</span></label>
                  <input name="mobile" value={form.mobile} onChange={handleChange} className="input-field" placeholder="10-digit mobile" required />
                </div>
              </div>
              <div>
                <label className="label">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Course Interested In</label>
                  <select name="course" value={form.course} onChange={handleChange} className="input-field">
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">City / Location</label>
                  <input name="city" value={form.city} onChange={handleChange} className="input-field" placeholder="Your city" />
                </div>
              </div>
              <div>
                <label className="label">Preferred College</label>
                <input name="college" value={form.college} onChange={handleChange} className="input-field" placeholder="College name (optional)" />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Any specific queries..." />
              </div>
              <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
