import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CollegeCard from '../components/CollegeCard';
import EnquiryModal from '../components/EnquiryModal';
import { getColleges } from '../services/api';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';

export default function Colleges() {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const s = searchParams.get('search') || '';
    setSearch(s);
    fetchColleges(s, '');
  }, [searchParams]);

  const fetchColleges = async (s = search, l = location) => {
    setLoading(true);
    try {
      const params = {};
      if (s) params.search = s;
      if (l) params.location = l;
      const r = await getColleges(params);
      setColleges(r.data.colleges || []);
    } catch {}
    finally { setLoading(false); }
  };

  const handleSearch = e => {
    e.preventDefault();
    fetchColleges();
  };

  const handleEnquire = (college) => {
    setSelectedCollege(college ? college.name : '');
    setShowEnquiry(true);
  };

  return (
    <>
      <SEO
        title="Explore Colleges"
        description="Explore colleges and find the right college for your career goals. Search colleges by name, course and location."
        path="/colleges"
      />
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">Explore Colleges</h1>
        <p className="text-blue-100">Find the perfect college for your career goals</p>
      </section>

      <section className="py-8 px-4 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <FiSearch className="ml-3 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-2.5 outline-none text-sm" placeholder="Search college or course..." />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden sm:w-48">
              <FiFilter className="ml-3 text-gray-400" />
              <input value={location} onChange={e => setLocation(e.target.value)}
                className="flex-1 px-3 py-2.5 outline-none text-sm" placeholder="Filter by location" />
            </div>
            <button type="submit" className="btn-primary py-2.5">Search</button>
          </form>
        </div>
      </section>

      <section className="flex-1 py-10 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">{colleges.length} college{colleges.length !== 1 ? 's' : ''} found</p>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="h-72 bg-gray-200 rounded-xl animate-pulse" />)}
            </div>
          ) : colleges.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <HiOutlineAcademicCap size={48} className="mx-auto mb-3" />
              <p className="text-lg">No colleges found. Try a different search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {colleges.map(c => <CollegeCard key={c._id} college={c} onEnquire={handleEnquire} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
      <EnquiryModal show={showEnquiry} onClose={() => setShowEnquiry(false)} preselectedCollege={selectedCollege} />
      </div>
    </>
  );
}
