import { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, Star, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [providers, setProviders] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, providersRes, usersRes, bookingsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/providers'),
        api.get('/admin/users'),
        api.get('/admin/bookings')
      ]);
      setStats(statsRes.data.stats);
      setProviders(providersRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProvider = async (providerId, isApproved) => {
    try {
      await api.put(`/admin/providers/${providerId}/status`, { isApproved, isVerified: isApproved });
      toast.success(`Provider ${isApproved ? 'approved' : 'rejected'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update provider status');
      console.error(error);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive });
      toast.success(`User ${isActive ? 'activated' : 'suspended'} successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user status');
      console.error(error);
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

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage platform users, providers, and bookings</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                <Users className="text-blue-600" size={32} />
              </div>
              <div className="text-gray-600">Total Users</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-green-600">{stats.approvedProviders}</div>
                <Briefcase className="text-green-600" size={32} />
              </div>
              <div className="text-gray-600">Active Providers</div>
              <div className="text-sm text-yellow-600 mt-1">
                {stats.pendingProviders} pending approval
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-purple-600">{stats.totalBookings}</div>
                <Calendar className="text-purple-600" size={32} />
              </div>
              <div className="text-gray-600">Total Bookings</div>
              <div className="text-sm text-green-600 mt-1">
                {stats.completedBookings} completed
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl font-bold text-yellow-600">{stats.totalReviews}</div>
                <Star className="text-yellow-600" size={32} />
              </div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`py-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'providers'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Providers ({providers.length})
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'users'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-4 font-medium border-b-2 transition whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Bookings ({bookings.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Pending Provider Approvals</h3>
                  {providers.filter(p => !p.isApproved).length === 0 ? (
                    <p className="text-gray-600">No pending approvals</p>
                  ) : (
                    <div className="space-y-3">
                      {providers.filter(p => !p.isApproved).slice(0, 5).map((provider) => (
                        <div key={provider._id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{provider.businessName}</p>
                            <p className="text-sm text-gray-600">{provider.userId?.email}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApproveProvider(provider._id, true)}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproveProvider(provider._id, false)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold">{booking.customerId?.name}</p>
                            <p className="text-sm text-gray-600">
                              {booking.providerId?.businessName} - {booking.serviceType}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(booking.scheduledDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">All Providers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Business Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Rating</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {providers.map((provider) => (
                        <tr key={provider._id}>
                          <td className="px-4 py-3 text-sm">{provider.businessName}</td>
                          <td className="px-4 py-3 text-sm">{provider.userId?.email}</td>
                          <td className="px-4 py-3 text-sm">
                            ⭐ {provider.rating?.average?.toFixed(1) || '0.0'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {provider.isApproved ? (
                              <span className="text-green-600 flex items-center space-x-1">
                                <CheckCircle size={16} />
                                <span>Approved</span>
                              </span>
                            ) : (
                              <span className="text-yellow-600">Pending</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {!provider.isApproved && (
                              <button
                                onClick={() => handleApproveProvider(provider._id, true)}
                                className="text-green-600 hover:text-green-700 font-medium"
                              >
                                Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">All Users</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-4 py-3 text-sm">{user.name}</td>
                          <td className="px-4 py-3 text-sm">{user.email}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {user.isActive ? (
                              <span className="text-green-600">Active</span>
                            ) : (
                              <span className="text-red-600">Suspended</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              onClick={() => handleToggleUserStatus(user._id, !user.isActive)}
                              className={`font-medium ${
                                user.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                              }`}
                            >
                              {user.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
                <div className="space-y-3">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {booking.customerId?.name} → {booking.providerId?.businessName}
                          </p>
                          <p className="text-sm text-gray-600">{booking.serviceType}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(booking.scheduledDate).toLocaleDateString()} at {booking.scheduledTime}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
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

export default AdminDashboard;
