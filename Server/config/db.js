const mysql = require('mysql2/promise');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || '127.0.0.1',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASS     || '',
  database: process.env.DB_NAME     || 'game_routes',
  port:     parseInt(process.env.MYSQLPORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

// Connection Test
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log(
      isProduction
        ? '✅ Connected to Railway MySQL successfully.'
        : '✅ Connected to XAMPP MySQL (phpMyAdmin) successfully.'
    );
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed!');
    console.error('Error Details:', err.message);
    console.log(
      isProduction
        ? '\nTroubleshooting: Check Railway MySQL credentials in Render environment variables.'
        : '\nTroubleshooting: Make sure XAMPP MySQL is running and "game_routes" database exists.'
    );
  }
})();

module.exports = pool;