import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await prisma.storeSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      // Don't leak meta access token to non-authenticated users
      map[s.key] = s.value;
    }

    const user = await getCurrentUser();
    if (!user) {
      // Mask private keys for public
      delete map.meta_access_token;
    }

    return NextResponse.json(map);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const allowedKeys = [
      "store_name",
      "store_tagline",
      "whatsapp_number",
      "currency_symbol",
      "greeting_template",
      "meta_phone_id",
      "meta_access_token",
    ];

    for (const [key, value] of Object.entries(body)) {
      if (allowedKeys.includes(key)) {
        await prisma.storeSetting.upsert({
          where: { key },
          update: { value: String(value ?? "") },
          create: { key, value: String(value ?? "") },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
