-- Student experience additions. Safe to run more than once.
ALTER TABLE announcements
  ADD COLUMN IF NOT EXISTS is_important BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS material_access_history (
  access_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  material_id INTEGER NOT NULL REFERENCES materials(material_id) ON DELETE CASCADE,
  last_accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  access_count INTEGER NOT NULL DEFAULT 1,
  UNIQUE (user_id, material_id)
);

CREATE INDEX IF NOT EXISTS idx_access_history_user_date
  ON material_access_history(user_id, last_accessed_at DESC);

