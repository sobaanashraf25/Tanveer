/*
# Create properties and enquiries tables

1. New Tables
- `properties`: listings shown on the public website. Columns: id, title, category (plot, residential_land, commercial_land, house), location, area_sqft, price_lakh (price in lakhs), description, is_featured, created_at.
- `enquiries`: messages submitted by visitors through the contact form. Columns: id, name, phone, property_type, message, created_at.

2. Security
- Row level security enabled on both tables.
- `properties`: anyone (anon and signed-in) can read listings. No public writes; edits are made in the database dashboard.
- `enquiries`: anyone can submit an enquiry (insert only). Visitors cannot read other enquiries.

3. Notes
- The website has no sign-in, so policies target the anon and authenticated roles.
- Seeded listings are sample entries intended to be replaced with real inventory.
*/

CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('plot', 'residential_land', 'commercial_land', 'house')),
  location text NOT NULL,
  area_sqft integer NOT NULL CHECK (area_sqft > 0),
  price_lakh numeric(10, 2) NOT NULL CHECK (price_lakh > 0),
  description text NOT NULL DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS properties_category_idx ON properties (category);

CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 20),
  property_type text NOT NULL DEFAULT 'any',
  message text NOT NULL DEFAULT '' CHECK (char_length(message) <= 1000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON properties TO anon, authenticated;
GRANT INSERT ON enquiries TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_properties" ON properties;
CREATE POLICY "anon_select_properties" ON properties FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_enquiries" ON enquiries;
CREATE POLICY "anon_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

INSERT INTO properties (id, title, category, location, area_sqft, price_lakh, description, is_featured) VALUES
  ('11111111-0000-4000-8000-000000000001', 'Corner Plot near Ring Road', 'plot', 'Patliputra, Patna', 1800, 85.00, 'East-facing corner plot with 30 ft and 40 ft approach roads, ready for construction. Sample listing.', true),
  ('11111111-0000-4000-8000-000000000002', 'Gated Residential Plot', 'residential_land', 'Danapur, Patna', 2400, 62.50, 'Plot inside a gated layout with water, electricity and drainage in place. Sample listing.', true),
  ('11111111-0000-4000-8000-000000000003', 'Highway Commercial Land', 'commercial_land', 'Phulwari Sharif, Patna', 12000, 540.00, 'Frontage on a main highway, suitable for showroom, warehouse or hospitality use. Sample listing.', true),
  ('11111111-0000-4000-8000-000000000004', 'Modern 3 BHK Independent House', 'house', 'Boring Road, Patna', 2200, 165.00, 'Newly built three-bedroom house with parking, terrace and modular kitchen. Sample listing.', false),
  ('11111111-0000-4000-8000-000000000005', 'Park-Facing Residential Plot', 'residential_land', 'Kankarbagh, Patna', 1500, 74.00, 'Quiet residential plot opposite a community park with clear title documents. Sample listing.', false),
  ('11111111-0000-4000-8000-000000000006', 'Market Road Commercial Plot', 'commercial_land', 'Khagaul, Patna', 4500, 210.00, 'High-footfall commercial plot on a market road with wide frontage. Sample listing.', false)
ON CONFLICT (id) DO NOTHING;
