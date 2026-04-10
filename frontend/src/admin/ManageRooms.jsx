import React, { useState, useEffect } from 'react';
import { getAllRooms, createRoom, updateRoom, deleteRoom } from '../api/roomService';

const T = {
  bg: '#0A0A08',
  surface: '#131310',
  surfaceAlt: '#111210',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(198,162,100,0.55)',
  gold: '#C6A264',
  goldLight: '#D4B97E',
  goldMuted: 'rgba(198,162,100,0.08)',
  text: '#F0EDE6',
  textMuted: 'rgba(240,237,230,0.38)',
  textSecondary: 'rgba(240,237,230,0.6)',
  danger: '#8A3B3B',
  dangerHover: '#9B4545',
};

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
  @keyframes fadeUp{from{opacity:0;transform:translateY(15px)}to{opacity:1;transform:translateY(0)}}
  @keyframes shimmer{100%{transform:translateX(100%)}}
`;

const Field = ({ label, type = 'text', value, onChange, placeholder, options }) => {
  const [focus, setFocus] = useState(false);
  
  const baseStyle = {
    width: '100%', background: focus ? '#1A1B18' : T.surfaceAlt,
    border: `1px solid ${focus ? T.borderFocus : T.border}`,
    padding: '12px 16px', color: T.text, fontFamily: "'DM Sans', sans-serif",
    fontSize: 13, fontWeight: 300, outline: 'none', borderRadius: 4,
    transition: 'all 0.25s ease', boxShadow: focus ? '0 0 0 3px rgba(198,162,100,0.05)' : 'none'
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: focus ? T.gold : T.textMuted, marginBottom: 8, transition: 'color 0.2s' }}>
        {label}
      </label>
      {options ? (
        <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{ ...baseStyle, appearance: 'none' }}>
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} placeholder={placeholder} style={baseStyle} />
      )}
    </div>
  );
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRoom, setEditingRoom] = useState(null);
  const [newRoom, setNewRoom] = useState({ name: '', price: '', roomType: 'standard', description: '', capacity: '', amenities: '', images: '' });

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data.rooms || []);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
    } finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!newRoom.name || !newRoom.price || !newRoom.description) return setError('Please fill in required fields');
    try {
      await createRoom({
        ...newRoom,
        price: parseInt(newRoom.price),
        capacity: parseInt(newRoom.capacity) || 2,
        amenities: newRoom.amenities ? newRoom.amenities.split(',').map(a => a.trim()) : [],
        images: newRoom.images ? newRoom.images.split(',').map(a => a.trim()) : ['https://picsum.photos/seed/roomx/800/600'],
      });
      setNewRoom({ name: '', price: '', roomType: 'standard', description: '', capacity: '', amenities: '', images: '' });
      fetchRooms();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add room'); }
  };

  const handleEdit = (r) => {
    setEditingRoom(r);
    setNewRoom({ name: r.name, price: r.price, roomType: r.roomType, description: r.description, capacity: r.capacity || 2, amenities: r.amenities?.join(', ') || '', images: r.images?.join(', ') || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = async () => {
    try {
      await updateRoom(editingRoom._id, {
        ...newRoom, price: parseInt(newRoom.price), capacity: parseInt(newRoom.capacity) || 2,
        amenities: newRoom.amenities ? newRoom.amenities.split(',').map(a => a.trim()) : [],
        images: newRoom.images ? newRoom.images.split(',').map(a => a.trim()) : editingRoom.images
      });
      setEditingRoom(null);
      setNewRoom({ name: '', price: '', roomType: 'standard', description: '', capacity: '', amenities: '', images: '' });
      fetchRooms();
    } catch (err) { setError(err.response?.data?.message || 'Failed to update'); }
  };

  const handleCancel = () => {
    setEditingRoom(null);
    setNewRoom({ name: '', price: '', roomType: 'standard', description: '', capacity: '', amenities: '', images: '' });
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Delete this room permanently?')) return;
    try { await deleteRoom(id); fetchRooms(); } catch (err) { setError('Delete failed'); }
  };

  return (
    <>
      <style>{fonts}</style>
      <div style={{ background: T.bg, minHeight: '100vh', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50, animation: 'fadeUp 0.6s ease' }}>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, marginBottom: 12, display: 'block' }}>Administration</span>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: T.text, margin: 0 }}>
              Manage <span style={{ fontStyle: 'italic', color: T.gold }}>Rooms</span>
            </h1>
            <div style={{ width: 40, height: 1, background: T.gold, opacity: 0.4, margin: '20px auto 0' }} />
          </div>

          {error && (
            <div style={{ padding: 16, background: 'rgba(180,80,80,0.1)', border: '1px solid rgba(180,80,80,0.2)', color: '#C07070', borderRadius: 4, marginBottom: 30, fontSize: 13, textAlign: 'center' }}>
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: '40px 48px', borderRadius: 6, marginBottom: 40, animation: 'fadeUp 0.7s ease' }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontStyle: 'italic', color: T.text, marginBottom: 30 }}>
              {editingRoom ? 'Update Room Configuration' : 'Establish New Room'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 24px' }}>
              <Field label="Room Name" value={newRoom.name} onChange={e => setNewRoom({...newRoom, name: e.target.value})} placeholder="e.g. Presidential Suite" />
              <Field label="Room Category" value={newRoom.roomType} onChange={e => setNewRoom({...newRoom, roomType: e.target.value})} options={[{value:'standard', label:'Standard'},{value:'deluxe', label:'Deluxe'},{value:'suite', label:'Suite'},{value:'presidential', label:'Presidential'}]} />
              <Field label="Nightly Rate (₹)" type="number" value={newRoom.price} onChange={e => setNewRoom({...newRoom, price: e.target.value})} placeholder="15000" />
              <Field label="Guest Capacity" type="number" value={newRoom.capacity} onChange={e => setNewRoom({...newRoom, capacity: e.target.value})} placeholder="2" />
            </div>

            <Field label="Room Description" value={newRoom.description} onChange={e => setNewRoom({...newRoom, description: e.target.value})} placeholder="A brief elegant description..." />
            <Field label="Amenities (comma separated)" value={newRoom.amenities} onChange={e => setNewRoom({...newRoom, amenities: e.target.value})} placeholder="WiFi, Minibar, Ocean View" />
            <Field label="Image URLs (comma separated)" value={newRoom.images} onChange={e => setNewRoom({...newRoom, images: e.target.value})} placeholder="https://picsum.photos/..., ..." />
            
            <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
              <button onClick={editingRoom ? handleUpdate : handleAdd} style={{ padding: '14px 28px', background: T.gold, border: `1px solid ${T.gold}`, color: '#000', fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, transition: 'background 0.3s' }} onMouseEnter={e=>e.target.style.background=T.goldLight} onMouseLeave={e=>e.target.style.background=T.gold}>
                {editingRoom ? 'Save Changes' : 'Create Room'}
              </button>
              {editingRoom && (
                <button onClick={handleCancel} style={{ padding: '14px 28px', background: 'transparent', border: `1px solid ${T.border}`, color: T.text, fontSize: 11, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 4, transition: 'border 0.3s' }} onMouseEnter={e=>e.target.style.borderColor=T.textMuted} onMouseLeave={e=>e.target.style.borderColor=T.border}>
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {loading ? (
              <p style={{ color: T.textMuted, textAlign: 'center', gridColumn: '1/-1', padding: 40 }}>Synchronizing inventory...</p>
            ) : rooms.map((r, i) => (
              <div key={r._id} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden', animation: `fadeUp ${0.4 + i*0.1}s ease forwards` }}>
                <div style={{ height: 180, background: T.surfaceAlt, position: 'relative' }}>
                  {r.images?.[0] && <img src={r.images[0]} alt={r.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />}
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '4px 10px', fontSize: 10, color: T.gold, textTransform: 'uppercase', letterSpacing: '0.1em', border: `1px solid ${T.goldMuted}`, borderRadius: 4 }}>
                    ₹{r.price.toLocaleString()} / Night
                  </div>
                </div>
                <div style={{ padding: 24 }}>
                  <p style={{ fontSize: 10, color: T.textMuted, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>{r.roomType} • {r.capacity} Guests</p>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: T.text, marginBottom: 12 }}>{r.name}</h3>
                  <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, marginBottom: 20 }}>{r.description.length > 80 ? r.description.substring(0,80)+'...' : r.description}</p>
                  
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={() => handleEdit(r)} style={{ flex: 1, padding: '10px', background: T.surfaceAlt, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s' }} onMouseEnter={e=>e.target.style.borderColor=T.gold} onMouseLeave={e=>e.target.style.borderColor=T.border}>
                      Configure
                    </button>
                    <button onClick={() => handleDelete(r._id)} style={{ flex: 1, padding: '10px', background: 'transparent', border: `1px solid ${T.border}`, color: T.danger, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', borderRadius: 4, transition: 'all 0.2s' }} onMouseEnter={e=>{e.target.style.background=T.danger; e.target.style.color='#fff'; e.target.style.borderColor=T.danger}} onMouseLeave={e=>{e.target.style.background='transparent'; e.target.style.color=T.danger; e.target.style.borderColor=T.border}}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default ManageRooms;