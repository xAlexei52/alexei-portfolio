# Portafolio — Alexei Palacios

Landing page personal de una sola página, construida con Next.js (App Router) y
CSS plano. Estética japonesa nocturna: fondo casi negro, un único acento cálido
y un video de fondo en el hero.

## Correr

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

Para producción, define `NEXT_PUBLIC_SITE_URL` con el dominio real para que las
URLs de Open Graph queden absolutas.

## Estructura

```
app/
  layout.tsx        metadata, Open Graph, JSON-LD Person, fuentes
  page.tsx          compone las secciones y resuelve el CV
  globals.css       tokens, layout y animaciones
components/
  SiteNav.tsx       pill flotante + scroll spy
  MobileMenu.tsx    overlay full-screen (< 768px)
  HeroMedia.tsx     video o poster segun viewport y reduced-motion
  Hero.tsx  Metrics.tsx  About.tsx  Experience.tsx  Projects.tsx  Contact.tsx
  CoverflowCarousel.tsx  carrusel 3D de proyectos (drag, teclado, loop)
  Reveal.tsx        fade + 12px al entrar en viewport
hooks/
  useMediaQuery.ts  matchMedia via useSyncExternalStore
  useCountUp.ts     conteo easeOutCubic al intersectar
  useScrollSpy.ts   seccion activa
  useMobileMenu.ts  estado del menu, Escape y resize
lib/content.ts      todo el contenido en un solo lugar
```

## Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| `--sumi` | `#0d0b0f` | fondo base |
| `--sumi-soft` | `#16131a` | superficies elevadas |
| `--shu` | `#E34234` | acento, único color saturado |
| `--shu-dim` | `#8a2820` | hover y bordes |
| `--kinari` | `#F0EAD6` | texto principal |

`--shu` aparece exactamente en cuatro lugares: el botón "Ver proyectos", los dos
primeros nodos del timeline, el `outline` de foco y el hover del mailto.

## Tipografía

| Familia | Uso | Origen |
| --- | --- | --- |
| Inter (400/500) | UI y cuerpo | Google Fonts |
| BubbledotICG-FinePos | display: nombre, cifras, fechas, email | OnlineWebFonts CDN |
| Geist Pixel Circle | fallback display | local, de [vercel/geist-pixel-font](https://github.com/vercel/geist-pixel-font) (OFL 1.1) |

## Media

`public/assets/` contiene `hero-loop.webm` (280 KB, VP9), `hero-loop.mp4`
(5 MB, fallback), `hero-poster.jpg` y `og-image.jpg`, todos derivados del mismo
cinemagraph con ffmpeg.

Por debajo de 768px, o con `prefers-reduced-motion: reduce`, solo se sirve el
poster: el HTML del servidor no contiene `<video>`, así que el loop nunca se
descarga en datos móviles.

## Carrusel de proyectos

`CoverflowCarousel` no usa librerías: el efecto sale de una posición fraccional
única (`posRef`) que se pinta directo al DOM en cada frame, sin re-render de
React. El loop dobla la distancia por el lado corto del anillo, así que no hay
nodos clonados. Acepta drag, flechas del teclado, botones y paginación.

Las imágenes en `public/assets/projects/` son placeholders geométricos
generados en la paleta del sitio. Reemplaza cada `placeholder-N.webp` por una
captura real (cuadrada) y no hace falta tocar el código: las rutas viven en
`lib/content.ts`.

## Pendientes de contenido

- `public/cv-alexei-palacios.pdf` — al colocarlo aparecen solos los botones
  "Descargar CV" del hero y el link "CV en PDF" de contacto. Sin el archivo, no
  se renderiza ningún enlace muerto.
- Falta la URL de LinkedIn; el bloque de contacto solo muestra GitHub.
