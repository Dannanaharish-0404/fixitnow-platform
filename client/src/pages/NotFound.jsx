import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import Navbar from '../components/Navbar';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Home size={20} />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
