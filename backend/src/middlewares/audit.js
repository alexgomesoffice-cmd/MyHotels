/**
 * Audit logging utility for tracking user actions
 */

import { pool } from "../db.js";

/**
 * Log user action to audit_log table
 * @param {Object} param0 - Logging parameters
 * @param {number} param0.user_id - User who performed action
 * @param {string} param0.action - Action performed (CREATE, UPDATE, DELETE, etc.)
 * @param {string} param0.entity_type - Type of entity affected (hotel, room, booking, etc.)
 * @param {number} param0.entity_id - ID of affected entity
 * @param {Object} param0.oldValue - Previous values (for updates)
 * @param {Object} param0.newValue - New values
 * @param {string} param0.ipAddress - Client IP address
 * @param {string} param0.userAgent - Client user agent
 */
export async function logAudit({
  user_id,
  action,
  entity_type,
  entity_id,
  oldValue = null,
  newValue = null,
  ipAddress,
  userAgent,
}) {
  try {
    await pool.query(
      `
      INSERT INTO audit_log 
        (user_id, action, entity_type, entity_id, old_value, new_value, ip_address, user_agent, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [
        user_id || null,
        action,
        entity_type,
        entity_id || null,
        oldValue ? JSON.stringify(oldValue) : null,
        newValue ? JSON.stringify(newValue) : null,
        ipAddress,
        userAgent,
      ]
    );
  } catch (err) {
    // Log error but don't fail the main operation
    console.error("Audit logging error:", err);
  }
}

/**
 * Middleware to extract and attach audit info to request
 */
export function auditInfoMiddleware(req, res, next) {
  req.auditInfo = {
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.get('user-agent'),
    user_id: req.user?.user_id || null,
  };
  next();
}

/**
 * Fetch audit logs with filtering
 */
export async function getAuditLogs({
  user_id = null,
  action = null,
  entity_type = null,
  limit = 100,
  offset = 0,
}) {
  let query = 'SELECT * FROM audit_log WHERE 1=1';
  const params = [];

  if (user_id) {
    query += ' AND user_id = ?';
    params.push(user_id);
  }

  if (action) {
    query += ' AND action = ?';
    params.push(action);
  }

  if (entity_type) {
    query += ' AND entity_type = ?';
    params.push(entity_type);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const [rows] = await pool.query(query, params);
  return rows;
}
