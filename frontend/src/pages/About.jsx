import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HiOutlineLightBulb, HiOutlineAcademicCap, HiOutlineUsers } from 'react-icons/hi';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-blue-700 text-white py-12 px-4 text-center">
        <h1 className="text-3xl font-bold mb-2">About Your College</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Your College is an education guidance platform helping students explore colleges, courses and admission opportunities.
        </p>
      </section>
      <section className="flex-1 py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HiOutlineLightBulb className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Purpose</h2>
              <p className="text-gray-600 leading-relaxed">
                We believe every student deserves access to the right information about higher education. Our purpose is to make the college selection and admission process simpler, transparent, and stress-free for students across India.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HiOutlineAcademicCap className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">What We Do</h2>
              <p className="text-gray-600 leading-relaxed">
                We curate and present detailed information about colleges and courses, helping students make informed decisions. From college profiles and course details to fee structures and eligibility criteria — we bring everything in one place.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HiOutlineUsers className="text-blue-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Student Guidance</h2>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced counsellors is available to guide students through the admission process. Submit an enquiry and one of our experts will personally reach out to help you find the best college for your goals and budget.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
