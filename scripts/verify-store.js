const http = require("http");

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("==================================================");
  console.log("   AUTOMATED VERIFICATION OF STORE & WHATSAPP     ");
  console.log("==================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Check Categories API
  console.log("--- 1. Testing Categories API ---");
  const catRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/categories",
    method: "GET",
  });
  assert(catRes.statusCode === 200, "Categories API returns HTTP 200");
  const categories = JSON.parse(catRes.body);
  assert(Array.isArray(categories) && categories.length >= 6, `Categories loaded dynamically (${categories.length} categories found)`);
  assert(categories.some((c) => c.slug === "shirts-and-tops"), "Category 'shirts-and-tops' exists");

  // 2. Check Products API
  console.log("\n--- 2. Testing Products API ---");
  const prodRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/products",
    method: "GET",
  });
  assert(prodRes.statusCode === 200, "Products API returns HTTP 200");
  const products = JSON.parse(prodRes.body);
  assert(Array.isArray(products) && products.length >= 6, `Products loaded dynamically (${products.length} products found)`);
  
  const productA = products.find((p) => p.sku === "SH-102");
  const productB = products.find((p) => p.sku === "KT-204");
  assert(!!productA, "Product A (Black Oversized Poplin Shirt, SKU: SH-102) present");
  assert(!!productB, "Product B (Royal Heritage Embroidered Kurta, SKU: KT-204) present");
  assert(productA.images.length >= 2, `Product A has multiple images gallery (${productA.images.length} images)`);
  assert(productA.variants.length >= 4, `Product A has dynamic variants (${productA.variants.length} variants)`);

  // 3. Check Open Graph & SEO on Product A
  console.log("\n--- 3. Testing WhatsApp Open Graph Meta Tags (Product A) ---");
  const pageARes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/product/${productA.slug}`,
    method: "GET",
  });
  assert(pageARes.statusCode === 200, `Product A page (/product/${productA.slug}) returns HTTP 200`);
  assert(pageARes.body.includes('property="og:title" content="Black Oversized Poplin Shirt'), "Product A has og:title with product name");
  assert(pageARes.body.includes('property="og:image"'), "Product A has og:image meta tag for WhatsApp preview");
  assert(pageARes.body.includes(encodeURI(productA.slug)) || pageARes.body.includes(productA.slug), "Product A has canonical product URL");
  assert(pageARes.body.includes("SH-102"), "Product A HTML includes exact SKU SH-102");

  // 4. Check Open Graph & SEO on Product B (Guarantee no cross-contamination)
  console.log("\n--- 4. Testing WhatsApp Open Graph Meta Tags (Product B) ---");
  const pageBRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/product/${productB.slug}`,
    method: "GET",
  });
  assert(pageBRes.statusCode === 200, `Product B page (/product/${productB.slug}) returns HTTP 200`);
  assert(pageBRes.body.includes('property="og:title" content="Royal Heritage Embroidered Kurta'), "Product B has og:title with product name");
  assert(pageBRes.body.includes("KT-204"), "Product B HTML includes exact SKU KT-204");
  assert(!pageBRes.body.includes("SH-102"), "Product B does NOT contain Product A's SKU (zero cross contamination)");

  // 5. Check Admin Authentication
  console.log("\n--- 5. Testing Admin Authentication ---");
  const loginPayload = JSON.stringify({ email: "admin@store.com", password: "admin123" });
  const loginRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/auth/login",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(loginPayload),
      },
    },
    loginPayload
  );
  assert(loginRes.statusCode === 200, "Admin login succeeds with valid credentials");
  const setCookie = loginRes.headers["set-cookie"];
  assert(!!setCookie && setCookie.some((c) => c.includes("admin_auth_token")), "Secure admin_auth_token cookie set");
  const authCookie = setCookie.find((c) => c.includes("admin_auth_token")).split(";")[0];

  // 6. Check Auth Session Verification
  const meRes = await request({
    hostname: "localhost",
    port: 3000,
    path: "/api/auth/me",
    method: "GET",
    headers: { Cookie: authCookie },
  });
  assert(meRes.statusCode === 200, "/api/auth/me validates session");
  const meData = JSON.parse(meRes.body);
  assert(meData.authenticated === true && meData.user.email === "admin@store.com", "Session belongs to Store Admin");

  // 7. Test Admin Product Lifecycle (CRUD)
  console.log("\n--- 6. Testing Product CRUD (Create, Read, Update, Delete) ---");
  const testProductPayload = JSON.stringify({
    name: "Verification Linen Safari Jacket",
    sku: "TEST-SAFARI-99",
    categoryId: categories[0].id,
    description: "Automated test item verifying full CRUD lifecycle.",
    details: "Fabric: 100% Linen",
    price: 3299,
    discountPrice: 2899,
    stock: 20,
    availability: true,
    featured: true,
    newArrival: true,
    images: [
      { imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80", isPrimary: true },
    ],
    variants: [
      { size: "L", colour: "Sand Tan", stock: 10 },
      { size: "XL", colour: "Sand Tan", stock: 10 },
    ],
  });

  const createRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: "/api/products",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(testProductPayload),
        Cookie: authCookie,
      },
    },
    testProductPayload
  );
  assert(createRes.statusCode === 201, "Admin creates new product (HTTP 201 Created)");
  const createdProd = JSON.parse(createRes.body);
  assert(createdProd.sku === "TEST-SAFARI-99", "Created product has SKU TEST-SAFARI-99");

  // Update Product Price
  const updatePayload = JSON.stringify({
    price: 3499,
    discountPrice: 2999,
    stock: 18,
  });
  const updateRes = await request(
    {
      hostname: "localhost",
      port: 3000,
      path: `/api/products/${createdProd.id}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(updatePayload),
        Cookie: authCookie,
      },
    },
    updatePayload
  );
  assert(updateRes.statusCode === 200, "Admin updates product price and stock (HTTP 200)");
  const updatedProd = JSON.parse(updateRes.body);
  assert(updatedProd.price === 3499, `Updated price is ₹${updatedProd.price}`);

  // Delete Product
  const deleteRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/products/${createdProd.id}`,
    method: "DELETE",
    headers: { Cookie: authCookie },
  });
  assert(deleteRes.statusCode === 200, "Admin safely deletes product (HTTP 200)");

  // Verify it is gone
  const checkDeletedRes = await request({
    hostname: "localhost",
    port: 3000,
    path: `/api/products/${createdProd.id}`,
    method: "GET",
  });
  assert(checkDeletedRes.statusCode === 404, "Deleted product no longer accessible (HTTP 404)");

  // 8. Test Dynamic WhatsApp Message Builder
  console.log("\n--- 7. Testing WhatsApp Dynamic Message Generation ---");
  function buildWhatsAppOrderMessage(data) {
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

    message += `\n🔗 *Product Link & Preview:*\n${data.productUrl}\n\n`;
    message += `Please confirm availability and share payment/delivery details. Thank you!`;

    return message;
  }

  function generateWhatsAppLink(data) {
    const phone = (data.storePhone || "919876543210").replace(/[^0-9]/g, "");
    const message = buildWhatsAppOrderMessage(data);
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }
  
  const msgA = buildWhatsAppOrderMessage({
    productName: "Black Oversized Poplin Shirt",
    sku: "SH-102",
    price: 1899,
    discountPrice: 1499,
    size: "L",
    colour: "Pitch Black",
    productUrl: "http://localhost:3000/product/black-oversized-poplin-shirt",
    currency: "₹",
  });

  assert(msgA.includes("Product:* Black Oversized Poplin Shirt"), "WhatsApp message contains exact product name");
  assert(msgA.includes("Product ID / SKU:* SH-102"), "WhatsApp message contains exact SKU SH-102");
  assert(msgA.includes("Size:* L"), "WhatsApp message contains customer-selected Size L");
  assert(msgA.includes("Colour:* Pitch Black"), "WhatsApp message contains customer-selected Colour Pitch Black");
  assert(msgA.includes("Price:* ₹1,499"), "WhatsApp message contains correct discounted price ₹1,499");
  assert(msgA.includes("http://localhost:3000/product/black-oversized-poplin-shirt"), "WhatsApp message contains canonical product URL for rich preview");

  const linkA = generateWhatsAppLink({
    productName: "Black Oversized Poplin Shirt",
    sku: "SH-102",
    price: 1899,
    discountPrice: 1499,
    size: "L",
    colour: "Pitch Black",
    productUrl: "http://localhost:3000/product/black-oversized-poplin-shirt",
    storePhone: "919876543210",
  });
  assert(linkA.startsWith("https://wa.me/919876543210?text="), "WhatsApp deep link correctly formatted to store phone");

  console.log("\n==================================================");
  console.log(`VERIFICATION COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error("Test runner error:", e);
  process.exit(1);
});
