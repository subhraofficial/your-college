import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CollegeCard from '../components/CollegeCard';
import EnquiryModal from '../components/EnquiryModal';
import { getColleges, getCourses } from '../services/api';
import { FiSearch } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineUsers } from 'react-icons/hi';

export default function Home() {
  const [featuredColleges, setFeaturedColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [showEnquiry, setShowEnquiry] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getColleges({ featured: true }).then(r => setFeaturedColleges(r.data.colleges || [])).catch(() => {});
    getCourses().then(r => setCourses(r.data.courses || [])).catch(() => {});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (search.trim()) navigate(`/colleges?search=${encodeURIComponent(search)}`);
  };

  const handleEnquire = (college) => {
    setSelectedCollege(college ? college.name : '');
    setShowEnquiry(true);
  };

  return (
    <>
      <SEO
        title="Find the Right College for Your Future"
        description="Explore colleges, courses, admission information and career guidance with Your College. Find the right college and course for your future."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'EducationalOrganization',
              name: 'Your College',
              url: 'https://yourcollege.in/',
            },
            {
              '@type': 'WebSite',
              name: 'Your College',
              url: 'https://yourcollege.in/',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://yourcollege.in/colleges?search={search_term_string}',
                },
                'query-input': 'required name=search_term_string',
              },
            },
          ],
        }}
      />
      <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Find the Right College<br />for Your Future
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Explore colleges and courses and get admission guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/colleges" className="bg-white text-blue-700 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              Explore Colleges
            </Link>
            <button onClick={() => handleEnquire(null)} className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-700 transition-colors">
              Get Admission Guidance
            </button>
          </div>
          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-2">
            <div className="flex-1 flex items-center bg-white rounded-lg overflow-hidden">
              <FiSearch className="ml-3 text-gray-400" size={18} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-3 text-gray-800 outline-none text-sm"
                placeholder="Search College or Course" />
            </div>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition-colors">
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          {[['500+', 'Colleges Listed'], ['50+', 'Courses Available'], ['10,000+', 'Students Guided']].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl font-extrabold text-blue-700">{n}</div>
              <div className="text-sm text-gray-500">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Colleges */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Colleges</h2>
              <p className="text-gray-500 mt-1">Top colleges handpicked for you</p>
            </div>
            <Link to="/colleges" className="text-blue-600 font-semibold hover:underline text-sm">View All →</Link>
          </div>
          {featuredColleges.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <HiOutlineAcademicCap size={48} className="mx-auto mb-3" />
              <p>No featured colleges yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredColleges.map(c => <CollegeCard key={c._id} college={c} onEnquire={handleEnquire} />)}
            </div>
          )}
        </div>
      </section>

      {/* Popular Courses */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Popular Courses</h2>
          <p className="text-gray-500 text-center mb-10">Explore top programs to shape your career</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {courses.map(c => (
              <button key={c._id} onClick={() => handleEnquire(null)}
                className="bg-blue-50 text-blue-700 border border-blue-200 px-6 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors text-sm">
                {c.name}
              </button>
            ))}
            {courses.length === 0 && ['BBA', 'BCA', 'B.Com', 'MBA', 'MCA'].map(name => (
              <span key={name} className="bg-blue-50 text-blue-700 border border-blue-200 px-6 py-3 rounded-full font-semibold text-sm">{name}</span>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/courses" className="text-blue-600 font-semibold hover:underline text-sm">View All Courses →</Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Why Choose Your College?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <HiOutlineAcademicCap size={36} />, title: 'Top Colleges', desc: 'Access verified information about hundreds of colleges across India.' },
              { icon: <HiOutlineLightBulb size={36} />, title: 'Expert Guidance', desc: 'Get personalized admission guidance from our experienced counsellors.' },
              { icon: <HiOutlineUsers size={36} />, title: 'Student First', desc: 'Thousands of students have found their dream college through us.' },
            ].map(item => (
              <div key={item.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Confused About Your College Admission?</h2>
          <p className="text-blue-100 mb-8">Submit your details and our team will contact you.</p>
          <button onClick={() => handleEnquire(null)} className="bg-white text-blue-700 px-10 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors text-lg">
            Get Admission Guidance
          </button>
        </div>
      </section>

      <Footer />
      <EnquiryModal show={showEnquiry} onClose={() => setShowEnquiry(false)} preselectedCollege={selectedCollege} />
      </div>
    </>
  );
}
