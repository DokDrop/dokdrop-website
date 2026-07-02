# DokDrop — Marketing Site

Static site (no build step) for DokDrop, a concierge provisioning and delivery
service for charter yachts in Miami. Six pages: `index.html`,
`how-it-works.html`, `services.html`, `about.html`, `request.html`,
`contact.html`. Shared design system lives in `assets/css/styles.css`;
shared behavior (nav, scroll reveal, hero chart animation, counters, form
handling, scroll-progress compass) lives in `assets/js/main.js`.

**Navigation pattern**: the header shows only the logo and a circular menu
toggle at every screen size — clicking it opens a full-screen dark overlay
(`.nav-links`) with large serif links and roman-numeral labels, mirroring the
editorial/heritage-brand pattern this design is based on. The same link set
repeats in the large `.mega-footer` sitemap. When adding a new page, copy the
header/nav/footer block from an existing page rather than writing it from
scratch, and add the new link to *both* `.nav-links-inner` and
`.mega-footer-nav` on every page.

## Before launch — replace placeholder content

Everything below is realistic placeholder copy, not real business data:

- **Phone / email**: `(305) 555-0123` and `concierge@dokdrop.com` appear in
  every page's nav, footer, and contact/request pages — find-and-replace
  across all six `.html` files.
- **Marina & anchorage names**: the trust marquee (`index.html`) and service
  area lists (footer, `about.html`, `contact.html`) use plausible Miami
  marina names. Confirm which marinas you actually have relationships with.
- **Testimonial** (`index.html`): fictional captain quote — swap for a real
  one once you have it, or remove the section.
- **Pricing / SLA claims**: "90 min average turnaround," "40+ marinas," "300+
  purveyors," "2–4 hr standard" etc. are illustrative — replace with real
  numbers before publishing.
- **Illustrations**: all graphics are custom inline SVG (no photography), so
  there's nothing to license — but you may want real vessel/marina
  photography in the `illustration-panel` slots on `services.html` and
  `about.html` for a more grounded feel.
- **Request/contact forms**: currently simulate a submission client-side
  (see `main.js`) and show a success state, but do not send data anywhere.
  Wire `#request-form` and `#contact-form` up to your backend, form service
  (e.g. Formspree, Netlify Forms), or email endpoint before launch.

## Local preview

No build step — open `index.html` directly, or serve the folder:

```bash
npx http-server -p 4173
```

## Deploy

Any static host works: drag-and-drop the folder into Netlify/Vercel, push to
GitHub Pages, or upload to S3/Cloudflare Pages. No server-side code, no
database, no dependencies to install.
