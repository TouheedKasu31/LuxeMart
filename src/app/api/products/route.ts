import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import slugify from "slugify";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const categorySlug = searchParams.get("category");
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const size = searchParams.get("size");
    const colour = searchParams.get("colour");
    const availability = searchParams.get("availability");
    const featured = searchParams.get("featured");
    const newArrival = searchParams.get("newArrival");
    const sort = searchParams.get("sort") || "newest";
    const limit = searchParams.get("limit");

    const where: any = {};

    // Availability filter
    if (availability === "true") {
      where.availability = true;
    } else if (availability === "false") {
      where.availability = false;
    }

    // Featured filter
    if (featured === "true") {
      where.featured = true;
    }

    // New Arrival filter
    if (newArrival === "true") {
      where.newArrival = true;
    }

    // Category filter
    if (categoryId) {
      where.categoryId = categoryId;
    } else if (categorySlug && categorySlug !== "all") {
      where.category = { slug: categorySlug };
    }

    // Search query: Name, SKU, or Description
    if (search.trim() !== "") {
      const q = search.trim();
      where.OR = [
        { name: { contains: q } },
        { sku: { contains: q } },
        { description: { contains: q } },
      ];
    }

    // Price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    // Size filter
    if (size && size !== "all") {
      where.variants = {
        some: { size: { equals: size } },
      };
    }

    // Colour filter
    if (colour && colour !== "all") {
      where.variants = {
        ...where.variants,
        some: {
          ...(where.variants?.some || {}),
          colour: { contains: colour },
        },
      };
    }

    // Sorting
    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low") {
      orderBy = { price: "asc" };
    } else if (sort === "price-high") {
      orderBy = { price: "desc" };
    } else if (sort === "name-asc") {
      orderBy = { name: "asc" };
    } else if (sort === "name-desc") {
      orderBy = { name: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      take: limit ? Number(limit) : undefined,
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
        },
        variants: true,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      sku,
      name,
      categoryId,
      description,
      details,
      price,
      discountPrice,
      stock,
      availability,
      featured,
      newArrival,
      images, // array of { imageUrl: string, isPrimary?: boolean }
      variants, // array of { size: string, colour: string, stock?: number }
    } = body;

    if (!name || !sku || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: "Name, SKU, Category, and Price are required" },
        { status: 400 }
      );
    }

    // Check unique SKU
    const existingSku = await prisma.product.findUnique({
      where: { sku: sku.trim().toUpperCase() },
    });
    if (existingSku) {
      return NextResponse.json(
        { error: `A product with SKU "${sku}" already exists.` },
        { status: 400 }
      );
    }

    // Unique slug
    let baseSlug = slugify(name, { lower: true, strict: true });
    let slug = baseSlug;
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${baseSlug}-${sku.trim().toLowerCase()}`;
    }

    const product = await prisma.product.create({
      data: {
        sku: sku.trim().toUpperCase(),
        name: name.trim(),
        slug,
        categoryId,
        description: description?.trim() || "",
        details: details?.trim() || null,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock) || 0,
        availability: availability !== undefined ? Boolean(availability) : true,
        featured: Boolean(featured),
        newArrival: Boolean(newArrival),
        images: {
          create: (images || []).map((img: any, index: number) => ({
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : index === 0,
            displayOrder: index,
          })),
        },
        variants: {
          create: (variants || []).map((v: any) => ({
            size: v.size?.trim() || "Free Size",
            colour: v.colour?.trim() || "Standard",
            stock: Number(v.stock) || 10,
          })),
        },
      },
      include: {
        category: true,
        images: true,
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
