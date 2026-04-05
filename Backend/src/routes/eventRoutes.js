const express = require('express');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  updateEventStatus,
  getCategories,
  createCategory,
  getOrganizerStats,
} = require('../controllers/eventController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const { body } = require('express-validator');

const router = express.Router();

// Public routes for events
router.get('/', getEvents);
router.get('/categories', getCategories); // Moved up
router.get('/organizer/stats', protect, authorizeRoles('organizer'), getOrganizerStats);
router.get('/:id', getEventById);

// Organizer and Admin routes for events
router.post(
  '/',
  protect,
  authorizeRoles('organizer', 'admin'),
  upload.single('banner_image'),
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('event_date').isISO8601().toDate().withMessage('Valid event date is required'),
    body('event_time').notEmpty().withMessage('Event time is required'),
    body('category_id').isInt().withMessage('Category ID must be an integer'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  ],
  createEvent
);

router.put(
  '/:id',
  protect,
  authorizeRoles('organizer', 'admin'),
  upload.single('banner_image'),
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('event_date').optional().isISO8601().toDate().withMessage('Valid event date is required'),
    body('event_time').optional().notEmpty().withMessage('Event time cannot be empty'),
    body('category_id').optional().isInt().withMessage('Category ID must be an integer'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('capacity').optional().isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  ],
  updateEvent
);
router.delete('/:id', protect, authorizeRoles('organizer', 'admin'), deleteEvent);

// Admin routes for event status and categories
router.put('/:id/status', protect, authorizeRoles('admin'), updateEventStatus);
router.post(
  '/categories',
  protect,
  authorizeRoles('admin'),
  [body('name').notEmpty().withMessage('Category name is required')],
  createCategory
);

module.exports = router;
