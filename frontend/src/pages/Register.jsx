import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await register(formData);
      if (res.role === 'organizer') {
        navigate('/organizer/dashboard');
      } else {
        navigate('/attendee/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join the community today</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm font-bold p-4 rounded-xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">I am an</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'attendee' })}
                  className={`py-3 rounded-xl font-bold border-2 transition-all ${
                    formData.role === 'attendee' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  Attendee
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'organizer' })}
                  className={`py-3 rounded-xl font-bold border-2 transition-all ${
                    formData.role === 'organizer' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 text-gray-500'
                  }`}
                >
                  Organizer
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-xl font-black text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Get Started'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
