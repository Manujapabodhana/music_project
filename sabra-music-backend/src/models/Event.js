const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  eventType: {
    type: String,
    enum: ['concert', 'recital', 'workshop', 'masterclass', 'exhibition', 'performance', 'other'],
    required: true
  },
  venue: {
    name: {
      type: String,
      required: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    },
    capacity: {
      type: Number,
      required: true
    },
    facilities: [String] // e.g., ['piano', 'sound_system', 'lighting', 'recording']
  },
  dateTime: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  pricing: {
    basePrice: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    discounts: [{
      type: {
        type: String,
        enum: ['early_bird', 'student', 'senior', 'group']
      },
      percentage: Number,
      validUntil: Date,
      minQuantity: Number
    }]
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: [String], // Artists, instructors, performers
  genres: [String], // Music genres or art categories
  requirements: {
    ageLimit: {
      min: Number,
      max: Number
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'all']
    },
    equipment: [String]
  },
  media: {
    images: [String],
    videos: [String],
    audio: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
    default: 'draft'
  },
  bookingSettings: {
    maxBookings: Number,
    currentBookings: {
      type: Number,
      default: 0
    },
    bookingDeadline: Date,
    cancellationPolicy: String,
    refundPolicy: String
  },
  features: [String], // Special features like 'live_streaming', 'recording', 'meet_and_greet'
  tags: [String], // For search and categorization
  isPublic: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
eventSchema.index({ 'dateTime.start': 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ isPublic: 1 });
eventSchema.index({ isFeatured: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ tags: 1 });

// Virtual for availability
eventSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  const isNotExpired = this.dateTime.start > now;
  const hasCapacity = this.bookingSettings.currentBookings < (this.bookingSettings.maxBookings || this.venue.capacity);
  const isPublished = this.status === 'published';
  
  return isNotExpired && hasCapacity && isPublished;
});

// Virtual for booking deadline check
eventSchema.virtual('canBook').get(function() {
  if (!this.bookingSettings.bookingDeadline) return this.isAvailable;
  
  const now = new Date();
  const deadlinePassed = now > this.bookingSettings.bookingDeadline;
  
  return this.isAvailable && !deadlinePassed;
});

// Virtual for duration
eventSchema.virtual('duration').get(function() {
  const start = new Date(this.dateTime.start);
  const end = new Date(this.dateTime.end);
  return Math.round((end - start) / (1000 * 60)); // Duration in minutes
});

// Ensure virtual fields are serialized
eventSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Event', eventSchema);
