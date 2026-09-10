import SEO from '../components/SEO';
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EnquiryModal from '../components/EnquiryModal';
import { getCollege } from '../services/api';
import {
  FiMapPin,
  FiGlobe,
  FiBook,
  FiDollarSign,
  FiCheckCircle,
  FiArrowLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';

export default function CollegeDetail() {
  const { identifier } = useParams();
  const navigate = useNavigate();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEnquiry, setShowEnquiry] = useState(false);

  useEffect(() => {
    getCollege(identifier)
      .then((r) => {
        const data = r.data.college;
        setCollege(data);

        // If an old MongoDB ID URL was opened,
        // redirect it to the SEO-friendly slug URL.
        if (data?.slug && identifier !== data.slug) {
          navigate(`/colleges/${data.slug}`, { replace: true });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [identifier, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500">College not found.</p>

        <Link to="/colleges" className="mt-4 btn-primary">
          Back to Colleges
        </Link>
      </div>
    );
  }

  const collegePath = `/colleges/${college.slug || college._id}`;
  const collegeUrl = `https://yourcollege.in${collegePath}`;

  const collegeDescription =
    college.description ||
    `Get information about ${college.name}, including courses, admission details, eligibility, fees and location.`;

  const collegeSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: college.name,
    url: collegeUrl,
    description: collegeDescription,

    ...(college.image
      ? {
          image: college.image,
        }
      : {}),

    ...(college.website
      ? {
          sameAs: [college.website],
        }
      : {}),

    ...(college.location || college.city || college.state
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(college.location
              ? { streetAddress: college.location }
              : {}),
            ...(college.city
              ? { addressLocality: college.city }
              : {}),
            ...(college.state
              ? { addressRegion: college.state }
              : {}),
          },
        }
      : {}),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://yourcollege.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Colleges',
        item: 'https://yourcollege.in/colleges',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: college.name,
        item: collegeUrl,
      },
    ],
  };

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${college.name} - Admission, Courses, Fees & Eligibility`,
    url: collegeUrl,
    description: collegeDescription,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Your College',
      url: 'https://yourcollege.in/',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://yourcollege.in/',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Colleges',
          item: 'https://yourcollege.in/colleges',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: college.name,
          item: collegeUrl,
        },
      ],
    },
  };

  return (
    <>
      <SEO
        title={`${college.name} - Admission, Courses, Fees & Eligibility`}
        description={collegeDescription}
        path={collegePath}
        jsonLd={{
          '@context': 'https://schema.org',
          '@graph': [
            collegeSchema,
            breadcrumbSchema,
            webpageSchema,
          ],
        }}
      />

      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="max-w-5xl mx-auto w-full px-4 py-8 flex-1">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1 text-sm text-gray-500 mb-5"
          >
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            <FiChevronRight size={14} />

            <Link
              to="/colleges"
              className="hover:text-blue-600 transition-colors"
            >
              Colleges
            </Link>

            <FiChevronRight size={14} />

            <span
              className="text-gray-700 font-medium truncate max-w-[250px]"
              title={college.name}
            >
              {college.name}
            </span>
          </nav>

          {/* Back Link */}
          <Link
            to="/colleges"
            className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm mb-6"
          >
            <FiArrowLeft size={14} />
            Back to Colleges
          </Link>

          {/* College Header */}
          <div className="card overflow-hidden mb-6">
            <div className="h-56 md:h-72 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              {college.image ? (
                <img
                  src={college.image}
                  alt={`${college.name} campus`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <HiAcademicCap
                  className="text-blue-400"
                  size={80}
                />
              )}
            </div>

            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {college.type}
                    </span>

                    {college.featured && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                    {college.name}
                  </h1>

                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <FiMapPin size={14} />

                    <span>
                      {college.location || college.city}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowEnquiry(true)}
                  className="btn-primary whitespace-nowrap"
                >
                  Enquire About This College
                </button>
              </div>
            </div>
          </div>

          {/* College Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {college.description && (
                <div className="card p-6">
                  <h2 className="text-lg font-bold mb-3">
                    About the College
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {college.description}
                  </p>
                </div>
              )}

              {college.admissionInfo && (
                <div className="card p-6">
                  <h2 className="text-lg font-bold mb-3">
                    Admission Information
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {college.admissionInfo}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Information */}
            <div className="space-y-4">
              <div className="card p-5">
                <h3 className="font-bold mb-3 text-gray-900">
                  Quick Info
                </h3>

                <ul className="space-y-3 text-sm">
                  {college.courses?.length > 0 && (
                    <li className="flex gap-2">
                      <FiBook className="text-blue-500 mt-0.5 flex-shrink-0" />

                      <div>
                        <span className="font-medium">
                          Courses:
                        </span>
                        <br />
                        {college.courses.join(', ')}
                      </div>
                    </li>
                  )}

                  {college.fees && (
                    <li className="flex gap-2">
                      <FiDollarSign className="text-blue-500 mt-0.5 flex-shrink-0" />

                      <div>
                        <span className="font-medium">
                          Fees:
                        </span>
                        <br />
                        {college.fees}
                      </div>
                    </li>
                  )}

                  {college.eligibility && (
                    <li className="flex gap-2">
                      <FiCheckCircle className="text-blue-500 mt-0.5 flex-shrink-0" />

                      <div>
                        <span className="font-medium">
                          Eligibility:
                        </span>
                        <br />
                        {college.eligibility}
                      </div>
                    </li>
                  )}

                  {college.website && (
                    <li className="flex gap-2">
                      <FiGlobe className="text-blue-500 mt-0.5 flex-shrink-0" />

                      <div>
                        <span className="font-medium">
                          Website:
                        </span>
                        <br />

                        <a
                          href={college.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline break-all"
                        >
                          {college.website}
                        </a>
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              <button
                onClick={() => setShowEnquiry(true)}
                className="w-full btn-primary py-3 text-center"
              >
                Get Admission Guidance
              </button>
            </div>
          </div>
        </main>

        <Footer />

        <EnquiryModal
          show={showEnquiry}
          onClose={() => setShowEnquiry(false)}
          preselectedCollege={college.name}
        />
      </div>
    </>
  );
}