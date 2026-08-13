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

El mosaico de servicios se mantiene dentro de esa familia: un solo matiz en
cuatro saturaciones (`--shu`, `--shu-2`, `--shu-3`, `--shu-4`), de modo que la
jerarquía se lee como intensidad y no como color. `--shu` marca la carta ancla
de IA; el resto baja hacia el gris estructural. Cada carta fija un solo
`--accent` y de ahí salen su ilustración, sus viñetas y su borde en hover.

## Cartas de servicios

`ServiceCard` es el cliente que da comportamiento a cada carta:

- **Trazo al entrar en viewport.** Mide cada forma con `getTotalLength()` y
  anima `stroke-dashoffset` a 0 en 900 ms. Una sola vez por carta: el observer
  se desconecta antes de dibujar. Los rellenos sin trazo se filtran, porque
  animarles el dash los borraría.
- **Pulso en la carta ancla.** Un punto de luz recorre las líneas de entrada
  hacia el nodo cada 4 s y el nodo destella al recibirlo, con
  `getPointAtLength()` sobre rAF. Las cuatro líneas viven en paths separados
  justamente para poder recorrerlas de una en una. Solo corre con la carta en
  pantalla y la pestaña visible.
- **Tinte por borde de entrada.** En `pointerenter` compara el cursor contra
  `getBoundingClientRect()` y toma la distancia mínima a cada borde; ese punto
  se escribe en `--tint-x`/`--tint-y` y el `::after` crece desde ahí hacia
  `--shu-tint`. Sin glow ni `box-shadow`: es el fondo el que sube de tono.

Bajo `prefers-reduced-motion` el bloque global mata las transiciones, lo que
dejaría los iconos congelados sin dibujar. Por eso la sección de reduced motion
fuerza `stroke-dashoffset: 0` — sin esa regla, los siete iconos serían
invisibles.

## Superficie de las cards

`lib/cardSurface.ts` pinta el fondo vivo de las siete cards con la misma
familia de shader que el hero: fBm de 3 octavas, domain warp y la misma rampa
de tres paradas, pero iluminado como una lámina de luz que cruza la card en
lugar de una pluma radial. Cada card tiene semilla, dirección de flujo e
intensidad propias; la intensidad sigue la escala de acentos, así que la carta
ancla es también la más caliente.

**Un solo contexto WebGL para las siete.** Un canvas por card no es viable: los
navegadores limitan los contextos vivos a ~16 y descartan los viejos en
silencio (medido: al crear veinte, cuatro ya se habían perdido), así que las
cards se apagarían al azar. En su lugar hay un canvas `fixed` a viewport
completo dentro de la sección, y cada card se dibuja en su propio `viewport` +
`scissor` dentro del mismo frame.

Tres cosas que hay que saber si se toca:

- **`uOrigin` no es opcional.** `gl_FragCoord` es absoluto al framebuffer, no
  relativo al viewport. Sin restar el origen de la card, solo se pintan las
  que caen cerca del origen del buffer y el resto sale negro.
- **El scissor se acota, el viewport no.** Una card que sobresale por abajo da
  un `y` negativo; el viewport tiene que conservar el rect completo para que
  las UV sigan cubriendo la card, mientras el scissor se recorta a la pantalla.
  Un scissor con valores negativos no dibuja nada.
- **Nada de `isolation: isolate` en `.service`.** Abriría un contexto de
  apilamiento y cortaría la card del canvas que la pinta por detrás. Por lo
  mismo, `.card-surface` está excluido de la regla `.section > *`, que si no
  lo metería en el flujo con `position: relative`.

El velo `::before` sostiene el contraste del texto sobre una imagen en
movimiento: transparente arriba donde va el line art, casi opaco abajo donde va
la copia.

## Estado de reposo y hover

En reposo la carta muestra solo la ilustración y el título, grande y anclado al
pie. La descripción y las viñetas viven en `.service__reveal`, colapsado con
`grid-template-rows: 0fr` — no `display: none`, que mataría la transición y lo
sacaría del árbol de accesibilidad. Al entrar el cursor sube un overlay
(`.service__overlay`, elemento propio porque `background` no interpola entre
gradientes), el título se desplaza y el detalle se despliega a `1fr`.

Como el contenido queda oculto tras un hover, la carta lleva `tabIndex={0}` y
todo el estado responde también a `:focus-within`; sin un tab stop, quien
navegue por teclado nunca vería la descripción.

Las cartas no tienen borde: el relieve sale de un `box-shadow` de cuatro capas
—dos `inset` que biselan el canto y dos proyectadas que la despegan del fondo.

Solo las esquinas que miran hacia afuera del mosaico llevan radio grande. Qué
carta ocupa cada esquina cambia con el número de columnas, y la rejilla es
irregular (dos celdas ocupan dos columnas, una ocupa dos filas), así que
`useMosaicCorners` las mide en tiempo real y marca `data-corner`; a dos y a una
columna la carta de IA acaba ocupando las dos esquinas superiores. El shader
lee esos radios del CSS computado para recortar su máscara igual.

## Tipografía

| Familia | Uso | Origen |
| --- | --- | --- |
| Poppins (300/400/500/600) | UI y cuerpo | Google Fonts |
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
