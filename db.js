// db.js
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = new Database(path.join(__dirname, 'app.db'));

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role INTEGER DEFAULT 0
  )
`).run();

db.prepare('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)').run();

try {
  const adminExists = db.prepare('SELECT COUNT(*) AS count FROM users WHERE username = ?').get('admin');
  if (adminExists.count === 0) {
    const email = process.env.DEFAULT_ADMIN_EMAIL || 'admin@gmail.com';
    const username = process.env.DEFAULT_ADMIN_USER || 'admin';
    const password = process.env.DEFAULT_ADMIN_PASS || 'admin123';
    const hash = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (email, username, password, role) VALUES (?, ?, ?, ?)')
      .run(email, username, hash, 1);
    console.log(`✅ Default admin created: ${username} / ${password}`);
  }
} catch (err) {
  console.error('❌ Error initializing database:', err.message);
}

module.exports = db;
