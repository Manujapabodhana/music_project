const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('firstName').optional().notEmpty().trim().withMessage('First name cannot be empty'),
  body('lastName').optional().notEmpty().trim().withMessage('Last name cannot be empty'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('dateOfBirth').optional().isISO8601().withMessage('Please provide a valid date'),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.country').optional().trim()
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

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'firstName', 'lastName', 'phone', 'dateOfBirth', 
      'address', 'preferences'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'address' && user.address) {
          // Merge address fields
          user.address = { ...user.address.toObject(), ...req.body.address };
        } else if (key === 'preferences' && user.preferences) {
          // Merge preferences
          user.preferences = { ...user.preferences.toObject(), ...req.body.preferences };
        } else {
          user[key] = req.body[key];
        }
      }
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: userResponse }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   PUT /api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match');
    }
    return true;
  })
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

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', auth, [
  body('musicGenres').optional().isArray().withMessage('Music genres must be an array'),
  body('instruments').optional().isArray().withMessage('Instruments must be an array'),
  body('notifications.email').optional().isBoolean().withMessage('Email notification preference must be boolean'),
  body('notifications.sms').optional().isBoolean().withMessage('SMS notification preference must be boolean')
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

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update preferences
    if (!user.preferences) {
      user.preferences = {};
    }

    if (req.body.musicGenres !== undefined) {
      user.preferences.musicGenres = req.body.musicGenres;
    }

    if (req.body.instruments !== undefined) {
      user.preferences.instruments = req.body.instruments;
    }

    if (req.body.notifications) {
      if (!user.preferences.notifications) {
        user.preferences.notifications = {};
      }
      
      if (req.body.notifications.email !== undefined) {
        user.preferences.notifications.email = req.body.notifications.email;
      }
      
      if (req.body.notifications.sms !== undefined) {
        user.preferences.notifications.sms = req.body.notifications.sms;
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: { preferences: user.preferences }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating preferences'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, [
  body('password').notEmpty().withMessage('Password is required to delete account'),
  body('confirmation').equals('DELETE').withMessage('Please type DELETE to confirm account deletion')
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

    const { password } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Check for active bookings
    const Booking = require('../models/Booking');
    const activeBookings = await Booking.countDocuments({
      userId: user._id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete account with active bookings. Please cancel all bookings first.'
      });
    }

    // Soft delete - deactivate account instead of hard delete
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
});

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's booking statistics
    const Booking = require('../models/Booking');
    const bookingStats = await Booking.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$fees.amount' }
        }
      }
    ]);

    // Get recent bookings
    const recentBookings = await Booking.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('eventId', 'eventName venue dateTime')
      .select('eventName status requestedDate fees.amount createdAt referenceNumber');

    // Get upcoming events user might be interested in
    const Event = require('../models/Event');
    const upcomingEvents = await Event.find({
      isPublic: true,
      status: 'published',
      'dateTime.start': { $gte: new Date() }
    })
    .sort({ 'dateTime.start': 1 })
    .limit(3)
    .select('eventName description venue dateTime pricing eventType');

    // Process booking statistics
    const stats = {
      total: 0,
      confirmed: 0,
      pending: 0,
      cancelled: 0,
      completed: 0,
      totalSpent: 0
    };

    bookingStats.forEach(stat => {
      stats.total += stat.count;
      stats[stat._id] = stat.count;
      if (stat._id === 'confirmed' || stat._id === 'completed') {
        stats.totalSpent += stat.totalAmount || 0;
      }
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          lastLogin: user.lastLogin,
          preferences: user.preferences
        },
        bookingStats: stats,
        recentBookings,
        upcomingEvents
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data'
    });
  }
});

module.exports = router;
