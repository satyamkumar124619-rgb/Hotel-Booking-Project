# Hotel Management Website

A complete hotel management website frontend built with React.js, featuring a client website and admin dashboard.

## Features

### Client Website
- **Home Page**: Hero section, welcome text, featured rooms, call to action
- **About Page**: Hotel story, facilities, staff introduction
- **Rooms Page**: Display room cards with images, names, prices, and booking buttons
- **Services Page**: List of hotel services (WiFi, Restaurant, Pool, etc.)
- **Gallery Page**: Responsive image grid of hotel photos
- **Contact Page**: Contact form, address, phone, Google Maps embed
- **Booking Page**: Room selection, check-in/out dates, guest count, confirmation

## Payment Integration

The booking system includes Stripe payment processing for secure transactions.

### Setup Stripe Payment Processing

1. **Create a Stripe Account**: Sign up at [stripe.com](https://stripe.com)

2. **Get API Keys**:
   - Go to your Stripe Dashboard → Developers → API keys
   - Copy your **Publishable key** (starts with `pk_test_` for test mode)

3. **Configure the Application**:
   - Open `src/components/BookingForm.jsx`
   - Replace the placeholder key on line 7:
     ```javascript
     const stripePromise = loadStripe('pk_test_51EXAMPLE...replace_with_your_key');
     ```
     with your actual publishable key:
     ```javascript
     const stripePromise = loadStripe('pk_test_your_actual_key_here');
     ```

4. **Backend Setup** (Required for Production):
   - The current implementation uses mock payments for demonstration
   - For real payments, create a backend server with Stripe secret key
   - Implement `/api/create-payment-intent` endpoint

### Payment Features
- **Multiple Payment Methods**:
  - 💳 Credit/Debit Card (Visa, Mastercard, American Express)
  - 📱 UPI (Google Pay, PhonePe, Paytm, BHIM UPI)
  - 🏦 Net Banking (All major Indian banks)
  - 👛 Digital Wallets (PayPal, Apple Pay, Google Pay)
  - 🏨 Pay at Hotel (Cash/Card payment at check-in)
- Secure card input with Stripe Elements
- Automatic calculation of total amount based on nights and room rate
- Payment confirmation with success/failure handling
- PCI compliant payment processing

### Test Payments
Use these test card numbers in Stripe test mode:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Any future expiry date and any CVC

For UPI, Net Banking, and Wallet payments, enter any valid-looking details as they use mock processing.
- **Manage Customers**: Customer list with details

## Technology Stack
- React.js with JSX
- React Router for navigation
- Tailwind CSS for styling
- Functional components with React Hooks
- Fully responsive design (desktop, tablet, mobile)

## Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and visit `http://localhost:5174`

## Project Structure
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── RoomCard.jsx
│   ├── BookingForm.jsx
│   ├── Gallery.jsx
│   └── Loading.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Rooms.jsx
│   ├── Services.jsx
│   ├── GalleryPage.jsx
│   ├── Contact.jsx
│   └── Booking.jsx
├── admin/
│   ├── AdminLogin.jsx
│   ├── Dashboard.jsx
│   ├── ManageRooms.jsx
│   ├── ManageBookings.jsx
│   └── ManageCustomers.jsx
├── assets/
│   ├── images/
│   └── logo/
├── App.jsx
└── main.jsx
```

## Admin Access
- Username: `admin`
- Password: `password`
- Access URL: `http://localhost:5174/admin`

## Notes
- Images are currently using placeholder URLs. Replace with actual hotel images in the `public/images/` directory.
- This is a frontend-only application. Backend integration would be needed for full functionality.
- Admin authentication is basic and should be enhanced for production use.

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
