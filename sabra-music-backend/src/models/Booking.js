const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Basic booking information
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Booking details from the form
  eventName: {
    type: String,
    required: true
  },
  eventLocation: {
    type: String,
    required: true
  },
  faculty: String,
  email: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  fees: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  description: String,
  
  // Address information
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Booking metadata
  bookingDate: {
    type: Date,
    default: Date.now
  },
  requestedDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
    default: 'pending'
  },
  
  // Payment information
  payment: {
    status: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    method: String, // 'card', 'paypal', 'bank_transfer', etc.
    transactionId: String,
    paidAmount: Number,
    paidAt: Date,
    refundAmount: Number,
    refundedAt: Date
  },
  
  // Additional services
  additionalServices: [{
    name: String,
    description: String,
    price: Number
  }],
  
  // Special requirements
  specialRequirements: String,
  equipmentNeeds: [String],
  
  // Contact information
  contactInfo: {
    phone: String,
    alternateEmail: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  
  // Admin notes
  adminNotes: String,
  internalNotes: String,
  
  // Cancellation details
  cancellation: {
    reason: String,
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: Date,
    refundStatus: {
      type: String,
      enum: ['none', 'partial', 'full', 'pending']
    }
  },
  
  // Notification settings
  notifications: {
    emailSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    confirmationSent: { type: Boolean, default: false }
  },
  
  // Booking source
  source: {
    type: String,
    enum: ['website', 'phone', 'email', 'walk_in', 'admin'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ eventId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ requestedDate: 1 });
bookingSchema.index({ 'payment.status': 1 });
bookingSchema.index({ email: 1 });

// Virtual for total amount (including additional services)
bookingSchema.virtual('totalAmount').get(function() {
  let total = this.fees.amount || 0;
  
  if (this.additionalServices && this.additionalServices.length > 0) {
    total += this.additionalServices.reduce((sum, service) => sum + (service.price || 0), 0);
  }
  
  return total;
});

// Virtual for booking reference number
bookingSchema.virtual('referenceNumber').get(function() {
  const date = this.bookingDate || this.createdAt;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const id = this._id.toString().slice(-6).toUpperCase();
  
  return `SM-${year}${month}-${id}`;
});

// Virtual for is cancellable
bookingSchema.virtual('isCancellable').get(function() {
  const now = new Date();
  const eventDate = new Date(this.requestedDate);
  const hoursUntilEvent = (eventDate - now) / (1000 * 60 * 60);
  
  return this.status === 'confirmed' && hoursUntilEvent > 24; // Can cancel if more than 24 hours
});

// Pre-save middleware to update event booking count
bookingSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('status')) {
    try {
      const Event = mongoose.model('Event');
      const event = await Event.findById(this.eventId);
      
      if (event) {
        if (this.status === 'confirmed' && this.isNew) {
          event.bookingSettings.currentBookings += 1;
        } else if (this.status === 'cancelled' && !this.isNew) {
          event.bookingSettings.currentBookings = Math.max(0, event.bookingSettings.currentBookings - 1);
        }
        
        await event.save();
      }
    } catch (error) {
      console.error('Error updating event booking count:', error);
    }
  }
  next();
});

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
