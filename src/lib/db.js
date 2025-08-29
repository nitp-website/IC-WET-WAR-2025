const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool with optimized settings
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  port: parseInt(process.env.MYSQL_PORT, 10),
  
  // Optimized connection pool settings
  connectionLimit: 10,         // Reduced from 20 for better performance
  acquireTimeout: 30000,       // Reduced to 30 seconds
  timeout: 30000,              // Reduced to 30 seconds
  queueLimit: 25,              // Reduced queued requests
  
  // Performance optimizations
  charset: 'utf8mb4',
  timezone: 'Z',
  supportBigNumbers: true,
  bigNumberStrings: true,
  
  // SSL settings (if needed)
  ssl: process.env.MYSQL_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
  
  // Additional optimizations
  multipleStatements: false,  // Security: prevent SQL injection
  debug: false,
  trace: false,
  
  // Connection health check
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  
  // Connection retry settings
  maxRetries: 2,              // Reduced retries
  retryDelay: 500,            // Reduced delay
});

// Validate environment variables at startup
if (
  !process.env.MYSQL_HOST ||
  !process.env.MYSQL_DATABASE ||
  !process.env.MYSQL_USERNAME ||
  !process.env.MYSQL_PASSWORD ||
  !process.env.MYSQL_PORT
) {
  throw new Error('Missing one or more required MySQL environment variables.');
}

// Connection pool event listeners for monitoring
pool.on('connection', (connection) => {
  console.log(`[DB] New connection established as id ${connection.threadId}`);
});

pool.on('enqueue', () => {
  console.log('[DB] Waiting for available connection slot');
});

pool.on('error', (err) => {
  console.error('[DB] Pool error:', err);
});

// Cache for prepared statements
const stmtCache = new Map();

/**
 * Executes a MySQL query with performance monitoring and connection pooling.
 * @param {string} q - The SQL query string.
 * @param {Array<string|number>} [values=[]] - Query parameters to be escaped.
 * @returns {Promise<any>} - The query result.
 */
async function query(q, values = []) {
  let connection;
  let retries = 0;
  const maxRetries = 2;
  
  while (retries < maxRetries) {
    try {
      const startTime = Date.now();
      
      // Get connection from pool (reuse existing connection if available)
      connection = await pool.getConnection();
      
      // Execute query with prepared statement
      const [results] = await connection.execute(q, values);
      
      const endTime = Date.now();
      const executionTime = endTime - startTime;
      
      // Log slow queries (> 500ms instead of 1000ms) in development
      if (process.env.NODE_ENV === 'development' && executionTime > 500) {
        console.warn(`Slow query detected (${executionTime}ms): ${q.substring(0, 100)}`);
      }
      
      // Log connection pool stats for monitoring (less frequent)
      if (process.env.NODE_ENV === 'development' && executionTime > 1000) {
        const stats = getPoolStats();
        console.log(`[DB] Pool stats - Active: ${stats.activeConnections}, Available: ${stats.availableConnections}, Queue: ${stats.queuedRequests}`);
      }
      
      return results;
    } catch (e) {
      retries++;
      
      // Log the error
      console.error(`Database Query Error (attempt ${retries}/${maxRetries}):`, {
        query: q.substring(0, 100),
        error: e.message,
        values: values.length,
        sqlState: e.sqlState,
        errno: e.errno,
        code: e.code
      });
      
      // If it's a connection timeout and we have retries left, wait and retry
      if ((e.code === 'ETIMEDOUT' || e.code === 'ECONNRESET' || e.code === 'PROTOCOL_CONNECTION_LOST') && retries < maxRetries) {
        console.log(`Connection issue detected, retrying in ${retries * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, retries * 500));
        continue;
      }
      
      // If we've exhausted retries or it's not a connection issue, throw the error
      throw new Error(`Database query failed after ${retries} attempts: ${e.message}`);
    } finally {
      // Always release connection back to pool
      if (connection) {
        connection.release();
      }
    }
  }
}

/**
 * Execute multiple queries using a single connection for better performance
 * @param {Array<{query: string, values: Array}>} queries - Array of queries to execute
 * @returns {Promise<Array>} - Array of results
 */
async function batchQuery(queries) {
  let connection;
  try {
    const startTime = Date.now();
    connection = await pool.getConnection();
    
    const results = [];
    for (const { query: q, values = [] } of queries) {
      const [result] = await connection.execute(q, values);
      results.push(result);
    }
    
    const endTime = Date.now();
    const executionTime = endTime - startTime;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DB] Batch query executed in ${executionTime}ms with ${queries.length} queries`);
    }
    
    return results;
  } catch (error) {
    console.error('Batch query error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Execute multiple queries in a transaction
 * @param {Array<{query: string, values: Array}>} queries - Array of queries to execute
 * @returns {Promise<Array>} - Array of results
 */
async function transaction(queries) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    const results = [];
    for (const { query: q, values = [] } of queries) {
      const [result] = await connection.execute(q, values);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Transaction error:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

/**
 * Execute multiple queries in parallel (for read-only operations)
 * @param {Array<{query: string, values: Array}>} queries - Array of queries to execute
 * @returns {Promise<Array>} - Array of results
 */
async function parallel(queries) {
  try {
    const promises = queries.map(({ query: q, values = [] }) => 
      query(q, values)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error('Parallel query error:', error);
    throw error;
  }
}

/**
 * Get connection pool statistics
 * @returns {Object} - Pool statistics
 */
function getPoolStats() {
  return {
    activeConnections: pool._allConnections ? pool._allConnections.length : 0,
    availableConnections: pool._freeConnections ? pool._freeConnections.length : 0,
    queuedRequests: pool._connectionQueue ? pool._connectionQueue.length : 0
  };
}

/**
 * Closes the MySQL connection pool.
 * Use this explicitly when shutting down the application.
 */
async function closePool() {
  try {
    await pool.end();
    console.log('[DB] Connection pool closed');
  } catch (e) {
    console.error('[DB] Error closing connection pool:', e);
  }
}

// Health check function
async function healthCheck() {
  try {
    const result = await query('SELECT 1 as health');
    return result.length > 0;
  } catch (error) {
    console.error('[DB] Health check failed:', error);
    return false;
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  console.log('[DB] Received SIGINT, closing connection pool...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[DB] Received SIGTERM, closing connection pool...');
  await closePool();
  process.exit(0);
});

module.exports = {
  pool,
  query,
  batchQuery,
  transaction,
  parallel,
  closePool,
  healthCheck,
  getPoolStats,
};
