# Landing Page — File Structure & Developer Guide

## Directory Tree

```
app/landing/
│
├── index.tsx                          ← Route root: loader + page composition
├── landing.css                        ← All styles (design tokens, sections)
│
├── types/
│   └── landing-types.ts               ← Testimonial, FaqItem, CollectionCard, etc.
│
├── helpers/
│   └── landing-data.ts                ← Static seed data + formatPrice()
│
├── stores/
│   └── use-landing-ui-store.ts        ← Zustand: FAQ open state, sticky CTA, hero variant
│
├── hooks/
│   └── use-sticky-cta-trigger.ts      ← IntersectionObserver → store setter
│
└── components/
    │
    ├── hero/
    │   ├── hero.tsx                   ← Smart: variant select, scroll, cart handler
    │   ├── hero-view.tsx              ← Dumb: full hero JSX, receives all via props
    │   ├── sticky-cta-bar.tsx         ← Smart: reads store visibility
    │   └── sticky-cta-bar-view.tsx    ← Dumb: floating bar UI
    │
    ├── trust-bar/
    │   ├── trust-bar.tsx              ← Smart: provides TRUST_PILLARS data
    │   └── trust-bar-view.tsx         ← Dumb: 4-column icon + text grid
    │
    ├── collections/
    │   ├── collections.tsx            ← Smart: provides COLLECTIONS data
    │   └── collections-view.tsx       ← Dumb: 3-card grid with hover effects
    │
    ├── featured-product/
    │   ├── featured-products.tsx      ← Smart: useFetcher load + initialProducts SSR
    │   └── featured-products-view.tsx ← Dumb: wraps existing <ProductGrid />
    │
    ├── story/
    │   ├── story.tsx                  ← Smart: provides STORY_CONTENT
    │   └── story-view.tsx             ← Dumb: split-panel layout with stats
    │
    ├── comparison/
    │   ├── comparison.tsx             ← Smart: provides COMPARISON_ROWS
    │   └── comparison-view.tsx        ← Dumb: dark table, boolean ✓/✗ rendering
    │
    ├── testimonials/
    │   ├── testimonials.tsx           ← Smart: provides TESTIMONIALS
    │   └── testimonials-view.tsx      ← Dumb: 3-card grid + payment strip
    │
    ├── faq/
    │   ├── faq.tsx                    ← Smart: reads/writes openFaqId from store
    │   └── faq-view.tsx               ← Dumb: accordion, CSS max-height animation
    │
    └── cta-banner/
        ├── cta-banner.tsx             ← Smart: useNavigate to /products
        └── cta-banner-view.tsx        ← Dumb: full-bleed dark banner with bg image
```

---

## Section Order (Visual Flow)

| # | Component       | Purpose                                      | Background       |
|---|-----------------|----------------------------------------------|------------------|
| 1 | `<Hero />`      | First impression, variant selector, CTA      | Full-bleed image |
| 2 | `<TrustBar />`  | Build instant credibility (4 pillars)        | Forest green     |
| 3 | `<Collections />`| Category discovery (Vanilla, Pepper, Spices) | Parchment        |
| 4 | `<FeaturedProducts />`| Bestseller grid — reuses ProductGrid   | Cream            |
| 5 | `<Story />`     | Emotional brand origin story (SAVA)          | Parchment, split |
| 6 | `<Comparison />`| Product quality proof table                  | Dark bark        |
| 7 | `<Testimonials />`| Social proof + payment method strip        | Parchment        |
| 8 | `<Faq />`       | Objection handling accordion                 | Cream            |
| 9 | `<CtaBanner />` | Bottom conversion push                       | Full-bleed dark  |

---

## Smart / Dumb Pattern

Every section is split into two files:

**Smart (`section.tsx`)** — No HTML, no JSX.
- Reads from stores, loaders, fetchers
- Derives computed values
- Passes everything as props to the View
- Handles side effects (navigation, cart actions)

**Dumb (`section-view.tsx`)** — Pure JSX.
- Receives all data and handlers via props
- No imports from stores, hooks, or fetchers
- Fully testable in isolation (Storybook-ready)

---

## Images to Replace

| File path                                | Content                                                     |
|------------------------------------------|-------------------------------------------------------------|
| `/public/images/hero-bg.jpg`             | Vanilla farmer hands with pods, plantation background       |
| `/public/images/collection-vanilla.jpg`  | Macro split vanilla pods, amber tones, portrait             |
| `/public/images/collection-pepper.jpg`   | Mixed peppercorns on dark slate, portrait                   |
| `/public/images/collection-spices.jpg`   | Cloves/cinnamon/cardamom flat lay on linen, portrait        |
| `/public/images/sava-region-madagascar.jpg` | SAVA region aerial/landscape, golden hour               |
| `/public/images/cta-banner-bg.jpg`       | Vanilla pods fan on dark wood/linen, very dark              |
| `/public/images/hero-product-thumb.jpg`  | 40×40px product thumbnail for sticky CTA bar               |
| `/public/images/avatar-*.jpg`            | Customer avatars (fallback: initials shown automatically)   |

---

## Connecting FeaturedProducts to Your API

The `<FeaturedProducts />` component expects a resource route at:

```
app/routes/api/featured-products.tsx
```

The loader should mirror `products.tsx`:

```ts
export const loader = async (args: LoaderFunctionArgs) => {
  const { request } = args;
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") ?? 4);
  // add `featured=true` or `sort=best_selling` when API supports it
  const response = await getProducts({ page: 1, limit }, { headers });
  return response.data;
};
```

---

## Fonts

Add to your root `layout.tsx` `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
  rel="stylesheet"
/>
```

---

## Zustand Store: `useLandingUIStore`

| State key              | Type      | Set by                               | Read by          |
|------------------------|-----------|--------------------------------------|------------------|
| `openFaqId`            | string?   | `Faq` (smart) via `toggleFaq`       | `FaqView`        |
| `isStickyCTAVisible`   | boolean   | `useStickyCtaTrigger` hook          | `StickyCTABar`   |
| `selectedHeroVariantId`| string?   | `Hero` (smart) on pill click        | `HeroView`       |