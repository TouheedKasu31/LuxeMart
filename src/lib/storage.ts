import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directories exist
export async function ensureUploadDirs() {
  const dirs = [
    UPLOAD_DIR,
    path.join(UPLOAD_DIR, "products"),
    path.join(UPLOAD_DIR, "categories"),
  ];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

/**
 * Save an uploaded file buffer to public/uploads/ folder
 */
export async function saveUploadedFile(
  file: File,
  folder: "products" | "categories" = "products"
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Allowed: JPEG, PNG, WEBP, AVIF`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File exceeds maximum size of 10MB`);
  }

  await ensureUploadDirs();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : ".jpg");
  const randomHash = crypto.randomBytes(12).toString("hex");
  const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const filename = `${safeBaseName}_${randomHash}${ext.toLowerCase()}`;

  const destinationPath = path.join(UPLOAD_DIR, folder, filename);
  await fs.writeFile(destinationPath, buffer);

  const publicUrl = `/uploads/${folder}/${filename}`;

  return {
    url: publicUrl,
    filename,
    size: file.size,
    mimeType: file.type,
  };
}

/**
 * Safely delete an uploaded file from disk
 */
export async function deleteUploadedFile(relativeUrl: string): Promise<boolean> {
  if (!relativeUrl || !relativeUrl.startsWith("/uploads/")) {
    return false;
  }

  try {
    const cleanPath = relativeUrl.replace(/^\//, "");
    const fullPath = path.join(process.cwd(), "public", cleanPath);
    await fs.unlink(fullPath);
    return true;
  } catch {
    return false;
  }
}
