/**
 * One WebGL2 canvas painting every service card.
 *
 * Seven cards cannot each own a context: browsers cap live WebGL contexts at
 * roughly sixteen and silently evict the oldest, so per-card canvases would
 * blank out at random (measured: creating twenty leaves four already lost).
 * Instead a single fixed, full-viewport canvas sits behind the mosaic and
 * renders one scissored viewport per registered card in a single frame.
 *
 * Each card gets its own seed, flow direction and intensity, so the surfaces
 * read as a family rather than seven copies. Animation runs only while at
 * least one card is on screen, the tab is visible and reduced motion is off.
 */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

/**
 * A sheet of light bent through a warped noise field. Same fBm + domain-warp
 * family as the hero so the two read as one material, but lit as a directional
 * sweep across the card rather than a radial plume.
 */
const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;       // card size in device px
uniform vec2  uOrigin;    // card's bottom-left corner in framebuffer px
uniform float uTime;
uniform float uSeed;
uniform float uIntensity; // 0..1, how hot this card burns
uniform vec2  uFlow;      // sweep direction
uniform float uHover;     // 0..1, eased pointer proximity
/* Corner radii in device px, read off the card: TL, TR, BR, BL. The mosaic
   gives its four outer corners a much larger radius than the inner ones, so a
   single value would leave the big corners square. */
uniform vec4  uRadii;

out vec4 fragColor;

#define OCTAVES     3
#define GAIN        0.34
#define LACUNARITY  2.00
#define GAMMA       2.15

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                          + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p) {
  const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);
  float amp = 0.5, sum = 0.0, norm = 0.0;
  for (int i = 0; i < OCTAVES; i++) {
    sum  += amp * snoise(p);
    norm += amp;
    p     = R * p * LACUNARITY;
    amp  *= GAIN;
  }
  return sum / norm;
}

/* Same three stops as the hero ramp, so both surfaces share a material. */
vec3 ramp(float t) {
  const vec3 c0 = vec3(0.0510, 0.0431, 0.0588); // --sumi
  const vec3 c1 = vec3(0.4196, 0.0784, 0.0941); // --shu-tint
  const vec3 c2 = vec3(0.8902, 0.2588, 0.2039); // --shu
  float a = smoothstep(0.00, 0.70, t);
  float b = smoothstep(0.70, 1.00, t);
  return mix(mix(c0, c1, a), c2, b);
}

float hash12(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 overlay(vec3 base, vec3 blend) {
  return mix(2.0 * base * blend,
             1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
             step(0.5, base));
}

void main() {
  // gl_FragCoord is absolute to the framebuffer, not to the viewport, so the
  // card's origin has to be subtracted before normalising. Dividing the raw
  // coordinate by uRes would only cover the cards nearest the buffer origin
  // and leave every other one black.
  vec2 local = gl_FragCoord.xy - uOrigin;
  vec2 uv = local / uRes;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.1;

  float t = uTime * 0.05 + uSeed * 7.13;

  // Domain warp, drifting along this card's flow direction.
  vec2 q;
  q.x = fbm(p + uFlow * t + vec2(uSeed * 3.1, 0.0));
  q.y = fbm(p + uFlow * t * 0.72 + vec2(0.0, uSeed * 2.7 + 4.2));

  float f = fbm(p + 0.85 * q + uFlow * t * 0.45);
  float v = clamp(f * 0.5 + 0.5, 0.0, 1.0);

  // A light sheet crossing the card: the noise bends where the band falls, so
  // the highlight reads as a curved surface catching light, not as fog. The
  // band is wide and soft on purpose — a tight one leaves most of the card
  // black instead of lighting the whole surface.
  float band = dot(uv - 0.5, normalize(uFlow));
  float sheet = smoothstep(0.95, -0.55, abs(band + q.x * 0.34));

  // Ambient floor keeps the unlit side a deep ember rather than pure black.
  // Kept low overall: this is a backdrop the line art has to stay legible on,
  // not the subject. Intensity spreads the cards back across the accent
  // ladder so the anchor still reads hottest.
  float lit = pow(clamp(0.10 + v * 0.30 + sheet * 0.40, 0.0, 1.0), GAMMA);
  lit *= mix(0.42, 1.0, uIntensity);
  lit *= 1.0 + uHover * 0.55;

  vec3 col = ramp(lit);

  // Falls off toward the card edges so the surface sits inside its frame.
  vec2 e = abs(uv - 0.5) * 2.0;
  float frame = (1.0 - smoothstep(0.62, 1.05, e.x)) * (1.0 - smoothstep(0.68, 1.05, e.y));
  col *= mix(0.35, 1.0, frame);

  float g = hash12(local + uSeed * 131.0);
  col = mix(col, overlay(col, vec3(g)), 0.028);
  col += (hash12(local.yx * 1.37 + uSeed) - 0.5) / 255.0;

  // Rounded corners: the canvas is one flat rectangle, so the radius has to be
  // cut here or the surface would show as a square behind each rounded card.
  vec2 halfPx = uRes * 0.5;
  vec2 rel = local - halfPx;
  // Pick this fragment's corner radius by quadrant. GL's y grows upward, so
  // the top pair is y > 0.
  float radius = rel.x > 0.0
    ? (rel.y > 0.0 ? uRadii.y : uRadii.z)   // TR : BR
    : (rel.y > 0.0 ? uRadii.x : uRadii.w);  // TL : BL
  vec2 corner = abs(rel) - (halfPx - vec2(radius));
  float dist = length(max(corner, 0.0)) + min(max(corner.x, corner.y), 0.0) - radius;
  float mask = 1.0 - smoothstep(-1.0, 0.5, dist);

  fragColor = vec4(max(col, 0.0) * mask, mask);
}`;

const MAX_DPR = 1.5;

export type CardHandle = {
  /** Pointer proximity, 0..1. Drives the extra warmth on hover. */
  setHover: (value: number) => void;
  release: () => void;
};

type Card = {
  el: HTMLElement;
  seed: number;
  intensity: number;
  flow: [number, number];
  hover: number;
  hoverTarget: number;
  /* Cached: getComputedStyle per card per frame would force a reflow. The
     mosaic swaps which corners are rounded at its breakpoints, so this is
     refreshed on resize. */
  radii: [number, number, number, number];
};

/** Corner radii in CSS px, read off the element: TL, TR, BR, BL. */
function readRadii(el: HTMLElement): [number, number, number, number] {
  const cs = getComputedStyle(el);
  const parse = (value: string) => parseFloat(value) || 0;
  return [
    parse(cs.borderTopLeftRadius),
    parse(cs.borderTopRightRadius),
    parse(cs.borderBottomRightRadius),
    parse(cs.borderBottomLeftRadius),
  ];
}

type Engine = {
  register: (
    el: HTMLElement,
    opts: { seed: number; intensity: number; flow: [number, number] },
  ) => CardHandle;
  destroy: () => void;
};

let engine: Engine | null = null;
let refCount = 0;

function createEngine(host: HTMLElement): Engine | null {
  const canvas = document.createElement("canvas");
  canvas.className = "card-surface";
  canvas.setAttribute("aria-hidden", "true");

  const gl = canvas.getContext("webgl2", {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
    premultipliedAlpha: true,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("[card-surface] shader:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = vs && compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("[card-surface] link:", gl.getProgramInfoLog(program));
    return null;
  }

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  gl.useProgram(program);

  // The shader outputs premultiplied alpha so the rounded-corner mask fades
  // out cleanly instead of leaving dark fringing on the diagonal.
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const uRes = gl.getUniformLocation(program, "uRes");
  const uOrigin = gl.getUniformLocation(program, "uOrigin");
  const uTime = gl.getUniformLocation(program, "uTime");
  const uSeed = gl.getUniformLocation(program, "uSeed");
  const uIntensity = gl.getUniformLocation(program, "uIntensity");
  const uFlow = gl.getUniformLocation(program, "uFlow");
  const uHover = gl.getUniformLocation(program, "uHover");
  const uRadii = gl.getUniformLocation(program, "uRadii");

  // Mounted inside the section rather than on <body>: `main.page` is opaque
  // and stacked above the page background to let the fixed footer sit behind
  // it, so a body-level canvas would be painted over entirely.
  host.appendChild(canvas);

  const cards = new Set<Card>();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let raf = 0;
  let running = false;
  let time = 0;
  let last = 0;
  let visibleCount = 0;
  let destroyed = false;
  let dirty = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.max(1, Math.round(window.innerWidth * dpr));
    const h = Math.max(1, Math.round(window.innerHeight * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    dirty = true;
  };

  const render = () => {
    if (destroyed || gl.isContextLost()) return;

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const viewH = canvas.height;

    gl.disable(gl.SCISSOR_TEST);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST);

    for (const card of cards) {
      const rect = card.el.getBoundingClientRect();
      // Skip anything fully outside the viewport; nothing to scissor into.
      if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
      if (rect.width <= 0 || rect.height <= 0) continue;

      const x = Math.round(rect.left * dpr);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      // GL's origin is bottom-left; the DOM's is top-left. This goes negative
      // whenever the card runs off the bottom of the screen.
      const y = Math.round(viewH - rect.bottom * dpr);

      // The viewport keeps the card's full rect so the shader's UVs still span
      // the whole card. The scissor is what gets clamped to the drawing
      // buffer: a negative or oversized scissor box draws nothing at all.
      gl.viewport(x, y, w, h);

      const sx = Math.max(0, x);
      const sy = Math.max(0, y);
      const sw = Math.min(x + w, canvas.width) - sx;
      const sh = Math.min(y + h, viewH) - sy;
      if (sw <= 0 || sh <= 0) continue;
      gl.scissor(sx, sy, sw, sh);

      gl.uniform2f(uRes, w, h);
      gl.uniform2f(uOrigin, x, y);
      gl.uniform1f(uTime, time);
      gl.uniform1f(uSeed, card.seed);
      gl.uniform1f(uIntensity, card.intensity);
      gl.uniform2f(uFlow, card.flow[0], card.flow[1]);
      gl.uniform1f(uHover, card.hover);

      const [tl, tr, br, bl] = card.radii;
      gl.uniform4f(uRadii, tl * dpr, tr * dpr, br * dpr, bl * dpr);

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    gl.disable(gl.SCISSOR_TEST);
  };

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;

    // Ease hover toward its target so entering and leaving both glide.
    for (const card of cards) {
      const delta = card.hoverTarget - card.hover;
      if (Math.abs(delta) > 0.001) card.hover += delta * Math.min(dt * 7, 1);
      else card.hover = card.hoverTarget;
    }

    render();
  };

  const start = () => {
    if (running || destroyed) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
  };

  const sync = () => {
    if (destroyed) return;
    if (reduceMotion.matches) {
      stop();
      resize();
      render();
      return;
    }
    if (visibleCount > 0 && !document.hidden) {
      resize();
      start();
    } else {
      stop();
    }
  };

  // Cards enter and leave as the mosaic scrolls past.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const wasVisible = entry.target.getAttribute("data-surface-visible") === "1";
        const isVisible = entry.isIntersecting;
        if (wasVisible === isVisible) continue;
        entry.target.setAttribute("data-surface-visible", isVisible ? "1" : "0");
        visibleCount += isVisible ? 1 : -1;
      }
      visibleCount = Math.max(0, visibleCount);
      sync();
    },
    { threshold: 0 },
  );

  const refreshRadii = () => {
    for (const card of cards) card.radii = readRadii(card.el);
  };

  // useMosaicCorners writes data-corner from its own ResizeObserver, which may
  // land after ours. Watching the attribute avoids depending on that order.
  const cornerObserver = new MutationObserver(() => {
    refreshRadii();
    if (!running) render();
  });

  const onScroll = () => {
    // Rects move with the scroll; a paused surface still has to follow them.
    if (!running) {
      resize();
      render();
    }
  };

  const onResize = () => {
    resize();
    // Breakpoints reshuffle which card sits in a corner, and useMosaicCorners
    // rewrites data-corner in response — so the radii have to be re-read here
    // or the surface would keep the previous layout's rounding.
    refreshRadii();
    if (!running) render();
  };

  const onVisibility = () => sync();
  const onMotionPref = () => sync();

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  document.addEventListener("visibilitychange", onVisibility);
  reduceMotion.addEventListener("change", onMotionPref);
  canvas.addEventListener("webglcontextlost", onContextLost, false);

  resize();

  return {
    register(el, opts) {
      const card: Card = {
        el,
        seed: opts.seed,
        intensity: opts.intensity,
        flow: opts.flow,
        hover: 0,
        hoverTarget: 0,
        radii: readRadii(el),
      };
      cards.add(card);
      el.setAttribute("data-surface-visible", "0");
      observer.observe(el);
      cornerObserver.observe(el, {
        attributes: true,
        attributeFilter: ["data-corner"],
      });
      // Paint immediately so a card is never briefly empty.
      if (dirty || !running) {
        resize();
        render();
      }

      return {
        setHover(value) {
          card.hoverTarget = value;
          // A hover while paused still needs to show; render one frame.
          if (!running) render();
        },
        release() {
          observer.unobserve(el);
          if (el.getAttribute("data-surface-visible") === "1") {
            visibleCount = Math.max(0, visibleCount - 1);
          }
          cards.delete(card);
          sync();
        },
      };
    },

    destroy() {
      destroyed = true;
      stop();
      observer.disconnect();
      cornerObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionPref);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      cards.clear();

      gl.deleteProgram(program);
      gl.deleteVertexArray(vao);
      canvas.remove();
    },
  };
}

/**
 * Cards share one engine. The last card to unmount tears it down, so a route
 * change does not leave an orphan canvas or a live rAF behind.
 */
export function attachCardSurface(
  el: HTMLElement,
  opts: { seed: number; intensity: number; flow: [number, number] },
): CardHandle | null {
  if (!engine) {
    // The canvas lives in the nearest section so it shares that stacking
    // context with the cards it paints.
    const host = el.closest("section") ?? document.body;
    engine = createEngine(host as HTMLElement);
    if (!engine) return null;
    refCount = 0;
  }

  const handle = engine.register(el, opts);
  refCount += 1;

  return {
    setHover: handle.setHover,
    release() {
      handle.release();
      refCount -= 1;
      if (refCount <= 0 && engine) {
        engine.destroy();
        engine = null;
        refCount = 0;
      }
    },
  };
}
