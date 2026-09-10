import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductDetailsClient from "./ProductDetailsClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { sku: slug }, { id: slug }],
    },
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
      },
      category: true,
    },
  });

  if (!product) {
    return {
      title: "Product Not Found | MAISON ÉLÉGANCE",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const primaryImg = product.images[0]?.imageUrl || "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80";
  const absoluteImageUrl = primaryImg.startsWith("http") ? primaryImg : `${siteUrl}${primaryImg}`;
  const canonicalUrl = `${siteUrl}/product/${product.slug}`;

  const priceFormatted = `₹${(product.discountPrice || product.price).toLocaleString("en-IN")}`;
  const description = `${product.name} (SKU: ${product.sku}). ${priceFormatted}. ${product.description.slice(0, 160)}`;

  return {
    title: `${product.name} | MAISON ÉLÉGANCE`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${product.name} - ${priceFormatted} | MAISON ÉLÉGANCE`,
      description,
      url: canonicalUrl,
      siteName: "MAISON ÉLÉGANCE",
      images: [
        {
          url: absoluteImageUrl,
          width: 1000,
          height: 1200,
          alt: `${product.name} - Product Image`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} - ${priceFormatted}`,
      description,
      images: [absoluteImageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { sku: slug }, { id: slug }],
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
    notFound();
  }

  // Related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      availability: true,
    },
    take: 4,
    include: {
      category: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { displayOrder: "asc" }],
      },
      variants: true,
    },
  });

  // Fetch store phone setting
  const phoneSetting = await prisma.storeSetting.findUnique({
    where: { key: "whatsapp_number" },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
      siteUrl={siteUrl}
      storePhone={phoneSetting?.value}
    />
  );
}
