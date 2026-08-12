# Intelligence Designed To Evolve

Single-viewport, full-bleed video-background landing page built with Next.js
(App Router) and plain CSS.

The whole page fits one viewport and never scrolls: header, hero and stats
footer are stacked over a looping background video.

## Run

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Structure

```
app/
  layout.tsx        document metadata + CDN font/icon links
  page.tsx          composes the three viewport regions
  globals.css       the entire stylesheet (design tokens, layout, animations)
components/
  BackgroundVideo.tsx   full-bleed cover video
  SiteNav.tsx           header: logo, desktop nav pill, sign in, burger
  MobileMenu.tsx        overlay + sheet menu (<= 720px)
  Hero.tsx              trust row, headline, subhead, CTA
  StatsFooter.tsx       four counting metrics
hooks/
  useCountUp.ts         IntersectionObserver + easeOutCubic count-up
  useMobileMenu.ts      open state, Escape / resize handling
lib/
  content.ts            nav links, stats and trust brand data
public/
  assets/logo.webp
  fonts/GeistPixel-Circle.woff2
```

## Typography

| Family | Use | Source |
| --- | --- | --- |
| Inter (400/500/600) | UI text | Google Fonts |
| BubbledotICG-FinePos | display: headline + stat glyphs | OnlineWebFonts CDN |
| Geist Pixel Circle | display fallback | local `public/fonts`, from [vercel/geist-pixel-font](https://github.com/vercel/geist-pixel-font) (OFL 1.1) |
| Font Awesome 6.5.2 Brands | trust row icons | cdnjs |

## Assets

`public/assets/logo.webp` is a placeholder mark generated for this build.
Replace the file to swap the brand logo — the header scales it to 72% of the
circular button automatically.

## Notes

- `backdrop-filter` on the mobile overlay is declared unprefixed only.
  Adding `-webkit-backdrop-filter` alongside it makes Lightning CSS (Next's CSS
  transformer) drop the property entirely.
- The mobile menu uses `z-index: 2` and the header `z-index: 3` while open, so
  the sheet covers the hero and the close button stays tappable.
