import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Ticket, Users, Share2, Heart, ShieldCheck } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`/events/${id}`);
        setEvent(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookingClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/events/${id}` } });
      return;
    }
    setIsModalOpen(true);
  };

  const confirmBooking = async () => {
    setBooking(true);
    try {
      await api.post('/bookings', { event_id: parseInt(id), ticket_quantity: 1 });
      alert('Ticket booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to book ticket');
    } finally {
      setBooking(false);
      setIsModalOpen(false);
    }
  };

  if (loading) return <Loader />;
  if (!event) return <div className="text-center py-24 text-2xl font-bold">Event not found</div>;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <div className="relative h-[400px] md:h-[500px]">
        <img
          src={event.banner_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}
          className="w-full h-full object-cover"
          alt={event.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-primary/20 backdrop-blur text-primary-foreground border border-primary/20 inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-4">
              {event.category_name}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight leading-tight max-w-4xl">
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-medium">{new Date(event.event_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="font-medium">{event.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                About this event
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Date & Time</h3>
                  <p className="text-gray-600">{new Date(event.event_date).toDateString()}</p>
                  <p className="text-gray-600">{event.event_time}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Location</h3>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-500 font-medium">Ticket Price</span>
                  <span className="text-3xl font-black text-primary">${event.price}</span>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Ticket className="w-5 h-5 text-primary" />
                    <span>Free cancellation up to 24h before</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{event.capacity} tickets available</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 text-sm">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span>Secure booking & instant delivery</span>
                  </div>
                </div>

                <button
                  onClick={handleBookingClick}
                  className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  Book Your Ticket
                </button>

                <div className="mt-6 flex justify-center gap-6">
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                    <Heart className="w-4 h-4" /> Save
                  </button>
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>

              <div className="mt-8 bg-accent/10 border border-accent/20 p-6 rounded-2xl">
                <h4 className="font-bold text-accent-foreground mb-2">Organizer Contact</h4>
                <p className="text-sm text-gray-600">Have questions? Reach out to the organizer for more info about the event.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={event}
        onConfirm={confirmBooking}
        loading={booking}
      />
    </div>
  );
};

export default EventDetails;
