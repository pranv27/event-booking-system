import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  PlusCircle, 
  Ticket, 
  User, 
  LogOut, 
  History,
  Settings,
  Shield
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const organizerLinks = [
    { name: 'Dashboard', path: '/organizer/dashboard', icon: LayoutDashboard },
    { name: 'My Events', path: '/organizer/events', icon: Calendar },
    { name: 'Create Event', path: '/create-event', icon: PlusCircle },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const attendeeLinks = [
    { name: 'My Tickets', path: '/attendee/dashboard', icon: History },
    { name: 'Browse Events', path: '/events', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const links = user?.role === 'organizer' ? organizerLinks : attendeeLinks;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-50">
      <div className="p-8">
        <NavLink to="/" className="text-primary font-black text-2xl tracking-tighter flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Evently</span>
        </NavLink>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">
          Main Menu
        </div>
        {links.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all duration-300 group
              ${isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-gray-500 hover:bg-primary/5 hover:text-primary'
              }
            `}
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gray-50 rounded-[2rem] p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm ${user?.role === 'organizer' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'}`}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-gray-900 truncate">{user?.name}</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{user?.role}</div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3.5 text-gray-400 font-bold hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
