const { Server } = require('socket.io');

let io;

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Allow all origins for now, configure properly in production
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });

    // Example: Join an event room
    socket.on('joinEventRoom', (eventId) => {
      socket.join(eventId);
      console.log(`${socket.id} joined event room: ${eventId}`);
    });

    // Example: Leave an event room
    socket.on('leaveEventRoom', (eventId) => {
      socket.leave(eventId);
      console.log(`${socket.id} left event room: ${eventId}`);
    });

    // Example: Send event announcement
    socket.on('eventAnnouncement', ({ eventId, message }) => {
      io.to(eventId).emit('announcement', message);
      console.log(`Announcement for event ${eventId}: ${message}`);
    });

    // You can add more real-time event listeners here
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
