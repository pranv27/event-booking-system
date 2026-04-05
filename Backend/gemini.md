# Project: Event Management Platform Backend

## Goal
Build a complete backend for a modern Event Management Platform similar to Eventbrite or Meetup.

The backend must be production-ready, scalable, secure, and modular.

This project will allow users to discover events, create events, book tickets, and manage event participation.

The backend must be implemented using Node.js, Express.js, and SQL database.

---

# Tech Stack

Language:
Node.js (JavaScript)

Framework:
Express.js

Database:
MySQL or PostgreSQL

Authentication:
JWT (JSON Web Token)

Password Security:
bcrypt

File Uploads:
Multer

Email Service:
Nodemailer

Real-time Features:
Socket.io

QR Code Generation:
qrcode

Environment Variables:
dotenv

Validation:
express-validator

---

# Architecture

Use a clean modular architecture with separation of concerns.

Project Structure:

backend/
│
├── src/
│   ├── controllers/
│   │   authController.js
│   │   eventController.js
│   │   bookingController.js
│   │   userController.js
│   │
│   ├── routes/
│   │   authRoutes.js
│   │   eventRoutes.js
│   │   bookingRoutes.js
│   │   userRoutes.js
│   │
│   ├── models/
│   │   userModel.js
│   │   eventModel.js
│   │   bookingModel.js
│   │   categoryModel.js
│   │
│   ├── middleware/
│   │   authMiddleware.js
│   │   roleMiddleware.js
│   │   errorMiddleware.js
│   │
│   ├── services/
│   │   emailService.js
│   │   paymentService.js
│   │   qrService.js
│   │
│   ├── utils/
│   │   generateToken.js
│   │   database.js
│   │
│   ├── config/
│   │   db.js
│   │   socket.js
│   │
│   ├── uploads/
│   │
│   └── server.js
│
├── package.json
├── .env.example
└── README.md

Follow MVC architecture.

---

# User Roles

There are three types of users:

1. Admin
2. Organizer
3. Attendee

Permissions:

Admin
- manage users
- approve or remove events
- view platform analytics

Organizer
- create events
- edit events
- manage bookings
- view attendee list

Attendee
- browse events
- book tickets
- cancel bookings
- view tickets

---

# Database Design

Create SQL schema and migration scripts.

Users Table

Fields:
id (primary key)
name
email (unique)
password
role (admin, organizer, attendee)
created_at
updated_at

---

Events Table

Fields:
id
title
description
location
event_date
event_time
category_id
price
capacity
banner_image
organizer_id
status (pending, approved, rejected)
created_at
updated_at

---

Categories Table

Fields:
id
name
created_at

---

Bookings Table

Fields:
id
user_id
event_id
ticket_quantity
total_price
payment_status
qr_code
created_at

---

Reviews Table (Optional but recommended)

Fields:
id
user_id
event_id
rating
comment
created_at

---

# Authentication System

Implement full authentication system.

Endpoints:

POST /api/auth/register
POST /api/auth/login
GET /api/auth/profile

Features:

- JWT authentication
- Password hashing using bcrypt
- Role-based authorization
- Protected routes

---

# Event Management APIs

Endpoints:

GET /api/events
GET /api/events/:id
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id

Features:

- event creation by organizers
- event approval by admin
- event search
- filter by category, date, location
- pagination

---

# Booking System

Endpoints:

POST /api/bookings
GET /api/bookings/user
GET /api/bookings/event/:eventId
DELETE /api/bookings/:id

Features:

- ticket booking
- generate QR code for ticket
- prevent booking if event is full
- calculate total price

---

# File Upload

Allow organizers to upload event banner images.

Use multer.

Store files in:

/uploads

Save image path in database.

---

# Email Notifications

Send emails when:

- user registers
- ticket is booked
- event reminder before event

Use Nodemailer.

---

# QR Code Ticket

Generate QR code when ticket is booked.

QR must contain:

booking_id
event_id
user_id

Store QR image or string in database.

---

# Real-Time Features

Use Socket.io for:

- live ticket availability updates
- event announcements
- live chat (optional)

---

# Security Requirements

Must include:

- JWT authentication
- password hashing
- request validation
- SQL injection prevention
- centralized error handling

---

# Validation

Use express-validator for:

User registration
Event creation
Booking requests

---

# Pagination

For event listing implement:

?page=1
&limit=10

---

# Search & Filters

Support filters:

/api/events?category=music
/api/events?location=pune
/api/events?date=2026-06-20

---

# Logging

Implement request logging using morgan.

---

# Environment Variables

Create .env.example

Variables:

PORT
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET
EMAIL_USER
EMAIL_PASS

---

# Development Rules

Use async/await.
Handle errors properly.
Write reusable services.
Use modular route files.
Write clean readable code.

---

# Deliverables

Gemini must generate:

- full backend project structure
- SQL schema
- all controllers
- all routes
- middleware
- JWT authentication
- booking system
- QR generation
- email service
- example environment file
- README with setup instructions

---

# Final Instruction

First generate the full project structure.

Then implement authentication module.

Then implement event module.

Then implement booking module.

Then implement additional services (QR, email, socket).

Ensure the backend can run using:

npm install
npm run dev