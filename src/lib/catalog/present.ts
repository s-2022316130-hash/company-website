import type { CartLine } from "@/lib/cart/cart";
import type { ProductView } from "@/lib/types";

/** Short fitment line for cards and the cart, e.g. "Fits Yamaha FZS V3 +1 more". */
export function fitmentSummary(product: ProductView): string {
  const brandName = (slug: string) => product.brands.find((b) => b.slug === slug)?.name ?? "";
  const named = () => {
    const [first, ...rest] = product.models;
    const label = `${brandName(first.brand)} ${first.name}`.trim();
    return rest.length > 0 ? `${label} +${rest.length} more` : label;
  };
  // A universal item can still name the models whose manual recommends it (e.g. an oil grade).
  if (product.fitment === "universal") return product.models.length > 0 ? `Recommended for ${named()}` : "Not model-specific";
  if (product.fitment === "unconfirmed" || product.models.length === 0) return "Fitment not listed";
  return `Fits ${named()}`;
}

/** Card eyebrow: bike brand(s) and part type, e.g. "Yamaha · Brake Pads". */
export function productEyebrow(product: ProductView): string {
  const brandPart =
    product.brands.length === 1 ? product.brands[0].name : product.brands.length > 1 ? "Multiple brands" : undefined;
  return [brandPart, product.subcategoryName ?? product.categoryName].filter(Boolean).join(" · ");
}

export function toCartLine(product: ProductView): Omit<CartLine, "quantity"> {
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    image: product.images[0] ?? (product.displayImage ? { src: product.displayImage.src, alt: "" } : undefined),
    price: product.price,
    fitmentSummary: fitmentSummary(product),
  };
}
