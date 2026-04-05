import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EventCard from '../components/EventCard';
import Loader from '../components/Loader';
import BookingModal from '../components/BookingModal';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const categories = ['Music', 'Tech', 'Food', 'Business', 'Sports', 'Art'];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/events?search=${search}&category=${category}`);
        setEvents(res.data.events || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [search, category]);

  const handleBookClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    setBookingLoading(true);
    try {
      await api.post('/bookings', { event_id: selectedEvent.id, tickets: 1 });
      alert('Ticket booked successfully! 🎟️');
      navigate('/attendee/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book ticket');
    } finally {
      setBookingLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Browse Events</h1>
          <p className="text-gray-500 font-medium">Discover experiences happening near you</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white font-medium outline-none"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all bg-white font-bold outline-none"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        <button
          onClick={() => setCategory('')}
          className={`px-6 py-2.5 rounded-full font-black whitespace-nowrap transition-all border-2 ${
            category === '' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
          }`}
        >
          All Events
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-6 py-2.5 rounded-full font-black whitespace-nowrap transition-all border-2 ${
              category === cat ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-gray-500 border-gray-100 hover:border-primary/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          {events.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  onBookClick={handleBookClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-6 grayscale">🔍</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 font-medium">Try adjusting your filters or search keywords</p>
            </div>
          )}
        </>
      )}

      {selectedEvent && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          onConfirm={confirmBooking}
          loading={bookingLoading}
        />
      )}
    </div>
  );
};

export default Events;
