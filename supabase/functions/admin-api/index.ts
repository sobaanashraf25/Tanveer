import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BUCKET = "property-photos";
const SESSION_HOURS = 12;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_PHOTOS = 12;
const CATEGORIES = ["plot", "residential_land", "commercial_land", "house"];
const PHOTO_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const PHOTO_PATH_PATTERN = /^[0-9a-f-]{36}\.(jpg|png|webp)$/;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.length === 10 ? `91${digits}` : digits;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsText, saltB64, hashB64] = stored.split("$");
  if (scheme !== "pbkdf2_sha256" || !iterationsText || !saltB64 || !hashB64) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      hash: "SHA-256",
      salt: base64ToBytes(saltB64),
      iterations: Number(iterationsText),
    },
    key,
    256,
  );
  return timingSafeEqual(new Uint8Array(bits), base64ToBytes(hashB64));
}

async function handleLogin(req: Request): Promise<Response> {
  const body = await req.json().catch(() => null);
  const phone = typeof body?.phone === "string" ? normalizePhone(body.phone) : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (!phone || !password) return json({ error: "Enter your phone number and password." }, 400);

  const { data: account, error } = await supabase
    .from("admin_accounts")
    .select("id, password_hash")
    .eq("phone", phone)
    .maybeSingle();
  if (error) throw error;

  const valid = account ? await verifyPassword(password, account.password_hash) : false;
  if (!account || !valid) return json({ error: "Incorrect phone number or password." }, 401);

  await supabase.from("admin_sessions").delete().lt("expires_at", new Date().toISOString());

  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = bytesToBase64(tokenBytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const expiresAt = new Date(Date.now() + SESSION_HOURS * 60 * 60 * 1000).toISOString();

  const { error: insertError } = await supabase.from("admin_sessions").insert({
    token_hash: await sha256Hex(token),
    account_id: account.id,
    expires_at: expiresAt,
  });
  if (insertError) throw insertError;

  return json({ token, expiresAt });
}

async function getSessionTokenHash(req: Request): Promise<string | null> {
  const header = req.headers.get("Authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  const tokenHash = await sha256Hex(token);
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("token_hash")
    .eq("token_hash", tokenHash)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return data ? tokenHash : null;
}

async function handleLogout(req: Request): Promise<Response> {
  const tokenHash = await getSessionTokenHash(req);
  if (tokenHash) {
    const { error } = await supabase.from("admin_sessions").delete().eq("token_hash", tokenHash);
    if (error) throw error;
  }
  return json({ ok: true });
}

async function handleUpload(req: Request): Promise<Response> {
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return json({ error: "Choose a photo to upload." }, 400);

  const extension = PHOTO_EXTENSIONS[file.type];
  if (!extension) return json({ error: "Photos must be JPEG, PNG or WebP." }, 400);
  if (file.size === 0 || file.size > MAX_PHOTO_BYTES) {
    return json({ error: "Each photo must be under 5 MB." }, 400);
  }

  const path = `${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;

  return json({ path });
}

interface PropertyInput {
  title: string;
  category: string;
  location: string;
  area_sqft: number;
  price_lakh: number;
  description: string;
  is_featured: boolean;
  image_paths: string[];
}

function validatePropertyInput(raw: unknown): { value: PropertyInput } | { error: string } {
  if (typeof raw !== "object" || raw === null) return { error: "Property details are missing." };
  const r = raw as Record<string, unknown>;

  const title = typeof r.title === "string" ? r.title.trim() : "";
  const location = typeof r.location === "string" ? r.location.trim() : "";
  const description = typeof r.description === "string" ? r.description.trim() : "";
  const category = typeof r.category === "string" ? r.category : "";
  const area = Number(r.area_sqft);
  const price = Number(r.price_lakh);

  if (!title || title.length > 150) return { error: "Enter a title up to 150 characters." };
  if (!CATEGORIES.includes(category)) return { error: "Choose a valid property type." };
  if (!location || location.length > 150) return { error: "Enter a location up to 150 characters." };
  if (!Number.isInteger(area) || area <= 0 || area > 100_000_000) {
    return { error: "Enter the area in square feet." };
  }
  if (!Number.isFinite(price) || price <= 0 || price > 1_000_000) {
    return { error: "Enter a price in lakhs." };
  }
  if (description.length > 3000) return { error: "The description must be under 3000 characters." };
  if (typeof r.is_featured !== "boolean") return { error: "Invalid featured setting." };

  const imagePaths = Array.isArray(r.image_paths) ? r.image_paths : null;
  if (!imagePaths || imagePaths.length > MAX_PHOTOS) {
    return { error: `A property can have up to ${MAX_PHOTOS} photos.` };
  }
  if (!imagePaths.every((p) => typeof p === "string" && PHOTO_PATH_PATTERN.test(p))) {
    return { error: "One of the photos is invalid. Please upload it again." };
  }

  return {
    value: {
      title,
      category,
      location,
      area_sqft: area,
      price_lakh: price,
      description,
      is_featured: r.is_featured,
      image_paths: imagePaths as string[],
    },
  };
}

async function removeStoredPhotos(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error("Failed to remove photos", error.message);
}

async function handleSaveProperty(body: Record<string, unknown>): Promise<Response> {
  const result = validatePropertyInput(body.property);
  if ("error" in result) return json({ error: result.error }, 400);
  const input = result.value;

  if (typeof body.id === "string") {
    const { data: existing, error: fetchError } = await supabase
      .from("properties")
      .select("image_paths")
      .eq("id", body.id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (!existing) return json({ error: "This property no longer exists." }, 404);

    const { data, error } = await supabase
      .from("properties")
      .update(input)
      .eq("id", body.id)
      .select()
      .single();
    if (error) throw error;

    const kept = new Set(input.image_paths);
    await removeStoredPhotos((existing.image_paths as string[]).filter((p) => !kept.has(p)));
    return json({ property: data });
  }

  const { data, error } = await supabase.from("properties").insert(input).select().single();
  if (error) throw error;
  return json({ property: data });
}

async function handleDeleteProperty(body: Record<string, unknown>): Promise<Response> {
  if (typeof body.id !== "string") return json({ error: "Missing property." }, 400);

  const { data: existing, error: fetchError } = await supabase
    .from("properties")
    .select("image_paths")
    .eq("id", body.id)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (!existing) return json({ error: "This property no longer exists." }, 404);

  const { error } = await supabase.from("properties").delete().eq("id", body.id);
  if (error) throw error;

  await removeStoredPhotos(existing.image_paths as string[]);
  return json({ ok: true });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { pathname } = new URL(req.url);

    if (pathname.endsWith("/login") && req.method === "POST") return await handleLogin(req);

    if (!(await getSessionTokenHash(req))) {
      return json({ error: "Your admin session has ended. Please sign in again." }, 401);
    }

    if (pathname.endsWith("/logout") && req.method === "POST") return await handleLogout(req);
    if (pathname.endsWith("/upload") && req.method === "POST") return await handleUpload(req);

    if (pathname.endsWith("/properties/save") && req.method === "POST") {
      const body = await req.json().catch(() => null);
      if (!body) return json({ error: "Invalid request." }, 400);
      return await handleSaveProperty(body);
    }

    if (pathname.endsWith("/properties/delete") && req.method === "POST") {
      const body = await req.json().catch(() => null);
      if (!body) return json({ error: "Invalid request." }, 400);
      return await handleDeleteProperty(body);
    }

    return json({ error: "Not found." }, 404);
  } catch (err) {
    console.error("admin-api failed", err);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
