import React from 'react';
import { X, Calendar, MapPin, Ticket, ShieldCheck } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, event, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-black text-gray-900">Confirm Ticket</h3>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex gap-4 mb-8">
            <img
              src={event.banner_image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80'}
              className="w-24 h-24 rounded-2xl object-cover shadow-sm"
              alt="Event"
            />
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{event.title}</h4>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
                <Calendar className="w-4 h-4" /> {new Date(event.event_date).toDateString()}
              </div>
            </div>
          </div>

          <div className="bg-primary/5 rounded-2xl p-6 space-y-4 mb-8 border border-primary/10">
            <div className="flex justify-between items-center font-medium">
              <span className="text-gray-600">Standard Ticket</span>
              <span className="text-gray-900">${event.price}</span>
            </div>
            <div className="flex justify-between items-center font-medium">
              <span className="text-gray-600">Service Fee</span>
              <span className="text-gray-900">$0.00</span>
            </div>
            <div className="pt-4 border-t border-primary/20 flex justify-between items-center font-black text-xl">
              <span className="text-gray-900">Total</span>
              <span className="text-primary">${event.price}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8 bg-gray-50 p-4 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
            <p>By clicking "Confirm", you agree to the terms of service. Your ticket will be issued immediately after confirmation.</p>
          </div>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm & Book'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
