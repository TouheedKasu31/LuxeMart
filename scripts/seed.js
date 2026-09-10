const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial store data...");

  // 1. Seed Admin User
  const passwordHash = await bcrypt.hash("admin123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@store.com" },
    update: {
      passwordHash,
      name: "Store Director",
    },
    create: {
      email: "admin@store.com",
      passwordHash,
      name: "Store Director",
      role: "ADMIN",
    },
  });
  console.log("Admin user created/verified: admin@store.com / admin123");

  // 2. Seed Store Settings
  const settings = [
    { key: "store_name", value: "MAISON ÉLÉGANCE" },
    { key: "store_tagline", value: "Timeless Haute Couture & Modern Luxury" },
    { key: "whatsapp_number", value: "919876543210" },
    { key: "currency_symbol", value: "₹" },
    { key: "greeting_template", value: "Assalamualaikum, I would like to place an order for the following item:" },
    { key: "meta_phone_id", value: "" },
    { key: "meta_access_token", value: "" },
  ];

  for (const s of settings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: { key: s.key, value: s.value },
    });
  }

  // 3. Seed Categories
  const categoriesData = [
    {
      name: "Shirts & Tops",
      slug: "shirts-and-tops",
      description: "Crisp cottons, relaxed silhouettes, and luxury oversized cuts tailored for everyday perfection.",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
      sortOrder: 1,
    },
    {
      name: "Kurtas & Traditional",
      slug: "kurtas-and-traditional",
      description: "Handcrafted pure linen and jacquard kurtas blending regal heritage with modern finesse.",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
      sortOrder: 2,
    },
    {
      name: "Abayas & Modest Wear",
      slug: "abayas-and-modest-wear",
      description: "Graceful cuts, premium Nidha & Korean georgette fabrics with minimalist embroidery.",
      image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80",
      sortOrder: 3,
    },
    {
      name: "Trousers & Chinos",
      slug: "trousers-and-chinos",
      description: "Precision-tailored pleated trousers and stretch Italian cotton casual chinos.",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      sortOrder: 4,
    },
    {
      name: "Blazers & Suits",
      slug: "blazers-and-suits",
      description: "Structured double-breasted blazers and relaxed seasonal linen jackets.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
      sortOrder: 5,
    },
    {
      name: "Hijabs & Accessories",
      slug: "hijabs-and-accessories",
      description: "Breathable modal, premium chiffon, and silk touch hijabs and luxury stoles.",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
      sortOrder: 6,
    },
  ];

  const categoryMap = {};
  for (const cat of categoriesData) {
    const createdCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryMap[cat.slug] = createdCat.id;
  }
  console.log("Categories seeded successfully.");

  // 4. Seed Products
  const productsData = [
    {
      sku: "SH-102",
      name: "Black Oversized Poplin Shirt",
      slug: "black-oversized-poplin-shirt",
      description: "An architectural masterpiece crafted from 100% long-staple organic cotton poplin. Features dropped shoulders, a relaxed cuban collar, tonal mother-of-pearl buttons, and a clean curved hem designed to drape effortlessly over any silhouette.",
      details: "Fabric: 100% Organic Cotton Poplin\nFit: Relaxed Oversized Fit\nCare: Machine wash cold gentle, hang dry in shade\nModel wears size L (Height: 6'1\")",
      categorySlug: "shirts-and-tops",
      price: 1899,
      discountPrice: 1499,
      stock: 35,
      availability: true,
      featured: true,
      newArrival: true,
      images: [
        {
          imageUrl: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
          displayOrder: 1,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
          displayOrder: 2,
        },
      ],
      variants: [
        { size: "S", colour: "Pitch Black", stock: 8 },
        { size: "M", colour: "Pitch Black", stock: 12 },
        { size: "L", colour: "Pitch Black", stock: 10 },
        { size: "XL", colour: "Pitch Black", stock: 5 },
        { size: "M", colour: "Off White", stock: 7 },
        { size: "L", colour: "Off White", stock: 6 },
      ],
    },
    {
      sku: "KT-204",
      name: "Royal Heritage Embroidered Kurta",
      slug: "royal-heritage-embroidered-kurta",
      description: "Sophisticated luxury crafted in rich breathable pure linen with subtle tonal hand-embroidery around the placket and mandarin collar. Designed for celebratory evenings, Friday prayers, and formal gatherings.",
      details: "Fabric: 100% Premium Belgian Linen\nStyle: Straight cut side slits, welt side pockets\nCare: Dry clean recommended or delicate hand wash\nCraft: Hand-finished collar detail",
      categorySlug: "kurtas-and-traditional",
      price: 2699,
      discountPrice: 1999,
      stock: 24,
      availability: true,
      featured: true,
      newArrival: false,
      images: [
        {
          imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      variants: [
        { size: "M", colour: "Deep Emerald", stock: 6 },
        { size: "L", colour: "Deep Emerald", stock: 8 },
        { size: "XL", colour: "Deep Emerald", stock: 4 },
        { size: "M", colour: "Ivory Cream", stock: 5 },
        { size: "L", colour: "Ivory Cream", stock: 7 },
      ],
    },
    {
      sku: "AB-501",
      name: "Midnight Nidha Open-Front Abaya",
      slug: "midnight-nidha-open-front-abaya",
      description: "Epitome of timeless modesty. Cut from authentic Korean Nidha fabric celebrated for its fluid drape and cooling comfort. Features concealed snap buttons down the front, elegant cuff detailing, and includes a matching premium chiffon sheila/hijab.",
      details: "Fabric: 100% Premium Grade Korean Nidha\nSet Includes: Abaya + Coordinating Hijab\nLength Options: Regular drape\nCare: Hand wash or gentle machine wash cold",
      categorySlug: "abayas-and-modest-wear",
      price: 3499,
      discountPrice: 2899,
      stock: 18,
      availability: true,
      featured: true,
      newArrival: true,
      images: [
        {
          imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      variants: [
        { size: "52 (Petite)", colour: "Midnight Black", stock: 4 },
        { size: "54 (Regular)", colour: "Midnight Black", stock: 6 },
        { size: "56 (Tall)", colour: "Midnight Black", stock: 5 },
        { size: "54 (Regular)", colour: "Dusty Mocca", stock: 3 },
      ],
    },
    {
      sku: "TR-308",
      name: "Pleated Relaxed Italian Cotton Trousers",
      slug: "pleated-relaxed-italian-cotton-trousers",
      description: "Meticulously constructed high-rise tailored trousers with double forward pleats and extended tab closure. Provides a generous drape through the thigh tapering smoothly to a clean cuff.",
      details: "Fabric: 98% Brushed Cotton Twill, 2% Elastane\nRise: High rise with side adjusters\nCare: Dry clean or cold machine wash inside out",
      categorySlug: "trousers-and-chinos",
      price: 2499,
      discountPrice: null,
      stock: 20,
      availability: true,
      featured: false,
      newArrival: true,
      images: [
        {
          imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      variants: [
        { size: "30", colour: "Sand Khaki", stock: 5 },
        { size: "32", colour: "Sand Khaki", stock: 7 },
        { size: "34", colour: "Sand Khaki", stock: 4 },
        { size: "32", colour: "Charcoal Grey", stock: 4 },
      ],
    },
    {
      sku: "BL-402",
      name: "Structured Tailored Wool-Blend Blazer",
      slug: "structured-tailored-wool-blend-blazer",
      description: "An impeccably sculpted blazer with defined shoulders and peak lapels. Crafted with an internal half-canvas build ensuring it contours naturally to your form over time.",
      details: "Composition: 60% Wool, 38% Poly, 2% Spandex\nLining: 100% Cupro silk feel\nFeatures: Functional internal passport pocket, dual back vents",
      categorySlug: "blazers-and-suits",
      price: 5499,
      discountPrice: 4299,
      stock: 12,
      availability: true,
      featured: true,
      newArrival: false,
      images: [
        {
          imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
          displayOrder: 0,
        },
        {
          imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
          isPrimary: false,
          displayOrder: 1,
        },
      ],
      variants: [
        { size: "38R", colour: "Navy Melange", stock: 3 },
        { size: "40R", colour: "Navy Melange", stock: 5 },
        { size: "42R", colour: "Navy Melange", stock: 4 },
      ],
    },
    {
      sku: "HJ-605",
      name: "Premium Bamboo Modal Breathable Hijab",
      slug: "premium-bamboo-modal-breathable-hijab",
      description: "Ultra-soft, lightweight bamboo modal fabric with a natural drape that stays in place all day without pins. Temperature regulating and gentle on hair.",
      details: "Fabric: 100% Organic Bamboo Modal\nDimensions: 190cm x 80cm\nCare: Hand wash cold with mild detergent",
      categorySlug: "hijabs-and-accessories",
      price: 899,
      discountPrice: 699,
      stock: 45,
      availability: true,
      featured: false,
      newArrival: true,
      images: [
        {
          imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
          isPrimary: true,
          displayOrder: 0,
        },
      ],
      variants: [
        { size: "One Size", colour: "Pecan Nude", stock: 15 },
        { size: "One Size", colour: "Oat Milk", stock: 18 },
        { size: "One Size", colour: "Slate Grey", stock: 12 },
      ],
    },
  ];

  for (const prod of productsData) {
    const categoryId = categoryMap[prod.categorySlug];
    if (!categoryId) continue;

    const createdProduct = await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        details: prod.details,
        categoryId,
        price: prod.price,
        discountPrice: prod.discountPrice,
        stock: prod.stock,
        availability: prod.availability,
        featured: prod.featured,
        newArrival: prod.newArrival,
      },
      create: {
        sku: prod.sku,
        name: prod.name,
        slug: prod.slug,
        description: prod.description,
        details: prod.details,
        categoryId,
        price: prod.price,
        discountPrice: prod.discountPrice,
        stock: prod.stock,
        availability: prod.availability,
        featured: prod.featured,
        newArrival: prod.newArrival,
      },
    });

    // Delete existing images & variants to re-seed cleanly
    await prisma.productImage.deleteMany({ where: { productId: createdProduct.id } });
    for (const img of prod.images) {
      await prisma.productImage.create({
        data: {
          productId: createdProduct.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          displayOrder: img.displayOrder,
        },
      });
    }

    await prisma.productVariant.deleteMany({ where: { productId: createdProduct.id } });
    for (const v of prod.variants) {
      await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          size: v.size,
          colour: v.colour,
          stock: v.stock,
        },
      });
    }
  }

  console.log("Products and variants seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
