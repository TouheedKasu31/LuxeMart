require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function run() {
  console.log("Upserting new categories...");
  const catWatches = await prisma.category.upsert({
    where: { slug: "watches-and-timepieces" },
    update: {
      name: "Watches & Timepieces",
      description: "Luxury analog timepieces, minimalist dress watches, and precision chronographs.",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      sortOrder: 7,
    },
    create: {
      name: "Watches & Timepieces",
      slug: "watches-and-timepieces",
      description: "Luxury analog timepieces, minimalist dress watches, and precision chronographs.",
      image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      sortOrder: 7,
    },
  });

  const catShoes = await prisma.category.upsert({
    where: { slug: "footwear-and-shoes" },
    update: {
      name: "Footwear & Shoes",
      description: "Premium leather loafers, dress shoes, and casual luxury sneakers.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      sortOrder: 8,
    },
    create: {
      name: "Footwear & Shoes",
      slug: "footwear-and-shoes",
      description: "Premium leather loafers, dress shoes, and casual luxury sneakers.",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      sortOrder: 8,
    },
  });

  console.log("Categories ready:", catWatches.name, catShoes.name);

  // Watch product
  const watch = await prisma.product.upsert({
    where: { sku: "WT-701" },
    update: {
      name: "Chronograph Classic Leather Watch",
      slug: "chronograph-classic-leather-watch",
      description:
        "Sophisticated craftsmanship featuring an ultra-slim stainless steel case, sapphire crystal glass, and a genuine calfskin leather strap. Water-resistant up to 50m with precision quartz chronograph movement.",
      details:
        "Case Size: 40mm\nStrap: Genuine Italian Leather\nGlass: Scratch-resistant Sapphire Crystal\nMovement: Japanese Quartz Chronograph\nWater Resistance: 5 ATM",
      categoryId: catWatches.id,
      price: 3499,
      discountPrice: 2799,
      stock: 18,
      availability: true,
      featured: true,
      newArrival: true,
    },
    create: {
      sku: "WT-701",
      name: "Chronograph Classic Leather Watch",
      slug: "chronograph-classic-leather-watch",
      description:
        "Sophisticated craftsmanship featuring an ultra-slim stainless steel case, sapphire crystal glass, and a genuine calfskin leather strap. Water-resistant up to 50m with precision quartz chronograph movement.",
      details:
        "Case Size: 40mm\nStrap: Genuine Italian Leather\nGlass: Scratch-resistant Sapphire Crystal\nMovement: Japanese Quartz Chronograph\nWater Resistance: 5 ATM",
      categoryId: catWatches.id,
      price: 3499,
      discountPrice: 2799,
      stock: 18,
      availability: true,
      featured: true,
      newArrival: true,
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: watch.id } });
  await prisma.productImage.createMany({
    data: [
      {
        productId: watch.id,
        imageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80",
        isPrimary: true,
        displayOrder: 0,
      },
      {
        productId: watch.id,
        imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80",
        isPrimary: false,
        displayOrder: 1,
      },
    ],
  });

  await prisma.productVariant.deleteMany({ where: { productId: watch.id } });
  await prisma.productVariant.createMany({
    data: [
      { productId: watch.id, size: "One Size", colour: "Rose Gold / Brown Leather", stock: 10 },
      { productId: watch.id, size: "One Size", colour: "Midnight Black / Silver", stock: 8 },
    ],
  });

  // Shoe product
  const shoe = await prisma.product.upsert({
    where: { sku: "SH-801" },
    update: {
      name: "Handcrafted Luxury Leather Loafers",
      slug: "handcrafted-luxury-leather-loafers",
      description:
        "Timeless penny loafers hand-stitched from full-grain supple calfskin leather. Cushioned memory-foam insole and flexible rubber tread for effortless day-to-evening comfort.",
      details:
        "Upper: 100% Full Grain Calfskin Leather\nLining: Breathable Leather\nSole: Durable Rubber & Wood Stack\nFit: Standard UK/India sizing",
      categoryId: catShoes.id,
      price: 4299,
      discountPrice: 3499,
      stock: 22,
      availability: true,
      featured: true,
      newArrival: true,
    },
    create: {
      sku: "SH-801",
      name: "Handcrafted Luxury Leather Loafers",
      slug: "handcrafted-luxury-leather-loafers",
      description:
        "Timeless penny loafers hand-stitched from full-grain supple calfskin leather. Cushioned memory-foam insole and flexible rubber tread for effortless day-to-evening comfort.",
      details:
        "Upper: 100% Full Grain Calfskin Leather\nLining: Breathable Leather\nSole: Durable Rubber & Wood Stack\nFit: Standard UK/India sizing",
      categoryId: catShoes.id,
      price: 4299,
      discountPrice: 3499,
      stock: 22,
      availability: true,
      featured: true,
      newArrival: true,
    },
  });

  await prisma.productImage.deleteMany({ where: { productId: shoe.id } });
  await prisma.productImage.createMany({
    data: [
      {
        productId: shoe.id,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80",
        isPrimary: true,
        displayOrder: 0,
      },
      {
        productId: shoe.id,
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80",
        isPrimary: false,
        displayOrder: 1,
      },
    ],
  });

  await prisma.productVariant.deleteMany({ where: { productId: shoe.id } });
  await prisma.productVariant.createMany({
    data: [
      { productId: shoe.id, size: "UK 7", colour: "Cognac Tan", stock: 4 },
      { productId: shoe.id, size: "UK 8", colour: "Cognac Tan", stock: 6 },
      { productId: shoe.id, size: "UK 9", colour: "Cognac Tan", stock: 6 },
      { productId: shoe.id, size: "UK 8", colour: "Rich Black", stock: 3 },
    ],
  });

  console.log("Successfully seeded Watches and Shoes into Neon PostgreSQL database!");
}

run()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
