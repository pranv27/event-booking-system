import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { 
  Layout, 
  Calendar, 
  MapPin, 
  Tag, 
  DollarSign, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Loader2, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Rocket
} from 'lucide-react';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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
        if (res.data.length > 0 && !formData.category_id) {
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
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (image) {
        data.append('banner_image', image);
      }

      await api.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setStep(4); // Success step
    } catch (error) {
      console.error('Submit Error:', error.response?.data);
      alert(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-12 max-w-xs mx-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ${
            step === i ? 'bg-primary text-white shadow-lg scale-110' : 
            step > i ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            {step > i ? <CheckCircle2 className="w-5 h-5" /> : i}
          </div>
          {i < 3 && (
            <div className={`w-12 h-1 mx-2 rounded-full ${step > i ? 'bg-green-500' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  );

  if (step === 4) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
          <Rocket className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Event Launched!</h1>
        <p className="text-gray-500 text-lg mb-10 font-medium px-12">
          Your event has been successfully created and is now live. Reach out to your audience and start selling tickets.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center px-8">
          <button 
            onClick={() => navigate('/organizer/dashboard')}
            className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => setStep(1)}
            className="bg-gray-50 text-gray-900 px-10 py-4 rounded-2xl font-black hover:bg-gray-100 transition-all"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 font-bold mb-8 hover:text-primary transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
        Cancel Creation
      </button>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Create Experience</h1>
        <p className="text-gray-500 font-medium text-lg">Bring your vision to life in just a few steps</p>
      </div>

      {renderStepIndicator()}

      <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-8 animate-in">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">What's the title?</label>
                <div className="relative">
                  <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="title"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-lg"
                    placeholder="e.g. Summer Music Festival 2026"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Choose a Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, category_id: cat.id })}
                      className={`px-4 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                        formData.category_id === cat.id 
                        ? 'border-primary bg-primary/5 text-primary' 
                        : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-primary/20'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Describe the event</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-5 text-gray-400 w-5 h-5" />
                  <textarea
                    name="description"
                    required
                    rows="5"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium resize-none"
                    placeholder="Tell your audience what to expect..."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Where is it happening?</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold text-lg"
                    placeholder="City, Venue Name"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Event Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      name="event_date"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                      value={formData.event_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Start Time</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="time"
                      name="event_time"
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-bold"
                      value={formData.event_time}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Ticket Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-black text-xl text-primary"
                      value={formData.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Max Capacity</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number"
                      name="capacity"
                      required
                      min="1"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-black text-xl"
                      value={formData.capacity}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 px-1">Cover Image</label>
                <div className={`relative border-2 border-dashed rounded-[2.5rem] transition-all p-8 text-center ${
                  imagePreview ? 'border-primary bg-primary/5' : 'border-gray-100 bg-gray-50 hover:border-primary/20'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {!imagePreview ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                        <ImageIcon className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-gray-500 font-bold">Click or drag to upload banner</div>
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Max 2MB • JPG, PNG</div>
                    </div>
                  ) : (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview" className="h-48 w-auto rounded-3xl object-cover shadow-2xl" />
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-50">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-8 py-4 rounded-2xl font-black text-gray-400 hover:text-gray-900 transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 group"
              >
                Continue 
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 min-w-[200px]"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Launch Event'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
