import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase, CheckCircle } from 'lucide-react';

const ProviderCard = ({ provider }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/provider/${provider._id}`)}
      className="card cursor-pointer"
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-2xl font-bold text-primary-600">
            {provider.userId?.name?.charAt(0) || 'P'}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-800">
              {provider.businessName}
            </h3>
            {provider.isVerified && (
              <CheckCircle size={18} className="text-green-500" />
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="flex items-center space-x-1">
              <Star size={16} className="text-yellow-400 fill-current" />
              <span className="font-medium">{provider.rating?.average?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="text-sm text-gray-500">
              ({provider.rating?.count || 0} reviews)
            </span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-2">
            {provider.categories?.slice(0, 3).map((cat, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Experience */}
          {provider.experience > 0 && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Briefcase size={14} />
              <span>{provider.experience} years experience</span>
            </div>
          )}

          {/* Description */}
          {provider.description && (
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {provider.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <MapPin size={14} />
          <span>
            {provider.serviceArea?.zipCodes?.length || 0} service areas
          </span>
        </div>
        <button className="text-primary-600 font-medium text-sm hover:text-primary-700">
          View Profile →
        </button>
      </div>
    </div>
  );
};

export default ProviderCard;
