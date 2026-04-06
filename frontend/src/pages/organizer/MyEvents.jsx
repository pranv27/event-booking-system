import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { Edit, Trash2, Eye, PlusCircle, Search, Calendar, MapPin, Tag, MoreVertical } from 'lucide-react';
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
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Events</h1>
          <p className="text-gray-500 font-medium">You have {events.length} active experiences.</p>
        </div>
        <Link 
          to="/create-event" 
          className="bg-primary text-white px-6 py-3.5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 text-sm group"
        >
          <PlusCircle className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" /> 
          Add New Event
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Filter by title..."
          className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white border-none shadow-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all font-medium"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={event.image_url || event.banner_image || 'https://via.placeholder.com/150'} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={event.title} 
              />
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md ${
                  event.status === 'approved' ? 'bg-green-500/90 text-white' : 
                  event.status === 'pending' ? 'bg-yellow-500/90 text-white' : 'bg-red-500/90 text-white'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{event.category_name}</span>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-1 truncate uppercase tracking-tight">
                {event.title}
              </h3>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4" />
                  </div>
                  {new Date(event.event_date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                  <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  {event.location}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-6 border-t border-gray-50">
                <Link to={`/events/${event.id}`} className="flex-1 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all text-center">
                  View
                </Link>
                <Link to={`/edit-event/${event.id}`} className="p-3 bg-gray-50 hover:bg-accent hover:text-white text-gray-600 rounded-xl transition-all">
                  <Edit className="w-4 h-4" />
                </Link>
                <button onClick={() => handleDelete(event.id)} className="p-3 bg-gray-50 hover:bg-destructive hover:text-white text-gray-600 rounded-xl transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-200" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No results found</h3>
          <p className="text-gray-500 font-medium max-w-xs mx-auto">
            {searchTerm ? `We couldn't find any events matching "${searchTerm}"` : "You haven't created any events yet."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyEvents;
