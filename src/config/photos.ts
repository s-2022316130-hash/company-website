/**
 * Photo manifest: every photograph the site uses, with alt text, focal point and credit.
 * Data files refer to photos by key (e.g. category.image = "catBrakes"), so replacing a
 * photo means changing one entry here.
 *
 * All current photos are stock images from Unsplash (Unsplash License: free for commercial
 * use, no permission or attribution required). They are atmosphere and representative
 * category images, NOT photos of Nirob Autos stock. Replace product photos with the shop's
 * own pictures as they become available.
 */

export interface PhotoCredit {
  author: string;
  profileUrl: string;
  pageUrl: string;
  source: "Unsplash";
  license: "Unsplash License";
  licenseUrl: string;
}

export interface Photo {
  src: string;
  /** Describes the photo. Leave decorative uses to the component (alt=""). */
  alt: string;
  width: number;
  height: number;
  /** CSS object-position used when the photo is cropped by its container. */
  position?: string;
  credit: PhotoCredit;
  /** Stock placeholder that should eventually be replaced by the shop's own photo. */
  temporary: boolean;
}

function unsplash(author: string, username: string, slug: string): PhotoCredit {
  return {
    author,
    profileUrl: `https://unsplash.com/@${username}`,
    pageUrl: `https://unsplash.com/photos/${slug}`,
    source: "Unsplash",
    license: "Unsplash License",
    licenseUrl: "https://unsplash.com/license",
  };
}

const HERO = { width: 2400, height: 1600 };
const WIDE = { width: 2000, height: 1333 };
const CATEGORY = { width: 1200, height: 1000 };
const SQUARE = { width: 900, height: 900 };

export const photos = {
  // Atmosphere
  hero: {
    src: "/images/hero/hero-motorcycle.webp",
    alt: "Yamaha R15 motorcycle standing in a dark car park",
    ...HERO,
    position: "68% 60%",
    credit: unsplash("Aiman Bahrin", "aimnbhrn", "a-purple-motorcycle-parked-in-a-parking-garage-iwexxOcFWzs"),
    temporary: true,
  },
  workshop: {
    src: "/images/backgrounds/workshop.webp",
    alt: "Mechanic working on a motorcycle in a dim garage, toolbox open on the floor",
    ...WIDE,
    position: "50% 45%",
    credit: unsplash("Angry._.Kat", "_ks_", "a-man-working-on-a-motorcycle-in-a-garage-4ORysIjH-mY"),
    temporary: true,
  },
  ridingRoad: {
    src: "/images/backgrounds/riding-road.webp",
    alt: "Rider on a motorcycle between palm trees and green paddy fields",
    ...WIDE,
    position: "50% 70%",
    credit: unsplash("Jaman Asad", "asadsnapper", "a-man-riding-a-motorcycle-down-a-lush-green-hillside-f6MAja9I9gg"),
    temporary: true,
  },

  // Category cards and banners
  catBrakes: {
    src: "/images/categories/brakes.webp",
    alt: "Motorcycle front brake disc and caliper on an alloy wheel",
    ...CATEGORY,
    credit: unsplash("Eduardo Soares", "eduschadesoares", "black-and-silver-motorcycle-wheel-QhlHn4JzMdw"),
    temporary: true,
  },
  catChain: {
    src: "/images/categories/chain-drive.webp",
    alt: "Motorcycle drive chain running on a gold rear sprocket",
    ...CATEGORY,
    credit: unsplash("Conor Luddy", "opticonor", "selective-focus-photography-of-gold-sprocket-a2iMnb8ZePE"),
    temporary: true,
  },
  catEngine: {
    src: "/images/categories/engine.webp",
    alt: "Air-cooled single-cylinder motorcycle engine with cooling fins",
    ...CATEGORY,
    credit: unsplash("Leonardo Moreno", "leojavier_huila", "a-close-up-of-a-motorcycle-engine-on-a-bike-_4o6cg4QJXM"),
    temporary: true,
  },
  catClutch: {
    src: "/images/categories/clutch-transmission.webp",
    alt: "Close-up of meshing gear teeth",
    ...CATEGORY,
    credit: unsplash("Amir Balam", "balam15", "a-close-up-of-a-guitar-VUEtP-eA9Mk"),
    temporary: true,
  },
  catFilters: {
    src: "/images/categories/filters.webp",
    alt: "Pleated air filter fitted to an engine",
    ...CATEGORY,
    credit: unsplash("Dylan Gillis", "mainermedia", "white-and-red-industrial-machine-nDPQr_7rkm4"),
    temporary: true,
  },
  catElectrical: {
    src: "/images/categories/electrical.webp",
    alt: "Red LED tail light glowing in the dark",
    ...CATEGORY,
    credit: unsplash("Nick ter Haar", "nickterhaar", "red-led-lights-AxhuvKKo4iU"),
    temporary: true,
  },
  catFuel: {
    src: "/images/categories/fuel-system.webp",
    alt: "Carburettor intake on a motorcycle engine",
    ...CATEGORY,
    credit: unsplash("Leonardo Moreno", "leojavier_huila", "a-close-up-of-a-carburet-on-a-motorcycle-7Y4H0icG7xA"),
    temporary: true,
  },
  catSuspension: {
    src: "/images/categories/suspension-steering.webp",
    alt: "Chrome coil-spring rear shock absorber",
    ...CATEGORY,
    credit: unsplash("Salah Ait Mokhtar", "motosha", "a-close-up-of-a-stack-of-coins-9Wv4gU5bk_s"),
    temporary: true,
  },
  catWheels: {
    src: "/images/categories/wheels-tyres.webp",
    alt: "Close-up of a motorcycle rear tyre tread",
    ...CATEGORY,
    credit: unsplash("C", "thecurlyone", "close-up-of-a-motorcycles-rear-tire-and-exhaust-PxUSr10kBuU"),
    temporary: true,
  },
  catCables: {
    src: "/images/categories/cables-controls.webp",
    alt: "Motorcycle handlebar with twin gauges and control cables",
    ...CATEGORY,
    credit: unsplash("Christopher Burns", "christopher__burns", "a-close-up-of-a-motorcycle-parked-on-the-street-Pl0s3qM0A_w"),
    temporary: true,
  },
  catBody: {
    src: "/images/categories/body.webp",
    alt: "Chrome mirror and round headlight on a red motorcycle",
    ...CATEGORY,
    credit: unsplash("C", "thecurlyone", "red-scooter-handlebar-with-chrome-mirror-and-headlight-GdvKj37spbM"),
    temporary: true,
  },
  catBearings: {
    src: "/images/categories/bearings-seals.webp",
    alt: "Polished steel bearing balls",
    ...CATEGORY,
    credit: unsplash("Random Thinking", "randomthinking", "a-bunch-of-shiny-balls-sitting-on-top-of-a-table-pmMG-mjJJqs"),
    temporary: true,
  },
  catOils: {
    src: "/images/categories/oils-fluids.webp",
    alt: "Golden engine oil being poured",
    ...CATEGORY,
    credit: unsplash("Fulvio Ciccolo", "scentspiracy", "a-close-up-of-a-wine-glass-being-filled-with-wine-iRbz_Y0wpkw"),
    temporary: true,
  },
  catAccessories: {
    src: "/images/categories/accessories.webp",
    alt: "Full-face motorcycle helmet",
    ...CATEGORY,
    credit: unsplash("Gijs Coolen", "gijsparadijs", "grayscale-selective-focus-photography-of-full-face-helmet-on-desk-JbefLYl6FEY"),
    temporary: true,
  },

  // Representative product photos (part type, not the exact item)
  brakeDisc: {
    src: "/images/products/brake/brake-disc.webp",
    alt: "Motorcycle brake disc close-up",
    ...SQUARE,
    credit: unsplash("Karan Suthar", "karan_suthar_", "a-close-up-of-a-wheel-on-a-vehicle-_ssyufaEVQc"),
    temporary: true,
  },
  chainKit: {
    src: "/images/products/chain/chain-sprocket-kit.webp",
    alt: "Drive chain with front and rear sprockets on a workbench",
    ...SQUARE,
    credit: unsplash("LouisMoto", "louismotorrad", "a-close-up-of-a-watch-9ehmPYBJkyU"),
    temporary: true,
  },
  chainService: {
    src: "/images/products/chain/chain-maintenance.webp",
    alt: "Hands checking a motorcycle drive chain",
    ...SQUARE,
    credit: unsplash("hendra kurniawan", "heyndraa13", "a-close-up-of-a-person-holding-a-bike-tire-HfVg8WeUVS0"),
    temporary: true,
  },
  engineService: {
    src: "/images/products/engine/engine-service.webp",
    alt: "Hands working on a motorcycle engine",
    ...SQUARE,
    credit: unsplash("Mick Haupt", "rocinante_11", "a-person-holding-a-car-engine-NIV7xNUGMbM"),
    temporary: true,
  },
  piston: {
    src: "/images/products/engine/piston.webp",
    alt: "Engine piston held above an open cylinder",
    ...SQUARE,
    credit: unsplash("Leonardo Moreno", "leojavier_huila", "a-close-up-of-a-motorcycle-engine-with-a-person-wearing-gloves-JVyIt9GyDyU"),
    temporary: true,
  },
  oilFilter: {
    src: "/images/products/filters/oil-filter.webp",
    alt: "Oil filter being removed during an oil change",
    ...SQUARE,
    credit: unsplash("Jimmy Nilsson Masth", "jimmynilssonmasth", "a-mechanic-is-pouring-oil-on-a-car-uhuTo7u8VXk"),
    temporary: true,
  },
  sparkPlug: {
    src: "/images/products/filters/spark-plug.webp",
    alt: "Spark plug electrode close-up",
    ...SQUARE,
    credit: unsplash("Tonmoy Iftekhar", "xalfa", "a-close-up-of-a-metal-object-with-a-black-background-6pd6HAWhPwg"),
    temporary: true,
  },
  frontFork: {
    src: "/images/products/suspension/front-fork.webp",
    alt: "Motorcycle front fork and wheel",
    ...SQUARE,
    credit: unsplash("Fridi Antrack", "fr1d1", "close-up-of-a-motorcycle-wheel-at-sunset-MuxGgaLfcm4"),
    temporary: true,
  },
  wheelBearing: {
    src: "/images/products/suspension/wheel-bearing.webp",
    alt: "Sealed ball bearings",
    ...SQUARE,
    credit: unsplash("Glen Carrie", "glencarrie", "black-and-silver-round-speaker-PmmbE54C8i4"),
    temporary: true,
  },
  mirror: {
    src: "/images/products/body/mirror.webp",
    alt: "Round chrome motorcycle mirror",
    ...SQUARE,
    credit: unsplash("C", "thecurlyone", "close-up-of-a-motorcycle-handlebar-and-chrome-mirror-bR9EapRXVmU"),
    temporary: true,
  },
  tailLamp: {
    src: "/images/products/electrical/tail-lamp.webp",
    alt: "Motorcycle tail lamp with indicators",
    ...SQUARE,
    credit: unsplash("Maxim Tolchinskiy", "shaikhulud", "motorcycle-taillight-on-chrome-fender-m2QscGMsGFU"),
    temporary: true,
  },
  engineOil: {
    src: "/images/products/oils/engine-oil.webp",
    alt: "Engine oil being poured",
    ...SQUARE,
    credit: unsplash("Fulvio Ciccolo", "scentspiracy", "a-close-up-of-a-liquid-being-poured-into-a-bowl-0jMjSp7rVbk"),
    temporary: true,
  },
  ridingGloves: {
    src: "/images/products/accessories/riding-gloves.webp",
    alt: "Rider fastening motorcycle riding gloves",
    ...SQUARE,
    credit: unsplash("Julian Henke", "julianhenke", "a-motorcyclist-is-getting-ready-to-ride-QAUzIH1J0Y4"),
    temporary: true,
  },
  mobileHolder: {
    src: "/images/products/accessories/mobile-holder.webp",
    alt: "Phone held in a handlebar mobile holder",
    ...SQUARE,
    credit: unsplash("Rohan Krishnan", "rohankrishnann", "black-and-silver-camera-film-TXYOJmlMciQ"),
    temporary: true,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export function getPhoto(key: PhotoKey | undefined): Photo | undefined {
  return key ? photos[key] : undefined;
}
