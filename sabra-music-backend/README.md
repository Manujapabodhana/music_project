# Sabra Music Backend API

A comprehensive Node.js/Express backend for the Sabra Music website with MongoDB database integration.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password hashing with bcrypt
  - Account verification system

- **Event Management**
  - CRUD operations for events
  - Event categories (concerts, workshops, masterclasses, etc.)
  - Featured events system
  - Advanced search and filtering

- **Booking System**
  - Complete booking lifecycle management
  - Payment status tracking
  - Cancellation policies
  - Booking reference numbers

- **Admin Panel Features**
  - Dashboard with analytics
  - User management
  - Event management
  - Booking oversight
  - Revenue reports

- **Security Features**
  - Rate limiting
  - CORS protection
  - Helmet security headers
  - Input validation
  - Error handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Password reset

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `PUT /api/users/preferences` - Update preferences
- `GET /api/users/dashboard` - User dashboard data
- `DELETE /api/users/account` - Delete account

### Events
- `GET /api/events` - Get all public events
- `GET /api/events/featured` - Get featured events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Admin)
- `PUT /api/events/:id` - Update event (Admin/Organizer)
- `DELETE /api/events/:id` - Delete event (Admin/Organizer)
- `GET /api/events/search/suggestions` - Search suggestions

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `GET /api/bookings/stats/overview` - Booking statistics

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Manage users
- `PUT /api/admin/users/:id` - Update user
- `GET /api/admin/bookings` - Manage bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `GET /api/admin/events` - Manage events
- `GET /api/admin/reports/revenue` - Revenue reports

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sabra-music-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret
   - Email configuration
   - Other settings

4. **Start MongoDB**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Database Models

### User Model
- Personal information (name, email, phone)
- Authentication data (password, role)
- Preferences (music genres, instruments)
- Address information
- Account status

### Event Model
- Event details (name, description, type)
- Venue information
- Date and time
- Pricing and discounts
- Faculty and organizers
- Media attachments
- Booking settings

### Booking Model
- User and event references
- Booking details from form
- Payment information
- Status tracking
- Cancellation details
- Contact information

## Security Features

- **Authentication**: JWT tokens with expiration
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Express-validator for all inputs
- **Password Security**: Bcrypt hashing
- **CORS**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Error Handling**: Centralized error management

## Default Credentials

After seeding the database:

**Admin Account:**
- Email: admin@sabramusic.com
- Password: Admin123!

**Sample User Account:**
- Email: john.doe@email.com
- Password: User123!

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sabra_music
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin@sabramusic.com
ADMIN_PASSWORD=Admin123!
```

## Development

### Running Tests
```bash
npm test
```

### Database Seeding
```bash
npm run seed
```

### API Documentation
The API follows RESTful conventions and returns consistent JSON responses:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if applicable
  ]
}
```

## License

MIT License
