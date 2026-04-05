const db = require('../config/db');

const Event = {
  async create(title, description, location, event_date, event_time, category_id, price, capacity, banner_image, image_url, organizer_id) {
    const [result] = await db.execute(
      'INSERT INTO events (title, description, location, event_date, event_time, category_id, price, capacity, banner_image, image_url, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, location, event_date, event_time, category_id, price, capacity, banner_image, image_url, organizer_id]
    );
    return result.insertId;
  },

  async getAll({ page = 1, limit = 10, category, location, date, search, organizer_id }) {
    const p = parseInt(page) || 1;
    const l = parseInt(limit) || 10;
    const offset = (p - 1) * l;

    let query = `
      SELECT
        e.id, e.title, e.description, e.location, e.event_date, e.event_time, e.price, e.capacity, e.banner_image, e.image_url, e.status,
        c.name AS category_name,
        u.name AS organizer_name
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (organizer_id) {
      query += ' AND e.organizer_id = ?';
      params.push(organizer_id);
    }
    if (category && category.trim() !== '') {
      query += ' AND c.name = ?';
      params.push(category);
    }
    if (location && location.trim() !== '') {
      query += ' AND e.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (date && date.trim() !== '') {
      query += ' AND e.event_date = ?';
      params.push(date);
    }
    if (search && search.trim() !== '') {
      query += ' AND (e.title LIKE ? OR e.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Explicitly append integers for LIMIT to avoid mysqld_stmt_execute errors
    query += ` LIMIT ${parseInt(offset)}, ${parseInt(l)}`;

    console.log('--- SQL DEBUG ---');
    console.log('Query:', query.replace(/\s+/g, ' ').trim());
    console.log('Params:', params);

    try {
      const [rows] = await db.execute(query, params);

      let countQuery = `
        SELECT COUNT(*) AS total
        FROM events e
        LEFT JOIN categories c ON e.category_id = c.id
        WHERE 1=1
      `;
      const countParams = [];
      if (organizer_id) {
        countQuery += ' AND e.organizer_id = ?';
        countParams.push(organizer_id);
      }
      if (category && category.trim() !== '') {
        countQuery += ' AND c.name = ?';
        countParams.push(category);
      }
      if (location && location.trim() !== '') {
        countQuery += ' AND e.location LIKE ?';
        countParams.push(`%${location}%`);
      }
      if (date && date.trim() !== '') {
        countQuery += ' AND e.event_date = ?';
        countParams.push(date);
      }
      if (search && search.trim() !== '') {
        countQuery += ' AND (e.title LIKE ? OR e.description LIKE ?)';
        countParams.push(`%${search}%`, `%${search}%`);
      }

      const [countRows] = await db.execute(countQuery, countParams);
      const total = countRows[0].total;

      return {
        events: rows,
        total,
        page: p,
        pages: Math.ceil(total / l),
      };
    } catch (err) {
      console.error('SQL Error:', err.message);
      throw err;
    }
  },

  async getById(id) {
    const [rows] = await db.execute(
      `SELECT
        e.id, e.title, e.description, e.location, e.event_date, e.event_time, e.price, e.capacity, e.banner_image, e.image_url, e.status,
        c.name AS category_name,
        u.name AS organizer_name, u.id AS organizer_id
      FROM events e
      LEFT JOIN categories c ON e.category_id = c.id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE e.id = ?`,
      [id]
    );
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    for (const key in data) {
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
    params.push(id);
    const [result] = await db.execute(`UPDATE events SET ${fields.join(', ')} WHERE id = ?`, params);
    return result.affectedRows;
  },

  async updateStatus(id, status) {
    const [result] = await db.execute('UPDATE events SET status = ? WHERE id = ?', [status, id]);
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM events WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Event;
