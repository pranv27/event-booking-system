const express = require('express');
const {
  createBooking,
  getUserBookings,
  getEventBookings,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { body } = require('express-validator');

const router = express.Router();

// Create booking (Attendee)
router.post(
  '/',
  protect,
  authorizeRoles('attendee'),
  [
    body('event_id').isInt().withMessage('Event ID must be an integer'),
    body('tickets').optional().isInt({ min: 1 }).withMessage('Tickets must be at least 1'),
    body('ticket_quantity').optional().isInt({ min: 1 }).withMessage('Ticket quantity must be at least 1'),
    body().custom((value) => {
      if (!value.tickets && !value.ticket_quantity) {
        throw new Error('Either tickets or ticket_quantity is required');
      }
      return true;
    }),
  ],
  createBooking
);

// Get user's bookings (Attendee)
router.get('/user', protect, authorizeRoles('attendee'), getUserBookings);

// Get bookings for an event (Organizer, Admin)
router.get('/event/:eventId', protect, authorizeRoles('organizer', 'admin'), getEventBookings);

// Delete a booking (Attendee for their own, Admin for any)
router.delete('/:id', protect, authorizeRoles('attendee', 'admin'), deleteBooking);

module.exports = router;
