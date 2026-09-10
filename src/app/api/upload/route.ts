import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const folder = (formData.get("folder") as string) || "products";
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      const singleFile = formData.get("file") as File;
      if (singleFile) {
        files.push(singleFile);
      }
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploaded = [];
    for (const file of files) {
      if (file && typeof file === "object" && "arrayBuffer" in file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
        }
        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
        }

        // Convert file to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
          folder: `store/${folder}`,
          resource_type: "image",
          transformation: [
            { quality: "auto:good" },
            { fetch_format: "auto" },
          ],
        });

        uploaded.push({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        });
      }
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
