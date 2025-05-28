const { ipcMain } = require('electron');
const db = require('./db');
const bcrypt = require('bcryptjs');

// Login
ipcMain.handle('login', async (event, { username, password }) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && bcrypt.compareSync(password, user.password)) {
    return { success: true, username: user.username, role: user.role };
  }
  return { success: false };
});
// Login waiters
ipcMain.handle('loginWaiter', async (event, { username, password }) => {
  const waiter = db.prepare('SELECT * FROM waiters WHERE username = ?').get(username);
  if (waiter && bcrypt.compareSync(password, waiter.password)) {
    return { success: true, waiter:waiter};
  }
  return { success: false };
});

//add waiter
ipcMain.handle('addWaiter', async (event, { requester, newWaiter }) => {
  const admin = db.prepare('SELECT * FROM users WHERE username = ?').get(requester);
  if (!admin || admin.role !== 1) {
    return { success: false, message: 'Not authorized' };
  }
  try {
    const hash = bcrypt.hashSync(newWaiter.password, 10);
    db.prepare('INSERT INTO waiters (username, password) VALUES (?, ?)').run(
      newWaiter.username,
      hash
    );
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

// Change password
ipcMain.handle('changePassword', async (event, { username, oldPassword, newPassword }) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (user && bcrypt.compareSync(oldPassword, user.password)) {
    const newHash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE username = ?').run(newHash, username);
    return { success: true };
  }
  return { success: false, message: 'Invalid old password' };
});



// Add new user (admin only)
ipcMain.handle('addUser', async (event, { requester, newUser }) => {
  const admin = db.prepare('SELECT * FROM users WHERE username = ?').get(requester);
  if (!admin || admin.role !== 1) {
    return { success: false, message: 'Not authorized' };
  }
  try {
    const hash = bcrypt.hashSync(newUser.password, 10);
    db.prepare('INSERT INTO users (username, password, role) VALUES (?, ?, ?)').run(
      newUser.username,
      hash,
      newUser.role || 0
    );
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

// Get food categories
ipcMain.handle('getCategoriesWithFoods', () => {
  const rows = db.prepare(`
    SELECT 
      fc.id AS category_id,
      fc.name AS category_name,
      fc.description AS category_description,
      fc.image AS category_image,
      fc.created_at AS category_created_at,
      fc.updated_at AS category_updated_at,
      f.id AS food_id,
      f.name AS food_name,
      f.description AS food_description,
      f.image AS food_image,
      f.price,
      f.created_at AS food_created_at,
      f.updated_at AS food_updated_at
    FROM food_categories fc
    LEFT JOIN food f ON f.category_id = fc.id
    ORDER BY fc.id, f.id
  `).all();

  const categories = [];
  const map = {};

  for (const row of rows) {
    if (!map[row.category_id]) {
      map[row.category_id] = {
        id: row.category_id,
        name: row.category_name,
        description: row.category_description,
        image: row.category_image,
        created_at: row.category_created_at,
        updated_at: row.category_updated_at,
        foods: []
      };
      categories.push(map[row.category_id]);
    }

    if (row.food_id) {
      map[row.category_id].foods.push({
        id: row.food_id,
        name: row.food_name,
        description: row.food_description,
        image: row.food_image,
        price: row.price,
        created_at: row.food_created_at,
        updated_at: row.food_updated_at
      });
    }
  }

  return categories;
});


// Get waiters
ipcMain.handle('getWaiters', () => {
  const rows = db.prepare('SELECT * FROM waiters').all();
  return { waiter: rows }; // To match your original API shape
});

// Get customers
ipcMain.handle('getCustomers', () => {
  const rows = db.prepare('SELECT * FROM customers').all();
  return rows;
});

// Get tables
ipcMain.handle('getTables', () => {
  const rows = db.prepare('SELECT * FROM tables').all();
  return { tables: rows }; // To match your original API shape
});

// Get zones
ipcMain.handle('getZones', () => {
  const rows = db.prepare('SELECT * FROM zones').all();
  return rows;
});

