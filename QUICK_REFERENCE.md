# Quick Reference Card

## 🚀 STARTUP (Every Time)

### Terminal 1: Backend
```bash
cd backend
npm start
# ✅ Should see: 🚀 Server running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# ✅ Should see: ➜  Local:   http://localhost:5173/
```

### One-Time Setup
```bash
# Backend: Install dependencies & run seeder
cd backend
npm install
node seeder.js  # Populate test data

# Frontend: Install dependencies
cd frontend
npm install
```

---

## 🔐 TEST CREDENTIALS

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@luxuryhotel.com` | `admin123` |
| User | `test@example.com` | `john1234` |

Or **register new user** on `/register` page

---

## 📱 QUICK LINKS

| Page | URL | Requires Auth |
|------|-----|---------------|
| Home | `/` | ❌ No |
| Rooms | `/rooms` | ❌ No |
| Booking | `/booking` | ✅ Yes |
| Admin Dashboard | `/admin/dashboard` | ✅ Yes (Admin) |
| Manage Rooms | `/admin/rooms` | ✅ Yes (Admin) |
| Manage Bookings | `/admin/bookings` | ✅ Yes (Admin) |
| Manage Users | `/admin/users` | ✅ Yes (Admin) |

---

## 💾 DATABASE

### Start MongoDB (Local)
```bash
mongod
# Or use MongoDB Atlas (cloud)
```

### View Collections
```bash
# Using Compass (GUI)
https://www.mongodb.com/products/tools/compass

# Or using shell
mongosh
use hotel_booking
db.users.find()
db.rooms.find()
db.bookings.find()
```

---

## 🔧 COMMON COMMANDS

### Backend
```bash
npm install  # Install dependencies
npm start    # Run server
npm run dev  # Run with auto-reload
npm run seed # Run seeder script
```

### Frontend
```bash
npm install      # Install dependencies
npm run dev      # Dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📁 KEY FILES GUIDE

### Critical Components
| File | Purpose |
|------|---------|
| `frontend/src/context/AuthContext.jsx` | Global auth state |
| `frontend/src/components/ProtectedRoute.jsx` | Route protection |
| `frontend/src/components/ErrorBoundary.jsx` | Error handling |
| `frontend/src/components/BookingForm.jsx` | Booking form |

### API Services
| File | Purpose |
|------|---------|
| `frontend/src/api/config.js` | Axios config with auth |
| `frontend/src/api/authService.js` | Auth endpoints |
| `frontend/src/api/bookingService.js` | Booking endpoints |
| `frontend/src/api/roomService.js` | Room endpoints |

### Backend Routes
| File | Endpoints |
|------|-----------|
| `backend/routes/auth.js` | /api/auth/* |
| `backend/routes/rooms.js` | /api/rooms/* |
| `backend/routes/bookings.js` | /api/bookings/* |

### Models
| File | Collection |
|------|-----------|
| `backend/models/User.js` | users |
| `backend/models/Room.js` | rooms |
| `backend/models/Booking.js` | bookings |

---

## 🐛 DEBUG TIPS

### Check if Backend is Running
```bash
curl http://localhost:5000/
# Should return: { "message": "API running" }
```

### Check if Frontend Connects to Backend
Open DevTools → Network tab → Try loading `/rooms`
Look for GET request to `http://localhost:5000/api/rooms`

### View Authentication Token
DevTools → Storage → Local Storage → localhost:5173
Look for `token` and `user` keys

### Check Database Connection
```bash
# In backend terminal, you should see:
✅ Database connected successfully
```

### View Console Logs
DevTools → Console
- Auth logs (login/logout)
- API response logs
- Component mount/unmount logs

---

## 🚨 QUICK FIXES

### "401 Unauthorized"
```
❌ Problem: Seeder not run
✅ Fix: Run `node seeder.js` in backend folder
```

### "Cannot GET /api/rooms"
```
❌ Problem: Backend not running
✅ Fix: Start backend: `npm start`
```

### "CORS error"
```
❌ Problem: Frontend port mismatch
✅ Fix: Check CORS in backend - should allow localhost:5173
```

### "Token not persisting"
```
❌ Problem: localStorage disabled
✅ Fix: Check browser settings, clear cache, try incognito mode
```

### "Admin routes show 'must be admin'"
```
❌ Problem: Not logged in as admin
✅ Fix: Login as admin@luxuryhotel.com / admin123
```

---

## 📚 USEFUL LINKS

| Resource | URL |
|----------|-----|
| React Docs | https://react.dev |
| Express Docs | https://expressjs.com |
| MongoDB Docs | https://docs.mongodb.com |
| JWT Info | https://jwt.io |
| Axios Docs | https://axios-http.com |
| Vite Docs | https://vitejs.dev |

---

## ⏱️ TIMING REFERENCE

| Task | Time |
|------|------|
| Setup (one-time) | 10 min |
| Start servers | 1 min |
| Run full test suite | 15 min |
| Deploy to production | 5-10 min |
| Debug typical issue | 5 min |

---

## 💡 REMEMBER

- ✅ Always run seeder after fresh setup
- ✅ frontend runs on 5173, backend runs on 5000
- ✅ Check `.env` file before deployment
- ✅ Use admin credentials to access admin pages
- ✅ Clear browser cache if seeing old styles

---

**Last Updated**: Phase 1 Complete  
**Status**: ✅ Ready for Testing

