const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(limiter);
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    email: 'admin@sabramusic.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin'
  },
  {
    id: 2,
    email: 'john.doe@email.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user'
  }
];

const mockEvents = [
  {
    id: 1,
    eventName: 'Classical Music Masterclass',
    description: 'An intensive masterclass focusing on classical music techniques.',
    eventType: 'masterclass',
    venue: {
      name: 'Sabra Music Hall',
      capacity: 50
    },
    dateTime: {
      start: '2025-10-15T14:00:00Z',
      end: '2025-10-15T17:00:00Z'
    },
    pricing: {
      basePrice: 150,
      currency: 'USD'
    },
    faculty: ['Prof. Maria Rodriguez', 'Dr. James Wilson'],
    isFeatured: true,
    status: 'published'
  },
  {
    id: 2,
    eventName: 'Jazz Evening Concert',
    description: 'A smooth jazz evening featuring local and international artists.',
    eventType: 'concert',
    venue: {
      name: 'Blue Note Lounge',
      capacity: 100
    },
    dateTime: {
      start: '2025-11-02T19:00:00Z',
      end: '2025-11-02T22:00:00Z'
    },
    pricing: {
      basePrice: 75,
      currency: 'USD'
    },
    faculty: ['Sarah Johnson Quartet', 'Marcus Thompson Trio'],
    isFeatured: true,
    status: 'published'
  }
];

const mockBookings = [];

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Check if user exists
  const existingUser = mockUsers.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  const newUser = {
    id: mockUsers.length + 1,
    email,
    firstName,
    lastName,
    role: 'user'
  };

  mockUsers.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: newUser,
      token: 'mock_jwt_token_' + newUser.id
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = mockUsers.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token: 'mock_jwt_token_' + user.id
    }
  });
});

// Events routes
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    data: {
      events: mockEvents,
      pagination: {
        page: 1,
        limit: 10,
        total: mockEvents.length,
        pages: 1
      }
    }
  });
});

app.get('/api/events/featured', (req, res) => {
  const featuredEvents = mockEvents.filter(event => event.isFeatured);
  res.json({
    success: true,
    data: { events: featuredEvents }
  });
});

app.get('/api/events/upcoming', (req, res) => {
  const upcomingEvents = mockEvents.filter(event => new Date(event.dateTime.start) > new Date());
  res.json({
    success: true,
    data: { events: upcomingEvents }
  });
});

// Bookings routes
app.post('/api/bookings', (req, res) => {
  const booking = {
    id: mockBookings.length + 1,
    ...req.body,
    status: 'pending',
    referenceNumber: `SM-2025-${String(mockBookings.length + 1).padStart(6, '0')}`,
    createdAt: new Date().toISOString()
  };

  mockBookings.push(booking);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking: {
        id: booking.id,
        referenceNumber: booking.referenceNumber,
        eventName: booking.eventName,
        status: booking.status,
        createdAt: booking.createdAt
      }
    }
  });
});

app.get('/api/bookings', (req, res) => {
  res.json({
    success: true,
    data: {
      bookings: mockBookings,
      pagination: {
        page: 1,
        limit: 10,
        total: mockBookings.length,
        pages: Math.ceil(mockBookings.length / 10)
      }
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sabra Music API is running (Mock Mode)',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sabra Music API (Mock Mode)',
    version: '1.0.0',
    note: 'This is a demonstration version without database connection',
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      bookings: '/api/bookings',
      health: '/api/health'
    }
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Sabra Music API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log('Note: Running in mock mode without database connection');
});
