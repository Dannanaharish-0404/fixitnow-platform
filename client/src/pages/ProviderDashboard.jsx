import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Star, TrendingUp, Users, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useAuthStore from '../store/authStore';
import api from '../utils/api';

const ProviderDashboard = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bookingsRes, profileRes, statsRes] = await Promise.all([
        api.get('/bookings/provider/bookings'),
        api.get('/providers/me/profile'),
        api.get('/providers/me/stats')
      ]);
      setBookings(bookingsRes.data);
      setProfile(profileRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status, notes = '') => {
    try {
      await api.put(`/bookings/provider/${bookingId}/status`, {
        status,
        providerNotes: notes
      });
      toast.success(`Booking ${status} successfully`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking');
      console.error(error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put('/providers/me/profile', profile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error(error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredBookings = filterStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filterStatus);

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

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Provider Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          {!profile?.isApproved && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                ⚠️ Your account is pending approval. You'll be able to receive bookings once approved by admin.
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-primary-600">
                {stats?.pendingBookings || 0}
              </div>
              <Clock className="text-primary-600" size={32} />
            </div>
            <div className="text-gray-600">Pending Requests</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-green-600">
                {stats?.completedBookings || 0}
              </div>
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <div className="text-gray-600">Completed Jobs</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-yellow-600">
                {stats?.rating?.average?.toFixed(1) || '0.0'}
              </div>
              <Star className="text-yellow-600" size={32} />
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.totalBookings || 0}
              </div>
              <TrendingUp className="text-blue-600" size={32} />
            </div>
            <div className="text-gray-600">Total Bookings</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 font-medium border-b-2 transition ${
                  activeTab === 'bookings'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 font-medium border-b-2 transition ${
                  activeTab === 'profile'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Profile Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'bookings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Booking Requests</h2>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="input-field w-auto"
                  >
                    <option value="all">All Bookings</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-600">
                    No bookings found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div key={booking._id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
                              {booking.customerId?.name?.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {booking.customerId?.name}
                              </h3>
                              <p className="text-sm text-gray-600">{booking.serviceType}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Calendar size={16} />
                            <span className="text-sm">
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock size={16} />
                            <span className="text-sm">{booking.scheduledTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin size={16} />
                            <span className="text-sm">{booking.location?.address}</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-700 mb-4">{booking.description}</p>

                        {booking.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleUpdateBookingStatus(booking._id, 'accepted')}
                              className="btn-primary text-sm"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(booking._id, 'rejected')}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {booking.status === 'accepted' && (
                          <button
                            onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                            className="btn-primary text-sm"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && profile && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={profile.businessName}
                      onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={profile.description || ''}
                      onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                      rows={4}
                      className="input-field"
                      placeholder="Tell customers about your business..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      value={profile.experience || 0}
                      onChange={(e) => setProfile({ ...profile, experience: parseInt(e.target.value) })}
                      className="input-field"
                      min="0"
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProviderDashboard;
