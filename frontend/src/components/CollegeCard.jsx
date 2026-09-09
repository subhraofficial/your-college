import { Link } from 'react-router-dom';
import { FiMapPin, FiBook, FiDollarSign } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi';

export default function CollegeCard({ college, onEnquire }) {
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-44 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
        {college.image ? (
          <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
        ) : (
          <HiAcademicCap className="text-blue-400" size={64} />
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-lg mb-2 leading-tight">{college.name}</h3>
        <div className="space-y-1.5 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <FiMapPin size={13} className="text-blue-500 flex-shrink-0" />
            <span>{college.location || college.city}</span>
          </div>
          {college.courses?.length > 0 && (
            <div className="flex items-center gap-1.5">
              <FiBook size={13} className="text-blue-500 flex-shrink-0" />
              <span className="truncate">{college.courses.slice(0, 3).join(', ')}</span>
            </div>
          )}
          {college.fees && (
            <div className="flex items-center gap-1.5">
              <FiDollarSign size={13} className="text-blue-500 flex-shrink-0" />
              <span>{college.fees}</span>
            </div>
          )}
        </div>
        <div className="mt-auto flex gap-2">
          <Link to={`/colleges/${college._id}`} className="flex-1 text-center bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            View Details
          </Link>
          <button
            onClick={() => onEnquire && onEnquire(college)}
            className="flex-1 btn-primary text-sm py-2 px-3 text-center">
            Enquire Now
          </button>
        </div>
      </div>
    </div>
  );
}
