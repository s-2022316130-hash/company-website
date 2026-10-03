/**
 * Image manifest: every image the site can show, where it comes from and whether it may be shown.
 * Components never hard-code an image path. Data files refer to photos by key (e.g. a category's
 * image = "catBrakes"), and brands and models look up their entries here, so replacing an image
 * means changing one entry.
 *
 * rightsStatus decides whether a file is displayed:
 *   approved             the rights holder has confirmed in writing that the shop may use it: shown
 *   dealer-supplied      supplied to Nirob Auto's by the distributor for dealer use: shown
 *   temporary            licensed stock photo, a placeholder until the shop's own photo exists: shown
 *   permission-required  reuse not confirmed: never shown, and no local file is kept. The site uses
 *                        the brand name in type or an original line drawing instead.
 *
 * Being an authorized dealer is not, on its own, permission to republish a manufacturer's photos or
 * logos. Official images stay "permission-required" until the distributor supplies the files or
 * confirms the shop may use them. Files that may be shown are stored locally under /public/images;
 * the site never loads images from manufacturer websites.
 */

/** Where the image comes from. "shop-brand" is Nirob Auto's own logo, supplied by the owner. */
export type ImageSource = "official-brand" | "store-photo" | "licensed-stock" | "shop-brand";

export type RightsStatus = "approved" | "dealer-supplied" | "temporary" | "permission-required";

export interface StockCredit {
  author: string;
  profileUrl: string;
  pageUrl: string;
  source: "Unsplash";
  license: "Unsplash License";
  licenseUrl: string;
}

export interface ImageAsset {
  /** Local file under /public/images. Absent until there is a file the site may show. */
  src?: string;
  /** Describes the image. Decorative uses get alt="" from the component. */
  alt: string;
  width?: number;
  height?: number;
  /** CSS object-position used when the image is cropped by its container. */
  position?: string;
  imageSource: ImageSource;
  rightsStatus: RightsStatus;
  /** Page where the original is published. A reference for checking and requesting it; the site never loads it. */
  sourceUrl?: string;
  /** Photographer and licence, for stock photos. */
  credit?: StockCredit;
  /** Who can supply the file or approve its use. */
  requestFrom?: string;
  note?: string;
}

/**
 * Nirob Auto's own logo, cut from the signboard artwork the owner supplied on 2026-10-03 (white paper
 * made transparent; the "-dark" files turn the black ink white for dark backgrounds). The "mark" is the
 * motorcycle-in-garage emblem without the Bangla name band, for small spaces and the browser icon.
 * The signboard's row of manufacturer logos was left out.
 */
const SHOP_LOGO = {
  imageSource: "shop-brand",
  rightsStatus: "approved",
  note: "Supplied by the owner, 2026-10-03.",
} as const;

export const shopLogo = {
  full: { src: "/images/nirob/logo.png", alt: "Nirob Auto's logo, since 2000", width: 1018, height: 603, ...SHOP_LOGO },
  fullDark: { src: "/images/nirob/logo-dark.png", alt: "Nirob Auto's logo, since 2000", width: 1018, height: 603, ...SHOP_LOGO },
  mark: { src: "/images/nirob/mark.png", alt: "Nirob Auto's", width: 649, height: 409, ...SHOP_LOGO },
  markDark: { src: "/images/nirob/mark-dark.png", alt: "Nirob Auto's", width: 649, height: 409, ...SHOP_LOGO },
} satisfies Record<string, ImageAsset & { src: string; width: number; height: number }>;

/** A stock photo: always a local file, with its photographer and licence. */
export interface Photo extends ImageAsset {
  src: string;
  width: number;
  height: number;
  credit: StockCredit;
}

/** Unsplash License: free for commercial use, no permission or attribution required. */
function unsplash(author: string, username: string, slug: string) {
  const pageUrl = `https://unsplash.com/photos/${slug}`;
  return {
    imageSource: "licensed-stock",
    rightsStatus: "temporary",
    sourceUrl: pageUrl,
    credit: {
      author,
      profileUrl: `https://unsplash.com/@${username}`,
      pageUrl,
      source: "Unsplash",
      license: "Unsplash License",
      licenseUrl: "https://unsplash.com/license",
    },
  } as const;
}

const HERO = { width: 2400, height: 1600 };
const WIDE = { width: 2000, height: 1333 };
const CATEGORY = { width: 1200, height: 1000 };
const SQUARE = { width: 900, height: 900 };

/**
 * Stock photos from Unsplash: atmosphere, category cards and photos of part types. None of them shows
 * Nirob Auto's stock or premises, so each stays "temporary" until the shop supplies its own.
 */
export const photos = {
  // Hero and banners
  hero: {
    src: "/images/hero/hero-motorcycle.webp",
    alt: "Yamaha R15 motorcycle standing in a dark car park",
    ...HERO,
    position: "68% 60%",
    ...unsplash("Aiman Bahrin", "aimnbhrn", "a-purple-motorcycle-parked-in-a-parking-garage-iwexxOcFWzs"),
  },
  ridingRoad: {
    src: "/images/hero/riding-road.webp",
    alt: "Rider on a motorcycle between palm trees and green paddy fields",
    ...WIDE,
    position: "50% 70%",
    ...unsplash("Jaman Asad", "asadsnapper", "a-man-riding-a-motorcycle-down-a-lush-green-hillside-f6MAja9I9gg"),
  },
  workshop: {
    src: "/images/workshop/workshop.webp",
    alt: "Mechanic working on a motorcycle in a dim garage, toolbox open on the floor",
    ...WIDE,
    position: "50% 45%",
    ...unsplash("Angry._.Kat", "_ks_", "a-man-working-on-a-motorcycle-in-a-garage-4ORysIjH-mY"),
  },

  // Category cards and banners
  catBrakes: {
    src: "/images/categories/brakes.webp",
    alt: "Motorcycle front brake disc and caliper on an alloy wheel",
    ...CATEGORY,
    ...unsplash("Eduardo Soares", "eduschadesoares", "black-and-silver-motorcycle-wheel-QhlHn4JzMdw"),
  },
  catChain: {
    src: "/images/categories/chain-drive.webp",
    alt: "Motorcycle drive chain running on a gold rear sprocket",
    ...CATEGORY,
    ...unsplash("Conor Luddy", "opticonor", "selective-focus-photography-of-gold-sprocket-a2iMnb8ZePE"),
  },
  catEngine: {
    src: "/images/categories/engine.webp",
    alt: "Air-cooled single-cylinder motorcycle engine with cooling fins",
    ...CATEGORY,
    ...unsplash("Leonardo Moreno", "leojavier_huila", "a-close-up-of-a-motorcycle-engine-on-a-bike-_4o6cg4QJXM"),
  },
  catClutch: {
    src: "/images/categories/clutch-transmission.webp",
    alt: "Close-up of meshing gear teeth",
    ...CATEGORY,
    ...unsplash("Amir Balam", "balam15", "a-close-up-of-a-guitar-VUEtP-eA9Mk"),
  },
  catFilters: {
    src: "/images/categories/filters.webp",
    alt: "Pleated air filter fitted to an engine",
    ...CATEGORY,
    ...unsplash("Dylan Gillis", "mainermedia", "white-and-red-industrial-machine-nDPQr_7rkm4"),
  },
  catElectrical: {
    src: "/images/categories/electrical.webp",
    alt: "Red LED tail light glowing in the dark",
    ...CATEGORY,
    ...unsplash("Nick ter Haar", "nickterhaar", "red-led-lights-AxhuvKKo4iU"),
  },
  catFuel: {
    src: "/images/categories/fuel-system.webp",
    alt: "Carburettor intake on a motorcycle engine",
    ...CATEGORY,
    ...unsplash("Leonardo Moreno", "leojavier_huila", "a-close-up-of-a-carburet-on-a-motorcycle-7Y4H0icG7xA"),
  },
  catSuspension: {
    src: "/images/categories/suspension-steering.webp",
    alt: "Chrome coil-spring rear shock absorber",
    ...CATEGORY,
    ...unsplash("Salah Ait Mokhtar", "motosha", "a-close-up-of-a-stack-of-coins-9Wv4gU5bk_s"),
  },
  catWheels: {
    src: "/images/categories/wheels-tyres.webp",
    alt: "Close-up of a motorcycle rear tyre tread",
    ...CATEGORY,
    ...unsplash("C", "thecurlyone", "close-up-of-a-motorcycles-rear-tire-and-exhaust-PxUSr10kBuU"),
  },
  catCables: {
    src: "/images/categories/cables-controls.webp",
    alt: "Motorcycle handlebar with twin gauges and control cables",
    ...CATEGORY,
    ...unsplash("Christopher Burns", "christopher__burns", "a-close-up-of-a-motorcycle-parked-on-the-street-Pl0s3qM0A_w"),
  },
  catBody: {
    src: "/images/categories/body.webp",
    alt: "Chrome mirror and round headlight on a red motorcycle",
    ...CATEGORY,
    ...unsplash("C", "thecurlyone", "red-scooter-handlebar-with-chrome-mirror-and-headlight-GdvKj37spbM"),
  },
  catBearings: {
    src: "/images/categories/bearings-seals.webp",
    alt: "Polished steel bearing balls",
    ...CATEGORY,
    ...unsplash("Random Thinking", "randomthinking", "a-bunch-of-shiny-balls-sitting-on-top-of-a-table-pmMG-mjJJqs"),
  },
  catOils: {
    src: "/images/categories/oils-fluids.webp",
    alt: "Golden engine oil being poured",
    ...CATEGORY,
    ...unsplash("Fulvio Ciccolo", "scentspiracy", "a-close-up-of-a-wine-glass-being-filled-with-wine-iRbz_Y0wpkw"),
  },
  catAccessories: {
    src: "/images/categories/accessories.webp",
    alt: "Full-face motorcycle helmet",
    ...CATEGORY,
    ...unsplash("Gijs Coolen", "gijsparadijs", "grayscale-selective-focus-photography-of-full-face-helmet-on-desk-JbefLYl6FEY"),
  },

  // Photos of part types (not the exact item for sale)
  brakeDisc: {
    src: "/images/products/brake/brake-disc.webp",
    alt: "Motorcycle brake disc close-up",
    ...SQUARE,
    ...unsplash("Karan Suthar", "karan_suthar_", "a-close-up-of-a-wheel-on-a-vehicle-_ssyufaEVQc"),
  },
  chainKit: {
    src: "/images/products/chain/chain-sprocket-kit.webp",
    alt: "Drive chain with front and rear sprockets on a workbench",
    ...SQUARE,
    ...unsplash("LouisMoto", "louismotorrad", "a-close-up-of-a-watch-9ehmPYBJkyU"),
  },
  chainService: {
    src: "/images/products/chain/chain-maintenance.webp",
    alt: "Hands checking a motorcycle drive chain",
    ...SQUARE,
    ...unsplash("hendra kurniawan", "heyndraa13", "a-close-up-of-a-person-holding-a-bike-tire-HfVg8WeUVS0"),
  },
  engineService: {
    src: "/images/products/engine/engine-service.webp",
    alt: "Hands working on a motorcycle engine",
    ...SQUARE,
    ...unsplash("Mick Haupt", "rocinante_11", "a-person-holding-a-car-engine-NIV7xNUGMbM"),
  },
  piston: {
    src: "/images/products/engine/piston.webp",
    alt: "Engine piston held above an open cylinder",
    ...SQUARE,
    ...unsplash("Leonardo Moreno", "leojavier_huila", "a-close-up-of-a-motorcycle-engine-with-a-person-wearing-gloves-JVyIt9GyDyU"),
  },
  oilFilter: {
    src: "/images/products/filters/oil-filter.webp",
    alt: "Oil filter being removed during an oil change",
    ...SQUARE,
    ...unsplash("Jimmy Nilsson Masth", "jimmynilssonmasth", "a-mechanic-is-pouring-oil-on-a-car-uhuTo7u8VXk"),
  },
  sparkPlug: {
    src: "/images/products/filters/spark-plug.webp",
    alt: "Spark plug electrode close-up",
    ...SQUARE,
    ...unsplash("Tonmoy Iftekhar", "xalfa", "a-close-up-of-a-metal-object-with-a-black-background-6pd6HAWhPwg"),
  },
  frontFork: {
    src: "/images/products/suspension/front-fork.webp",
    alt: "Motorcycle front fork and wheel",
    ...SQUARE,
    ...unsplash("Fridi Antrack", "fr1d1", "close-up-of-a-motorcycle-wheel-at-sunset-MuxGgaLfcm4"),
  },
  wheelBearing: {
    src: "/images/products/suspension/wheel-bearing.webp",
    alt: "Sealed ball bearings",
    ...SQUARE,
    ...unsplash("Glen Carrie", "glencarrie", "black-and-silver-round-speaker-PmmbE54C8i4"),
  },
  mirror: {
    src: "/images/products/body/mirror.webp",
    alt: "Round chrome motorcycle mirror",
    ...SQUARE,
    ...unsplash("C", "thecurlyone", "close-up-of-a-motorcycle-handlebar-and-chrome-mirror-bR9EapRXVmU"),
  },
  tailLamp: {
    src: "/images/products/electrical/tail-lamp.webp",
    alt: "Motorcycle tail lamp with indicators",
    ...SQUARE,
    ...unsplash("Maxim Tolchinskiy", "shaikhulud", "motorcycle-taillight-on-chrome-fender-m2QscGMsGFU"),
  },
  engineOil: {
    src: "/images/oils/engine-oil.webp",
    alt: "Engine oil being poured",
    ...SQUARE,
    ...unsplash("Fulvio Ciccolo", "scentspiracy", "a-close-up-of-a-liquid-being-poured-into-a-bowl-0jMjSp7rVbk"),
  },
  ridingGloves: {
    src: "/images/accessories/riding-gloves.webp",
    alt: "Rider fastening motorcycle riding gloves",
    ...SQUARE,
    ...unsplash("Julian Henke", "julianhenke", "a-motorcyclist-is-getting-ready-to-ride-QAUzIH1J0Y4"),
  },
  mobileHolder: {
    src: "/images/accessories/mobile-holder.webp",
    alt: "Phone held in a handlebar mobile holder",
    ...SQUARE,
    ...unsplash("Rohan Krishnan", "rohankrishnann", "black-and-silver-camera-film-TXYOJmlMciQ"),
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export function getPhoto(key: PhotoKey | undefined): Photo | undefined {
  return key ? photos[key] : undefined;
}

/**
 * Who can supply each brand's official images or approve their use. The four dealerships are the
 * companies on the shop's business card; the other three are the brands' Bangladesh distributors.
 */
export const imageContacts: Record<string, string> = {
  bajaj: "Uttara Motors (Bajaj distributor in Bangladesh)",
  tvs: "TVS Motors",
  runner: "Runner Automobiles",
  hero: "Hero",
  yamaha: "ACI Motors (Yamaha distributor in Bangladesh)",
  honda: "Bangladesh Honda Private Limited",
  suzuki: "Rancon Motor Bikes (Suzuki distributor in Bangladesh)",
};

export interface BrandImages {
  /** Official logo. Until it may be shown, the brand name is set in the site's display type. */
  logo: ImageAsset;
  /** Model whose image (or drawing) stands for the brand on cards and the brand page. */
  featureModel: string;
  /** What the brand's official site says about reusing its images, as read on `checked`. */
  terms: { url?: string; summary: string; mediaKit?: string; checked: string };
}

const TERMS_CHECKED = "2026-10-03";

function officialLogo(brand: string, slug: string, sourceUrl: string): ImageAsset {
  return {
    alt: `${brand} logo`,
    imageSource: "official-brand",
    rightsStatus: "permission-required",
    sourceUrl,
    requestFrom: imageContacts[slug],
  };
}

/**
 * Brand logos and feature models. When a distributor supplies its logo, save it as
 * /public/images/brands/<brand>.svg (or .webp), then set src, width, height and rightsStatus
 * "dealer-supplied" (or "approved" with the permission noted).
 */
export const brandImages = {
  bajaj: {
    logo: officialLogo("Bajaj", "bajaj", "https://www.bajajauto.com/en-bd"),
    featureModel: "bajaj-pulsar-n160",
    terms: {
      url: "https://www.bajajauto.com/onlinebooking-tnc",
      summary: "Site images are for personal, non-commercial use; republishing needs Bajaj Auto's prior written consent.",
      mediaKit: "https://www.bajajauto.com/corporate/media-centre",
      checked: TERMS_CHECKED,
    },
  },
  honda: {
    logo: officialLogo("Honda", "honda", "https://www.bdhonda.com"),
    featureModel: "honda-shine-100",
    terms: {
      summary: "No terms page found; the footer reserves all rights to Bangladesh Honda Private Limited.",
      checked: TERMS_CHECKED,
    },
  },
  yamaha: {
    logo: officialLogo("Yamaha", "yamaha", "https://www.yamahabd.com"),
    featureModel: "yamaha-r15-v4",
    terms: { summary: "No terms or reuse statement found on the Bangladesh site (ACI Motors).", checked: TERMS_CHECKED },
  },
  suzuki: {
    logo: officialLogo("Suzuki", "suzuki", "https://suzuki.com.bd"),
    featureModel: "suzuki-gixxer-sf",
    terms: {
      url: "https://suzuki.com.bd/terms-condition",
      summary: "Terms page under construction; the footer carries a Rancon Motor Bikes copyright notice.",
      checked: TERMS_CHECKED,
    },
  },
  tvs: {
    logo: officialLogo("TVS", "tvs", "https://bangladesh.tvsmotor.com/en/"),
    featureModel: "tvs-apache-rtr-160-4v",
    terms: {
      url: "https://bangladesh.tvsmotor.com/en/terms-and-condition",
      summary: "Names, logos and product images may not be used without TVS Motor Company's express written permission.",
      checked: TERMS_CHECKED,
    },
  },
  hero: {
    logo: officialLogo("Hero", "hero", "https://www.heromotocorp.com/en-bd.html"),
    featureModel: "hero-splendor-plus-xtec",
    terms: {
      url: "https://www.heromotocorp.com/en-in/terms-of-use.html",
      summary: "Logos and images may not be reproduced for commercial purposes without Hero MotoCorp's express written consent.",
      mediaKit: "https://www.heromotocorp.com/en-in/company/newsroom/media-kit.html",
      checked: TERMS_CHECKED,
    },
  },
  runner: {
    logo: officialLogo("Runner", "runner", "https://motorcycles.runnerautomobiles.com"),
    featureModel: "runner-bullet-100",
    terms: {
      url: "https://motorcycles.runnerautomobiles.com/site/terms-of-use",
      summary: "Text, graphics, logos and images belong to Runner Automobiles and may not be reused without its consent.",
      checked: TERMS_CHECKED,
    },
  },
} satisfies Record<string, BrandImages>;

/**
 * Photos of specific motorcycle models, keyed by model id. Every current Bangladesh model already has
 * a "permission-required" slot pointing at its official page (see lib/images.ts), so the site shows
 * the line drawing until a file arrives. To add a file the distributor has supplied, save it as
 * /public/images/motorcycles/<model-id>.webp (side view, about 1600 × 1000) and add, for example:
 *
 *   "bajaj-pulsar-n160": {
 *     src: "/images/motorcycles/bajaj-pulsar-n160.webp",
 *     alt: "Bajaj Pulsar N160, side view",
 *     width: 1600,
 *     height: 1000,
 *     imageSource: "official-brand",
 *     rightsStatus: "dealer-supplied",
 *     sourceUrl: "https://www.bajajauto.com/en-bd/bikes/pulsar-n160",
 *     requestFrom: "Uttara Motors (Bajaj distributor in Bangladesh)",
 *   },
 *
 * Earlier and other-market models keep the drawing: a current model's photo must not stand in for them.
 */
export const motorcycleImages: Record<string, ImageAsset | undefined> = {};
