# Kethama Pharmacy

Public pharmacy showcase built with React, TypeScript, Vite and Tailwind CSS.
There is no live backend, authentication, checkout or database in this release.
Product availability, suitability, prices and appointments are confirmed by the pharmacy.

## Local development

Use Node.js 22 LTS or later and npm.

1. `npm ci`
2. `npm run dev`

No API key or environment file is required. Never place secrets in frontend source or Vite variables.

## Checks and production preview

- `npm run lint` — TypeScript checks.
- `npm test` — validation, safe storage and WhatsApp URL regression tests.
- `npm audit` — dependency advisories.
- `npm run build` — production bundle in `dist`.
- `npm run preview` — serve that bundle locally.

## Data and enquiries

Catalog and articles are local TypeScript datasets in `src/data.ts`; read queries are wrapped in `src/lib/mockApi.ts`.
All public enquiry flows hand off to the same WhatsApp number in `src/lib/whatsapp.ts`.
This is a WhatsApp click-to-chat link, **not** the WhatsApp Business API. Visitors must press Send in WhatsApp; the website cannot confirm message delivery or a booking.
Wishlist and article bookmark IDs are stored only on the visitor's device. Demo authentication is disabled and old demo profiles are never loaded.

Local service pictures are imported and bundled as optimized WebP. Original PNGs remain available as source assets.
External supplier and article pictures use a local fallback when unavailable.

## Deployment handoff

Vercel: framework preset **Vite**, build command `npm run build`, output directory `dist`.
`vercel.json` supports client-side route refreshes. No deployment or GitHub upload has been performed by the review implementation.
Before public launch, have the business confirm the displayed contact details, services, product imagery rights, health content, and legal copy.
Check direct article/product links, service images, and WhatsApp handoff on the deployed preview and a real phone.
See `SYSTEM_REVIEW.md` for the original audit and `IMPLEMENTATION_STATUS.md` for completed fixes and verification limits.
