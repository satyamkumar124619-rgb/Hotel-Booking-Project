# Architecture Diagrams & Quick Reference Guide

## 🏗️ APPLICATION ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           App.jsx (Root Component)                    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │  ┌─ ErrorBoundary (Catches Errors)                  │  │
│  │  │  ┌─ AuthProvider (Global State)                  │  │
│  │  │  │  ┌─ Router (Routes)                           │  │
│  │  │  │  │                                             │  │
│  │  │  │  ├─ Public Routes                             │  │
│  │  │  │  │  ├─ Home                                   │  │
│  │  │  │  │  ├─ Rooms (RoomPage)                       │  │
│  │  │  │  │  ├─ SignIn                                 │  │
│  │  │  │  │  └─ Register                               │  │
│  │  │  │  │                                             │  │
│  │  │  │  └─ Protected Routes                          │  │
│  │  │  │     ├─ /booking (requires auth)               │  │
│  │  │  │     ├─ /admin/* (requires admin)              │  │
│  │  │  │     └─ More...                                │  │
│  │  │  │                                             │  │
│  │  │  └────────────────────────────────────────────┘  │
│  │  │                                             │  │
│  │  └────────────────────────────────────────────────┘  │
│  │                                             │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────────┘
         │                           │
         │ API Calls (axios)         │
         │ JWT Token in Headers      │
         │                           │
         ▼                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           server.js (Entry Point)                    │  │
│  │  ├─ CORS: localhost:5173                             │  │
│  │  └─ JSON parsing                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Routes                          Middleware                 │
│  ├─ /api/auth                    ├─ protect (JWT verify)   │
│  │  ├─ POST /register            ├─ adminOnly (role check) │
│  │  ├─ POST /login               └─ error handler          │
│  │  └─ GET /me                                              │
│  │                                                          │
│  ├─ /api/rooms                   Controller Functions      │
│  │  ├─ GET / (public, filter)    ├─ register user         │
│  │  ├─ GET /:id (public)         ├─ login user            │
│  │  ├─ POST / (admin)            ├─ create room           │
│  │  ├─ PUT /:id (admin)          ├─ create booking        │
│  │  └─ DELETE /:id (admin)       └─ get bookings          │
│  │                                                          │
│  └─ /api/bookings                                           │
│     ├─ POST / (auth)             Models                     │
│     ├─ GET /my (auth)            ├─ User (hashed password) │
│     ├─ GET /all (admin)          ├─ Room (details)         │
│     └─ PUT /:id/cancel (auth)    └─ Booking (references)   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
         │
         │ MongoDB Driver
         │
         ▼
┌─────────────────────────────────────────────────────────────┐
│                   MONGODB DATABASE                           │
├─────────────────────────────────────────────────────────────┤
│  Collections:                                               │
│  ├─ users (name, email, password_hash, role, createdAt)    │
│  ├─ rooms (name, roomType, price, amenities, images, etc)  │
│  └─ bookings (user_ref, room_ref, dates, price, status)    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 USER AUTHENTICATION FLOW

```
┌─────────────────────────────────────────────────────────────┐
│                    User Registration                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User fills Register form (name, email, password)       │
│                         ▼                                    │
│  2. registerUser() called (authService)                     │
│                         ▼                                    │
│  3. axios POST to /api/auth/register                        │
│                         ▼                                    │
│  4. Backend validates input                                 │
│                         ▼                                    │
│  5. Check if email already exists                           │
│                         ▼                                    │
│  6. Hash password with bcryptjs                             │
│                         ▼                                    │
│  7. Save User to MongoDB                                    │
│                         ▼                                    │
│  8. Generate JWT token                                      │
│                         ▼                                    │
│  9. Return token + user data                                │
│                         ▼                                    │
│ 10. Frontend stores in localStorage                         │
│                         ▼                                    │
│ 11. Update AuthContext (global state)                       │
│                         ▼                                    │
│ 12. Redirect to home (logged in)                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      User Login                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User enters email & password                            │
│                         ▼                                    │
│  2. loginUser() called (authService)                        │
│                         ▼                                    │
│  3. axios POST to /api/auth/login                           │
│                         ▼                                    │
│  4. Backend finds user by email                             │
│                         ▼                                    │
│  5. Compare entered password with hashed password           │
│     (Using bcrypt.compare)                                  │
│                         ▼                                    │
│  6. If match: Generate JWT token                            │
│  7. If no match: Return 401 Unauthorized                    │
│                         ▼                                    │
│  8. Return token + user data                                │
│                         ▼                                    │
│  9. Frontend stores in localStorage                         │
│                         ▼                                    │
│ 10. Update AuthContext                                      │
│                         ▼                                    │
│ 11. Redirect based on role (admin → dashboard, user → home) │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  Protected API Request                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. axios.post('/bookings', data)                           │
│                         ▼                                    │
│  2. Axios interceptor adds Authorization header             │
│     Header: "Authorization: Bearer <jwt_token>"             │
│                         ▼                                    │
│  3. Backend receive request with token                      │
│                         ▼                                    │
│  4. protect middleware extracts token from header           │
│                         ▼                                    │
│  5. Verify token signature using JWT_SECRET                 │
│                         ▼                                    │
│  6. If valid: Extract user ID from token                    │
│  7. If invalid: Return 401 Unauthorized                     │
│                         ▼                                    │
│  8. Fetch user from database (attach to req.user)           │
│                         ▼                                    │
│  9. Call route handler with authenticated user              │
│                         ▼                                    │
│ 10. Route proceeds (e.g., create booking for this user)     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 USER BOOKING FLOW

```
┌──────────────────────────────────────────────────────────┐
│                 User Booking Journey                      │
└──────────────────────────────────────────────────────────┘

1. User Navigates to /rooms
   ├─ RoomPage component loads
   ├─ Checks: isAuthenticated? (from AuthContext)
   ├─ Yes: Load rooms from API
   └─ No: Show rooms (public access)

2. User Clicks "Reserve" on a Room
   ├─ handleBook() called
   ├─ Check: isAuthenticated?
   ├─ No: Redirect to /signin
   └─ Yes: Redirect to /booking

3. User Navigates to /booking Route
   ├─ ProtectedRoute component catches it
   ├─ Checks: isAuthenticated?
   ├─ No: Redirect to /signin (and stay logged in)
   └─ Yes: Render Booking page

4. BookingForm Component Renders
   ├─ useAuth() gets current user
   ├─ useEffect runs: getAllRooms()
   ├─ Display available rooms in dropdown
   └─ User sees form

5. User Fills Booking Details
   ├─ Select room type
   ├─ Select check-in date
   ├─ Select check-out date
   ├─ Select number of guests
   ├─ Add special requests (optional)
   └─ Form calculates price in real-time

6. User Clicks "Confirm Booking"
   ├─ Form validates all required fields
   ├─ Calculates number of nights
   ├─ axios POST to /api/bookings
   ├─ Axios interceptor adds JWT token
   │
   ├─ Backend:
   │  ├─ protect middleware verifies token
   │  ├─ Extracts user ID from token
   │  ├─ Validates booking data
   │  ├─ Creates Booking document in MongoDB
   │  │  └─ Linked to user._id and room._id
   │  └─ Returns booking confirmation
   │
   ├─ Frontend receives response
   ├─ Shows success message
   └─ Auto-redirects to home after 2 seconds

7. User Can View Their Booking
   ├─ Via "My Bookings" page (to be implemented)
   └─ Booking shows in database linked to their user ID
```

---

## 🏪 ADMIN ROOM MANAGEMENT FLOW

```
┌──────────────────────────────────────────────────────────┐
│            Admin Room Management Journey                  │
└──────────────────────────────────────────────────────────┘

1. Admin Logs In
   ├─ POST /api/auth/login
   ├─ Backend validates email/password
   ├─ Returns JWT token with role:"admin"
   └─ AuthContext: isAdmin = true

2. Admin Navigates to /admin/rooms
   ├─ ProtectedRoute catches it
   ├─ Checks: isAuthenticated? ✅ (has token)
   ├─ Checks: isAdmin? ✅ (role is 'admin')
   └─ Render ManageRooms page

3. ManageRooms Component Loads
   ├─ useEffect runs: getAllRooms()
   ├─ axios GET /api/rooms (no auth needed for public)
   ├─ Display all rooms in a grid
   └─ Show Add/Edit/Delete buttons

4. Admin Clicks "Add Room"
   ├─ Form opens (or scrolls to form)
   ├─ Admin fills in details:
   │  ├─ Room name
   │  ├─ Room type (standard/deluxe/suite/presidential)
   │  ├─ Price per night
   │  ├─ Description
   │  ├─ Amenities (comma-separated)
   │  └─ Image URLs
   │
   ├─ Admin clicks "Add Room"
   ├─ axios POST /api/rooms with room data
   ├─ Axios adds Authorization header with JWT
   │
   ├─ Backend:
   │  ├─ protect middleware verifies token
   │  ├─ adminOnly middleware checks role=='admin'
   │  ├─ Validates room data
   │  ├─ Creates Room in MongoDB
   │  └─ Returns new room object
   │
   ├─ Frontend receives response
   ├─ Form clears
   ├─ Re-fetches room list
   └─ New room appears in grid

5. Admin Clicks "Edit" on a Room
   ├─ Room details populate form
   ├─ Admin modifies details
   ├─ Clicks "Update Room"
   ├─ axios PUT /api/rooms/:id with new data
   ├─ Backend updates MongoDB document
   ├─ Frontend refreshes list
   └─ Updated room shows in grid

6. Admin Clicks "Delete" on a Room
   ├─ Confirmation dialog appears
   ├─ Admin confirms deletion
   ├─ axios DELETE /api/rooms/:id
   ├─ Backend deletes from MongoDB
   ├─ Frontend refreshes list
   └─ Room removed from grid
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION LAYERS

```
FRONTEND LAYER (Client-Side)
├─ AuthContext manages: isAuthenticated, isAdmin
├─ ProtectedRoute checks before rendering
├─ Redirects to signin if not authenticated
└─ Redirects to home if not admin (for admin routes)

MIDDLEWARE LAYER (Server-Side)
├─ protect() middleware
│  ├─ Extracts JWT from Authorization header
│  ├─ Verifies signature with JWT_SECRET
│  ├─ Decodes user ID
│  ├─ Fetches user from database
│  └─ Attaches user to req.user for handlers
│
└─ adminOnly() middleware
   ├─ Checks if req.user exists (protect runs first)
   ├─ Checks if req.user.role === 'admin'
   └─ Allows/denies access

DATA LAYER (Database)
├─ User model stores:
│  ├─ Email (unique)
│  ├─ Password (hashed with bcryptjs)
│  └─ Role (admin or user)
│
├─ Booking model stores:
│  ├─ user: ObjectId (reference to user)
│  └─ room: ObjectId (reference to room)
│
└─ Ensures data isolation (users only see own bookings)
```

---

## 📊 STATE MANAGEMENT

```
AuthContext (Global State)
├─ user: { id, name, email, role }
├─ loading: boolean (true while checking auth)
├─ error: string (error message)
├─ isAuthenticated: boolean (computed from user)
├─ isAdmin: boolean (computed from user.role)
│
└─ Functions:
   ├─ login(email, password)
   ├─ register(formData)
   └─ logout()

Component State (Local)
├─ BookingForm
│  ├─ formData: { roomId, checkIn, checkOut, guests }
│  ├─ loading: boolean
│  ├─ error: string
│  └─ success: boolean
│
├─ RoomPage
│  ├─ rooms: array
│  ├─ loading: boolean
│  ├─ error: string
│  └─ filter: string
│
└─ Other components manage their own state
```

---

## 🎯 KEY FILES REFERENCE

| Purpose | File | Type |
|---------|------|------|
| API Config | `frontend/src/api/config.js` | Core |
| Auth API | `frontend/src/api/authService.js` | Service |
| Room API | `frontend/src/api/roomService.js` | Service |
| Booking API | `frontend/src/api/bookingService.js` | Service |
| Auth Context | `frontend/src/context/AuthContext.jsx` | Provider |
| Route Protection | `frontend/src/components/ProtectedRoute.jsx` | Component |
| Error Handler | `frontend/src/components/ErrorBoundary.jsx` | Component |
| Booking Form | `frontend/src/components/BookingForm.jsx` | Component |
| Main App | `frontend/src/App.jsx` | Root |
| Auth Middleware | `backend/middleware/auth.js` | Middleware |
| Admin Check | `backend/middleware/adminAuth.js` | Middleware |
| Auth Routes | `backend/routes/auth.js` | Routes |
| Room Routes | `backend/routes/rooms.js` | Routes |
| Booking Routes | `backend/routes/bookings.js` | Routes |

