const Booking = require('../models/bookingModel');
const Event = require('../models/eventModel');
const User = require('../models/userModel'); // Import User model
const { generateQrCode } = require('../services/qrService');
const { sendEmail } = require('../services/emailService'); // Import email service
const { validationResult } = require('express-validator');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Attendee
const createBooking = async (req, res) => {
  console.log("--- DEBUG BOOKING ---");
  console.log("BODY:", req.body);
  console.log("USER:", req.user);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation Errors:", errors.array());
    return res.status(400).json({ 
      message: "Validation failed", 
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
    });
  }

  const { event_id, tickets, ticket_quantity } = req.body;
  const actualTickets = tickets || ticket_quantity;
  const user_id = req.user.id;

  if (!event_id) {
    return res.status(400).json({ message: "Event ID is required" });
  }
  if (!actualTickets || actualTickets <= 0) {
    return res.status(400).json({ message: "Tickets must be greater than 0" });
  }

  try {
    const event = await Event.getById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const user = await User.findById(user_id); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'Cannot book tickets for an unapproved event' });
    }

    const totalBooked = await Booking.getTotalTicketsBookedForEvent(event_id);
    if (totalBooked + parseInt(actualTickets) > event.capacity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    const total_price = event.price * actualTickets;

    // 1. Create booking initially without QR code (pass null)
    const bookingId = await Booking.create(user_id, event_id, actualTickets, total_price, null);

    // 2. Generate QR code now that we have bookingId
    const qrCodeData = {
      booking_id: bookingId,
      event_id,
      user_id,
      tickets: actualTickets,
      event_title: event.title,
      user_name: user.name,
    };
    const qr_code_data_url = await generateQrCode(qrCodeData);

    // 3. Update the booking record with the generated QR code
    await Booking.updateQrCode(bookingId, qr_code_data_url);

    // Send booking confirmation email
    const subject = `Your Ticket for ${event.title} is Confirmed!`;
    const htmlContent = `
      <p>Dear ${user.name},</p>
      <p>Your booking for the event "${event.title}" on ${event.event_date} at ${event.event_time} is confirmed!</p>
      <p>Number of tickets: ${actualTickets}</p>
      <p>Total price: $${total_price.toFixed(2)}</p>
      <p>Your QR code for entry: <img src="${qr_code_data_url}" alt="QR Code" /></p>
      <p>We look forward to seeing you there!</p>
      <p>Best regards,</p>
      <p>The Event Management Team</p>
    `;
    sendEmail(user.email, subject, htmlContent);

    res.status(201).json({
      message: 'Booking successful',
      booking: {
        id: bookingId,
        event_id,
        user_id,
        tickets: actualTickets,
        total_price,
        qr_code: qr_code_data_url
      }
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/user
// @access  Attendee
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.getByUserId(req.user.id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get bookings for a specific event
// @route   GET /api/bookings/event/:eventId
// @access  Organizer, Admin
const getEventBookings = async (req, res) => {
  const { eventId } = req.params;
  const organizer_id = req.user.id;
  const user_role = req.user.role;

  try {
    const event = await Event.getById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only the event organizer or an admin can view bookings for an event
    if (event.organizer_id !== organizer_id && user_role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view bookings for this event' });
    }

    const bookings = await Booking.getByEventId(eventId);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Attendee (for their own bookings), Admin (for any booking)
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;
  const user_role = req.user.role;

  try {
    const booking = await Booking.getById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the user who made the booking or an admin can delete it
    if (booking.user_id !== user_id && user_role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    const affectedRows = await Booking.delete(id);
    if (affectedRows > 0) {
      res.json({ message: 'Booking deleted successfully' });
    } else {
      res.status(400).json({ message: 'Booking not deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getEventBookings,
  deleteBooking,
};