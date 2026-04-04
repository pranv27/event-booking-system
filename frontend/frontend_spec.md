# Event Management System Frontend

Build a modern responsive frontend for an Event Management System.

Tech Stack:

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM
- Context API for authentication

Backend API Base URL:
http://localhost:5000/api

Use the design tokens defined in `frontend_theme.css`.

The UI should look modern and minimal similar to Eventbrite or Meetup.

----------------------------------

# Pages

1 Home Page

Sections:
- Navbar
- Hero Section
- Featured Events
- Categories
- Footer

----------------------------------

2 Events Page

Features:
- Show all events
- Event cards
- Search events
- Filter by category
- Pagination

----------------------------------

3 Event Details Page

Show:

- Event banner
- Title
- Description
- Date
- Time
- Location
- Ticket price
- Capacity
- Book Ticket button

----------------------------------

4 Login Page

Fields:

- Email
- Password

API:
POST /auth/login

Store JWT token in localStorage.

----------------------------------

5 Register Page

Fields:

- Name
- Email
- Password
- Role (attendee / organizer)

API:
POST /auth/register

----------------------------------

6 Dashboard

User dashboard showing:

- User info
- Booked events
- Ticket QR codes

API:
GET /bookings/user

----------------------------------

7 Create Event Page (Organizer)

Form fields:

- Title
- Description
- Category
- Location
- Event Date
- Event Time
- Ticket Price
- Capacity
- Banner Upload

API:
POST /events

----------------------------------

# Components

Create reusable components:

Navbar
Footer
EventCard
Loader
ProtectedRoute
BookingModal

----------------------------------

# API Endpoints

Authentication

POST /auth/register
POST /auth/login
GET /auth/profile

Events

GET /events
GET /events/:id
POST /events
PUT /events/:id
DELETE /events/:id

Bookings

POST /bookings
GET /bookings/user
DELETE /bookings/:id

----------------------------------

# Project Structure

src
  components
  pages
  services
  context
  hooks
  utils

----------------------------------

# Requirements

- Use Axios instance
- JWT authentication
- Protected routes
- Responsive layout
- Clean modern UI
- Use theme variables from frontend_theme.css