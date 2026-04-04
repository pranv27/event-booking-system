const db = require('../config/db');

const Booking = {
  async create(user_id, event_id, ticket_quantity, total_price, qr_code) { // qr_code can be null initially
    const [result] = await db.execute(
      'INSERT INTO bookings (user_id, event_id, ticket_quantity, total_price, qr_code) VALUES (?, ?, ?, ?, ?)',
      [user_id, event_id, ticket_quantity, total_price, qr_code]
    );
    return result.insertId;
  },

  async updateQrCode(bookingId, qr_code) {
    const [result] = await db.execute(
      'UPDATE bookings SET qr_code = ? WHERE id = ?',
      [qr_code, bookingId]
    );
    return result.affectedRows;
  },

  async getByUserId(user_id) {
    const [rows] = await db.execute(
      `SELECT
        b.id, b.ticket_quantity, b.total_price, b.payment_status, b.qr_code, b.created_at,
        e.title AS event_title, e.event_date, e.event_time, e.location, e.banner_image
      FROM bookings b
      JOIN events e ON b.event_id = e.id
      WHERE b.user_id = ?`,
      [user_id]
    );
    return rows;
  },

  async getByEventId(event_id) {
    const [rows] = await db.execute(
      `SELECT
        b.id, b.user_id, b.ticket_quantity, b.total_price, b.payment_status, b.qr_code, b.created_at,
        u.name AS user_name, u.email AS user_email
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.event_id = ?`,
      [event_id]
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [id]);
    return rows[0];
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM bookings WHERE id = ?', [id]);
    return result.affectedRows;
  },

  async getTotalTicketsBookedForEvent(event_id) {
    const [rows] = await db.execute(
      'SELECT SUM(ticket_quantity) AS totalBooked FROM bookings WHERE event_id = ?',
      [event_id]
    );
    return rows[0].totalBooked || 0;
  },
};

module.exports = Booking;