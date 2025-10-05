# FixItNow - Service Provider Platform

A comprehensive full-stack web application connecting customers with local service professionals (mechanics, plumbers, electricians, and more).

## 🚀 Features

### For Customers
- **Search & Filter**: Find service providers by category, location (ZIP code), and ratings
- **Provider Profiles**: View detailed profiles with ratings, reviews, services, and pricing
- **Easy Booking**: Request services with preferred date, time, and location
- **Dashboard**: Track all bookings, view status updates, and leave reviews
- **Rating System**: Rate and review completed services

### For Service Providers
- **Professional Profile**: Create detailed business profiles with services, pricing, and availability
- **Booking Management**: Accept/reject booking requests and manage schedules
- **Customer Communication**: View customer details and service requirements
- **Performance Tracking**: Monitor ratings, reviews, and total bookings
- **Service Areas**: Define service coverage by ZIP codes

### For Administrators
- **Dashboard Analytics**: View platform statistics and key metrics
- **Provider Approval**: Review and approve new service provider registrations
- **User Management**: Suspend/activate user accounts
- **Booking Oversight**: Monitor all platform bookings
- **Review Moderation**: Remove inappropriate reviews

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation

### Frontend
- **React 18** with Vite
- **React Router** for navigation
- **Zustand** for state management
- **Axios** for API calls
- **TailwindCSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
cd fixitnow-platform
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fixitnow
JWT_SECRET=your_super_secret_jwt_key_change_this
CLIENT_URL=http://localhost:5173
```

5. **Start MongoDB**
```bash
# If using local MongoDB
mongod
```

6. **Run the application**

In one terminal (backend):
```bash
npm run server
```

In another terminal (frontend):
```bash
npm run client
```

Or run both concurrently:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Project Structure

```
fixitnow-platform/
├── server/
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # State management
│   │   ├── utils/       # Utilities & constants
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/
│   └── index.html
├── package.json
└── README.md
```

## 🔑 Default Admin Account

To create an admin account, register a user and manually update the role in MongoDB:

```javascript
db.users.updateOne(
  { email: "admin@fixitnow.com" },
  { $set: { role: "admin" } }
)
```

## 📱 Service Categories

The platform supports the following service categories:
- 🚗 Car Mechanic
- 🏍️ Bike Mechanic
- 🔧 Plumber
- ⚡ Electrician
- ❄️ AC Repair
- 🪚 Carpenter
- 🎨 Painter
- 🔌 Home Appliance Repair
- 💻 Computer/Laptop Repair
- 📱 Mobile Technician
- 📹 CCTV Installation & Repair

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Providers
- `GET /api/providers` - Get all providers (with filters)
- `GET /api/providers/:id` - Get provider by ID
- `GET /api/providers/me/profile` - Get own provider profile
- `PUT /api/providers/me/profile` - Update provider profile

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get customer bookings
- `GET /api/bookings/provider/bookings` - Get provider bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/provider/:id/status` - Update booking status

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/provider/:id` - Get provider reviews
- `PUT /api/reviews/:id/respond` - Provider response

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/providers` - Get all providers
- `PUT /api/admin/providers/:id/status` - Approve/reject provider
- `PUT /api/admin/users/:id/status` - Activate/suspend user

## 🎨 UI Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with TailwindCSS
- **Real-time Notifications**: Toast notifications for user actions
- **Loading States**: Smooth loading indicators
- **Form Validation**: Client and server-side validation
- **Protected Routes**: Role-based access control

## 🚦 User Roles

1. **Customer**: Search providers, book services, leave reviews
2. **Provider**: Manage profile, accept bookings, respond to reviews
3. **Admin**: Approve providers, manage users, oversee platform

## 📝 Future Enhancements

- Real-time chat between customers and providers
- Payment integration (Stripe/PayPal)
- Email notifications
- SMS notifications
- Advanced search with map integration
- Provider availability calendar
- Multi-language support
- Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For support, email support@fixitnow.com or open an issue in the repository.

---

Built with ❤️ using React, Node.js, and MongoDB
