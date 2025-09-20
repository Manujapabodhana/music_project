const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  console.log('Seeding users...');
  
  const users = [
    {
      email: 'admin@sabramusic.com',
      password: 'Admin123!',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      isVerified: true,
      phone: '+1234567890',
      preferences: {
        musicGenres: ['Classical', 'Jazz', 'Contemporary'],
        instruments: ['Piano', 'Guitar', 'Violin'],
        notifications: {
          email: true,
          sms: false
        }
      }
    },
    {
      email: 'john.doe@email.com',
      password: 'User123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      isVerified: true,
      phone: '+1234567891',
      address: {
        street: '123 Music Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      preferences: {
        musicGenres: ['Rock', 'Pop', 'Classical'],
        instruments: ['Guitar', 'Piano'],
        notifications: {
          email: true,
          sms: true
        }
      }
    },
    {
      email: 'jane.smith@email.com',
      password: 'User123!',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'user',
      isVerified: true,
      phone: '+1234567892',
      address: {
        street: '456 Harmony Avenue',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      preferences: {
        musicGenres: ['Jazz', 'Blues', 'Soul'],
        instruments: ['Saxophone', 'Piano'],
        notifications: {
          email: true,
          sms: false
        }
      }
    },
    {
      email: 'mike.johnson@email.com',
      password: 'User123!',
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'user',
      isVerified: false,
      phone: '+1234567893',
      preferences: {
        musicGenres: ['Electronic', 'Hip Hop', 'Pop'],
        instruments: ['Synthesizer', 'Drums'],
        notifications: {
          email: false,
          sms: true
        }
      }
    }
  ];

  await User.deleteMany({});
  
  for (const userData of users) {
    const user = new User(userData);
    await user.save();
    console.log(`Created user: ${user.email}`);
  }
  
  console.log('Users seeded successfully');
};

const seedEvents = async () => {
  console.log('Seeding events...');
  
  const adminUser = await User.findOne({ role: 'admin' });
  
  const events = [
    {
      eventName: 'Classical Music Masterclass',
      description: 'An intensive masterclass focusing on classical music techniques and interpretation. Join renowned musicians for an unforgettable learning experience.',
      eventType: 'masterclass',
      venue: {
        name: 'Sabra Music Hall',
        address: {
          street: '789 Concert Drive',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA'
        },
        capacity: 50,
        facilities: ['piano', 'sound_system', 'lighting', 'recording']
      },
      dateTime: {
        start: new Date('2025-10-15T14:00:00Z'),
        end: new Date('2025-10-15T17:00:00Z')
      },
      pricing: {
        basePrice: 150,
        currency: 'USD',
        discounts: [
          {
            type: 'student',
            percentage: 20,
            validUntil: new Date('2025-10-10T23:59:59Z')
          },
          {
            type: 'early_bird',
            percentage: 15,
            validUntil: new Date('2025-10-01T23:59:59Z')
          }
        ]
      },
      organizer: adminUser._id,
      faculty: ['Prof. Maria Rodriguez', 'Dr. James Wilson'],
      genres: ['Classical', 'Baroque', 'Romantic'],
      requirements: {
        skillLevel: 'intermediate',
        equipment: ['Sheet music', 'Instrument (optional)']
      },
      media: {
        images: ['masterclass1.jpg', 'masterclass2.jpg'],
        videos: ['preview.mp4']
      },
      status: 'published',
      bookingSettings: {
        maxBookings: 50,
        currentBookings: 0,
        bookingDeadline: new Date('2025-10-13T23:59:59Z'),
        cancellationPolicy: 'Full refund until 48 hours before event',
        refundPolicy: '100% refund for cancellations made 48+ hours in advance'
      },
      features: ['live_streaming', 'recording', 'certificate'],
      tags: ['classical', 'masterclass', 'education', 'professional'],
      isFeatured: true
    },
    {
      eventName: 'Jazz Evening Concert',
      description: 'A smooth jazz evening featuring local and international artists. Experience the magic of live jazz in an intimate setting.',
      eventType: 'concert',
      venue: {
        name: 'Blue Note Lounge',
        address: {
          street: '456 Jazz Street',
          city: 'New Orleans',
          state: 'LA',
          zipCode: '70116',
          country: 'USA'
        },
        capacity: 100,
        facilities: ['sound_system', 'lighting', 'bar', 'stage']
      },
      dateTime: {
        start: new Date('2025-11-02T19:00:00Z'),
        end: new Date('2025-11-02T22:00:00Z')
      },
      pricing: {
        basePrice: 75,
        currency: 'USD',
        discounts: [
          {
            type: 'group',
            percentage: 10,
            minQuantity: 4,
            validUntil: new Date('2025-11-01T23:59:59Z')
          }
        ]
      },
      organizer: adminUser._id,
      faculty: ['Sarah Johnson Quartet', 'Marcus Thompson Trio'],
      genres: ['Jazz', 'Smooth Jazz', 'Contemporary Jazz'],
      requirements: {
        ageLimit: { min: 18 },
        skillLevel: 'all'
      },
      media: {
        images: ['jazz1.jpg', 'jazz2.jpg'],
        audio: ['preview_track.mp3']
      },
      status: 'published',
      bookingSettings: {
        maxBookings: 100,
        currentBookings: 0,
        bookingDeadline: new Date('2025-11-01T23:59:59Z'),
        cancellationPolicy: 'Refund available until 24 hours before event',
        refundPolicy: '80% refund for cancellations made 24+ hours in advance'
      },
      features: ['live_performance', 'meet_and_greet', 'bar_service'],
      tags: ['jazz', 'concert', 'evening', 'live'],
      isFeatured: true
    },
    {
      eventName: 'Guitar Workshop for Beginners',
      description: 'Learn the basics of guitar playing in this comprehensive workshop designed for complete beginners.',
      eventType: 'workshop',
      venue: {
        name: 'Music Learning Center',
        address: {
          street: '321 Learning Lane',
          city: 'Austin',
          state: 'TX',
          zipCode: '73301',
          country: 'USA'
        },
        capacity: 20,
        facilities: ['guitars', 'amplifiers', 'music_stands', 'chairs']
      },
      dateTime: {
        start: new Date('2025-10-28T10:00:00Z'),
        end: new Date('2025-10-28T13:00:00Z')
      },
      pricing: {
        basePrice: 80,
        currency: 'USD'
      },
      organizer: adminUser._id,
      faculty: ['Tom Anderson', 'Lisa Chen'],
      genres: ['Acoustic', 'Rock', 'Pop'],
      requirements: {
        skillLevel: 'beginner',
        equipment: ['Guitar provided', 'Notebook', 'Pen']
      },
      media: {
        images: ['guitar_workshop.jpg']
      },
      status: 'published',
      bookingSettings: {
        maxBookings: 20,
        currentBookings: 0,
        bookingDeadline: new Date('2025-10-26T23:59:59Z'),
        cancellationPolicy: 'Full refund until 72 hours before workshop',
        refundPolicy: '100% refund for cancellations made 72+ hours in advance'
      },
      features: ['instruments_provided', 'materials_included', 'certificate'],
      tags: ['guitar', 'workshop', 'beginner', 'learning'],
      isFeatured: false
    },
    {
      eventName: 'Contemporary Art Exhibition Opening',
      description: 'Join us for the opening of our contemporary art exhibition featuring local and emerging artists.',
      eventType: 'exhibition',
      venue: {
        name: 'Sabra Art Gallery',
        address: {
          street: '567 Art District',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          country: 'USA'
        },
        capacity: 150,
        facilities: ['gallery_lighting', 'display_walls', 'sound_system', 'catering']
      },
      dateTime: {
        start: new Date('2025-11-15T18:00:00Z'),
        end: new Date('2025-11-15T21:00:00Z')
      },
      pricing: {
        basePrice: 25,
        currency: 'USD'
      },
      organizer: adminUser._id,
      faculty: ['Various Artists', 'Curator: Dr. Emily Carter'],
      genres: ['Contemporary', 'Abstract', 'Modern'],
      requirements: {
        skillLevel: 'all'
      },
      media: {
        images: ['exhibition1.jpg', 'exhibition2.jpg', 'exhibition3.jpg']
      },
      status: 'published',
      bookingSettings: {
        maxBookings: 150,
        currentBookings: 0,
        bookingDeadline: new Date('2025-11-14T23:59:59Z'),
        cancellationPolicy: 'Refund available until event day',
        refundPolicy: '100% refund for cancellations made before event day'
      },
      features: ['wine_reception', 'artist_talk', 'exhibition_catalog'],
      tags: ['art', 'exhibition', 'contemporary', 'opening'],
      isFeatured: false
    },
    {
      eventName: 'Piano Recital Series',
      description: 'Monthly piano recital featuring students and faculty performing classical and contemporary pieces.',
      eventType: 'recital',
      venue: {
        name: 'Sabra Recital Hall',
        address: {
          street: '789 Concert Drive',
          city: 'New York',
          state: 'NY',
          zipCode: '10002',
          country: 'USA'
        },
        capacity: 80,
        facilities: ['grand_piano', 'sound_system', 'lighting', 'recording']
      },
      dateTime: {
        start: new Date('2025-12-05T19:30:00Z'),
        end: new Date('2025-12-05T21:30:00Z')
      },
      pricing: {
        basePrice: 40,
        currency: 'USD',
        discounts: [
          {
            type: 'student',
            percentage: 50,
            validUntil: new Date('2025-12-04T23:59:59Z')
          },
          {
            type: 'senior',
            percentage: 25,
            validUntil: new Date('2025-12-04T23:59:59Z')
          }
        ]
      },
      organizer: adminUser._id,
      faculty: ['Students of Sabra Music', 'Guest: Pianist Anna Kowalski'],
      genres: ['Classical', 'Romantic', 'Contemporary'],
      requirements: {
        skillLevel: 'all'
      },
      media: {
        images: ['recital1.jpg']
      },
      status: 'published',
      bookingSettings: {
        maxBookings: 80,
        currentBookings: 0,
        bookingDeadline: new Date('2025-12-04T23:59:59Z'),
        cancellationPolicy: 'Full refund until 24 hours before event',
        refundPolicy: '100% refund for cancellations made 24+ hours in advance'
      },
      features: ['live_performance', 'reception', 'program_notes'],
      tags: ['piano', 'recital', 'classical', 'students'],
      isFeatured: false
    }
  ];

  await Event.deleteMany({});
  
  for (const eventData of events) {
    const event = new Event(eventData);
    await event.save();
    console.log(`Created event: ${event.eventName}`);
  }
  
  console.log('Events seeded successfully');
};

const seedBookings = async () => {
  console.log('Seeding sample bookings...');
  
  const users = await User.find({ role: 'user' });
  const events = await Event.find({ status: 'published' });
  
  if (users.length === 0 || events.length === 0) {
    console.log('No users or events found, skipping booking seeding');
    return;
  }

  const bookings = [
    {
      userId: users[0]._id,
      eventId: events[0]._id,
      eventName: events[0].eventName,
      eventLocation: events[0].venue.name,
      faculty: events[0].faculty[0],
      email: users[0].email,
      time: '2:00 PM',
      fees: {
        amount: events[0].pricing.basePrice,
        currency: 'USD'
      },
      description: 'Looking forward to learning classical music techniques. I have intermediate level experience with piano.',
      address: {
        line1: '123 Main Street',
        line2: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      requestedDate: events[0].dateTime.start,
      status: 'confirmed',
      payment: {
        status: 'paid',
        method: 'card',
        transactionId: 'txn_1234567890',
        paidAmount: events[0].pricing.basePrice,
        paidAt: new Date()
      },
      contactInfo: {
        phone: users[0].phone,
        emergencyContact: {
          name: 'Sarah Doe',
          phone: '+1234567899',
          relationship: 'Sister'
        }
      },
      source: 'website'
    },
    {
      userId: users[1]._id,
      eventId: events[1]._id,
      eventName: events[1].eventName,
      eventLocation: events[1].venue.name,
      faculty: events[1].faculty[0],
      email: users[1].email,
      time: '7:00 PM',
      fees: {
        amount: events[1].pricing.basePrice,
        currency: 'USD'
      },
      description: 'Excited for the jazz evening! I love live jazz performances.',
      address: {
        line1: '456 Jazz Avenue',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70116',
        country: 'USA'
      },
      requestedDate: events[1].dateTime.start,
      status: 'pending',
      payment: {
        status: 'pending',
        method: 'card'
      },
      contactInfo: {
        phone: users[1].phone
      },
      source: 'website'
    },
    {
      userId: users[2]._id,
      eventId: events[2]._id,
      eventName: events[2].eventName,
      eventLocation: events[2].venue.name,
      faculty: events[2].faculty[0],
      email: users[2].email,
      time: '10:00 AM',
      fees: {
        amount: events[2].pricing.basePrice,
        currency: 'USD'
      },
      description: 'Complete beginner looking to learn guitar. Very excited!',
      address: {
        line1: '789 Music Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '73301',
        country: 'USA'
      },
      requestedDate: events[2].dateTime.start,
      status: 'confirmed',
      payment: {
        status: 'paid',
        method: 'paypal',
        transactionId: 'paypal_9876543210',
        paidAmount: events[2].pricing.basePrice,
        paidAt: new Date()
      },
      contactInfo: {
        phone: users[2].phone
      },
      source: 'website'
    }
  ];

  await Booking.deleteMany({});
  
  for (const bookingData of bookings) {
    const booking = new Booking(bookingData);
    await booking.save();
    console.log(`Created booking: ${booking.referenceNumber}`);
  }
  
  console.log('Bookings seeded successfully');
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    await seedUsers();
    await seedEvents();
    await seedBookings();
    
    console.log('Database seeding completed successfully!');
    console.log('\nDefault Admin Credentials:');
    console.log('Email: admin@sabramusic.com');
    console.log('Password: Admin123!');
    console.log('\nSample User Credentials:');
    console.log('Email: john.doe@email.com');
    console.log('Password: User123!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = {
  seedUsers,
  seedEvents,
  seedBookings,
  seedDatabase
};
