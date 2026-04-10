import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking } from '../api/bookingService';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fake Card Details
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (!bookingData) {
      navigate(-1);
    }
  }, [bookingData, navigate]);

  const handleChange = (e) => {
    setCardData({ ...cardData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiry || !cardData.cvv) {
      setError('Please fill in all card details correctly.');
      return;
    }
    setError('');
    setLoading(true);

    // Simulate Payment Processing
    setTimeout(async () => {
      try {
        await createBooking(bookingData);
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-bookings');
        }, 2000);
      } catch (err) {
        setLoading(false);
        setError(err.response?.data?.message || 'Payment accepted but booking failed.');
      }
    }, 2500); // 2.5 second simulated processing delay
  };

  const T = {
    bg: '#0A0A08',
    surface: '#131310',
    border: 'rgba(255,255,255,0.07)',
    gold: '#C6A264',
    goldLight: '#D4B97E',
    text: '#F0EDE6',
    textMuted: 'rgba(240,237,230,0.42)',
  };

  if (!bookingData) return null;

  if (success) {
    return (
      <div style={{ background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', background: T.surface, border: `1px solid ${T.gold}`, padding: '60px', borderRadius: '12px' }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '36px', color: T.gold, marginBottom: '16px' }}>Payment Successful!</h2>
          <p style={{ color: T.textMuted, fontSize: '15px' }}>Your booking is confirmed. Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: T.bg, minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 20px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '42px', color: T.text, marginBottom: '30px', textAlign: 'center' }}>
          Secure <span style={{ fontStyle: 'italic', color: T.gold }}>Checkout</span>
        </h1>

        {error && (
          <div style={{ background: 'rgba(233,122,122,0.1)', color: '#E97A7A', border: '1px solid #E97A7A', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '40px', borderRadius: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${T.border}`, paddingBottom: '20px', marginBottom: '30px' }}>
            <div>
              <p style={{ color: T.textMuted, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Confirmation Method</p>
              <p style={{ fontSize: '28px', color: T.gold, fontWeight: '600', textTransform: 'capitalize' }}>
                 {bookingData.paymentMethod.replace('_', ' ')}
              </p>
            </div>
            <div style={{ fontSize: '32px', color: T.textMuted }}>💳</div>
          </div>

          <form onSubmit={handlePayment}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Card Number</label>
              <input type="text" name="cardNumber" value={cardData.cardNumber} onChange={handleChange} placeholder="XXXX XXXX XXXX XXXX" style={{ width: '100%', padding: '14px', background: 'transparent', border: `1px solid ${T.border}`, color: T.text, borderRadius: '6px', fontSize: '16px' }} disabled={loading} required/>
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Name on Card</label>
              <input type="text" name="cardName" value={cardData.cardName} onChange={handleChange} placeholder="John Doe" style={{ width: '100%', padding: '14px', background: 'transparent', border: `1px solid ${T.border}`, color: T.text, borderRadius: '6px', fontSize: '16px' }} disabled={loading} required/>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Expiry (MM/YY)</label>
                <input type="text" name="expiry" value={cardData.expiry} onChange={handleChange} placeholder="12/25" style={{ width: '100%', padding: '14px', background: 'transparent', border: `1px solid ${T.border}`, color: T.text, borderRadius: '6px', fontSize: '16px' }} disabled={loading} required/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: T.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>CVV</label>
                <input type="password" name="cvv" value={cardData.cvv} onChange={handleChange} placeholder="•••" style={{ width: '100%', padding: '14px', background: 'transparent', border: `1px solid ${T.border}`, color: T.text, borderRadius: '6px', fontSize: '16px' }} disabled={loading} required/>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '18px', background: loading ? 'transparent' : T.gold, border: loading ? `1px solid ${T.gold}` : 'none', color: loading ? T.gold : '#0E0F0D', 
              fontSize: '15px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '6px', cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.3s'
            }}>
              {loading ? 'Processing Payment...' : 'Pay Now & Book'}
            </button>
            <p style={{ textAlign: 'center', color: T.textMuted, fontSize: '12px', marginTop: '16px' }}>🔒 This is a secure mock payment gateway</p>
          </form>

        </div>
      </div>
    </div>
  );
};

export default Payment;
