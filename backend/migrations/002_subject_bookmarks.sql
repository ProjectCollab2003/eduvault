CREATE TABLE IF NOT EXISTS subject_bookmarks (
  subject_bookmark_id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(subject_id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_subject_bookmarks_user
  ON subject_bookmarks(user_id, created_at DESC);

