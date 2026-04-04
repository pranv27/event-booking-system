const db = require('../config/db');

const Category = {
  async getAll() {
    const [rows] = await db.execute('SELECT * FROM categories');
    return rows;
  },

  async getById(id) {
    const [rows] = await db.execute('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  async create(name) {
    const [result] = await db.execute('INSERT INTO categories (name) VALUES (?)', [name]);
    return result.insertId;
  },

  async update(id, name) {
    const [result] = await db.execute('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
    return result.affectedRows;
  },

  async delete(id) {
    const [result] = await db.execute('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows;
  },
};

module.exports = Category;
