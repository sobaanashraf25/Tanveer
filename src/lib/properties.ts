import { supabase } from '@/lib/supabase';

export type PropertyCategory = 'plot' | 'residential_land' | 'commercial_land' | 'house';

export interface Property {
  id: string;
  title: string;
  category: PropertyCategory;
  location: string;
  area_sqft: number;
  price_lakh: number;
  description: string;
  is_featured: boolean;
  image_paths: string[];
}

export const CATEGORY_LABELS: Record<PropertyCategory, string> = {
  plot: 'Plot',
  residential_land: 'Residential Land',
  commercial_land: 'Commercial Land',
  house: 'House',
};

const PROPERTY_COLUMNS =
  'id, title, category, location, area_sqft, price_lakh, description, is_featured, image_paths';

const PHOTO_BUCKET_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/property-photos`;

export function getPhotoUrl(path: string): string {
  return `${PHOTO_BUCKET_URL}/${path}`;
}

function isProperty(row: unknown): row is Property {
  if (typeof row !== 'object' || row === null) return false;
  const r = row as Record<string, unknown>;
  return (
    typeof r.id === 'string' &&
    typeof r.title === 'string' &&
    typeof r.category === 'string' &&
    typeof r.location === 'string' &&
    typeof r.area_sqft === 'number' &&
    typeof r.price_lakh !== 'undefined' &&
    Number.isFinite(Number(r.price_lakh)) &&
    typeof r.description === 'string' &&
    typeof r.is_featured === 'boolean' &&
    Array.isArray(r.image_paths) &&
    r.image_paths.every((p) => typeof p === 'string')
  );
}

export async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select(PROPERTY_COLUMNS)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  if (!Array.isArray(data)) throw new Error('Unexpected response while loading properties');

  return data.filter(isProperty).map((row) => ({ ...row, price_lakh: Number(row.price_lakh) }));
}
