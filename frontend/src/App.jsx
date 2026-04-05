import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow bg-white">
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
              <Route path="/events/:id" element={
                <ProtectedRoute allowedRoles={['attendee', 'organizer', 'admin']}>
                  <EventDetails />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />

              {/* ATTENDEE ROUTES */}
              <Route
                path="/attendee/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['attendee']}>
                    <AttendeeDashboard />
                  </ProtectedRoute>
                }
              />

              {/* ORGANIZER ROUTES */}
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/events"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <MyEvents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-event"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateEvent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-event/:id"
                element={
                  <ProtectedRoute allowedRoles={['organizer']}>
                    <CreateEvent isEdit={true} />
                  </ProtectedRoute>
                }
              />

              {/* CATCH ALL - Redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
