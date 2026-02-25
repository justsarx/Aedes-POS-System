const oracledb = require('oracledb');
require('dotenv').config();

// Configure OracleDB
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
  user: process.env.DB_USER || 'aedes',
  password: process.env.DB_PASSWORD || 'aedes_password',
  connectString: process.env.DB_CONNECT_STRING || 'localhost:1521/XEPDB1'
};

async function initialize() {
  try {
    // Create a connection pool
    await oracledb.createPool(dbConfig);
    console.log('Oracle Connection Pool created');
  } catch (err) {
    console.error('Error creating connection pool:', err);
    throw err;
  }
}

async function execute(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error('Error executing SQL:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

async function close() {
  try {
    await oracledb.getPool().close(10);
    console.log('Oracle Connection Pool closed');
  } catch (err) {
    console.error('Error closing pool:', err);
  }
}

module.exports = {
  initialize,
  execute,
  close
};
