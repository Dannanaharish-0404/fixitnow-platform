import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">FixItNow</h3>
            <p className="text-sm">
              Connecting customers with trusted local service professionals for all your repair and maintenance needs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-white transition">Find Services</Link></li>
              <li><Link to="/register" className="hover:text-white transition">Become a Provider</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popular Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search?category=car-mechanic" className="hover:text-white transition">Car Mechanic</Link></li>
              <li><Link to="/search?category=plumber" className="hover:text-white transition">Plumber</Link></li>
              <li><Link to="/search?category=electrician" className="hover:text-white transition">Electrician</Link></li>
              <li><Link to="/search?category=ac-repair" className="hover:text-white transition">AC Repair</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span>support@fixitnow.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span>1-800-FIX-NOW</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Nationwide Service</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-white transition"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition"><Instagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>&copy; {new Date().getFullYear()} FixItNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
