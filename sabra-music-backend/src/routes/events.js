const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// @route   GET /api/events
// @desc    Get all public events
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('eventType').optional().isIn(['concert', 'recital', 'workshop', 'masterclass', 'exhibition', 'performance', 'other']),
  query('status').optional().isIn(['published', 'draft', 'cancelled', 'completed']),
  query('featured').optional().isBoolean(),
  query('search').optional().isLength({ min: 1 }).trim(),
  query('sortBy').optional().isIn(['dateTime.start', 'createdAt', 'eventName', 'pricing.basePrice']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
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
    const sortBy = req.query.sortBy || 'dateTime.start';
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

    // Build filter
    const filter = { 
      isPublic: true,
      status: 'published'
    };

    if (req.query.eventType) {
      filter.eventType = req.query.eventType;
    }

    if (req.query.featured !== undefined) {
      filter.isFeatured = req.query.featured === 'true';
    }

    if (req.query.search) {
      filter.$or = [
        { eventName: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } },
        { faculty: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Filter future events only
    filter['dateTime.start'] = { $gte: new Date() };

    const events = await Event.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate('organizer', 'firstName lastName email')
      .select('-adminNotes -internalNotes');

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: {
        events: events.map(event => ({
          id: event._id,
          eventName: event.eventName,
          description: event.description,
          eventType: event.eventType,
          venue: event.venue,
          dateTime: event.dateTime,
          pricing: event.pricing,
          faculty: event.faculty,
          genres: event.genres,
          media: event.media,
          features: event.features,
          tags: event.tags,
          isFeatured: event.isFeatured,
          isAvailable: event.isAvailable,
          canBook: event.canBook,
          duration: event.duration,
          organizer: event.organizer
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
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/events/featured
// @desc    Get featured events
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const events = await Event.find({
      isPublic: true,
      status: 'published',
      isFeatured: true,
      'dateTime.start': { $gte: new Date() }
    })
    .sort({ 'dateTime.start': 1 })
    .limit(limit)
    .populate('organizer', 'firstName lastName')
    .select('eventName description eventType venue dateTime pricing media features');

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get featured events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured events'
    });
  }
});

// @route   GET /api/events/upcoming
// @desc    Get upcoming events
// @access  Public
router.get('/upcoming', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const now = new Date();

    const events = await Event.find({
      isPublic: true,
      status: 'published',
      'dateTime.start': { $gte: now }
    })
    .sort({ 'dateTime.start': 1 })
    .limit(limit)
    .populate('organizer', 'firstName lastName')
    .select('eventName description eventType venue dateTime pricing faculty genres media');

    res.json({
      success: true,
      data: { events }
    });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching upcoming events'
    });
  }
});

// @route   GET /api/events/:id
// @desc    Get single event by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      isPublic: true,
      status: 'published'
    }).populate('organizer', 'firstName lastName email phone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: { event }
    });
  } catch (error) {
    console.error('Get event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching event'
    });
  }
});

// @route   POST /api/events
// @desc    Create new event
// @access  Private (Admin)
router.post('/', [auth, adminAuth], [
  body('eventName').notEmpty().trim().withMessage('Event name is required'),
  body('description').notEmpty().trim().withMessage('Description is required'),
  body('eventType').isIn(['concert', 'recital', 'workshop', 'masterclass', 'exhibition', 'performance', 'other']).withMessage('Invalid event type'),
  body('venue.name').notEmpty().trim().withMessage('Venue name is required'),
  body('venue.capacity').isInt({ min: 1 }).withMessage('Venue capacity must be a positive integer'),
  body('dateTime.start').isISO8601().withMessage('Valid start date is required'),
  body('dateTime.end').isISO8601().withMessage('Valid end date is required'),
  body('pricing.basePrice').isFloat({ min: 0 }).withMessage('Base price must be a positive number')
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

    const eventData = {
      ...req.body,
      organizer: req.user.id
    };

    // Validate date logic
    const startDate = new Date(eventData.dateTime.start);
    const endDate = new Date(eventData.dateTime.end);

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    if (startDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Event start date must be in the future'
      });
    }

    const event = new Event(eventData);
    await event.save();

    await event.populate('organizer', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating event'
    });
  }
});

// @route   PUT /api/events/:id
// @desc    Update event
// @access  Private (Admin or Event Organizer)
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or the organizer
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'eventName', 'description', 'eventType', 'venue', 'dateTime',
      'pricing', 'faculty', 'genres', 'requirements', 'media',
      'bookingSettings', 'features', 'tags', 'status', 'isPublic', 'isFeatured'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        event[key] = req.body[key];
      }
    });

    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating event'
    });
  }
});

// @route   DELETE /api/events/:id
// @desc    Delete event
// @access  Private (Admin or Event Organizer)
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is admin or the organizer
    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Check if event has bookings
    const Booking = require('../models/Booking');
    const bookingCount = await Booking.countDocuments({ 
      eventId: event._id, 
      status: { $in: ['confirmed', 'pending'] } 
    });

    if (bookingCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with active bookings'
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting event'
    });
  }
});

// @route   GET /api/events/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const suggestions = await Event.aggregate([
      {
        $match: {
          isPublic: true,
          status: 'published',
          'dateTime.start': { $gte: new Date() },
          $or: [
            { eventName: { $regex: q, $options: 'i' } },
            { tags: { $in: [new RegExp(q, 'i')] } },
            { faculty: { $in: [new RegExp(q, 'i')] } }
          ]
        }
      },
      {
        $project: {
          eventName: 1,
          eventType: 1,
          tags: 1,
          faculty: 1
        }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    console.error('Get search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suggestions'
    });
  }
});

module.exports = router;
