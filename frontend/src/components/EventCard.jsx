import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Ticket, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, onBookClick }) => {
  const { user } = useAuth();
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onBookClick) onBookClick(event);
  };

  return (
    <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full relative">
      {/* Badge Overlay */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-black text-gray-900">{formatDate(event.event_date)}</span>
        </div>
      </div>

      <Link to={`/events/${event.id}`} className="block relative h-64 overflow-hidden shrink-0">
        <img
          src={event.image_url || event.banner_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {event.category_name || event.category}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            {event.event_time}
          </div>
        </div>

        <Link to={`/events/${event.id}`}>
          <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
            {event.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <MapPin className="w-4 h-4 text-gray-300 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        
        <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-50">
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Starting from</div>
            <div className="text-xl font-black text-gray-900">${event.price}</div>
          </div>

          {user?.role === 'attendee' ? (
            <button
              onClick={handleBookClick}
              className="bg-primary text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Ticket className="w-5 h-5" />
            </button>
          ) : (
            <Link 
              to={`/events/${event.id}`}
              className="bg-gray-50 text-gray-900 p-4 rounded-2xl hover:bg-primary hover:text-white transition-all group/btn"
            >
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
