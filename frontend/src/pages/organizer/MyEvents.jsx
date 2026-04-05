import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { Edit, Trash2, Eye, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await api.get(`/events?organizer_id=${user.id}`);
        setEvents(res.data.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [user.id]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        setEvents(events.filter(e => e.id !== id));
        alert('Event deleted successfully');
      } catch (error) {
        alert('Failed to delete event');
      }
    }
  };

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-500 font-medium">Manage and monitor all your listed events.</p>
        </div>
        <Link to="/create-event" className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2">
          <PlusCircle className="w-5 h-5" /> Add New Event
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your events..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white">
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Event Details</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img src={event.image_url || event.banner_image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={event.title} />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-primary transition-colors">{event.title}</div>
                        <div className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {event.category_name}
                    </span>
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
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/events/${event.id}`} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="View">
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link to={`/edit-event/${event.id}`} className="p-2 text-gray-400 hover:text-accent hover:bg-accent/5 rounded-xl transition-all" title="Edit">
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center text-gray-500 italic">
                    {searchTerm ? `No events found matching "${searchTerm}"` : "You haven't created any events yet."}
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

export default MyEvents;
