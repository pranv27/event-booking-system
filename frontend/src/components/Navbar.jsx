import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, LogOut, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-primary font-bold text-2xl tracking-tighter flex items-center gap-2">
              <Calendar className="w-8 h-8" />
              <span>Evently</span>
            </Link>
          </div>

          <div className="hidden sm:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/events" className="text-gray-700 hover:text-primary font-medium transition-colors">Events</Link>
            {user ? (
              <>
                <Link to="/create-event" className="hidden md:block text-primary border border-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-all font-medium">Create Event</Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-primary font-medium flex items-center gap-1">
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-destructive flex items-center gap-1 font-medium"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary font-medium">Login</Link>
                <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity font-medium">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
