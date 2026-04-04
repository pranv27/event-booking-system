# Event Management Platform Backend

## Goal
A complete backend for a modern Event Management Platform similar to Eventbrite or Meetup, built to be production-ready, scalable, secure, and modular.

## Tech Stack
- **Language:** Node.js (JavaScript)
- **Framework:** Express.js
- **Database:** MySQL or PostgreSQL (using `mysql2` for MySQL/MariaDB connectivity in this setup)
- **Authentication:** JWT (JSON Web Token)
- **Password Security:** bcryptjs
- **File Uploads:** Multer
- **Email Service:** Nodemailer
- **Real-time Features:** Socket.io
- **QR Code Generation:** qrcode
- **Environment Variables:** dotenv
- **Validation:** express-validator
- **Logging:** morgan

## Project Structure
```
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
```

## Setup Instructions

### 1. Clone the repository (if applicable)
```bash
# This step is for users cloning the repo. For this task, you are already in the directory.
# git clone <repository_url>
# cd <repository_name>
```

### 2. Install Dependencies
Navigate to the `backend` directory and install the required Node.js packages:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the `backend` directory based on the `.env.example` file.

```ini
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=event_management
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
```
**Note:** Replace placeholders like `your_jwt_secret`, `your_email@example.com`, and `your_email_password` with your actual credentials.

### 4. Database Setup
Ensure you have a MySQL or PostgreSQL database server running. Create a database named `event_management` (or as configured in your `.env` file). The SQL schema will be provided separately or handled by migration scripts.

### 5. Run the Application
You can start the development server using:
```bash
npm run dev
```
For production, use:
```bash
npm start
```

The server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

## API Documentation
(To be added once APIs are implemented)

## User Roles and Permissions
- **Admin:** Manage users, approve/remove events, view platform analytics.
- **Organizer:** Create/edit events, manage bookings, view attendee list.
- **Attendee:** Browse events, book/cancel tickets, view tickets.
