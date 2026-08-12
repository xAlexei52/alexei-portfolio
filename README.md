# Alexei Palacios — desarrollo a medida

Landing de una sola página con la oferta de servicios (páginas web, CRM, ERPs,
plugins de PHP, cloud en AWS, integración de modelos de IA y automatización de
procesos), más experiencia y proyectos. Next.js (App Router) y CSS plano.

Estética japonesa nocturna: fondo casi negro, un acento cálido dominante y un
shader de humo en el hero.

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
  HeroShader.tsx    canvas del shader de humo
  Hero.tsx  Metrics.tsx  Services.tsx  About.tsx  Experience.tsx  Projects.tsx
  ServiceGlyph.tsx  ilustraciones SVG del mosaico de servicios
  CoverflowCarousel.tsx  carrusel 3D de proyectos (drag, teclado, loop)
  SiteFooter.tsx    footer fijo que se descubre al final + contacto
  MagneticButton.tsx pills que se inclinan hacia el cursor
  Reveal.tsx        fade + 12px al entrar en viewport
hooks/
  useMediaQuery.ts  matchMedia via useSyncExternalStore
  useCountUp.ts     conteo easeOutCubic al intersectar
  useScrollSpy.ts   seccion activa
  useRevealProgress.ts  progreso 0..1 del ultimo viewport, en --reveal
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

`--shu` es el acento dominante: CTA principal, los dos nodos recientes del
timeline, el `outline` de foco, el hover del mailto, el shader del hero y la
carta ancla de servicios.

Para que el mosaico de servicios distinga sus cartas sin repetir rojo siete
veces, hay tres acentos secundarios deliberadamente desaturados —`--ai` añil,
`--matcha` verde y `--kincha` dorado. Cada carta fija un solo `--accent` y de
ahí salen su ilustración, sus viñetas y su borde en hover.

## Tipografía

| Familia | Uso | Origen |
| --- | --- | --- |
| Inter (400/500) | UI y cuerpo | Google Fonts |
| BubbledotICG-FinePos | display: nombre, cifras, fechas, email | OnlineWebFonts CDN |
| Geist Pixel Circle | fallback display | local, de [vercel/geist-pixel-font](https://github.com/vercel/geist-pixel-font) (OFL 1.1) |

## Fondo del hero

Un shader WebGL2 (`lib/smokeBackground.ts`): fBm de 3 octavas con una pasada de
domain warp, glow radial, viñeta, grano y dither de 1 LSB contra el banding. El
stop más oscuro de la rampa es `--sumi`, así que el hero funde con el resto de
la página.

Pesa 0 bytes de descarga —no hay video ni poster— y solo anima cuando el hero
está en pantalla, la pestaña visible y sin `prefers-reduced-motion`; en
cualquier otro caso pinta un único frame estático. Si falta WebGL2, el módulo
marca `data-webgl="unavailable"`, se oculta el canvas y queda el gradiente CSS
del contenedor.

Nota para quien lo toque: `destroy()` **no** llama a `WEBGL_lose_context`. React
reutiliza el mismo canvas al remontar (StrictMode monta dos veces en
desarrollo) y un contexto forzado a perderse ya no entrega otro — el shader
caería al gradiente el resto de la sesión.

## Carrusel de proyectos

`CoverflowCarousel` no usa librerías: el efecto sale de una posición fraccional
única (`posRef`) que se pinta directo al DOM en cada frame, sin re-render de
React. El loop dobla la distancia por el lado corto del anillo, así que no hay
nodos clonados. Acepta drag, flechas del teclado, botones y paginación.

Las imágenes en `public/assets/projects/` son placeholders geométricos
generados en la paleta del sitio. Reemplaza cada `placeholder-N.webp` por una
captura real (cuadrada) y no hace falta tocar el código: las rutas viven en
`lib/content.ts`.

## Footer

El footer es `position: fixed` detrás de `main`, que lleva fondo opaco y
`z-index: 1`. Un `div.footer-reveal` de 100vh en flujo normal le da espacio
para descubrirse en el último scroll, y es también el ancla `#contacto` del
nav — un elemento fijo no se puede "scrollear hasta".

`useRevealProgress` escribe el avance 0→1 en `--reveal` sobre el footer, sin
re-render de React; el parallax del texto gigante y la entrada del bloque
central salen de esa variable en CSS.

## Pendientes de contenido

- `public/cv-alexei-palacios.pdf` — al colocarlo aparecen solos los botones
  "Descargar CV" del hero y el link "CV en PDF" de contacto. Sin el archivo, no
  se renderiza ningún enlace muerto.
- Falta la URL de LinkedIn; el bloque de contacto solo muestra GitHub.
