import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import GalleryPage from './pages/GalleryPage';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import ManageRooms from './admin/ManageRooms';
import ManageBookings from './admin/ManageBookings';
import ManageCustomers from './admin/ManageCustomers';
import RoomsPage from './pages/RoomPage';
import MyBookings from './pages/MyBookings';
import Payment from './pages/Payment';

function AppContent() {
  const location = useLocation();

  const hideLayout = [
    '/signin',
    '/register',
    '/admin',
    '/admin/dashboard',
    '/admin/rooms',
    '/admin/bookings',
    '/admin/customers',
  ].includes(location.pathname);

  return (
    <div className="App">
      {!hideLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <ProtectedRoute requireAdmin>
              <ManageRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute requireAdmin>
              <ManageBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute requireAdmin>
              <ManageCustomers />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;