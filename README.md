# Nirob Autos | নিরব অটো'স

Website for Nirob Autos, a motorcycle spare-parts shop at N401, Madhupur, Bangladesh. Customers find a
part (by search, bike model or category), check what it fits, add it to a cart, and send an order
request to the shop by WhatsApp or phone. Customers can pick up from the store or have parts sent by
courier anywhere in Bangladesh. The site does not take payments online.

## Tech stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict)
- Tailwind CSS v4 with design tokens in `src/app/globals.css`
- `lucide-react` icons, `next/font` (Inter, Barlow, Noto Sans Bengali)
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
| Colours, fonts, button styles | `src/app/globals.css` (`@theme` block) |
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

### Sample data

`src/data/products.ts` holds **27 sample products** (`isSample: true`) so the site can be built and
tested. They are not confirmed Nirob Autos stock, and:

- show a "Sample listing" badge and a catalogue-preview banner
- are set to `noindex` and left out of the sitemap
- have no price, SKU, part number, specification or verified type
- list only the model named in the product itself

A unit test fails if a sample product is ever given a price, part number, specs or a verified type.
**Replace this file with the real inventory before launch.** Remove `isSample` from real records.

The model list in `src/data/models.ts` is a starting set of popular models. Review it against the
bikes the shop actually supplies parts for.

### Adding real products

```ts
{
  id: "p-0001",
  slug: "yamaha-fzs-v3-front-brake-pad",
  name: "Yamaha FZS V3 Front Brake Pad",
  category: "brakes",
  subcategory: "brake-pads",
  partBrand: "…",                 // maker of the part, if known
  sku: "…", partNumber: "…",      // only real values
  images: [{ src: "/images/products/fzs-v3-front-pad.jpg", alt: "Front brake pad set for Yamaha FZS V3" }],
  price: 650,                     // whole taka; omit for "Call for price"
  currency: "BDT",
  stockStatus: "in-stock",
  productType: "aftermarket",     // only if verified
  fitment: "model-specific",
  compatibleModels: ["yamaha-fzs-v3", "yamaha-fzs-v2"],
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

- The catalogue is sample data. Real inventory, prices, photos and part numbers are still needed.
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
