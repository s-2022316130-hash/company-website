# Nirob Autos | নিরব অটো'স

Website for Nirob Autos, a motorcycle spare-parts shop at N401, Madhupur, Bangladesh. Customers find a
part (by search, bike model or category), check what it fits, add it to a cart, and send an order
request to the shop by WhatsApp or phone. Customers can pick up from the store or have parts sent by
courier anywhere in Bangladesh. The site does not take payments online.

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS v4 with design tokens in `src/app/globals.css`
- `lucide-react` icons, `next/font` (Inter, Barlow Condensed, Noto Sans Bengali)
- Vitest for unit tests
- No database, auth or third-party services. The catalogue renders with no environment variables at all.

## Commands

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint
npm run typecheck
npm test
npm run check      # lint + typecheck + tests
```

Node 20.9 or newer is required.

## Deployment (Vercel)

1. Push this folder to a GitHub repository and import it in Vercel. Framework preset: Next.js.
2. Build command `npm run build`, output handled by Vercel. No other settings are needed.
3. Once you have a domain, set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) so canonical links, the
   sitemap and structured data use it. Without it, Vercel's production URL is used.

Any Node host that runs `next start` works the same way.

## Where to change things

| What | File |
| --- | --- |
| Name, address, phone numbers, WhatsApp numbers, hours, pickup/courier text, map embed, social links | `src/config/business.ts` |
| Main and footer navigation | `src/config/navigation.ts` |
| Colours, fonts, button styles, textures (blueprint grid, fins, chain rule) | `src/app/globals.css` (`@theme` block) |
| Images: stock photos, brand logos, model photos, their sources and rights | `src/config/images.ts`, files in `public/images/` |
| Official logos and model photos still to request from distributors | `docs/image-requests.md` |
| Bike line drawings | `src/components/bikes/BikeArt.tsx` |
| Products | `src/data/products.ts` |
| Motorcycle models | `src/data/models.ts` |
| Brands | `src/data/brands.ts` |
| Categories, subcategories, popular parts | `src/data/categories.ts` |
| Search synonyms (English, local terms, Bangla) | `src/data/search-aliases.ts` |
| FAQ answers | `src/app/faq/page.tsx` |
| Logo | `src/components/layout/Logo.tsx`, favicon `src/app/icon.svg` |

## Data architecture

```
UI (src/app, src/components)
  ↓
Catalogue service   src/lib/catalog/catalog.ts   joins records, related products, counts
Search / listing    src/lib/catalog/search.ts, listing.ts
  ↓
Repository          src/lib/catalog/repository.ts   (CatalogRepository interface)
  ↓
Seed data           src/data/*.ts
```

- Pages never import seed files directly. They call `loadCatalog()`, which reads through the repository.
- Products reference motorcycle models by id (`compatibleModels`). Compatible brands are derived from
  those models, so compatibility is stored once.
- `fitment` is `model-specific`, `universal` (e.g. chain lube; may still list the models whose manual
  recommends it, e.g. an oil grade) or `unconfirmed` (shown as "call to confirm").
- Three separate questions are kept separate:
  - **Is it in the catalogue?** Every record is.
  - **Is it on the shelf?** `inventoryStatus`: in stock, low stock, out of stock, available on request,
    call to confirm, or `catalogue-only` (listed, but stock not confirmed). Every record is currently
    `catalogue-only`.
  - **Is it genuine?** `authenticity`: genuine, OEM, aftermarket, compatible or `unknown`. It is shown
    only when not `unknown`, and only set when the shop has verified it.
- `compatibilityConfidence` says how sure the fitment is: `verified`, `manufacturer-listed` (an
  official source names the part, size or spec for the model), `store-confirmed`, or
  `needs-confirmation`. `compatibleVariants` limits a record to some official variants.
- `source` records where each record comes from (`official-bangladesh`, `official-manufacturer`,
  `retailer-reference`, `store-supplied`, …), with a URL when there is one. Every `specifications` row
  cites its official page.
- `productStatus` is `live`, `draft` or `demo`.
- A missing `price` shows "Call for price". Prices, SKUs and part numbers are never invented; a part
  number is only recorded when an official source prints it.
- Filters only appear when they can actually narrow the results, and all filter state lives in the URL
  (`/shop?brand=yamaha&category=brake-pads&fit=manufacturer-listed`).
- Catalogue-only records are `noindex` and left out of the sitemap (`isIndexable` in `src/lib/seo.ts`).
  They become indexable once the shop confirms them.

### Parts catalogue

`src/data/products.ts` assembles **583 catalogue records** from four files in `src/data/catalogue/`:

| File | What it holds |
| --- | --- |
| `kinds.ts` | About 115 part kinds (brake pads to grab rails). Each has rules for which bikes it can apply to (`requires`) and which official variants (`variant`), plus an optional split by official value, e.g. disc diameter. |
| `assignments.ts` | Which kinds are catalogued for which model, and the pairings an official source lists (`officialFitment`). |
| `official.ts` | Records from official sources. Yamaha Bangladesh's genuine-parts page lists 10 parts with their models. The rest are built from Bajaj spec pages and owner's manuals: tyres by size, tubes, batteries, spark plugs and bulbs. Each is one record listing every bike that uses it, never a copy per model. |
| `universal.ts` | Engine oils by grade, fluids, cleaners, accessories and small hardware. |

Rules:

- **Fitment:** a part is only catalogued where the official spec allows it. For example, there are no
  disc pads for a drum wheel, no CVT belt on a geared bike, and no injector on a carburettor bike. Where
  variants differ, the record names them: Pulsar 150 rear brake pads are listed for the TD and TD ABS
  variants only.
- **Oil grades and brake fluids** list a bike only where its owner's manual names that grade.
- **Counts by brand:**
  - Bajaj 271 (34 manufacturer-listed)
  - Honda 51
  - Yamaha 46 (10 manufacturer-listed)
  - Suzuki 40
  - TVS 32
  - Hero 47
  - Runner 41
  - Universal: 21 oils and fluids, 23 accessories, 12 hardware items
- **Fitment confidence:** 48 records have manufacturer-listed fitment; the other 535 need confirmation.
- **Duplicates:** product names are unique, and a shared part is one record with several models.

Unit tests enforce these rules:

- no prices, SKUs or verified authenticity on catalogue-only records
- part numbers and manufacturer-listed fitment only with an official source
- every assignment passes its `requires` rule
- variant names exist
- the Bajaj parts checklist is covered
- the per-brand minimums are met

**To go live with real stock**, set `inventoryStatus`, `price` and (when verified) `authenticity` on
each record the shop confirms. Add photos of the actual item to `images`.

### Motorcycle directory

`src/data/models.ts` lists **119 models** across 7 brands, checked on 2 October 2026 against each
brand's official site. Every model stores its source URL. Bajaj models carry their `family` (Pulsar,
Discover, Platina, CT).

| Brand | Official source | Models |
| --- | --- | --- |
| Bajaj | bajajauto.com/en-bd, plus bajajauto.com for models sold outside BD | 10 current, 13 outside BD |
| Honda | bdhonda.com | 11 current, 2 earlier |
| Yamaha | yamahabd.com (products and parts-spares pages) | 16 current, 1 earlier (FZS V3), 1 outside BD |
| Suzuki | suzuki.com.bd | 10 current, 1 outside BD |
| TVS | bangladesh.tvsmotor.com | 4 current, 1 earlier, 6 outside BD |
| Hero | heromotocorp.com/en-bd | 25 current, 1 outside BD |
| Runner | motorcycles.runnerautomobiles.com, runnerbd.com | 15 current, 2 earlier |

`status` takes one of three values:

- `bd-current`: in the official Bangladesh line-up
- `bd-earlier`: an older official Bangladesh model
- `official-other`: in the official catalogue outside Bangladesh only. These are hidden behind a toggle in the directory.

Brake and fuel-system specs are filled in only when the official page states them. UM-branded bikes
sold through Runner showrooms are not listed under Runner. The FZS V3 is not in Yamaha's current
product list, but Yamaha Bangladesh's genuine-parts page lists parts for it, so it is an earlier
Bangladesh model. Review the list against the bikes the shop actually supplies parts for.

### Variant specifications

`src/data/variants.ts` holds official per-variant specs, keyed by model id: engine, fuel system,
cooling, ABS, brake type and size, tyre sizes, suspension, battery and gearbox. Bajaj's 10 Bangladesh
models (16 variant pages on bajajauto.com/en-bd) are covered so far, checked on 2 October 2026.

- These are facts restated in our own words. No text or images are copied from the manufacturer's site.
- A field is left out when the page doesn't state it. It is also left out when the page contradicts
  itself; for example, the Pulsar 150 TD ABS page gives single-disc figures. Each variant's `note`
  explains any gap.
- When a model has variants, its brake and fuel `spec` is derived from them, and variant names become
  searchable aliases ("pulsar 150 td abs").
- Model pages show a variant comparison table and the parts that depend on the variant. Brand pages
  show a line-up table.

### Owner's manual facts

`src/data/manuals.ts` holds maintenance facts from official owner's manuals, keyed by model id. Each
entry records:

- engine oil grade and quantity, and the change and top-up intervals
- spark plug type and gap
- battery and brake fluid
- tyre pressures and chain slack
- bulbs and the service schedule

Bajaj publishes two manuals on its Bangladesh Owner's Zone: Pulsar 150 (which also covers the Classic
and Twin Disc) and Discover 110/125. Both were read on 2 October 2026.

- Only facts are restated. The PDFs are not stored in the repo, and pages link to the official PDF.
- Where a manual contradicts itself, the value is left out or both figures are given in `notes`. The
  Discover manual, for example, gives two oil-change intervals.
- Manuals can be older editions than the current line-up, so brake and tyre details still come from
  `variants.ts`.
- Model pages show the facts as cards. `/engine-oil` shows a "Recommended engine oil by model" table.

### Dealerships

The shop's business card lists it as a dealer for Uttara Motors (Bajaj), TVS Motors, Runner Automobiles
and Hero, with genuine parts at company price, and the owner has confirmed it is an authorized dealer for
them. The card prints "Hero Honda", the brand's name before 2011, and the site shows "Hero" at the owner's
request. The shop also sells original Yamaha, Suzuki and Honda parts; it is not their dealer, so those
brands get an "Original parts" badge rather than "Authorized dealer". These details live in
`business.dealerships` and `business.originalPartsBrands` in `src/config/business.ts`. The badges, brand
cards (dealerships listed first), brand and model pages, product pages for one brand's parts, the About
page, the header, the footer and the terms read from there.

### Images

Every image the site can show is registered in one manifest, `src/config/images.ts`, with alt text,
`imageSource` (`official-brand`, `store-photo`, `licensed-stock`), `sourceUrl` and `rightsStatus`.
Components never hard-code a path. `rightsStatus` decides whether a file is displayed:

| rightsStatus | Meaning | Shown? |
| --- | --- | --- |
| `approved` | The rights holder confirmed in writing that the shop may use it | Yes |
| `dealer-supplied` | Supplied to Nirob Autos by the distributor for dealer use | Yes |
| `temporary` | Licensed stock photo, until the shop has its own | Yes |
| `permission-required` | Reuse not confirmed. No local file is kept | No |

- **Official logos and model photos**: being an authorized dealer is not, on its own, permission to
  republish a manufacturer's images. The Bajaj, TVS, Hero and Runner sites say their images and logos
  need written consent; the Yamaha, Honda and Suzuki Bangladesh sites state no terms, so their images are
  covered by copyright too (findings and links per brand in `brandImages[...].terms`, checked
  3 October 2026). So every official image is `permission-required` for now:
  - each brand has a logo slot (`brandImages`); without a file the brand name is set in the site's type
    (`BrandMark`), never a redrawn logo;
  - every current Bangladesh model has a photo slot pointing at its official page (`motorcycleImage()` in
    `src/lib/images.ts`); without a file the page shows the line drawing of its body style
    (`BikeVisual`), captioned as not the exact model. Earlier and other-market models never get a current
    model's photo.

  `docs/image-requests.md` lists all 98 files to ask the distributors for (7 logos, 91 model photos) and
  how to add them. Once a file is saved under `public/images/brands/` or `public/images/motorcycles/` and
  its entry is set to `dealer-supplied` or `approved`, it appears on brand cards, brand and model banners,
  model cards, the part finder, product "Fits" lists, search suggestions and `/credits`, in a fixed frame
  with `object-contain` so wheels and lights are never cropped. The site never loads images from
  manufacturer websites.
- **Stock photos**: 31 photos from [Unsplash](https://unsplash.com) under the
  [Unsplash License](https://unsplash.com/license), stored as WebP and listed on `/credits` with their
  photographers. The hero photo's number plate is blurred. They are **temporary**: replace them with the
  shop's own photos when available.
- **Product images** fall back in this order:
  1. the product's own photo
  2. its representative `photo`
  3. its subcategory photo, which is only set where the photo really shows that part type
  4. an original line illustration of the part type (`src/components/parts/PartArt.tsx`, 44 drawings)
  5. a category icon

  The broad category photo is never used for a product, so a brake pad never shows a brake disc, and a
  motorcycle is never shown as a part's picture (search suggestions included). Anything other than the
  product's own photo is captioned as not the exact item for sale. Product pages show the bikes a part
  fits beneath its picture.
- **Folders** under `public/images/`:
  - `brands/`: logos supplied by distributors
  - `motorcycles/`: model photos supplied by distributors, named `<model-id>.webp`
  - `products/<brand>/` (bajaj, honda, yamaha, suzuki, tvs, hero, runner): photos of the shop's actual items
  - `products/<part-type>/`: representative stock photos of part types
  - `categories/`, `hero/`, `workshop/`, `oils/`, `accessories/`: stock photos for cards and banners

  Only use photos the shop owns or has permission to use. A credit line does not make a copyrighted
  manufacturer photo usable.
- **Bikes** without a permitted photo are shown as original line drawings of six body styles (commuter,
  street, sport, cruiser, scooter, offroad), so no page shows the wrong bike.
- **Performance**: images go through `next/image` (AVIF/WebP at the sizes each layout needs). Only
  images near the top of a page (banners, the first product cards) load eagerly; the rest load lazily.

### Adding real products

```ts
{
  id: "p-0001",
  slug: "yamaha-fzs-v4-front-brake-pad",
  name: "Yamaha FZS V4 Front Brake Pad",
  category: "brakes",
  subcategory: "brake-pads",
  partBrand: "…",                 // maker of the part, if known
  sku: "…", partNumber: "…",      // only real values
  images: [{ src: "/images/products/yamaha/fzs-v4-front-pad.jpg", alt: "Front brake pad set for Yamaha FZS V4" }],
  price: 650,                     // whole taka; omit for "Call for price"
  currency: "BDT",
  inventoryStatus: "in-stock",
  productStatus: "live",
  authenticity: "aftermarket",    // only if verified
  fitment: "model-specific",
  compatibleModels: ["yamaha-fzs-v4"],
  compatibilityConfidence: "store-confirmed",
  source: { type: "store-supplied", name: "Nirob Autos stock list" },
  isFeatured: true,
}
```

Put product photos in `public/images/products/`. For photos hosted elsewhere, add the host to
`images.remotePatterns` in `next.config.ts`.

## Moving to a database / admin panel

1. Implement `CatalogRepository` (`src/lib/catalog/repository.ts`) against the database (e.g. Supabase
   or PostgreSQL) and switch the exported `repository`.
2. Product pages are pre-rendered at build time with `generateStaticParams`. Unknown slugs still render
   on demand, so new products appear without a rebuild. Add revalidation (or `revalidateTag`) when data
   changes.
3. An admin panel (add or edit products, prices, stock, images, featured flags, orders) can then write
   to the same database. Authentication and storage need choosing first.
4. Order requests currently go to WhatsApp or a phone call and are not stored. To store them, add a
   server action or API route that writes to the database, and update `src/app/privacy/page.tsx`.

## Ordering flow

Cart (stored in the browser) → `/order` → name, phone (validated as a Bangladeshi mobile number), optional
motorcycle and notes, store pickup or courier (address required for courier) → send method:

- **WhatsApp**: opens `wa.me` with the order written out, to the first number in `business.whatsapp`.
  The second number is offered as an alternative. If the browser blocks the new window, the page says
  so and offers a direct button.
- **Phone call**: shows the order text to read out and a call button for `business.phones.orders`.

Nothing is reported as "ordered". The page says the request is only sent when the customer presses
Send in WhatsApp.

## SEO

- Per-page titles, descriptions, canonical URLs and Open Graph tags (`src/lib/seo.ts`)
- `AutoPartsStore` structured data (name, Bangla name, address, phone, hours) on home and contact.
  There are no coordinates, reviews or delivery areas because none were supplied.
- `BreadcrumbList` on all inner pages
- `Product` structured data only for non-sample products that have a price, as search engines require
- `/sitemap.xml` and `/robots.txt`. Cart, order, search and API routes are excluded.

## Analytics

`src/lib/analytics.ts` defines the events (`product_view`, `product_search`, `filter_used`,
`add_to_cart`, `remove_from_cart`, `begin_order`, `order_request_submitted`, `phone_click`,
`whatsapp_click`, `directions_click`, `brand_view`, `model_view`, `category_view`). No provider is
connected. Events go to `window.dataLayer` if one exists and are dispatched as `nirob:analytics` DOM
events.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No (recommended in production) | Public site URL for canonical links, sitemap, structured data |

## Known limitations

- Every catalogue record is `catalogue-only`: real stock, prices, photos and part numbers are still
  needed from the shop. 535 of 583 records need fitment confirmation.
- The photos are temporary Unsplash stock (see `/credits`). There are no photos of the shop or its stock.
- No official brand logos or model photos are shown yet: each needs the distributor's files or written
  permission (`docs/image-requests.md`). Until then brands appear by name and bikes as line drawings.
- There is no order backend: requests are not stored, and the store must reply on WhatsApp or phone.
- Stock is not live.
- The site is English only, though the data and layout are Bangla-ready. A language switch has not been built.
- No map embed is configured; `business.mapEmbedUrl` takes a Google Maps embed URL. The directions link
  searches by address text because exact coordinates were not supplied.
- The logo is a placeholder "N" mark.
- The privacy and terms pages describe how the site works. Payment, returns and warranty terms are not
  stated because they have not been confirmed. Have both pages reviewed before launch.
- Filter changes on listing pages navigate without a loading skeleton. Server rendering of the
  in-memory catalogue is fast, but add pending UI if the data source becomes slow.
