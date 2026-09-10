import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMetaCloudMediaMessage, buildWhatsAppOrderMessage } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      productName,
      sku,
      price,
      discountPrice,
      size,
      colour,
      productUrl,
      imageUrl,
      customerPhone,
    } = body;

    // Retrieve settings
    const settings = await prisma.storeSetting.findMany({
      where: {
        key: {
          in: ["meta_phone_id", "meta_access_token", "whatsapp_number", "store_name", "currency_symbol", "greeting_template"],
        },
      },
    });

    const config: Record<string, string> = {};
    for (const s of settings) config[s.key] = s.value;

    const phoneId = config.meta_phone_id || process.env.WHATSAPP_PHONE_NUMBER_ID;
    const token = config.meta_access_token || process.env.WHATSAPP_API_ACCESS_TOKEN;
    const storePhone = config.whatsapp_number || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP;
    const currency = config.currency_symbol || "₹";
    const greeting = config.greeting_template || "Assalamualaikum,";

    if (!phoneId || !token) {
      return NextResponse.json({
        available: false,
        message: "Meta WhatsApp Cloud API credentials not configured. Using standard WhatsApp Link preview channel.",
      });
    }

    const caption = buildWhatsAppOrderMessage({
      productName,
      sku,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : undefined,
      size,
      colour,
      currency,
      greeting,
      productUrl,
    });

    // Send native media message with product photo to the target recipient (or store)
    const recipient = customerPhone || storePhone;
    if (!recipient) {
      return NextResponse.json({ error: "No recipient phone number provided" }, { status: 400 });
    }

    const result = await sendMetaCloudMediaMessage({
      phoneNumberId: phoneId,
      accessToken: token,
      recipientPhone: recipient,
      imageUrl,
      caption,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: "Direct WhatsApp media message dispatched successfully via Meta Cloud API",
    });
  } catch (error: any) {
    console.error("Meta WhatsApp dispatch error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to send WhatsApp media message" },
      { status: 500 }
    );
  }
}
