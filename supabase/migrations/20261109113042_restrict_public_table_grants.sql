/*
# Restrict public table privileges to what the website uses

1. Modified Tables
- `properties`: anon and authenticated roles previously held INSERT, UPDATE and DELETE by default. These are removed; only SELECT remains.
- `enquiries`: anon and authenticated roles previously held SELECT, UPDATE and DELETE by default. These are removed; only INSERT remains.

2. Security
- Row level security policies are unchanged. Visitors can read listings and submit enquiries, and cannot read, edit or delete enquiries.
- No data is removed or altered.

3. Notes
- Revoking then re-granting keeps the grants identical on re-run.
*/

REVOKE ALL ON properties FROM anon, authenticated;
REVOKE ALL ON enquiries FROM anon, authenticated;

GRANT SELECT ON properties TO anon, authenticated;
GRANT INSERT ON enquiries TO anon, authenticated;
