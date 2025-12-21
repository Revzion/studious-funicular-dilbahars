import ProductDetail from '@/components/products/ProductDetail';
import React from 'react';
import { getProductByCustomUrl } from '@/services/productServices'; // Update with your actual service path

// ✅ Generate dynamic metadata
export async function generateMetadata({ params }) {
  const { id } = params;

  try {
    const data = await getProductByCustomUrl(id);
    const product = data.product || data;

    if (!product) {
      return {
        title: "Product Not Found - Dilbahar's",
        description: "The requested product could not be found.",
      };
    }

    // ✅ Collect keywords from product and all subproducts
    const mainKeywords = Array.isArray(product.keywords) ? product.keywords : [];

    const subKeywords = Array.isArray(product.subproduct)
      ? product.subproduct.flatMap((sub) =>
          Array.isArray(sub.keywords) ? sub.keywords : []
        )
      : [];

    const allKeywords = Array.from(new Set([...mainKeywords, ...subKeywords])).join(', ');

    return {
      title: product.metaTitle || product.title || product.name || "Dilbahar's",
      description:
        product.metaDescription ||
        product.description?.replace(/<[^>]*>/g, '').substring(0, 160) ||
        "Dilbahar's",
      keywords: allKeywords,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: "Dilbahar's",
      description: "Dilbahar's",
    };
  }
}

// ✅ Page component
export default function page() {
  return (
    <>
      <ProductDetail />
    </>
  );
}
