const mysql = require('mysql2/promise');
require('dotenv').config();

// Create the connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'game_routes',
  port: process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // SSL is disabled for XAMPP/Localhost
  ssl: false 
});

// Immediate Connection Test
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to XAMPP MySQL (phpMyAdmin) successfully.');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Error Details:', err.message);
    console.log('\nTroubleshooting Tip: Make sure XAMPP MySQL is STARTed and the database "game_routes" exists in phpMyAdmin.');
  }
})();

module.exports = pool;