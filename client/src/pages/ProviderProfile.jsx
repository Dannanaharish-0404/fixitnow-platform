import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Briefcase, Clock, CheckCircle, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderDetails();
  }, [id]);

  const fetchProviderDetails = async () => {
    try {
      const response = await api.get(`/providers/${id}`);
      setProvider(response.data.provider);
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error('Failed to load provider details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }
    if (user?.role !== 'customer') {
      toast.error('Only customers can book services');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p>Provider not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Header */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-3xl font-bold text-primary-600">
                  {provider.businessName?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{provider.businessName}</h1>
                    {provider.isVerified && (
                      <CheckCircle size={24} className="text-green-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star size={20} className="text-yellow-400 fill-current" />
                      <span className="font-semibold text-lg">
                        {provider.rating?.average?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-500">({provider.rating?.count || 0} reviews)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {provider.categories?.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-50 text-primary-700 text-sm rounded-full font-medium"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {provider.description || 'No description available.'}
              </p>
              {provider.experience > 0 && (
                <div className="flex items-center space-x-2 mt-4 text-gray-700">
                  <Briefcase size={20} />
                  <span className="font-medium">{provider.experience} years of experience</span>
                </div>
              )}
            </div>

            {/* Services Offered */}
            {provider.services && provider.services.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Services Offered</h2>
                <div className="space-y-3">
                  {provider.services.map((service, idx) => (
                    <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          {service.description && (
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          )}
                        </div>
                        {service.priceRange && (
                          <div className="text-right">
                            <p className="font-semibold text-primary-600">
                              ${service.priceRange.min} - ${service.priceRange.max}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews</h2>
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                          {review.customerId?.name?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold">{review.customerId?.name}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700 text-sm">{review.comment}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 mb-6">
                {provider.userId?.phone && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Phone size={18} />
                    <span>{provider.userId.phone}</span>
                  </div>
                )}
                {provider.userId?.email && (
                  <div className="flex items-center space-x-3 text-gray-700">
                    <Mail size={18} />
                    <span className="text-sm">{provider.userId.email}</span>
                  </div>
                )}
                {provider.serviceArea?.zipCodes && provider.serviceArea.zipCodes.length > 0 && (
                  <div className="flex items-start space-x-3 text-gray-700">
                    <MapPin size={18} className="mt-1" />
                    <div>
                      <p className="font-medium mb-1">Service Areas:</p>
                      <p className="text-sm">{provider.serviceArea.zipCodes.join(', ')}</p>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={handleBookNow} className="w-full btn-primary">
                Book Now
              </button>
            </div>

            {/* Working Hours */}
            {provider.workingHours && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock size={20} />
                  <span>Working Hours</span>
                </h3>
                <div className="space-y-2 text-sm">
                  {Object.entries(provider.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}</span>
                      <span className={hours.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProviderProfile;
