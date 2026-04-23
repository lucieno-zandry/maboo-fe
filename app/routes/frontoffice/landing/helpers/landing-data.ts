import type {
    Testimonial,
    ComparisonRow,
    FaqItem,
    CollectionCard,
    TrustPillar,
    StorySection,
} from "../types/landing-types";

// ─── Trust Pillars ────────────────────────────────────────────────────────────
export const TRUST_PILLARS: TrustPillar[] = [
    {
        id: "sourcing",
        icon: "Sprout",
        title: "Direct Sourcing",
        description:
            "No middlemen. We work hand-in-hand with partner farmers in the SAVA region.",
    },
    {
        id: "quality",
        icon: "Award",
        title: "Grade A Only",
        description:
            "Every pod, berry, and leaf is hand-selected for optimal moisture, aroma, and appearance.",
    },
    {
        id: "shipping",
        icon: "PackageCheck",
        title: "48–72h in France",
        description:
            "Shipped via Colissimo & FedEx from our French depot. Tracked from warehouse to door.",
    },
    {
        id: "payment",
        icon: "ShieldCheck",
        title: "Secure Payment",
        description:
            "SSL-encrypted checkout. Visa, Mastercard, PayPal — fully protected transactions.",
    },
];

// ─── Collections ──────────────────────────────────────────────────────────────
export const COLLECTIONS: CollectionCard[] = [
    {
        id: "vanilla",
        slug: "vanilla",
        title: "Bourbon Vanilla",
        subtitle: "The jewel of Madagascar",
        // IMAGE PLACEHOLDER: High-quality macro photo of split vanilla pods showing
        // dark, moist interior with visible seeds — warm amber/brown tones
        image: "https://images.unsplash.com/photo-1682482198446-4cbf92f85a4b",
        startingPrice: 12.9,
        currency: "EUR",
        productCount: 8,
    },
    {
        id: "pepper",
        slug: "peppercorns",
        title: "Wild Peppercorns",
        subtitle: "Forest-harvested intensity",
        // IMAGE PLACEHOLDER: Close-up of mixed peppercorns (black, red, white)
        // piled on a dark slate surface — deep shadows, rich texture
        image: "https://images.unsplash.com/photo-1649966585698-77645b854c82",
        startingPrice: 8.5,
        currency: "EUR",
        productCount: 5,
    },
    {
        id: "spices",
        slug: "wild-spices",
        title: "Wild Spices",
        subtitle: "The Red Island's finest",
        // IMAGE PLACEHOLDER: Flat lay of assorted dried spices — cloves, cinnamon
        // sticks, cardamom pods — arranged on a terracotta-toned linen cloth
        image: "https://images.unsplash.com/photo-1716816211590-c15a328a5ff0",
        startingPrice: 6.9,
        currency: "EUR",
        productCount: 12,
    },
];

// ─── Comparison Table Data ────────────────────────────────────────────────────
export const COMPARISON_ROWS: ComparisonRow[] = [
    { criteria: "Origin traceability", ours: "SAVA Region, Madagascar", theirs: "Unknown" },
    { criteria: "Grade", ours: "Grade A (Premium)", theirs: "Commercial Grade" },
    { criteria: "Harvest method", ours: "Hand-picked", theirs: "Machine-harvested" },
    { criteria: "Vanilla content (vanillin)", ours: "1.6–2.0%", theirs: "< 0.8%" },
    { criteria: "Price/gram transparency", ours: true, theirs: false },
    { criteria: "Direct farmer partnership", ours: true, theirs: false },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const TESTIMONIALS: Testimonial[] = [
    {
        id: "t1",
        author: "Sophie M.",
        location: "Paris, France",
        // IMAGE PLACEHOLDER: Neutral avatar or initials fallback
        avatar: "../public/images/avatar-woman-1.jpg",
        rating: 5,
        text: "The vanilla pods are extraordinary — twice the aroma of anything I've found at the market. My crème brûlée has never been the same.",
        verified: true,
    },
    {
        id: "t2",
        author: "Julien R.",
        location: "Lyon, France",
        avatar: "../public/images/avatar-man-1.jpg",
        rating: 5,
        text: "Fast delivery, impeccable packaging. The peppercorns are punchy and fresh. I've already reordered twice.",
        verified: true,
    },
    {
        id: "t3",
        author: "Marie-Hélène B.",
        location: "Bordeaux, France",
        avatar: "../public/images/avatar-woman-2.jpg",
        rating: 5,
        text: "Finally a shop that's transparent about origins. The SAVA label gives me confidence. Quality is unmatched at this price.",
        verified: true,
    },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
export const FAQ_ITEMS: FaqItem[] = [
    {
        id: "faq1",
        question: "Where do your products come from?",
        answer:
            "All of our products come directly from partner producers in Madagascar's SAVA region — the world capital of Bourbon vanilla and wild spices. We visit our partners regularly to ensure quality and fair trade conditions.",
    },
    {
        id: "faq2",
        question: "What are your delivery times?",
        answer:
            "We ship from our French depot within 24 hours of your order. Delivery takes 48–72 hours across metropolitan France via Colissimo tracked shipping. International delivery is also available — check at checkout.",
    },
    {
        id: "faq3",
        question: "How should I store vanilla pods?",
        answer:
            "Keep your pods in an airtight container away from light and heat, ideally at room temperature (18–22°C). Properly stored pods maintain peak aroma for up to 2 years.",
    },
    {
        id: "faq4",
        question: "Do you offer bulk or professional orders?",
        answer:
            "Yes! We have dedicated pricing for pastry chefs, restaurants, and professional buyers. Contact us via the form below or by email for a custom quote.",
    },
    {
        id: "faq5",
        question: "What payment methods do you accept?",
        answer:
            "We accept Visa, Mastercard, and PayPal. All transactions are SSL-encrypted for your security. You can also pay in 3 instalments for orders over €50.",
    },
];

// ─── Brand Story Data ─────────────────────────────────────────────────────────
export const STORY_CONTENT: StorySection = {
    headline: "From the SAVA River\nto your kitchen.",
    subheadline: "A story rooted in red earth.",
    body: "In the northeastern highlands of Madagascar, the SAVA region shelters some of the world's most prized vanilla orchids. Our founders travelled there in 2018 not to trade — but to listen. To understand the soil, the harvest cycles, and the families who tend these fields with extraordinary care. What followed was a direct partnership model that skips every middleman and puts premium into the hands of the people who grow it — and the people who cook with it.",
    // IMAGE PLACEHOLDER: Aerial or landscape shot of the SAVA region in Madagascar
    // — lush green plantations, red laterite roads, possibly a river in the frame.
    // Warm golden-hour lighting preferred. Aspect ratio approx 4:3 or 16:9.
    image: "https://images.unsplash.com/photo-1585335947330-16b2a34d939e",
    imageCaption: "The SAVA Region, northeastern Madagascar — where our vanilla is grown.",
};

// ─── Format price helper ──────────────────────────────────────────────────────
export function formatPrice(price: number, currency = "EUR", locale = "fr-FR"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(price);
}