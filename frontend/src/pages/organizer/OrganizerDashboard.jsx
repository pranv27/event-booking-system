import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { Calendar, Users, BarChart3, PlusCircle, LayoutDashboard, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Organizer Dashboard</h1>
          <p className="text-gray-500 font-medium">Welcome back, {user?.name}! Here's how your events are performing.</p>
        </div>
        <Link to="/create-event" className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Create New Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats?.totalEvents || 0}</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Events</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats?.totalBookings || 0}</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Bookings</div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="text-4xl font-black text-gray-900 mb-1">{stats?.totalTickets || 0}</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Tickets Sold</div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-2xl font-black text-gray-900">Recent Events</h2>
          <Link to="/organizer/events" className="text-primary font-bold flex items-center gap-1 hover:underline">
            Manage All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Event</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                        <img src={event.image_url || event.banner_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={event.title} />
                      </div>
                      <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{event.title}</div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium">
                    {new Date(event.event_date).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      event.status === 'approved' ? 'bg-green-100 text-green-600' : 
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-900">
                    ${event.price}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <Link to={`/events/${event.id}`} className="text-gray-400 hover:text-primary transition-colors">
                      <ArrowRight className="w-5 h-5 ml-auto" />
                    </Link>
                  </td>
                </tr>
              ))}
              {stats?.recentEvents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic">
                    No events created yet. Start by creating your first event!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
