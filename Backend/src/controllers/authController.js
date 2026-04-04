const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/emailService'); // Import email service

const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = await User.create(name, email, password, role || 'attendee');

    // Send welcome email
    const subject = 'Welcome to Event Management Platform!';
    const htmlContent = `
      <p>Dear ${name},</p>
      <p>Welcome to the Event Management Platform! We're excited to have you on board.</p>
      <p>You can now start discovering and booking amazing events, or even create your own.</p>
      <p>Best regards,</p>
      <p>The Event Management Team</p>
    `;
    sendEmail(email, subject, htmlContent);

    res.status(201).json({
      id: userId,
      name,
      email,
      role: role || 'attendee',
      token: generateToken(userId),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user && (await User.comparePassword(password, user.password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

module.exports = { registerUser, loginUser, getUserProfile };
