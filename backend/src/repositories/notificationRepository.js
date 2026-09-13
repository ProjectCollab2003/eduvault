import pool from "../config/db.js";
import { Notification } from "../entities/Notification.js";
import { NotificationPreference } from "../entities/NotificationPreference.js";

export const notificationRepository = {
  // ----------------- User Notifications -----------------

  async findByUserId(userId, { limit = 50, offset = 0 } = {}) {
    const query = `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    const { rows } = await pool.query(query, [userId, limit, offset]);
    return rows.map((row) => new Notification(row));
  },

  async getUnreadCount(userId) {
    const query = `
      SELECT COUNT(*)::int AS count
      FROM notifications
      WHERE user_id = $1 AND is_read = FALSE
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0]?.count || 0;
  },

  async create({ user_id, title, message }) {
    const query = `
      INSERT INTO notifications (user_id, title, message)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const { rows } = await pool.query(query, [user_id, title, message]);
    return new Notification(rows[0]);
  },

  async markAsRead(notificationId, userId) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE notification_id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await pool.query(query, [notificationId, userId]);
    return rows[0] ? new Notification(rows[0]) : null;
  },

  async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET is_read = TRUE
      WHERE user_id = $1 AND is_read = FALSE
    `;
    const { rowCount } = await pool.query(query, [userId]);
    return rowCount;
  },

  // Broadcast notification to all students subscribed to a subject
  async notifySubscribedStudents(subjectId, title, message) {
    const query = `
      INSERT INTO notifications (user_id, title, message)
      SELECT np.user_id, $2, $3
      FROM notification_preferences np
      WHERE np.subject_id = $1 AND np.enabled = TRUE
      RETURNING notification_id
    `;
    const { rows } = await pool.query(query, [subjectId, title, message]);
    return rows.length;
  },

  // ----------------- Notification Preferences -----------------

  async getPreferences(userId) {
    const query = `
      SELECT 
        s.subject_id,
        s.name AS subject_name,
        g.name AS grade_name,
        COALESCE(np.enabled, TRUE) AS enabled,
        np.preference_id
      FROM subjects s
      JOIN grades g ON s.grade_id = g.grade_id
      LEFT JOIN notification_preferences np 
        ON s.subject_id = np.subject_id AND np.user_id = $1
      ORDER BY g.grade_id ASC, s.name ASC
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows.map(
      (row) =>
        new NotificationPreference({
          preference_id: row.preference_id,
          user_id: userId,
          subject_id: row.subject_id,
          subject_name: row.subject_name,
          grade_name: row.grade_name,
          enabled: row.enabled,
        })
    );
  },

  async setPreference(userId, subjectId, enabled) {
    const query = `
      INSERT INTO notification_preferences (user_id, subject_id, enabled)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, subject_id)
      DO UPDATE SET enabled = EXCLUDED.enabled
      RETURNING *
    `;
    const { rows } = await pool.query(query, [userId, subjectId, enabled]);
    return new NotificationPreference(rows[0]);
  },
};
