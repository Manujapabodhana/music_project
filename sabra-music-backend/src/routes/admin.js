const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Apply auth and adminAuth middleware to all routes
router.use(auth);
router.use(adminAuth);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', async (req, res) => {
  try {
    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
          verifiedUsers: { $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] } },
          adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
        }
      }
    ]);

    // Get event statistics
    const eventStats = await Event.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$fees.amount' }
        }
      }
    ]);

    // Get monthly revenue data for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyRevenue = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$fees.amount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Recent activity
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'firstName lastName email')
      .populate('eventId', 'eventName')
      .select('eventName status requestedDate fees.amount createdAt referenceNumber');

    const recentUsers = await User.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt role');

    // Process statistics
    const processedUserStats = userStats[0] || {
      totalUsers: 0,
      activeUsers: 0,
      verifiedUsers: 0,
      adminUsers: 0
    };

    const processedEventStats = {
      total: 0,
      published: 0,
      draft: 0,
      cancelled: 0,
      completed: 0
    };

    eventStats.forEach(stat => {
      processedEventStats.total += stat.count;
      processedEventStats[stat._id] = stat.count;
    });

    const processedBookingStats = {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      totalRevenue: 0
    };

    bookingStats.forEach(stat => {
      processedBookingStats.total += stat.count;
      processedBookingStats[stat._id] = stat.count;
      if (stat._id === 'confirmed' || stat._id === 'completed') {
        processedBookingStats.totalRevenue += stat.totalRevenue || 0;
      }
    });

    res.json({
      success: true,
      data: {
        userStats: processedUserStats,
        eventStats: processedEventStats,
        bookingStats: processedBookingStats,
        monthlyRevenue,
        recentActivity: {
          bookings: recentBookings,
          users: recentUsers
        }
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin dashboard'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users (with pagination and filters)
// @access  Private (Admin)
router.get('/users', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['user', 'admin']),
  query('isActive').optional().isBoolean(),
  query('isVerified').optional().isBoolean(),
  query('search').optional().trim()
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (req.query.role) filter.role = req.query.role;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.isVerified !== undefined) filter.isVerified = req.query.isVerified === 'true';

    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching users'
    });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user (admin action)
// @access  Private (Admin)
router.put('/users/:id', [
  body('role').optional().isIn(['user', 'admin']),
  body('isActive').optional().isBoolean(),
  body('isVerified').optional().isBoolean()
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

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id && req.body.isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['role', 'isActive', 'isVerified'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.toObject({ transform: (doc, ret) => { delete ret.password; return ret; } }) }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating user'
    });
  }
});

// @route   GET /api/admin/bookings
// @desc    Get all bookings (with pagination and filters)
// @access  Private (Admin)
router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed', 'rejected']),
  query('dateFrom').optional().isISO8601(),
  query('dateTo').optional().isISO8601(),
  query('search').optional().trim()
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (req.query.status) filter.status = req.query.status;

    if (req.query.dateFrom || req.query.dateTo) {
      filter.requestedDate = {};
      if (req.query.dateFrom) filter.requestedDate.$gte = new Date(req.query.dateFrom);
      if (req.query.dateTo) filter.requestedDate.$lte = new Date(req.query.dateTo);
    }

    if (req.query.search) {
      filter.$or = [
        { eventName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { eventLocation: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const bookings = await Booking.find(filter)
      .populate('userId', 'firstName lastName email phone')
      .populate('eventId', 'eventName venue')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
});

// @route   PUT /api/admin/bookings/:id/status
// @desc    Update booking status
// @access  Private (Admin)
router.put('/bookings/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed', 'rejected']).withMessage('Invalid status'),
  body('adminNotes').optional().trim()
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

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const oldStatus = booking.status;
    booking.status = req.body.status;

    if (req.body.adminNotes) {
      booking.adminNotes = req.body.adminNotes;
    }

    // Handle cancellation
    if (req.body.status === 'cancelled' && oldStatus !== 'cancelled') {
      booking.cancellation = {
        reason: req.body.reason || 'Cancelled by admin',
        cancelledBy: req.user.id,
        cancelledAt: new Date(),
        refundStatus: 'pending'
      };
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
});

// @route   GET /api/admin/events
// @desc    Get all events (including drafts)
// @access  Private (Admin)
router.get('/events', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['draft', 'published', 'cancelled', 'completed']),
  query('eventType').optional().isIn(['concert', 'recital', 'workshop', 'masterclass', 'exhibition', 'performance', 'other']),
  query('search').optional().trim()
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};

    if (req.query.status) filter.status = req.query.status;
    if (req.query.eventType) filter.eventType = req.query.eventType;

    if (req.query.search) {
      filter.$or = [
        { eventName: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
        { faculty: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get admin events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching events'
    });
  }
});

// @route   GET /api/admin/reports/revenue
// @desc    Get revenue reports
// @access  Private (Admin)
router.get('/reports/revenue', [
  query('period').optional().isIn(['week', 'month', 'quarter', 'year']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
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

    const period = req.query.period || 'month';
    let startDate, endDate;

    if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
    } else {
      // Set default date range based on period
      endDate = new Date();
      startDate = new Date();

      switch (period) {
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case 'year':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
      }
    }

    const revenueData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: { $in: ['confirmed', 'completed'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$fees.amount' },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBookings = revenueData.reduce((sum, item) => sum + item.bookings, 0);

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate,
        totalRevenue,
        totalBookings,
        dailyData: revenueData
      }
    });
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while generating revenue report'
    });
  }
});

module.exports = router;
