import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Calendar, Shield, Zap, Users, Star } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight">
              Events Made <span className="text-primary">Simple.</span><br />
              Memories Made <span className="text-accent">Forever.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
              The all-in-one platform to discover, book, and host incredible experiences. 
              Join thousands of people making every moment count.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!user ? (
                <>
                  <Link to="/register" className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="bg-gray-50 text-gray-900 px-10 py-4 rounded-2xl font-black text-lg hover:bg-gray-100 transition-all border border-gray-100 flex items-center justify-center">
                    Sign In
                  </Link>
                </>
              ) : (
                <Link 
                  to={user.role === 'organizer' ? '/organizer/dashboard' : '/attendee/dashboard'} 
                  className="bg-primary text-white px-10 py-4 rounded-2xl font-black text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  Go to My Dashboard <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">Why Choose Evently?</h2>
            <p className="text-gray-500 font-medium">Everything you need to manage your events in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-500 leading-relaxed">Book tickets in seconds with our optimized checkout process. No more waiting in lines.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Secure & Reliable</h3>
              <p className="text-gray-500 leading-relaxed">Your data and payments are protected with enterprise-grade security and encryption.</p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Community Focused</h3>
              <p className="text-gray-500 leading-relaxed">Connect with like-minded people and join vibrant communities around shared interests.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1 text-accent mb-6">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-6 h-6 fill-current" />)}
          </div>
          <h2 className="text-3xl font-black mb-8 italic">"The best event platform I've ever used. Seamless and beautiful."</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="text-left">
              <p className="font-bold text-gray-900">Sarah Jenkins</p>
              <p className="text-sm text-gray-500">Tech Lead at InnovateX</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
