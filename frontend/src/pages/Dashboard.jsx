import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { Ticket, Calendar, MapPin, QrCode, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings/user');
        setBookings(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Tickets</h1>
        <p className="text-gray-500">Manage your upcoming experiences and tickets</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sticky top-24">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <span className="text-3xl font-black">{user?.name?.charAt(0)}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 mb-6">{user?.email}</p>
              <div className="w-full pt-6 border-t border-gray-50 flex justify-around text-center">
                <div>
                  <div className="text-2xl font-black text-primary">{bookings.length}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bookings</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-accent">0</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {loading ? (
            <Loader />
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-md transition-shadow">
                <div className="sm:w-48 h-48 sm:h-auto overflow-hidden">
                  <img
                    src={booking.banner_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Event"
                  />
                </div>
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {booking.title}
                      </h3>
                      <div className="bg-primary/5 text-primary p-2 rounded-xl">
                        <QrCode className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <Calendar className="w-4 h-4" />
                        {new Date(booking.event_date).toDateString()} at {booking.event_time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                        <MapPin className="w-4 h-4" />
                        {booking.location}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-xs font-bold bg-gray-100 text-gray-600 px-3 py-1 rounded-full uppercase tracking-wider">
                      Confirmed
                    </div>
                    <a
                      href={booking.qr_code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-bold text-sm flex items-center gap-1 hover:underline"
                    >
                      View Ticket <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-gray-50 rounded-3xl border border-dashed border-gray-200 py-20 text-center">
              <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No tickets yet</h3>
              <p className="text-gray-500 mb-8">Ready for your next adventure?</p>
              <button className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90">
                Explore Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
