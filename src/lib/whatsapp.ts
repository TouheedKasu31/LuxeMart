export interface WhatsAppOrderData {
  productName: string;
  sku: string;
  price: number;
  discountPrice?: number | null;
  currency?: string;
  size?: string;
  colour?: string;
  productUrl: string;
  imageUrl?: string;
  storePhone?: string;
  greeting?: string;
}

/**
 * Format dynamic WhatsApp message text strictly from product & selection data
 */
export function buildWhatsAppOrderMessage(data: WhatsAppOrderData): string {
  const currency = data.currency || "₹";
  const finalPrice = data.discountPrice && data.discountPrice > 0 ? data.discountPrice : data.price;
  const originalPriceStr = data.discountPrice && data.discountPrice > 0 
    ? ` (Original: ${currency}${data.price.toLocaleString("en-IN")})` 
    : "";
  
  const greeting = data.greeting || "Assalamualaikum,";
  
  let message = `${greeting}\nI would like to place an order for the following item:\n\n`;
  message += `▪ *Product:* ${data.productName}\n`;
  message += `▪ *Product ID / SKU:* ${data.sku}\n`;
  message += `▪ *Price:* ${currency}${finalPrice.toLocaleString("en-IN")}${originalPriceStr}\n`;

  if (data.size && data.size.trim() !== "") {
    message += `▪ *Size:* ${data.size}\n`;
  }

  if (data.colour && data.colour.trim() !== "") {
    message += `▪ *Colour:* ${data.colour}\n`;
  }

  if (data.imageUrl && data.imageUrl.trim() !== "") {
    message += `▪ *Image:* ${data.imageUrl}\n`;
  }

  message += `\n🔗 *Product Link:*\n${data.productUrl}\n\n`;
  message += `Please confirm availability and share payment/delivery details. Thank you!`;

  return message;
}

/**
 * Clean phone number to WhatsApp international standard (digits only, e.g. 919876543210)
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Generates the official WhatsApp Click-to-Chat deep link
 */
export function generateWhatsAppLink(data: WhatsAppOrderData): string {
  const rawPhone = data.storePhone || process.env.NEXT_PUBLIC_DEFAULT_WHATSAPP || "919876543210";
  const phone = cleanPhoneNumber(rawPhone);
  const message = buildWhatsAppOrderMessage(data);
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${phone}?text=${encodedMessage}`;
}

/**
 * Meta WhatsApp Cloud API helper
 * Used when merchant configures Meta WhatsApp Cloud API in store settings or .env
 */
export async function sendMetaCloudMediaMessage({
  phoneNumberId,
  accessToken,
  recipientPhone,
  imageUrl,
  caption,
}: {
  phoneNumberId: string;
  accessToken: string;
  recipientPhone: string;
  imageUrl: string;
  caption: string;
}) {
  const cleanPhone = cleanPhoneNumber(recipientPhone);
  const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanPhone,
    type: "image",
    image: {
      link: imageUrl,
      caption: caption,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Meta WhatsApp API error: ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}
