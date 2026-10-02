import { brandImages, imageContacts, motorcycleImages, type ImageAsset } from "@/config/images";
import type { Brand, MotorcycleModel } from "@/lib/types";

/** An image the site may display: a local file whose rights allow it. */
export type ShownImage = ImageAsset & { src: string };

/** The asset if it may be displayed, otherwise undefined. A "permission-required" image is never shown. */
export function shown(asset: ImageAsset | undefined): ShownImage | undefined {
  if (!asset?.src || asset.rightsStatus === "permission-required") return undefined;
  return asset as ShownImage;
}

/**
 * A model's image slot: the manifest entry when one exists, otherwise, for a current Bangladesh
 * model, a pending request for the official photo on its model page. Earlier and other-market
 * models have no slot, so they always show the line drawing.
 */
export function motorcycleImage(model: MotorcycleModel, brandName: string): ImageAsset | undefined {
  const own = motorcycleImages[model.id];
  if (own) return own;
  if (model.status !== "bd-current" || !model.source) return undefined;
  return {
    alt: `${brandName} ${model.name}`,
    imageSource: "official-brand",
    rightsStatus: "permission-required",
    sourceUrl: model.source,
    requestFrom: imageContacts[model.brand],
  };
}

export function brandLogo(brandSlug: string): ImageAsset | undefined {
  return brandImages[brandSlug as keyof typeof brandImages]?.logo;
}

/** Id of the model that represents the brand on cards and the brand page. */
export function brandFeatureModelId(brandSlug: string): string | undefined {
  return brandImages[brandSlug as keyof typeof brandImages]?.featureModel;
}

export interface ImageRequest {
  brand: string;
  kind: "logo" | "motorcycle";
  /** What to ask for, e.g. "Bajaj logo" or "Bajaj Pulsar N160". */
  name: string;
  sourceUrl?: string;
  requestFrom?: string;
}

/** Official images the site has a slot for but may not show yet: the list to send to distributors. */
export function pendingImageRequests(brands: Brand[], models: MotorcycleModel[]): ImageRequest[] {
  const requests: ImageRequest[] = [];
  for (const b of brands) {
    const logo = brandLogo(b.slug);
    if (logo && !shown(logo)) {
      requests.push({ brand: b.slug, kind: "logo", name: logo.alt, sourceUrl: logo.sourceUrl, requestFrom: logo.requestFrom });
    }
    for (const m of models.filter((x) => x.brand === b.slug)) {
      const img = motorcycleImage(m, b.name);
      if (img && !shown(img)) {
        requests.push({ brand: b.slug, kind: "motorcycle", name: img.alt, sourceUrl: img.sourceUrl, requestFrom: img.requestFrom });
      }
    }
  }
  return requests;
}
