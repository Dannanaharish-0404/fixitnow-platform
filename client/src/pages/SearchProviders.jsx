import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProviderCard from '../components/ProviderCard';
import { SERVICE_CATEGORIES } from '../utils/constants';
import api from '../utils/api';

const SearchProviders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    zipCode: searchParams.get('zipCode') || '',
    search: '',
    sortBy: 'rating'
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.zipCode) params.append('zipCode', filters.zipCode);
      if (filters.search) params.append('search', filters.search);
      params.append('sortBy', filters.sortBy);

      const response = await api.get(`/providers?${params.toString()}`);
      setProviders(response.data);
    } catch (error) {
      toast.error('Failed to fetch providers');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProviders();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Service Providers</h1>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Categories</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                value={filters.zipCode}
                onChange={handleFilterChange}
                className="input-field"
              />

              <input
                type="text"
                name="search"
                placeholder="Search by name..."
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field"
              />

              <button type="submit" className="btn-primary flex items-center justify-center space-x-2">
                <Search size={20} />
                <span>Search</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={(e) => {
                  handleFilterChange(e);
                  setTimeout(fetchProviders, 100);
                }}
                className="input-field w-auto"
              >
                <option value="rating">Highest Rated</option>
                <option value="bookings">Most Bookings</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </form>
        </div>

        {/* Results */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Searching...' : `${providers.length} Providers Found`}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading providers...</p>
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Providers Found</h3>
              <p className="text-gray-600">
                Try adjusting your search filters or check back later for new providers in your area.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {providers.map((provider) => (
                <ProviderCard key={provider._id} provider={provider} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchProviders;
