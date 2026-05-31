# Evolved Floors Static Site - Sitemap & Build Plan

**Project:** Full replica of evolvedfloors.com.au as static HTML/CSS/JS  
**Hosting:** Cloudflare Pages at evolvedluxuryfloors.com.au  
**Design Pattern:** Apple-style tile grid layout with hero section  

---

## Phase 1 Status: ✅ COMPLETE
- Homepage (index.html) built with Apple-style tile grid
- Navigation bar implemented with phone CTA
- Hero section with brand colours (#8a7f72) and white space
- Responsive design for mobile/tablet
- Pure HTML/CSS/JS, no frameworks

---

## Pages to Replicate (Priority Order)

### Tier 1 - Core Pages (Must Build)
| URL | Status | Title (from audit) | Meta Description | Priority | Notes |
|-----|--------|-------------------|-----------------|----------|-------|
| `/` | ✅ Built | Flooring Gold Coast \| Family-Owned, Expert Install | Premium flooring on Gold Coast, Brisbane & Byron Bay | 1 | Homepage - Apple-style grid |
| `/gold-coast/` | Pending | Gold Coast Flooring Showroom \| Visit Evolved Floors | Family-owned flooring showroom in Molendinar - compare colours, textures, finishes | 2 | Showroom location, hero + content |
| `/brisbane/` | Pending | Flooring Brisbane \| Premium Supply & Install | Premium flooring in Brisbane. In-home site measures & samples brought to you. Expert installation. | 3 | Mobile service, site measures CTA |
| `/byron-bay/` | Pending | Flooring Byron Bay \| Design Studio | Byron Bay Design Studio - premium flooring for coastal homes, rentals, high-traffic zones | 4 | New location, design studio vibe |
| `/about-evolved-floors/` | Pending | About Evolved Floors \| Gold Coast Flooring Experts | Family-owned flooring specialist. 45+ years industry experience. Premium installations. | 5 | Team story, credentials |
| `/contact/` | Pending | Contact Evolved Floors | Contact form, locations, hours, phone, email. Get in touch with Evolved Floors. | 6 | Contact form, map integration |

### Tier 2 - Product Pages (High Value)
| URL | Status | Title | Meta Description | Notes |
|-----|--------|-------|-----------------|-------|
| `/timber-flooring-gold-coast/` | Pending | Timber Flooring Gold Coast \| Hardwood & Engineered | Solid hardwood & engineered timber for Gold Coast homes. Australian species, finishes. | Long-form content, product specs |
| `/timber-flooring-brisbane/` | Pending | Timber Flooring Brisbane | Engineered timber for Brisbane climate. Install + specs. | Regional variation |
| `/timber-flooring-byron-bay/` | Pending | Timber Flooring Byron Bay | Coastal timber for Byron Bay homes. | Lifestyle angle |
| `/hybrid-flooring-brisbane/` | Pending | Hybrid Flooring Brisbane \| Waterproof, Expert Install | Waterproof hybrid flooring for Brisbane kitchens, bathrooms, high-traffic areas | Durable, practical focus |
| `/carpet-gold-coast/` | Pending | Carpet Gold Coast \| Wool & Synthetic, Expert Install | Premium carpet for Gold Coast homes. Wool, synthetic, blends. Comfort + style. | Comfort narrative |
| `/carpet-brisbane/` | Pending | Carpet Brisbane | Carpet for Brisbane homes and commercial spaces. | |
| `/carpet-byron-bay/` | Pending | Carpet Byron Bay | | |
| `/vinyl-flooring-gold-coast/` | Pending | Vinyl Flooring Gold Coast | Luxury vinyl plank, sheets. Water-resistant. | |
| `/vinyl-flooring-brisbane/` | Pending | Vinyl Flooring Brisbane | | |
| `/laminate-flooring-gold-coast/` | Pending | Laminate Flooring Gold Coast | Budget-friendly, durable laminate flooring. | |
| `/laminate-flooring-byron-bay/` | Pending | Laminate Flooring Byron Bay | | |
| `/cork-flooring-byron-bay/` | Pending | Cork Flooring Byron Bay | Eco-friendly, natural cork for coastal homes. | Sustainability angle |
| `/herringbone-chevron-flooring-gold-coast/` | Pending | Herringbone/Chevron Flooring Gold Coast | Premium herringbone & chevron patterns. | Design premium |
| `/herringbone-flooring-brisbane/` | Pending | Herringbone Flooring Brisbane | | |
| `/best-flooring-gold-coast/` | Pending | Best Flooring Gold Coast | Comparison guide - what's best for your home? | Educational |

### Tier 3 - Segment Pages (Medium Priority)
| URL | Status | Title | Meta Description | Notes |
|-----|--------|-------|-----------------|-------|
| `/architects/` | Pending | Architects & Designers - Evolved Floors | Specification support, samples, technical detail for design professionals. | B2B content |
| `/new-builds/` | Pending | Flooring for New Builds | New build flooring solutions, timelines, specifications. | Project type |
| `/renovations/` | Pending | Flooring for Renovations | Renovation flooring - colour matching, coordination, timing. | Project type |
| `/homeowners/` | Pending | Flooring for Homeowners | Residential flooring selection guide, care, installation. | Buyer journey |
| `/builders/` | Pending | Builder Flooring Supply & Install | Trade flooring program, volume pricing, project support. | B2B/trade |
| `/trade-program-new/` | Pending | Trade Program | Trade discounts, support, specification coordination. | B2B |
| `/commercial-flooring/` | Pending | Commercial Flooring Gold Coast & Brisbane | Multi-storey developments, shopfits, offices. Technical specs, case studies. | B2B flagship |

### Tier 4 - Content & Support Pages
| URL | Status | Title | Meta Description | Notes |
|-----|--------|-------|-----------------|-------|
| `/gallery/` | Pending | Flooring Gallery - Project Showcase | Before/after gallery, room examples, installations. | Visual portfolio |
| `/sustainability/` | Pending | Sustainable Flooring Options | Eco-friendly products, cork, renewable timber, low-VOC finishes. | ESG content |
| `/faqs/` | Pending | Flooring FAQs | Common questions answered - installation, care, warranty, costs. | Support content |
| `/finance/` | Pending | Flooring Finance Options | Payment plans, financing information. | Conversion support |
| `/site-measure/` | Pending | Book a Site Measure | Site measurement booking system. | Lead generation |
| `/flooring-blog-gold-coast/` | Pending | Flooring Blog | Regular blog posts, guides, tips. | SEO/thought leadership |

### Tier 5 - Legal & Support
| URL | Status | Title | Meta Description | Notes |
|-----|--------|-------|-----------------|-------|
| `/privacy-policy/` | Pending | Privacy Policy | Legal privacy statement. | Legal compliance |
| `/terms/` | Pending | Terms & Conditions | Legal terms of service. | Legal compliance |
| `/thanks-for-your-enquiry/` | Pending | Thank You | Confirmation page after enquiry submission. | User flow |

---

## Pages to REDIRECT (External)

These pages should redirect to external tools hosted on tools.evolvedluxuryfloors.com.au:

| Current URL | Status | Redirect Target | Purpose |
|-------------|--------|-----------------|---------|
| `/instant-quote/` | Pending | https://tools.evolvedluxuryfloors.com.au/quote | Quote calculator |
| `/site-quote-tool/` | Pending | https://tools.evolvedluxuryfloors.com.au/quote | Same as above |

---

## Pages to SKIP (WooCommerce)

These pages contain WooCommerce product/ecommerce functionality and will be omitted from the static build:

| Current URL | Reason |
|-------------|--------|
| `/shop/` | WooCommerce product listing - not needed for content replica |
| `/cart/` | WooCommerce shopping cart - not needed |
| `/checkout/` | WooCommerce checkout - not needed |
| `/my-account/` | WooCommerce account management - not needed |
| `/products/` | WooCommerce category - not needed |

---

## Build Specifications

### Technology Stack
- **HTML5** - semantic markup
- **CSS3** - responsive design, flexbox/grid
- **JavaScript** (ES6+) - interactivity (optional, minimal)
- **No frameworks** - React, Next.js, Vue not required
- **No WordPress** - pure static files

### File Structure
```
evolved-site/
├── index.html (homepage)
├── gold-coast/index.html
├── brisbane/index.html
├── byron-bay/index.html
├── about-evolved-floors/index.html
├── contact/index.html
├── commercial-flooring/index.html
├── timber-flooring-gold-coast/index.html
├── timber-flooring-brisbane/index.html
├── timber-flooring-byron-bay/index.html
├── hybrid-flooring-brisbane/index.html
├── carpet-gold-coast/index.html
├── carpet-brisbane/index.html
├── carpet-byron-bay/index.html
├── vinyl-flooring-gold-coast/index.html
├── vinyl-flooring-brisbane/index.html
├── laminate-flooring-gold-coast/index.html
├── laminate-flooring-byron-bay/index.html
├── cork-flooring-byron-bay/index.html
├── herringbone-chevron-flooring-gold-coast/index.html
├── herringbone-flooring-brisbane/index.html
├── best-flooring-gold-coast/index.html
├── architects/index.html
├── new-builds/index.html
├── renovations/index.html
├── homeowners/index.html
├── builders/index.html
├── trade-program-new/index.html
├── gallery/index.html
├── sustainability/index.html
├── faqs/index.html
├── finance/index.html
├── site-measure/index.html
├── flooring-blog-gold-coast/index.html
├── privacy-policy/index.html
├── terms/index.html
├── thanks-for-your-enquiry/index.html
└── _redirects (Cloudflare redirects)
```

### Key Features per Page
- **Meta tags** - title (50-60 chars), description (140-160 chars), canonical URLs
- **Schema markup** - LocalBusiness on homepage & contact page
- **Responsive design** - mobile-first, works on all screen sizes
- **Navigation** - consistent header/footer on all pages
- **Internal linking** - cross-links to related pages (products, locations, services)
- **Alt text** - all images have descriptive alt attributes
- **Accessibility** - semantic HTML, WCAG 2.1 AA compliant headings, contrast

### Content Sources

From audit of live site, key content themes:
1. **Location-specific content** - Gold Coast, Brisbane, Byron Bay each have unique climate/lifestyle angles
2. **Product education** - help people choose (timber vs hybrid, why engineered is better for coastal areas, etc.)
3. **Service descriptions** - showroom experience, site measures, mobile service, mobile service across Brisbane
4. **Trust signals** - 45+ years experience, family-owned, expert installers, transparent pricing
5. **CTAs** - "Get an instant quote", "Book a site measure", "Call 1300 45 11 32", contact form

### Branding

- **Primary Colour:** #8a7f72 (warm taupe/brown)
- **Secondary Accent:** #6f6b5e (darker variant)
- **Background:** Off-white #f9f9f9
- **Text:** Dark grey #333, lighter grey #666
- **Logo:** Evolved Floors black text logo (SVG or base64)
- **Typography:** System fonts (- apple-system, BlinkMacSystemFont, Segoe UI, Roboto)

---

## Images to Use

From live site, fetch high-quality images for:
- Product shots (timber, hybrid, vinyl, carpet samples)
- Location/showroom photos (Gold Coast, Brisbane, Byron Bay)
- Installation projects (before/after)
- Team/people photos
- Customer testimonials (if available)

**Image hosting:** Embed as base64 for critical images (logo), serve external URLs via Cloudflare for product/project images.

---

## Phase 2 Tasks (After Homepage Approval)

1. Build all Tier 1 pages (Gold Coast, Brisbane, Byron Bay, About, Contact)
2. Implement contact form backend (via Formspree, Netlify Forms, or similar)
3. Build all Tier 2 product pages with consistent product comparison layouts
4. Set up redirects for quote tool, site measure
5. Implement SEO/schema across all pages
6. Test mobile responsiveness
7. Deploy to Cloudflare Pages
8. Set up domain redirect (evolvedfloors.com.au → evolvedluxuryfloors.com.au)
9. Monitor 404 errors, set up 301 redirects for old URLs if needed
10. Performance optimization (Lighthouse audit, image optimization)

---

## Audit Summary

**Current Site Title:** Flooring Gold Coast | Family-Owned, Expert Install  
**Current H1 Patterns:**
- "Gold Coast Flooring Showroom" (location pages)
- "Flooring [Location] In-Home Site Measures & Samples" (service pages)
- "Commercial Flooring Projects" (commercial)
- "[Product] Flooring [Location]" (product pages)

**Key Content Gaps (for blog/future content):**
- "How much does flooring cost?" - pricing transparency guide
- "Commercial flooring Brisbane" - virtually no good content exists
- "Flooring care guides" - maintenance by product type
- "Brisbane vs Gold Coast flooring choices" - regional comparison
- "Why choose engineered timber?" - educational content

**Current Service Offerings:**
- Showroom visits (Gold Coast, Byron Bay)
- Mobile site measures (Brisbane)
- Instant quote tool
- Expert installation
- Volume/trade support

---

## Success Criteria

✅ Phase 1 complete when:
1. Homepage HTML file created at /home/rich/.openclaw/workspace/evolved-site/index.html
2. SITEMAP.md created documenting all pages
3. Apple-style tile grid layout implemented
4. Navigation bar with phone CTA
5. Hero section with white overlay
6. Footer with contact info and links
7. Mobile responsive
8. No frameworks, pure HTML/CSS/JS

---

## Next Steps

1. Approve homepage design
2. Begin Phase 2: Inner pages (locations, products)
3. Collect high-quality images from live site
4. Set up form backend for contact form
5. Configure Cloudflare Pages deployment
