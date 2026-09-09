import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryModal from '../components/EnquiryModal';
import { getCourses } from '../services/api';
import { FiClock, FiCheckCircle, FiBook } from 'react-icons/fi';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    getCourses().then(r => setCourses(r.data.courses || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleEnquire = (course) => {
    setSelectedCourse(course ? course.name : '');
    setShowEnquiry(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore Courses</h1>
        <p className="text-blue-100">Find the right program for your career goals</p>
      </section>
      <section className="flex-1 py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FiBook size={48} className="mx-auto mb-3" />
              <p>No courses found. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map(course => (
                <div key={course._id} className="card p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiBook className="text-blue-600" size={22} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{course.name}</h3>
                  <div className="space-y-2 mb-4 text-sm text-gray-600 flex-1">
                    {course.duration && (
                      <div className="flex items-center gap-2">
                        <FiClock size={14} className="text-blue-500" />
                        <span>Duration: {course.duration}</span>
                      </div>
                    )}
                    {course.eligibility && (
                      <div className="flex items-center gap-2">
                        <FiCheckCircle size={14} className="text-blue-500" />
                        <span>Eligibility: {course.eligibility}</span>
                      </div>
                    )}
                    {course.description && (
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{course.description}</p>
                    )}
                  </div>
                  <button onClick={() => handleEnquire(course)} className="w-full btn-primary py-2 text-sm mt-2">
                    Enquire Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <EnquiryModal show={showEnquiry} onClose={() => setShowEnquiry(false)} preselectedCollege="" />
    </div>
  );
}
