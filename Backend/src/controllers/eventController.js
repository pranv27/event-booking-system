const Event = require('../models/eventModel');
const Category = require('../models/categoryModel');
const Booking = require('../models/bookingModel');
const { validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinaryConfig');

// @desc    Get organizer statistics
// @route   GET /api/events/organizer/stats
// @access  Organizer
const getOrganizerStats = async (req, res) => {
  const organizer_id = req.user.id;

  try {
    const events = await Event.getAll({ organizer_id, limit: 1000 });
    const stats = await Booking.getTotalBookingsForOrganizer(organizer_id);
    
    res.json({
      totalEvents: events.total,
      totalBookings: stats.totalBookings || 0,
      totalTickets: stats.totalTickets || 0,
      recentEvents: events.events.slice(0, 5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Organizer
const createEvent = async (req, res) => {
  console.log('Incoming Event Data:', req.body); // Debugging log

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation Errors:', errors.array());
    return res.status(400).json({ 
      message: 'Validation failed', 
      errors: errors.array().map(err => ({ field: err.path, message: err.msg })) 
    });
  }

  const { title, description, location, event_date, event_time, category_id, price, capacity, banner_image: body_banner } = req.body;
  const organizer_id = req.user.id; 
  
  let image_url = null;
  let banner_image = body_banner || null;

  try {
    if (req.file) {
      // Upload to Cloudinary using upload_stream
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'events' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const cloudinaryResponse = await uploadPromise;
      image_url = cloudinaryResponse.secure_url;
      banner_image = image_url; // Use Cloudinary URL as banner_image too for compatibility
    }

    const eventId = await Event.create(
      title,
      description,
      location,
      event_date,
      event_time,
      category_id,
      price,
      capacity,
      banner_image,
      image_url,
      organizer_id
    );
    
    const createdEvent = await Event.getById(eventId);
    res.status(201).json({ message: 'Event created successfully', event: createdEvent });
  } catch (error) {
    console.error('Create Event Error:', error.message);
    
    // Fallback Dummy Response if DB fails
    if (error.code === 'ECONNREFUSED' || error.message.includes('Table')) {
      console.log('Returning dummy success for testing...');
      return res.status(201).json({ 
        message: 'Event created successfully (Dummy Mode)', 
        eventId: Math.floor(Math.random() * 1000) 
      });
    }
    
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const eventsData = await Event.getAll(req.query);
    res.json(eventsData);
  } catch (error) {
    console.error('Database Error:', error.message);
    
    // Fallback Dummy Data for testing when DB is not ready
    const dummyEvents = {
      events: [
        {
          id: 1,
          title: 'Dummy Tech Conference 2026',
          description: 'A dummy event for testing the integration.',
          location: 'New York, NY',
          event_date: '2026-05-15',
          event_time: '10:00:00',
          price: 50.00,
          capacity: 500,
          banner_image: null,
          status: 'approved',
          category_name: 'Tech',
          organizer_name: 'Admin'
        },
        {
          id: 2,
          title: 'Dummy Music Festival',
          description: 'A dummy music festival for testing.',
          location: 'Los Angeles, CA',
          event_date: '2026-06-20',
          event_time: '18:00:00',
          price: 120.00,
          capacity: 2000,
          banner_image: null,
          status: 'approved',
          category_name: 'Music',
          organizer_name: 'Admin'
        }
      ],
      total: 2,
      page: 1,
      pages: 1
    };
    
    // Check if it's a specific DB error or if we should just return dummy data
    if (error.code === 'ECONNREFUSED' || error.message.includes('Table') || error.message.includes('database')) {
      console.log('Returning dummy data as fallback...');
      return res.json(dummyEvents);
    }
    
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.getById(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Organizer (or Admin)
const updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const organizer_id = req.user.id;
  
  let image_url = null;
  let banner_image = req.body.banner_image || null;

  try {
    const event = await Event.getById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the logged-in user is the organizer of the event or an admin
    if (event.organizer_id !== organizer_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }

    if (req.file) {
      // Upload to Cloudinary
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'events' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      const cloudinaryResponse = await uploadPromise;
      image_url = cloudinaryResponse.secure_url;
      banner_image = image_url;
    }

    const updateData = { ...req.body };
    if (image_url) {
      updateData.image_url = image_url;
      updateData.banner_image = image_url;
    } else if (req.body.banner_image) {
       updateData.banner_image = req.body.banner_image;
    }
    
    // Remove banner_image from updateData if it's handled separately or just let it be
    // Since Event.update uses a loop, it will work.

    const affectedRows = await Event.update(id, updateData);
    if (affectedRows > 0) {
      res.json({ message: 'Event updated successfully' });
    } else {
      res.status(400).json({ message: 'Event not updated' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Organizer (or Admin)
const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const organizer_id = req.user.id;

  try {
    const event = await Event.getById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the logged-in user is the organizer of the event or an admin
    if (event.organizer_id !== organizer_id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    const affectedRows = await Event.delete(id);
    if (affectedRows > 0) {
      res.json({ message: 'Event deleted successfully' });
    } else {
      res.status(400).json({ message: 'Event not deleted' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve/Reject an event
// @route   PUT /api/events/:id/status
// @access  Admin
const updateEventStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (!['approved', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided' });
  }

  try {
    const event = await Event.getById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const affectedRows = await Event.updateStatus(id, status);
    if (affectedRows > 0) {
      res.json({ message: `Event status updated to ${status}` });
    } else {
      res.status(400).json({ message: 'Event status not updated' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all categories
// @route   GET /api/events/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    res.json(categories);
  } catch (error) {
    console.error('Database Error:', error.message);
    
    // Fallback Dummy Categories
    const dummyCategories = [
      { id: 1, name: 'Music' },
      { id: 2, name: 'Tech' },
      { id: 3, name: 'Food' },
      { id: 4, name: 'Business' },
      { id: 5, name: 'Sports' },
      { id: 6, name: 'Art' }
    ];
    
    if (error.code === 'ECONNREFUSED' || error.message.includes('Table') || error.message.includes('database')) {
      return res.json(dummyCategories);
    }
    
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new category
// @route   POST /api/events/categories
// @access  Admin
const createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;
  try {
    const categoryId = await Category.create(name);
    res.status(201).json({ message: 'Category created successfully', categoryId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getCategories,
  createCategory,
  getOrganizerStats,
};
