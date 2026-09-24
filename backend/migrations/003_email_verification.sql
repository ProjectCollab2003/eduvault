ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS verification_token_hash VARCHAR(128);

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS verification_expires_at TIMESTAMP;

UPDATE users
SET email_verified_at = COALESCE(email_verified_at, created_at)
WHERE email_verified_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_users_verification_token_hash
ON users(verification_token_hash);