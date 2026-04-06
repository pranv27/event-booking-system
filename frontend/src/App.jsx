import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DashboardLayout from './components/DashboardLayout';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AttendeeDashboard from './pages/attendee/AttendeeDashboard';
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import MyEvents from './pages/organizer/MyEvents';
import CreateEvent from './pages/CreateEvent';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent = () => {
  const location = useLocation();
  const isDashboardPath = location.pathname.includes('/organizer') || 
                          location.pathname.includes('/attendee') || 
                          location.pathname === '/profile' ||
                          location.pathname === '/create-event' ||
                          location.pathname.startsWith('/edit-event');

  return (
    <div className="flex flex-col min-h-screen">
      {!isDashboardPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* GUEST ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* SHARED PROTECTED ROUTES */}
          <Route path="/events" element={
            <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
              <Events />
            </ProtectedRoute>
          } />
          
          {/* DASHBOARD WRAPPED ROUTES */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/events/:id" element={
            <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
              <EventDetails />
            </ProtectedRoute>
          } />

          {/* ATTENDEE ROUTES */}
          <Route
            path="/attendee/dashboard"
            element={
              <ProtectedRoute allowedRoles={['attendee']}>
                <DashboardLayout>
                  <AttendeeDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* ORGANIZER ROUTES */}
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <DashboardLayout>
                  <OrganizerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <DashboardLayout>
                  <MyEvents />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-event"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <DashboardLayout>
                  <CreateEvent />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-event/:id"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <DashboardLayout>
                  <CreateEvent isEdit={true} />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* CATCH ALL - Redirect to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboardPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
