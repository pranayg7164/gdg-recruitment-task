# GDG AITR Portal Review

Reviewed on: mobile + desktop
Site: https://gdgocaitr.vercel.app/

## Issues Found

### 1. Pinch-zoom is disabled on mobile
- **Where:** viewport meta tag (`user-scalable=no`, `maximum-scale=1.0`)
- **Why it matters:** users with weak eyesight can't zoom in; it's an accessibility problem.
- **Fix:** remove `user-scalable=no` and `maximum-scale=1.0`.

### 2. Blank page when JavaScript is disabled / slow to load
- **Where:** whole site (client-side rendered)
- **Why it matters:** only "Please enable JavaScript" shows up; bad for SEO and slow phones.
- **Fix:** use server-side rendering / static generation (e.g. Next.js) or add a `<noscript>` fallback with basic info.

### 3. Weak social sharing preview
- **Where:** Open Graph / Twitter meta tags
- **Why it matters:** only a small logo shows when the link is shared.
- **Fix:** add a 1200x630 banner as og:image and use `twitter:card = summary_large_image`.


## What's Good
- Proper meta description, canonical URL, theme color, Open Graph tags
- Clear page title

## Suggestions for New Features
- Upcoming events section with calendar
- Team / members page
- Past events gallery
- Dark mode
- Direct "Join GDG" registration button
