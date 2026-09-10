import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/storage";
import slugify from "slugify";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }, { sku: id }],
      },
      include: {
        category: true,
        images: {
          orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
        },
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
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

    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { images: true, variants: true },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check SKU conflict
    if (sku && sku.trim().toUpperCase() !== existingProduct.sku) {
      const skuConflict = await prisma.product.findFirst({
        where: { sku: sku.trim().toUpperCase(), id: { not: id } },
      });
      if (skuConflict) {
        return NextResponse.json(
          { error: `SKU "${sku}" is already in use by another product.` },
          { status: 400 }
        );
      }
    }

    // Slug management
    let slug = existingProduct.slug;
    if (name && name.trim() !== existingProduct.name) {
      const baseSlug = slugify(name, { lower: true, strict: true });
      slug = baseSlug;
      const slugConflict = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugConflict) {
        slug = `${baseSlug}-${id.slice(-4)}`;
      }
    }

    // Update main product details
    const updated = await prisma.product.update({
      where: { id },
      data: {
        sku: sku ? sku.trim().toUpperCase() : existingProduct.sku,
        name: name ? name.trim() : existingProduct.name,
        slug,
        categoryId: categoryId || existingProduct.categoryId,
        description: description !== undefined ? description?.trim() : existingProduct.description,
        details: details !== undefined ? details?.trim() : existingProduct.details,
        price: price !== undefined ? Number(price) : existingProduct.price,
        discountPrice: discountPrice !== undefined ? (discountPrice ? Number(discountPrice) : null) : existingProduct.discountPrice,
        stock: stock !== undefined ? Number(stock) : existingProduct.stock,
        availability: availability !== undefined ? Boolean(availability) : existingProduct.availability,
        featured: featured !== undefined ? Boolean(featured) : existingProduct.featured,
        newArrival: newArrival !== undefined ? Boolean(newArrival) : existingProduct.newArrival,
      },
    });

    // Update images if provided
    if (images && Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        await prisma.productImage.create({
          data: {
            productId: id,
            imageUrl: img.imageUrl,
            isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
            displayOrder: i,
          },
        });
      }
    }

    // Update variants if provided
    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({ where: { productId: id } });
      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: id,
            size: v.size?.trim() || "Free Size",
            colour: v.colour?.trim() || "Standard",
            stock: Number(v.stock) || 10,
          },
        });
      }
    }

    const result = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }] },
        variants: true,
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Clean up local uploaded files
    for (const img of product.images) {
      if (img.imageUrl.startsWith("/uploads/")) {
        await deleteUploadedFile(img.imageUrl);
      }
    }

    // Cascade deletes product images and variants
    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
