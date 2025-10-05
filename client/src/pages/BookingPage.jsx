import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const BookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceType: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    location: {
      address: user?.address?.street || '',
      zipCode: user?.address?.zipCode || ''
    }
  });

  useEffect(() => {
    fetchProvider();
  }, [providerId]);

  const fetchProvider = async () => {
    try {
      const response = await api.get(`/providers/${providerId}`);
      setProvider(response.data.provider);
      if (response.data.provider.services?.length > 0) {
        setFormData(prev => ({
          ...prev,
          serviceType: response.data.provider.services[0].name
        }));
      }
    } catch (error) {
      toast.error('Failed to load provider details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        providerId,
        ...formData
      };

      await api.post('/bookings', bookingData);
      toast.success('Booking request sent successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Service</h1>
          <p className="text-gray-600 mb-8">Fill out the form below to request a booking</p>

          {/* Provider Info */}
          <div className="bg-primary-50 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center text-xl font-bold text-primary-700">
                {provider?.businessName?.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{provider?.businessName}</h3>
                <p className="text-sm text-gray-600">
                  {provider?.categories?.join(', ')}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText size={18} className="inline mr-2" />
                Service Type
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a service</option>
                {provider?.services?.map((service, idx) => (
                  <option key={idx} value={service.name}>
                    {service.name}
                    {service.priceRange && ` ($${service.priceRange.min} - $${service.priceRange.max})`}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="input-field"
                placeholder="Describe the service you need in detail..."
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar size={18} className="inline mr-2" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock size={18} className="inline mr-2" />
                  Preferred Time
                </label>
                <input
                  type="time"
                  name="scheduledTime"
                  value={formData.scheduledTime}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin size={18} className="inline mr-2" />
                Service Location
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                required
                className="input-field mb-3"
                placeholder="Street address"
              />
              <input
                type="text"
                name="location.zipCode"
                value={formData.location.zipCode}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="ZIP Code"
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn-primary"
              >
                {submitting ? 'Submitting...' : 'Submit Booking Request'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingPage;
