/*
# Add admin accounts, admin sessions and property photos

1. Modified Tables
- `properties`: new column `image_paths` (list of photo file names stored in the property-photos bucket). Existing rows get an empty list. No data is removed.

2. New Tables
- `admin_accounts`: admin logins. Columns: id, phone (unique, digits with country code), password_hash (salted PBKDF2 hash, never the plain password), created_at.
- `admin_sessions`: active admin sign-ins. Columns: token_hash (SHA-256 of the session token, the token itself is never stored), account_id, expires_at, created_at.

3. Storage
- New public bucket `property-photos` for listing photos. Images only (JPEG, PNG, WebP), up to 5 MB each. Anyone can view a photo by its link; only the server can upload or delete.

4. Security
- Row level security is enabled on both admin tables with no policies, so public visitors cannot read or change them.
- The public and signed-in roles have all privileges on both admin tables revoked.
- Only the server (service role, used by the admin edge function) can read and write admin accounts, sessions and properties.
- Public visitors keep read-only access to properties, as before.

5. Notes
- Photo uploads and property changes go through the admin edge function, which checks the session first.
*/

ALTER TABLE properties ADD COLUMN IF NOT EXISTS image_paths text[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS admin_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash text PRIMARY KEY,
  account_id uuid NOT NULL REFERENCES admin_accounts(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_sessions_expires_at_idx ON admin_sessions (expires_at);

ALTER TABLE admin_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON admin_accounts FROM anon, authenticated;
REVOKE ALL ON admin_sessions FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_accounts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON admin_sessions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON properties TO service_role;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('property-photos', 'property-photos', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
