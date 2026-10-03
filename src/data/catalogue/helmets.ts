import type { PartArtKind, Product, ProductSpec } from "@/lib/types";

/**
 * Helmets the shop carries, from the owner's list (2026-10-03), under the names the shop uses.
 *
 * Style (full face, open face…) and certification are recorded only where a page we opened states
 * them (checked 2026-10-03), so a helmet without a source shows no style rather than a guess.
 * Certifications come only from the maker's or an official distributor's page, never a retailer's.
 * Sizes, colours, prices and stock are confirmed by the shop: every helmet is "call-to-confirm".
 */

export type HelmetStyle = "full-face" | "modular" | "open-face" | "half-face" | "off-road" | "dual-sport";

export const helmetStyleLabels: Record<HelmetStyle, string> = {
  "full-face": "Full face",
  modular: "Modular (flip-up)",
  "open-face": "Open face",
  "half-face": "Half face",
  "off-road": "Off-road",
  "dual-sport": "Dual-sport",
};

/** Words riders search with, given only to helmets whose style is sourced. */
const styleAliases: Record<HelmetStyle, string[]> = {
  "full-face": ["full face helmet"],
  modular: ["modular helmet", "flip up helmet"],
  "open-face": ["open face helmet"],
  "half-face": ["half face helmet"],
  "off-road": ["off road helmet", "motocross helmet"],
  "dual-sport": ["dual sport helmet", "adventure helmet"],
};

/** Line drawing for each style (components/parts/PartArt). */
const styleArt: Record<HelmetStyle, PartArtKind> = {
  "full-face": "helmet-full",
  modular: "helmet-modular",
  "open-face": "helmet-open",
  "half-face": "helmet-half",
  "off-road": "helmet-offroad",
  "dual-sport": "helmet-offroad",
};

export interface HelmetModel {
  /** As the shop writes it, brand included, e.g. "Studds Thunder D1". */
  name: string;
  style?: HelmetStyle;
  kids?: boolean;
  /** Page the style (and any certification) comes from. */
  source?: HelmetSource;
  /** Standards stated on the maker's or official distributor's page, e.g. ["ISI", "DOT"]. */
  certifications?: string[];
  /** The maker's or distributor's page stating the certification, when it is not `source`. */
  certificationSource?: HelmetSource & { kind: "official" | "distributor" };
  /** Shown on the product page, e.g. that the name covers several graphic versions. */
  note?: string;
}

export interface HelmetSource {
  url: string;
  kind: "official" | "distributor" | "retailer";
}

export interface HelmetBrand {
  slug: string;
  name: string;
  models: HelmetModel[];
}

const official = (url: string) => ({ url, kind: "official" as const });
const retailer = (url: string) => ({ url, kind: "retailer" as const });

/** Page that states a model's certification: its own `certificationSource`, else `source` unless that is a retailer. */
export function certificationPage(model: HelmetModel): (HelmetSource & { kind: "official" | "distributor" }) | undefined {
  if (model.certificationSource) return model.certificationSource;
  if (model.source && model.source.kind !== "retailer") return { url: model.source.url, kind: model.source.kind };
  return undefined;
}

/** In the owner's order. */
export const helmetBrands: HelmetBrand[] = [
  {
    slug: "studds",
    name: "Studds",
    // D1, D4, D5… are Studds' décor (graphics) versions of a model. shop.studds.com refused our visits,
    // so its pages are cited through the Internet Archive.
    models: [
      { name: "Studds Icon", style: "open-face", source: official("https://www.studds.com/helmet/open-face-helmet/icon") },
      {
        name: "Studds Thunder D1",
        style: "full-face",
        source: official("https://www.studds.com/helmet/full-face-helmet/thunder-d1-decor"),
        certifications: ["ISI", "DOT"],
        certificationSource: official(
          "https://web.archive.org/web/20260219031647/https://shop.studds.com/product-category/helmets/full-face-helmets/thunder/thunder-d1-decor/",
        ),
      },
      {
        name: "Studds Thunder D5",
        style: "full-face",
        certifications: ["ISI", "DOT"],
        source: official("https://www.studds.com/helmet/full-face-helmet/thunder-d5-decor-with-spoiler"),
      },
      {
        name: "Studds Thunder D6",
        style: "full-face",
        source: official("https://www.studds.com/helmet/full-face-helmet/thunder-d6-decor"),
        certifications: ["ISI", "DOT"],
        certificationSource: official(
          "https://web.archive.org/web/20260610191209/https://shop.studds.com/product-category/helmets/full-face-helmets/thunder/thunder-d6-decor/",
        ),
      },
      {
        name: "Studds Thunder D7",
        style: "full-face",
        source: official("https://www.studds.com/helmet/full-face-helmet/thunder-d7-decor"),
        certifications: ["ISI", "DOT"],
        certificationSource: official(
          "https://web.archive.org/web/20260219035606/https://shop.studds.com/product-category/helmets/full-face-helmets/thunder/thunder-d7-decor/",
        ),
      },
      { name: "Studds Urban", style: "open-face", certifications: ["ISI", "DOT"], source: official("https://www.studds.com/helmet/open-face-helmet/urban") },
      { name: "Studds Raider", style: "full-face", certifications: ["ISI"], source: official("https://www.studds.com/helmet/full-face-helmet/raider") },
      { name: "Studds Raider Super", style: "full-face", certifications: ["ISI"], source: official("https://www.studds.com/helmet/full-face-helmet/raider-super") },
      // Studds names it the Trooper DV.
      { name: "Studds Trooper", style: "modular", certifications: ["ISI", "DOT"], source: official("https://www.studds.com/helmet/flip-up-full-face-helmet/trooper-dv") },
      {
        name: "Studds Ninja D4",
        style: "modular",
        certifications: ["ISI"],
        source: official(
          "https://web.archive.org/web/20260610180126/https://shop.studds.com/product-category/helmets/flip-up-full-face-helmets/ninja/ninja-d4-decor/",
        ),
      },
      // "X-Trooper" is a name Bangladeshi sellers use; Studds' sites do not, so only the style is recorded.
      { name: "Studds X-Trooper DV D2", style: "modular", source: retailer("https://www.rokomari.com/product/418992/x-trooper-dv-d2-decor-modular-full-face-bike-helmet") },
    ],
  },
  {
    slug: "vega",
    name: "Vega",
    models: [
      { name: "Vega Bolt", style: "full-face", certifications: ["ISI", "DOT"], source: official("https://vegaauto.com/products/bolt-bull-helmet-copy") },
      {
        name: "Vega Bolt Marvel",
        style: "full-face",
        certifications: ["ISI", "DOT"],
        source: official("https://vegaauto.com/products/bolt-marvel-captain-america-edition-helmet"),
        note: "Vega makes the Bolt Marvel in more than one licensed design. Ask which designs the shop has.",
      },
      { name: "Vega Bolt Superhero", style: "full-face", certifications: ["ISI", "DOT"], source: official("https://vegaauto.com/products/bolt-superhero-helmet") },
      { name: "Vega Bolt Crown", style: "full-face", source: retailer("https://phoenixprobiking.com/products/vega-bolt-crown-men-full-face-helmet") },
      { name: "Vega Bolt Octopus", style: "full-face", source: retailer("https://phoenixprobiking.com/products/vega-bolt-octopus-full-face-helmet") },
      { name: "Vega Bolt Bunny", style: "full-face", source: official("https://vegaauto.com/products/bolt-bunny") },
      { name: "Vega Jeet" },
      { name: "Vega Lark", style: "open-face", certifications: ["ISI"], source: official("https://vegaauto.com/products/lark-helmet") },
      { name: "Vega Verve", style: "open-face", certifications: ["ISI"], source: official("https://vegaauto.com/products/verve-helmet") },
      { name: "Vega Jet", style: "open-face", certifications: ["ISI"], source: official("https://vegaauto.com/products/jet-w-visor-helmet") },
      { name: "Vega Jet Star", style: "open-face", certifications: ["ISI"], source: official("https://vegaauto.com/products/jet-star-w-visor-helmet") },
    ],
  },
  {
    slug: "steelbird",
    name: "Steelbird",
    // steelbirdhelmet.com files each model under Full Face, Open Face or Flip-up in its listings; the
    // certification is on the model's own page. "SB2" and "SB8" are not names on Steelbird's site.
    models: [
      { name: "Steelbird Air SB2", style: "full-face", source: retailer("https://www.bdstall.com/details/steelbird-air-sb2-matt-black-full-face-bike-helmet-141219/") },
      {
        name: "Steelbird SBA-20",
        style: "modular",
        source: official("https://steelbirdhelmet.com/productlisting/?category=helmets&subcategory=flip-up"),
        certifications: ["ISI"],
        certificationSource: official("https://steelbirdhelmet.com/productlisting/details/?slug=sba-20-sv-09"),
      },
      // No longer in Steelbird's catalogue; this is the archived copy of its page.
      {
        name: "Steelbird SBA-1",
        style: "full-face",
        certifications: ["ISI"],
        source: official(
          "https://web.archive.org/web/20250421050024/https://www.steelbirdhelmet.com/product/3665/5/steelbird-sba-1-boon-dashing-isi-certified-full-face-helmet-for-men-and-women-with-inner-smoke-sun-shield--dashing-black-",
        ),
      },
      {
        name: "Steelbird SBH-25 Sharp",
        style: "full-face",
        source: official("https://steelbirdhelmet.com/productlisting/?category=helmets&subcategory=full-face-1"),
        certifications: ["ISI"],
        certificationSource: official("https://steelbirdhelmet.com/productlisting/details/?slug=sbh-25-dv-sharp-dashing"),
      },
      // Steelbird sells the SBH-56 as the "SBH-56 Vintage" in several graphics.
      {
        name: "Steelbird SBH-56 Vintez",
        style: "open-face",
        source: official("https://steelbirdhelmet.com/productlisting/?category=helmets&subcategory=open-face-1"),
        certifications: ["ISI"],
        certificationSource: official("https://steelbirdhelmet.com/productlisting/details/?slug=sbh-56-vintage-skull"),
      },
      { name: "Steelbird SB8", style: "modular", source: retailer("https://www.rokomari.com/product/434128/steelbird-sb8-modular-full-face-bike-helmet") },
    ],
  },
  {
    slug: "torq",
    name: "Torq",
    // Speedoz Limited (speedoz.com.bd) owns the TORQ brand. Its EVO page gives the certifications but not
    // the style, and retailers disagree on it, so the EVO has no style.
    models: [
      {
        name: "Torq EVO",
        certifications: ["DOT", "BSTI"],
        certificationSource: official("https://speedoz.com.bd/product/torq-evo-element-gloss-grey-black/"),
      },
      {
        name: "Torq Ranger",
        style: "full-face",
        source: official("https://web.archive.org/web/20230131123213/https://speedoz.com.bd/product-category/helmets/torq-helmets/full-face/"),
        certifications: ["DOT", "BSTI"],
        certificationSource: official("https://speedoz.com.bd/product/torq-ranger-brexter-orange-navy-blue/"),
      },
    ],
  },
  {
    slug: "axor",
    name: "Axor",
    // Vivid, Hunter, Camo and Okami are graphics on Axor's Apex and Street models.
    models: [
      { name: "Axor Apex Vivid", style: "full-face", certifications: ["ISI", "DOT", "ECE 22.06"], source: official("https://axorhelmets.com/products/apex-vivid-helmet") },
      {
        name: "Axor Apex XBHP",
        style: "full-face",
        source: official("https://axorhelmets.com/collections/axor-xbhp"),
        certifications: ["ISI", "DOT", "ECE 22.06"],
        certificationSource: official("https://axorhelmets.com/products/axor-xbhp-speed-of-thought-helmet"),
        note: "Axor makes more than one xBhp helmet, such as the Speed of Thought and the Bionic. Ask which one the shop has.",
      },
      { name: "Axor Apex Hunter", style: "full-face", certifications: ["ISI", "DOT", "ECE 22.06"], source: official("https://axorhelmets.com/products/apex-hunter-helmet") },
      // The Camo graphic is not on Axor's site; the Street model is filed as a full-face helmet.
      { name: "Axor Street Camo", style: "full-face", source: official("https://axorhelmets.com/collections/axor-street") },
      // No longer on Axor's site; this is the archived copy of its page.
      {
        name: "Axor Street Okami",
        style: "full-face",
        certifications: ["ISI", "DOT", "ECE 22.05"],
        source: official("https://web.archive.org/web/20240301171746/https://axorhelmets.com/products/axor-street-okami"),
      },
    ],
  },
  {
    slug: "ls2",
    name: "LS2",
    models: [
      { name: "LS2 Rapid", style: "full-face", certifications: ["ECE 22.05"], source: official("https://ls2helmets.com/helmets/full-face/rapid") },
      {
        name: "LS2 Stream",
        style: "full-face",
        source: official("https://ls2helmets.com/helmets/full-face/stream"),
        note: "LS2 has made the Stream in more than one version, such as the Stream EVO and Stream II. Ask which one the shop has.",
      },
      { name: "LS2 Rookie", style: "full-face", source: retailer("https://www.tradeinn.com/motardinn/en/ls2-ff352-rookie-infinite-full-face-helmet/136336720/p") },
      { name: "LS2 FF800 Storm", style: "full-face", certifications: ["ECE 22.05"], source: official("https://ls2helmets.com/helmets/full-face/storm") },
    ],
  },
  {
    slug: "mt",
    name: "MT Helmets",
    // MT's China site (mthelmets.com.cn) names the Thunder 3 and Blade 2 the Thunder 3 SV and Blade 2 SV.
    models: [
      { name: "MT Thunder 3", style: "full-face", certifications: ["DOT"], source: official("https://www.mthelmets.com.cn/en/product/thunder-3-sv/") },
      { name: "MT Hummer", style: "full-face", source: retailer("https://www.tradeinn.com/motardinn/en/mt-helmets-hummer-full-face-helmet/139229288/p") },
      {
        name: "MT Stinger 2",
        style: "full-face",
        source: official("https://mthelmets.com/en/collections/stinger-2"),
        certifications: ["ECE 22.06"],
        certificationSource: official("https://mthelmets.com/en/products/stinger-2-pure-a1-matt"),
      },
      { name: "MT Blade 2", style: "full-face", certifications: ["DOT"], source: official("https://www.mthelmets.com.cn/en/product/blade-2-sv/") },
    ],
  },
  {
    slug: "smk",
    name: "SMK",
    // smkhelmets.com shows a bot check instead of its pages, so these styles come from retailers.
    models: [
      { name: "SMK Stellar", style: "full-face", source: retailer("https://revco.ca/products/smk-stellar-solid-full-face-helmet") },
      { name: "SMK Typhoon", style: "full-face", source: retailer("https://www.24mx.com/en-us/product/smk-typhoon-solid-full-face-helmet/PM-4981813") },
      { name: "SMK Twister", style: "full-face", source: retailer("https://ridersjunction.com/products/smk-twister-dragon-helmet-gl758") },
      { name: "SMK Gullwing", style: "modular", source: retailer("https://www.24mx.com/en-us/product/smk-gullwing-solid-modular-helmet/PM-4981808") },
    ],
  },
  {
    slug: "kyt",
    name: "KYT",
    models: [
      { name: "KYT TT Course", style: "full-face", certifications: ["ECE 22.06"], source: official("https://kytasia.com/tt-course/") },
      // tarakusuma.com is PT Tarakusuma Indah, the company that makes KYT helmets.
      { name: "KYT NF-R", style: "full-face", source: official("https://tarakusuma.com/detail/nf-r") },
      // KYT's 2020 catalogue calls it a jet (open face) helmet; it is not on KYT's current sites.
      { name: "KYT Hellcat", style: "open-face", source: official("https://www.suomy.com/wp-content/uploads/2020/07/Catalogo_KYT_2020.pdf") },
      { name: "KYT Strike Eagle", style: "off-road", source: official("https://tarakusuma.com/detail/strike-eagle") },
    ],
  },
  {
    slug: "hjc",
    name: "HJC",
    models: [
      { name: "HJC C10", style: "full-face", certifications: ["ECE 22.06"], source: official("https://hjchelmets.eu/pages/c10-ull-face-sporty-motorcycle-helmet") },
      { name: "HJC C70N", style: "full-face", source: retailer("https://www.24mx.com/en-us/product/hjc-c70n-full-face-helmet/PM-4974068") },
      { name: "HJC i70", style: "full-face", source: official("https://hjchelmets.us/blogs/news/hjc-i70") },
      { name: "HJC i71", style: "full-face", certifications: ["ECE 22.06"], source: official("https://hjchelmets.eu/pages/i71-full-face-motorcycle-helmet-hjc") },
    ],
  },
  {
    slug: "bilmola",
    name: "Bilmola",
    models: [
      // Filed under Full Face on bilmola.com, with "Standard Certificate: ECE R22.05" in its specification.
      { name: "Bilmola Defender", style: "full-face", certifications: ["ECE 22.05"], source: official("https://www.bilmola.com/product-category/full-face/defender/") },
      // No Storm or Phantom model on Bilmola's site or its distributors' (checked 2026-10-03); possibly graphic names.
      { name: "Bilmola Storm" },
      { name: "Bilmola Phantom" },
    ],
  },
  {
    slug: "agv",
    name: "AGV",
    models: [
      { name: "AGV K1 S", style: "full-face", certifications: ["ECE 22.06"], source: official("https://www.agv.com/us/en/full-face/k1-s/") },
      { name: "AGV K3", style: "full-face", certifications: ["ECE 22.06"], source: official("https://www.agv.com/us/en/full-face/k3/") },
      {
        name: "AGV K6 S",
        style: "full-face",
        source: official("https://www.agv.com/us/en/full-face/k6-s/"),
        certifications: ["ECE 22.06"],
        certificationSource: official("https://www.agv.com/us/en/k6-s-matt-black---motorbike-full-face-helmet-dot-e2206-2118395016011011.html"),
      },
    ],
  },
  {
    slug: "shark",
    name: "Shark",
    models: [
      {
        name: "Shark Ridill 2",
        style: "full-face",
        source: official("https://www.shark-helmets.com/en/collections/ridill-2"),
        certifications: ["ECE 22.06"],
        certificationSource: official("https://www.shark-helmets.com/en/products/ridill-2-blank-he1100eblk"),
      },
      { name: "Shark Spartan RS", style: "full-face", certifications: ["ECE 22.06"], source: official("https://www.shark-helmets.com/en/products/spartan-rs-fibre-raceshop-he8117ewkr") },
      { name: "Shark D-Skwal 3", style: "full-face", certifications: ["ECE 22.06"], source: official("https://www.shark-helmets.com/en/products/d-skwal-3-blank-he0900eblk") },
    ],
  },
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function helmetSlug(model: HelmetModel): string {
  return `helmet-${slugify(model.name)}`;
}

export function helmetProduct(brand: HelmetBrand, model: HelmetModel): Product {
  const slug = helmetSlug(model);
  const style = model.style ? helmetStyleLabels[model.style] : undefined;
  const specifications: ProductSpec[] = [];
  if (model.style && model.source) {
    specifications.push({ label: "Style", value: `${style}${model.kids ? " (children's helmet)" : ""}`, source: model.source.url, sourceKind: model.source.kind });
  }
  const certPage = certificationPage(model);
  if (model.certifications?.length && certPage) {
    const whose = certPage.kind === "official" ? "maker's" : "distributor's";
    specifications.push({ label: `Certification on the ${whose} page`, value: model.certifications.join(", "), source: certPage.url, sourceKind: certPage.kind });
  }
  const lead = `${style ? `${style} helmet` : "Helmet"} from ${brand.name}${model.kids ? ", made for children" : ""}.`;
  const sizes = "Sizes and colours vary: call or WhatsApp to check what is in the shop, or try it on in Madhupur.";
  return {
    id: slug,
    slug,
    name: `${model.name} Helmet`,
    partBrand: brand.name,
    category: "accessories",
    subcategory: "helmets",
    images: [],
    art: model.style ? styleArt[model.style] : undefined,
    currency: "BDT",
    inventoryStatus: "call-to-confirm",
    productStatus: "live",
    authenticity: "unknown",
    fitment: "universal",
    compatibleModels: [],
    compatibilityConfidence: "needs-confirmation",
    source: { type: "store-supplied", name: "helmet list of October 2026" },
    shortDescription: `${lead} ${sizes}`,
    description: `${lead} ${sizes} The shop confirms the price before you order.`,
    specifications: specifications.length > 0 ? specifications : undefined,
    tags: ["helmet", brand.name, ...(style ? [`${style} helmet`] : []), ...(model.kids ? ["kids helmet"] : [])],
    searchableAliases: ["helmet", "হেলমেট", brand.slug, ...(model.style ? styleAliases[model.style] : [])],
    notes: model.note ? [model.note] : undefined,
  };
}

export const helmetProducts: Product[] = helmetBrands.flatMap((b) => b.models.map((m) => helmetProduct(b, m)));
