import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import slugify from "slugify";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: { availability: true },
          include: { images: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
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
    const data = await req.json();
    const { name, description, image, isActive, sortOrder } = data;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    let slug = existing.slug;
    if (name && name.trim() !== existing.name) {
      slug = slugify(name, { lower: true, strict: true });
      const slugConflict = await prisma.category.findFirst({
        where: { slug, id: { not: id } },
      });
      if (slugConflict) {
        slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name ? name.trim() : existing.name,
        slug,
        description: description !== undefined ? description?.trim() : existing.description,
        image: image !== undefined ? image : existing.image,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
        sortOrder: sortOrder !== undefined ? Number(sortOrder) : existing.sortOrder,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update category:", error);
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
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

    // Check if category has products
    const productCount = await prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category: ${productCount} product(s) are assigned to this category. Reassign or delete them first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete category:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
