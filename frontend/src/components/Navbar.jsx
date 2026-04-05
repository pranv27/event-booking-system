import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  User, 
  LogOut, 
  Search, 
  PlusCircle, 
  LayoutDashboard, 
  History, 
  BarChart3, 
  ChevronDown,
  Layout
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-primary font-black text-2xl tracking-tighter flex items-center gap-2 group">
              <div className="bg-primary p-1.5 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Evently</span>
            </Link>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center gap-3 md:gap-6 font-bold text-sm">
            {!user ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary transition-colors py-2 px-4 rounded-xl hover:bg-gray-50">Login</Link>
                <Link to="/register" className="bg-primary text-white px-6 py-3 rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]">
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4">
                {/* Role Specific Desktop Links */}
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/" className="text-gray-600 hover:text-primary transition-colors py-2 px-4 rounded-xl hover:bg-gray-50">Home</Link>
                  <Link to="/events" className="text-gray-600 hover:text-primary transition-colors py-2 px-4 rounded-xl hover:bg-gray-50">Events</Link>
                  {user.role === 'attendee' && (
                    <Link to="/events" className="flex items-center gap-2 text-primary border-2 border-primary/10 hover:border-primary/20 py-2 px-4 rounded-xl transition-all hover:bg-primary/5">
                      <Ticket className="w-4 h-4" /> 
                      <span>Book Tickets</span>
                    </Link>
                  )}
                  {user.role === 'organizer' && (
                    <Link to="/create-event" className="flex items-center gap-2 text-primary border-2 border-primary/10 hover:border-primary/20 py-2 px-4 rounded-xl transition-all hover:bg-primary/5">
                      <PlusCircle className="w-4 h-4" /> 
                      <span>Create</span>
                    </Link>
                  )}
                </div>

                {/* Profile Floating Menu Wrapper */}
                <div className="relative" ref={menuRef}>
                  <button 
                    onClick={toggleMenu}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-2xl transition-all duration-300 ${
                      isMenuOpen ? 'bg-gray-100 ring-2 ring-primary/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-transform duration-300 ${
                      isMenuOpen ? 'scale-90' : 'group-hover:scale-110'
                    } ${user.role === 'organizer' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Floating Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-4 w-72 glass-menu rounded-[2rem] overflow-hidden z-50 animate-in origin-top-right">
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100/50">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black ${user.role === 'organizer' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-gray-900 font-black text-lg truncate w-40">{user.name}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{user.role}</div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Link 
                            to="/profile" 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-primary/5 hover:text-primary transition-all group"
                          >
                            <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-bold">My Profile</span>
                          </Link>

                          {user.role === 'attendee' ? (
                            <Link 
                              to="/attendee/dashboard" 
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-primary/5 hover:text-primary transition-all group"
                            >
                              <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
                                <History className="w-4 h-4" />
                              </div>
                              <span className="font-bold">My Bookings</span>
                            </Link>
                          ) : (
                            <>
                              <Link 
                                to="/organizer/dashboard" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-accent/5 hover:text-accent transition-all group"
                              >
                                <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-accent/10 transition-colors">
                                  <BarChart3 className="w-4 h-4" />
                                </div>
                                <span className="font-bold">Dashboard</span>
                              </Link>
                              <Link 
                                to="/organizer/events" 
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-accent/5 hover:text-accent transition-all group"
                              >
                                <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-accent/10 transition-colors">
                                  <Layout className="w-4 h-4" />
                                </div>
                                <span className="font-bold">My Events</span>
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100/50">
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-500 hover:bg-destructive/5 hover:text-destructive transition-all group"
                          >
                            <div className="bg-gray-100 p-2 rounded-xl group-hover:bg-destructive/10 transition-colors">
                              <LogOut className="w-4 h-4" />
                            </div>
                            <span className="font-black">Log Out</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
