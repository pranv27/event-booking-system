import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, Loader2, Camera } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Profile update logic would go here
    setTimeout(() => {
      setLoading(false);
      alert('Profile updated successfully (Simulation)');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500 font-medium">Manage your personal information and account settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center text-primary text-4xl font-black">
                {user?.name?.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-400 hover:text-primary transition-all">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
              <Shield className="w-3 h-3" /> {user?.role}
            </div>
            
            <div className="pt-6 border-t border-gray-50 text-left space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 md:p-10">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              Account Information
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none transition-all"
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
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                      value={formData.email}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
