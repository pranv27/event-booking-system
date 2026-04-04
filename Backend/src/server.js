const express = require('express');
const cors = require('cors'); // Import CORS
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const http = require('http'); 
const { initSocket } = require('./config/socket'); 

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const fs = require('fs'); // Import fs

dotenv.config();

const app = express();
const server = http.createServer(app); 

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Uploads directory created!');
}

// Enable CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Initialize Socket.io
initSocket(server);

// Connect to database with improved logging
db.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database Connected Successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.message);
    console.log('💡 Tip: Ensure MySQL is running and the database "event_management" exists.');
  });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle form data if needed
app.use(morgan('dev'));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => { // Listen on the HTTP server
  console.log(`Server running on port ${PORT}`);
});


