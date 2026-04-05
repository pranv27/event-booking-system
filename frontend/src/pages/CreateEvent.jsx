import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Layout, Calendar, MapPin, Tag, DollarSign, Users, Image as ImageIcon, FileText, Loader2, ArrowLeft } from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    location: '',
    event_date: '',
    event_time: '',
    price: 0,
    capacity: 0,
    banner: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/events/categories');
        setCategories(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, category_id: res.data[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit!');
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category_id', formData.category_id);
      data.append('location', formData.location);
      data.append('event_date', formData.event_date);
      data.append('event_time', formData.event_time);
      data.append('price', formData.price);
      data.append('capacity', formData.capacity);
      
      if (image) {
        data.append('banner_image', image);
      } else if (formData.banner) {
        data.append('banner_image', formData.banner);
      }

      await api.post('/events', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      alert('Event launched successfully! 🚀');
      navigate('/events');
    } catch (error) {
      console.error('Submit Error:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Failed to create event';
      const validationErrors = error.response?.data?.errors;
      
      if (validationErrors) {
        alert(`${errorMsg}: ${validationErrors.map(e => e.message).join(', ')}`);
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 font-bold mb-8 hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Dashboard
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
        <div className="bg-primary p-8 md:p-12 text-white">
          <h1 className="text-3xl md:text-4xl font-black mb-2">Host an Event</h1>
          <p className="opacity-80 text-lg">Reach thousands of people by listing your event</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          {/* Basic Info */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Title</label>
                <div className="relative">
                  <Layout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="e.g. Summer Music Festival 2026"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                      name="category_id"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none appearance-none"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="location"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                      placeholder="City, Venue Name"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-l-4 border-accent pl-4">
              Date and Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="date"
                    name="event_date"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    value={formData.event_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Start Time</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="time"
                    name="event_time"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    value={formData.event_time}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tickets & Capacity */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-l-4 border-secondary pl-4">
              Tickets & Capacity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ticket Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Max Capacity</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="capacity"
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    value={formData.capacity}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description & Media */}
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 border-l-4 border-gray-900 pl-4">
              Details & Media
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Event Image</label>
                <div className="flex flex-col gap-4">
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    />
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setImage(null); setImagePreview(null); }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Or Image URL (Fallback)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="url"
                    name="banner"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                    placeholder="https://example.com/image.jpg"
                    value={formData.banner}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-6 text-gray-400 w-5 h-5" />
                  <textarea
                    name="description"
                    required
                    rows="5"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                    placeholder="Describe your event..."
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Launch Your Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
