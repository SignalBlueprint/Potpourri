---
repo: SignalBlueprint/Potpourri
scan_date: 2026-01-06
status: draft
---

# Potpourri Vision Document

## Foundation Read

Potpourri is a React-based gift shop storefront designed for boutique retailers who want an online presence without the complexity of full e-commerce. Today it delivers a curated browsing experience where customers discover products through categories, lookbooks, and search, then submit inquiries that shop owners manage through a built-in admin dashboard. The core loop is **discovery → inquiry → manual follow-up**—intentionally lightweight for gift shops that prefer personalized conversations over automated checkout.

## Architecture Snapshot

### Stack
- **Frontend:** React 18 + Vite 6 + TypeScript (strict)
- **Routing/State:** TanStack Router + TanStack Query + TanStack Table
- **Styling:** Tailwind CSS with runtime CSS custom properties
- **AI Integration:** Google Gemini API for image enhancement
- **Testing:** Vitest + Testing Library + jest-axe

### Data
- **Storage:** Browser localStorage (inquiries, favorites, products) + IndexedDB (images, enhancement jobs, lookbooks)
- **Key Models:** `Product` (36 mock items), `Inquiry` (with status tracking), `ProductImage` (multi-image + AI variants), `Lookbook` (curated collections with flexible layouts)
- **Persistence:** Demo-mode only; all data lives in the browser

### Patterns
- **Configuration-Driven:** Single `client.config.ts` controls branding, features, categories, contact info
- **Modular Routes:** `makeRouteTree()` generates catalog routes from config; designed for SDK replacement
- **Feature Flags:** `enableCheckout`, `enableAdmin`, `priceMode`, `useSDKAdmin`
- **API Fallback:** Inquiry submission tries backend first, falls back to localStorage

### Gaps
- **No Real Backend:** All persistence is browser-only
- **Hardcoded Auth:** Admin password is `admin123` in sessionStorage
- **Limited Tests:** 3 test files, 6 tests total (routes + accessibility)
- **No Payments:** Checkout route exists but is disabled
- **No Email Integration:** Inquiries captured but not sent anywhere
- **No Analytics:** No tracking, no conversion metrics

## Latent Potential

**The multi-tenant architecture is 90% ready.** The config system already externalizes everything—brand colors, categories, contact info, feature flags. A single environment variable swap could power different storefronts. What's missing is runtime config loading (currently build-time) and a config management UI.

**The Gemini image enhancement pipeline is complete but dormant.** The entire flow exists: upload → enhancement modal → variant generation → gallery display. It just needs an API key. This could instantly transform amateur product photos into professional shots.

**The lookbook feature is a hidden gem.** Full WYSIWYG editor with 6 layout types (hero, grid-2/3/4, masonry, split), publish workflow, and cover image support. Currently zero lookbooks exist. This is ready for content marketing but nobody's creating content.

**Inquiry data is captured but unused.** Every inquiry has `productId`, `productName`, customer info, timestamp, and status. This is a goldmine for understanding demand signals—which products get inquired about, who's asking, what questions they have—but there's no reporting.

**The comparison feature reveals purchase intent.** When someone compares products, they're deep in consideration. This behavioral signal isn't tracked or acted upon.

---

# Idea Generation

## Horizon 1: Quick Wins
*Buildable in days with existing infrastructure*

### 1. Inquiry Intelligence Dashboard

When an owner opens the admin panel, instead of a static inquiry table, they see a live pulse: "**3 new inquiries this week** — Your Rose Gold Vase is getting attention (5 inquiries this month)." The dashboard highlights **hot products** that are generating demand but might be under-stocked. Clicking any product shows a timeline of everyone who's asked about it, their questions, and current status. A simple "Respond" button pre-fills an email template with the customer's name and the product they inquired about. Suddenly the inquiry list becomes a sales pipeline with clear next actions.

### 2. Gemini Photo Studio

The admin clicks "Enhance" on a blurry product photo taken with a phone. A modal appears offering three styles: **Clean Shot** (pure white background, perfect lighting), **Lifestyle** (product on a rustic wooden table with soft shadows), and **Holiday Special** (surrounded by pine branches and warm lights). Gemini generates 3 variants in each style. The owner picks their favorites, and these automatically become the gallery images for that product. What used to require a photographer now happens in 30 seconds. The before/after slider on the product page shows customers the authentic item while the hero image grabs attention.

### 3. Social Lookbook Sharing

The owner curates a "Valentine's Gift Guide" lookbook with their 12 best items. When they hit publish, the system generates an Open Graph preview image using the cover photo and lookbook title. A "Share" button appears with one-click options for Instagram Stories (generates a vertical collage), Pinterest (creates individual pins with deep links), and email (generates a beautiful HTML newsletter). Each share includes a unique tracking parameter. The admin dashboard shows "Your Valentine's lookbook drove 47 visits and 8 inquiries." Content marketing becomes measurable.

---

## Horizon 2: System Expansions
*Requires new infrastructure, weeks of work*

### 1. The Checkout That Knows When to Wait

Not every product should have a "Buy Now" button. A $12 candle? Instant checkout with Stripe. A $2,400 antique mirror? "Schedule a Viewing" that books a calendar slot. A custom gift basket? "Build Your Bundle" wizard with live price calculation. The system introduces a new product attribute: **purchase_flow** (`instant`, `appointment`, `custom`, `inquiry-only`). The frontend adapts automatically. Instant purchases go through a streamlined one-page checkout. Appointments show available slots pulled from the owner's Google Calendar. Custom builds launch a step-by-step configurator. The owner never loses a sale because the checkout didn't match the product.

### 2. Customer Portals with Memory

A returning customer logs in and sees: "Welcome back, Sarah. The Moroccan Tea Set you viewed last month is now back in stock." Their favorites sync across devices. Their inquiry history shows responses from the shop. A "Reorder" button appears next to past purchases. But here's the magic: the shop owner sees a unified customer profile too. When Sarah inquires about a new item, the admin sees her full history—previous purchases, browsing patterns, average order value. A small badge says "VIP: 3 purchases, $847 lifetime." The shop can offer personalized discounts or early access to loyal customers.

### 3. Local Delivery Coordination

The shop turns on "Local Delivery" for a 25-mile radius. Customers entering addresses within range see a new option: "**Same-Day Local Delivery - $8**" alongside standard shipping. The admin dashboard shows a delivery map with pins for pending orders. Routes are suggested for efficiency. The driver app (a simple mobile-responsive page) shows turn-by-turn directions and lets them mark deliveries complete with photo proof. Customers receive SMS: "Your Potpourri order is on its way! Driver is 10 minutes away." For gift shops where personal touch matters, this beats anonymous carrier tracking.

---

## Horizon 3: Blue Sky
*Reframes what Potpourri could become*

### 1. The Gift Shop Network

Potpourri stops being a single-tenant storefront and becomes a **collective**. A customer searching for "handmade pottery" doesn't just see one shop's inventory—they see ceramics from 12 partner boutiques across the region. Each shop maintains its own brand identity and admin dashboard, but products flow into a shared discovery layer. When a purchase happens, the originating shop fulfills it. Revenue shares are automatic. Smaller shops gain the discovery power of a marketplace while keeping their boutique identity. The homepage becomes "Potpourri Collective: 847 curated gifts from 23 local artisans."

### 2. AI Gift Concierge

A customer lands on the site and clicks "Help Me Choose." A conversational interface asks: "Who's the gift for?" (Partner, Parent, Friend, Coworker). "What's the occasion?" (Birthday, Anniversary, Thank You, Just Because). "What are they into?" (Cooking, Gardening, Art, Outdoors). Based on responses, the system surfaces 5 personalized recommendations with explanations: "For a dad who loves grilling, this Artisan BBQ Set ($89) includes hand-carved utensils from our partner Cooper's Woodcraft." The customer can refine with follow-ups: "Something under $50?" The AI re-ranks. If nothing fits, it creates a custom inquiry: "Our team will curate a personal selection for Mike's 60th birthday." The concierge knows the entire catalog and speaks like a knowledgeable shop assistant.

---

## Moonshot

### Potpourri Platform: The Anti-Etsy

If resources were unlimited, Potpourri becomes the **full-stack operating system for independent gift retailers**—a direct counter to Etsy and Amazon Handmade, but designed for shops with physical locations.

**The vision:** A boutique owner downloads Potpourri and is live in 30 minutes. They photograph products with their phone; AI instantly generates professional product shots, writes SEO-optimized descriptions, and suggests competitive pricing based on similar items in the network. Inventory syncs with their point-of-sale system. Walk-in purchases automatically update the website.

**For customers:** A single app discovers gift shops within 50 miles. They can browse virtually, reserve items for pickup, or request local delivery. Gifting is frictionless: they enter a recipient's address, select "wrap and include handwritten note," and a nearby shop fulfills it—no more shipping from a warehouse 2,000 miles away. Gift cards work across the entire network.

**For shop owners:** AI handles the grunt work. "Your inventory of ceramic mugs is low—reorder from your supplier?" "Three customers viewed the Brass Candleholder today; consider featuring it?" "Your competitor in Westfield reduced prices on similar items; here's your margin analysis." Weekly digest emails show performance benchmarks against anonymized network averages.

**The business model:** 3% transaction fee (vs. Etsy's 6.5% + listing fees). Premium tier adds AI photography credits, advanced analytics, and multi-location support. Enterprise tier for gift shop franchises wanting centralized management.

**Why it's exciting:** This returns power to local retailers. Instead of fighting algorithms on platforms that prioritize volume, small shops compete on curation and personal touch—exactly what they're good at. The platform handles everything else.

---

## Next Move

### Most Promising Idea: Inquiry Intelligence Dashboard

**Why this one?** It builds entirely on existing infrastructure (inquiry data is already being captured), delivers immediate value (shop owners can actually do something with leads), and creates a foundation for every future feature. Today, inquiries disappear into a flat table. Tomorrow, they become actionable sales opportunities. This is the "aha moment" that converts a demo into a paying customer.

The data is already there. The UI components exist (charts, tables, filtering). This is connecting dots, not building new systems.

### First Experiment (< 1 day)

Add a single SQL-style aggregation view to the admin dashboard: **"Top 5 Products by Inquiry Count (Last 30 Days)"**. Display as a simple ranked list with product thumbnails and inquiry totals. Track click-through to see if admins engage with it. If they do, the full dashboard has validated demand.

Implementation:
1. Create a new hook `useInquiryStats()` that processes localStorage inquiries
2. Add a `TopInquiredProducts` component to the admin homepage
3. Make each item clickable to filter the inquiries table by product

### One Question That Would Sharpen the Vision

**"How do gift shop owners currently follow up on inquiries, and what makes them lose deals?"**

We're assuming the gap is visibility (they can't see patterns in inquiries) but the real blocker might be response time, crafting replies, or tracking conversations across email/phone. Talking to 3 actual shop owners would reveal whether this dashboard solves their pain or just looks nice. If the problem is "I forget to respond," the solution is automated email notifications, not a dashboard.

---

*This document represents a point-in-time analysis. Ideas should be validated with user research before investment.*
