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
| Photos and their credits | `src/config/photos.ts`, files in `public/images/` |
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
- `fitment` is `model-specific`, `universal` (e.g. chain lube) or `unconfirmed` (shown as "call to confirm").
- `stockStatus` supports in stock, low stock, out of stock, available on request and call to confirm.
  Stock is not live. Every product currently uses "call to confirm".
- `productType` (genuine/OEM/aftermarket/compatible) is shown only when it is not `unknown`. Only set
  it when the shop has verified it.
- A missing `price` shows "Call for price". Prices are never invented.
- Filters only appear when they can actually narrow the results, and all filter state lives in the URL
  (`/shop?brand=yamaha&category=brake-pads`).

### Demo catalogue

`src/data/products.ts` generates **159 demo products** (`isSample: true`). 131 are model-specific
listings from `demoAssignments` (model plus part kind) and 28 are universal items (oils, fluids,
accessories). They show how the shop is organised and are **not confirmed Nirob Autos stock**. Every
demo product:

- shows a "Demo catalogue" badge, and the pages show a catalogue-preview banner
- is `noindex` and left out of the sitemap
- has no price, SKU, part number, specification, photo of its own or verified type
- uses "call to confirm" availability
- is listed only where the bike has that part according to its official spec. Examples: brake pads
  only for a wheel with a disc, brake shoes only for a drum, CVT belts only on scooters, carburettors
  only on carburettor bikes. Each entry in `partKinds` has a `requires` rule for this.

Unit tests fail if a demo product gets a price, part number, specs, a verified type or a photo. They
also fail if an assignment breaks its `requires` rule. **Replace the demo records with the real
inventory before launch.** Remove `isSample` from real records.

### Motorcycle directory

`src/data/models.ts` lists **118 models** across 7 brands, checked on 2 October 2026 against each
brand's official site. Every model stores its source URL.

| Brand | Official source | Models |
| --- | --- | --- |
| Bajaj | bajajauto.com/en-bd, plus bajajauto.com for models sold outside BD | 10 current, 13 outside BD |
| Honda | bdhonda.com | 11 current, 2 earlier |
| Yamaha | yamahabd.com | 16 current, 1 outside BD |
| Suzuki | suzuki.com.bd | 10 current, 1 outside BD |
| TVS | bangladesh.tvsmotor.com | 4 current, 1 earlier, 6 outside BD |
| Hero | heromotocorp.com/en-bd | 25 current, 1 outside BD |
| Runner | motorcycles.runnerautomobiles.com, runnerbd.com | 15 current, 2 earlier |

`status` takes one of three values:

- `bd-current`: in the official Bangladesh line-up
- `bd-earlier`: an older official Bangladesh model
- `official-other`: in the official catalogue outside Bangladesh only. These are hidden behind a toggle in the directory.

Brake and fuel-system specs are filled in only when the official page states them. UM-branded bikes
sold through Runner showrooms are not listed under Runner. Review the list against the bikes the shop
actually supplies parts for. For example, the FZS V3 is no longer on yamahabd.com and is not listed.

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
and Hero, with genuine parts at company price. The card prints "Hero Honda", the brand's name before
2011, and the site shows "Hero" at the owner's request. The shop also sells original Yamaha, Suzuki and
Honda parts. These details live in `business.dealerships` and `business.originalPartsBrands` in
`src/config/business.ts`. Brand cards, brand and model pages, the About page, the footer and the terms
read from there.

### Images

- **Photos**: 31 photos from [Unsplash](https://unsplash.com) under the
  [Unsplash License](https://unsplash.com/license). They are stored as WebP in `public/images/` and
  registered in `src/config/photos.ts` with alt text, photographer and source page. `/credits` lists
  them all. The hero photo's number plate is blurred. These photos are **temporary**: replace them with
  the shop's own photos when available.
- **Product images** fall back in this order: the product's own photo, then its representative `photo`,
  then its subcategory photo, then its category photo, then a line drawing of the bike type, then a gear
  placeholder. Anything other than the product's own photo is captioned "Representative photo, not the
  exact item for sale".
- **Bikes** are shown as original line drawings of six body styles (commuter, street, sport, cruiser,
  scooter, offroad), never as photos of a specific model, so no page shows the wrong bike.

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
  images: [{ src: "/images/products/fzs-v4-front-pad.jpg", alt: "Front brake pad set for Yamaha FZS V4" }],
  price: 650,                     // whole taka; omit for "Call for price"
  currency: "BDT",
  stockStatus: "in-stock",
  productType: "aftermarket",     // only if verified
  fitment: "model-specific",
  compatibleModels: ["yamaha-fzs-v4"],
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

- The catalogue is demo data. Real inventory, prices, photos and part numbers are still needed.
- The photos are temporary Unsplash stock (see `/credits`). There are no photos of the shop or its stock.
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
