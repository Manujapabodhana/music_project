const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateBooking = [
  body('eventName').notEmpty().trim().withMessage('Event name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('eventLocation').notEmpty().trim().withMessage('Event location is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('fees.amount').isNumeric().withMessage('Fees amount must be a number'),
  body('requestedDate').isISO8601().withMessage('Valid requested date is required')
];

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', auth, validateBooking, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      eventName,
      eventLocation,
      faculty,
      email,
      time,
      fees,
      description,
      address,
      requestedDate,
      specialRequirements,
      equipmentNeeds,
      contactInfo,
      additionalServices
    } = req.body;

    // Create new booking
    const booking = new Booking({
      userId: req.user.id,
      eventName,
      eventLocation,
      faculty,
      email,
      time,
      fees: {
        amount: fees.amount,
        currency: fees.currency || 'USD'
      },
      description,
      address,
      requestedDate: new Date(requestedDate),
      specialRequirements,
      equipmentNeeds,
      contactInfo,
      additionalServices,
      source: 'website'
    });

    await booking.save();

    // Populate user information
    await booking.populate('userId', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        booking: {
          id: booking._id,
          referenceNumber: booking.referenceNumber,
          eventName: booking.eventName,
          eventLocation: booking.eventLocation,
          requestedDate: booking.requestedDate,
          status: booking.status,
          totalAmount: booking.totalAmount,
          createdAt: booking.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating booking'
    });
  }
});

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed', 'rejected']).withMessage('Invalid status'),
  query('sortBy').optional().isIn(['createdAt', 'requestedDate', 'status']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid query parameters',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    // Build filter
    const filter = { userId: req.user.id };
    if (status) {
      filter.status = status;
    }

    // Get bookings with pagination
    const bookings = await Booking.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email')
      .populate('eventId', 'eventName venue dateTime');

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings: bookings.map(booking => ({
          id: booking._id,
          referenceNumber: booking.referenceNumber,
          eventName: booking.eventName,
          eventLocation: booking.eventLocation,
          requestedDate: booking.requestedDate,
          status: booking.status,
          totalAmount: booking.totalAmount,
          paymentStatus: booking.payment.status,
          createdAt: booking.createdAt,
          isCancellable: booking.isCancellable,
          event: booking.eventId
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get booking details by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    }).populate('userId', 'firstName lastName email phone')
      .populate('eventId', 'eventName venue dateTime pricing');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
});

// @route   PUT /api/bookings/:id
// @desc    Update booking
// @access  Private
router.put('/:id', auth, [
  body('eventName').optional().notEmpty().trim(),
  body('eventLocation').optional().notEmpty().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('time').optional().notEmpty(),
  body('fees.amount').optional().isNumeric(),
  body('requestedDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be updated
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update completed or cancelled booking'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'eventName', 'eventLocation', 'faculty', 'email', 'time', 'fees',
      'description', 'address', 'requestedDate', 'specialRequirements',
      'equipmentNeeds', 'contactInfo', 'additionalServices'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        booking[key] = req.body[key];
      }
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking'
    });
  }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (!booking.isCancellable) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancellation = {
      reason: req.body.reason || 'Cancelled by user',
      cancelledBy: req.user.id,
      cancelledAt: new Date(),
      refundStatus: 'pending'
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
});

// @route   GET /api/bookings/stats/overview
// @desc    Get booking statistics overview for user
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Booking.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$fees.amount' }
        }
      }
    ]);

    const overview = {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      totalSpent: 0
    };

    stats.forEach(stat => {
      overview.total += stat.count;
      overview[stat._id] = stat.count;
      if (stat._id === 'confirmed' || stat._id === 'completed') {
        overview.totalSpent += stat.totalAmount;
      }
    });

    res.json({
      success: true,
      data: { overview }
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking statistics'
    });
  }
});

module.exports = router;
