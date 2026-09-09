import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { createLead } from '../services/api';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ studentName: '', mobile: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.studentName || !form.mobile) { toast.error('Name and phone are required'); return; }
    setLoading(true);
    try {
      await createLead({ ...form, college: 'Contact Page Enquiry' });
      setSubmitted(true);
    } catch { toast.error('Failed to submit. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-blue-100">We're here to help you find the right college</p>
      </section>
      <section className="flex-1 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Get In Touch</h2>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPhone className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone</p>
                  <p className="text-gray-600">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMail className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <p className="text-gray-600">info@yourcollege.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Address</p>
                  <p className="text-gray-600">New Delhi, India</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-5 text-gray-900">Send an Enquiry</h2>
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="font-semibold text-gray-900">Thank You!</p>
                <p className="text-gray-500 text-sm mt-1">Your enquiry has been submitted. We'll contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input name="studentName" value={form.studentName} onChange={handleChange} className="input-field" placeholder="Your full name" required />
                </div>
                <div>
                  <label className="label">Phone *</label>
                  <input name="mobile" value={form.mobile} onChange={handleChange} className="input-field" placeholder="Mobile number" required />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="label">Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary py-3 disabled:opacity-60">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
