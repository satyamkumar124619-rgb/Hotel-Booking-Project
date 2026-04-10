import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookingService';
import { getAllRooms } from '../api/roomService';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    roomId: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    paymentMethod: 'credit_card',
    specialRequests: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    fetchRooms();
  }, [isAuthenticated, navigate]);

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      setRooms(data.rooms || []);
    } catch (err) {
      setError('Failed to load rooms');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateNights = () => {
    if (!formData.checkIn || !formData.checkOut) return 0;
    const checkIn = new Date(formData.checkIn);
    const checkOut = new Date(formData.checkOut);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const getSelectedRoom = () => {
    return rooms.find(r => r._id === formData.roomId);
  };

  const calculateTotal = () => {
    const room = getSelectedRoom();
    if (!room) return 0;
    const nights = calculateNights();
    return room.price * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.roomId || !formData.checkIn || !formData.checkOut) {
      setError('Please fill in all required fields');
      return;
    }

    const nights = calculateNights();
    if (nights <= 0) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        roomId: formData.roomId,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: parseInt(formData.guests),
        paymentMethod: formData.paymentMethod,
        specialRequests: formData.specialRequests,
      };

      if (bookingData.paymentMethod !== 'pay_at_hotel') {
        navigate('/payment', { state: { bookingData } });
      } else {
        const response = await createBooking(bookingData);
        alert('Booking Confirmed successfully!');
        navigate('/my-bookings');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedRoom = getSelectedRoom();
  const nights = calculateNights();
  const total = calculateTotal();

  const T = {
    bg: '#0A0A08',
    surface: '#131310',
    border: 'rgba(255,255,255,0.07)',
    gold: '#C6A264',
    goldLight: '#D4B97E',
    text: '#F0EDE6',
    textMuted: 'rgba(240,237,230,0.42)',
    textSecondary: 'rgba(240,237,230,0.62)',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: T.surface,
    border: `1px solid ${T.border}`,
    color: T.text,
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    borderRadius: '6px',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: T.textMuted,
  };

  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${T.border}`,
      borderRadius: '8px',
      padding: '40px',
      maxWidth: '600px',
      width: '100%',
    }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '28px',
        color: T.text,
        marginBottom: '28px',
      }}>Complete Your Booking</h2>

      {error && (
        <div style={{
          background: 'rgba(192,113,90,0.1)',
          border: '1px solid rgba(192,113,90,0.5)',
          color: '#E97A7A',
          padding: '12px 16px',
          borderRadius: '6px',
          marginBottom: '24px',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Select Room */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Select Room *</label>
          <select
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${T.gold}' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '40px',
            }}
          >
            <option value="">-- Choose a room --</option>
            {rooms.map(room => (
              <option key={room._id} value={room._id}>
                {room.name} - ₹{room.price}/night
              </option>
            ))}
          </select>
        </div>

        {/* Check-in Date */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Check-in Date *</label>
          <input
            type="date"
            name="checkIn"
            value={formData.checkIn}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Check-out Date */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Check-out Date *</label>
          <input
            type="date"
            name="checkOut"
            value={formData.checkOut}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Number of Guests */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Number of Guests</label>
          <select
            name="guests"
            value={formData.guests}
            onChange={handleChange}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Payment Method *</label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            style={{
              ...inputStyle,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${T.gold}' stroke-width='2'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '20px',
              paddingRight: '40px',
            }}
          >
            <option value="credit_card">Credit / Debit Card</option>
            <option value="paypal">PayPal</option>
            <option value="upi">UPI / Net Banking</option>
            <option value="pay_at_hotel">Pay at Hotel</option>
          </select>
        </div>

        {/* Special Requests */}
        <div style={{ marginBottom: '28px' }}>
          <label style={labelStyle}>Special Requests</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            placeholder="Any special requests? (optional)"
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '80px',
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>

        {/* Price Summary */}
        {selectedRoom && nights > 0 && (
          <div style={{
            background: 'rgba(198,162,100,0.08)',
            border: `1px solid rgba(198,162,100,0.2)`,
            padding: '20px',
            borderRadius: '6px',
            marginBottom: '28px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
              paddingBottom: '12px',
              borderBottom: `1px solid rgba(198,162,100,0.1)`,
            }}>
              <span style={{ color: T.textMuted }}>₹{selectedRoom.price} per night × {nights} {nights === 1 ? 'night' : 'nights'}</span>
              <span style={{ color: T.text, fontWeight: '600' }}>₹{(selectedRoom.price * nights).toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: T.text, fontSize: '14px', fontWeight: '600' }}>Total</span>
              <span style={{ color: T.gold, fontSize: '18px', fontWeight: '700' }}>₹{total.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !formData.roomId}
          style={{
            width: '100%',
            padding: '16px 24px',
            background: submitting || !formData.roomId ? 'rgba(198,162,100,0.5)' : T.gold,
            color: '#0E0F0D',
            border: 'none',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: '600',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: submitting || !formData.roomId ? 'not-allowed' : 'pointer',
            borderRadius: '6px',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={(e) => !submitting && !formData.roomId === false && (e.target.style.background = T.goldLight)}
          onMouseLeave={(e) => !submitting && !formData.roomId === false && (e.target.style.background = T.gold)}
        >
          {submitting ? 'Processing...' : 'Confirm Booking'}
        </button>
      </form>

      <p style={{
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '12px',
        color: T.textMuted,
      }}>
        * Required fields
      </p>
    </div>
  );
};

export default BookingForm;