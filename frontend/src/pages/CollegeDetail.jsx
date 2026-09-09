import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryModal from '../components/EnquiryModal';
import { getCollege } from '../services/api';
import { FiMapPin, FiGlobe, FiBook, FiDollarSign, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';

export default function CollegeDetail() {
  const { id } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    getCollege(id).then(r => setCollege(r.data.college)).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" /></div>;
  if (!college) return <div className="flex flex-col items-center justify-center min-h-screen"><p className="text-gray-500">College not found.</p><Link to="/colleges" className="mt-4 btn-primary">Back to Colleges</Link></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
        <Link to="/colleges" className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm mb-6">
          <FiArrowLeft size={14} /> Back to Colleges
        </Link>

        <div className="card overflow-hidden mb-6">
          <div className="h-56 md:h-72 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            {college.image ? (
              <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
            ) : (
              <HiAcademicCap className="text-blue-400" size={80} />
            )}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{college.type}</span>
                  {college.featured && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⭐ Featured</span>}
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">{college.name}</h1>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <FiMapPin size={14} />
                  <span>{college.location || college.city}</span>
                </div>
              </div>
              <button onClick={() => setShowEnquiry(true)} className="btn-primary whitespace-nowrap">
                Enquire About This College
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {college.description && (
              <div className="card p-6">
                <h2 className="text-lg font-bold mb-3">About the College</h2>
                <p className="text-gray-600 leading-relaxed">{college.description}</p>
              </div>
            )}
            {college.admissionInfo && (
              <div className="card p-6">
                <h2 className="text-lg font-bold mb-3">Admission Information</h2>
                <p className="text-gray-600 leading-relaxed">{college.admissionInfo}</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold mb-3 text-gray-900">Quick Info</h3>
              <ul className="space-y-3 text-sm">
                {college.courses?.length > 0 && (
                  <li className="flex gap-2">
                    <FiBook className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Courses:</span><br />{college.courses.join(', ')}</div>
                  </li>
                )}
                {college.fees && (
                  <li className="flex gap-2">
                    <FiDollarSign className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Fees:</span><br />{college.fees}</div>
                  </li>
                )}
                {college.eligibility && (
                  <li className="flex gap-2">
                    <FiCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Eligibility:</span><br />{college.eligibility}</div>
                  </li>
                )}
                {college.website && (
                  <li className="flex gap-2">
                    <FiGlobe className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div><span className="font-medium">Website:</span><br />
                      <a href={college.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">
                        {college.website}
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            <button onClick={() => setShowEnquiry(true)} className="w-full btn-primary py-3 text-center">
              Get Admission Guidance
            </button>
          </div>
        </div>
      </div>
      <Footer />
      <EnquiryModal show={showEnquiry} onClose={() => setShowEnquiry(false)} preselectedCollege={college.name} />
    </div>
  );
}
