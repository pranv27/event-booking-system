import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { 
  Users, 
  BarChart3, 
  PlusCircle, 
  LayoutDashboard, 
  ArrowRight, 
  TrendingUp, 
  DollarSign,
  Calendar as CalendarIcon,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, detail }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      {detail && <span className="text-xs font-black text-green-500 bg-green-50 px-3 py-1 rounded-full">{detail}</span>}
    </div>
    <div className="text-3xl font-black text-gray-900 mb-1 tracking-tight">{value}</div>
    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">{title}</div>
  </div>
);

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/events/organizer/stats');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Overview</h1>
          <p className="text-gray-500 font-medium">Welcome back, {user?.name}! Here's your performance summary.</p>
        </div>
        <Link 
          to="/create-event" 
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 text-sm group"
        >
          <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" /> 
          Launch New Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Events" 
          value={stats?.totalEvents || 0} 
          icon={LayoutDashboard} 
          color="bg-primary"
          detail="+2 this month"
        />
        <StatCard 
          title="Total Bookings" 
          value={stats?.totalBookings || 0} 
          icon={Users} 
          color="bg-accent"
          detail="12.5% conv."
        />
        <StatCard 
          title="Tickets Sold" 
          value={stats?.totalTickets || 0} 
          icon={TrendingUp} 
          color="bg-secondary"
          detail="Live tracking"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Events List */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
            <div>
              <h2 className="text-xl font-black text-gray-900">Recent Events</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Latest activity</p>
            </div>
            <Link to="/organizer/events" className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1">
            <div className="divide-y divide-gray-50">
              {stats?.recentEvents?.map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-50/50 transition-all group flex items-center gap-6">
                  <div className="w-16 h-16 rounded-[1.25rem] overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                    <img src={event.image_url || event.banner_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={event.title} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-primary transition-colors">{event.title}</h3>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        {new Date(event.event_date).toLocaleDateString()}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        event.status === 'approved' ? 'bg-green-100 text-green-600' : 
                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-gray-900">${event.price}</div>
                    <Link to={`/events/${event.id}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline mt-1 block">
                      Edit →
                    </Link>
                  </div>
                </div>
              ))}
              {(!stats || !stats.recentEvents || stats.recentEvents.length === 0) && (
                <div className="px-8 py-20 text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-gray-200" />
                  </div>
                  <p className="text-gray-500 font-bold">No events created yet.</p>
                  <Link to="/create-event" className="text-primary font-black text-sm mt-2 block hover:underline">Launch your first event</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sales Performance Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 flex flex-col">
          <h2 className="text-xl font-black text-gray-900 mb-1">Quick Actions</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">Management tools</p>
          
          <div className="space-y-4 flex-1">
            <button className="w-full p-4 rounded-2xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-between group">
              <div className="flex items-center gap-3 text-sm font-black">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <PlusCircle className="w-5 h-5" />
                </div>
                Create New
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>

            <button className="w-full p-4 rounded-2xl bg-accent/5 text-accent hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-between group">
              <div className="flex items-center gap-3 text-sm font-black">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                Manage Users
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>

            <button className="w-full p-4 rounded-2xl bg-secondary/5 text-secondary hover:bg-secondary hover:text-white transition-all duration-300 flex items-center justify-between group">
              <div className="flex items-center gap-3 text-sm font-black">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <BarChart3 className="w-5 h-5" />
                </div>
                Analytics
              </div>
              <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
            </button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
            <div className="bg-gray-900 rounded-3xl p-6 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">System Status</div>
                <div className="flex items-center gap-2 font-black text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Operational
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
