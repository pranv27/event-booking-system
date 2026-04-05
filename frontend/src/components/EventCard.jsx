import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Ticket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EventCard = ({ event, onBookClick }) => {
  const { user } = useAuth();
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
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
    <Link to={`/events/${event.id}`} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={event.image_url || event.banner_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary">
          ${event.price}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs font-bold text-accent mb-2 uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(event.event_date)} • {event.event_time}
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between pt-4 border-t border-gray-50 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
              <Tag className="w-4 h-4" />
              {event.category_name || event.category}
            </div>
            <span className="text-xs font-bold text-primary">Details →</span>
          </div>

          {user?.role === 'attendee' && (
            <button
              onClick={handleBookClick}
              className="w-full bg-primary/10 text-primary py-2.5 rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Ticket className="w-4 h-4" /> Book Your Ticket
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
