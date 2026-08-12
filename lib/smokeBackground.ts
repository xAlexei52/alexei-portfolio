/**
 * WebGL2 red-smoke background: fBm + a single domain-warp pass, a radial glow,
 * vignette, film grain and a 1-LSB dither to kill banding in the dark ramp.
 *
 * Framework-agnostic on purpose — the React component is only a canvas and a
 * cleanup call. Animation runs only while the canvas is on screen, the tab is
 * visible and the visitor has not asked for reduced motion; otherwise a single
 * static frame is painted.
 */

const VERT = `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform float uSeed;

out vec4 fragColor;

#define OCTAVES        3
#define SCALE          1.20
#define GAIN           0.32
#define LACUNARITY     2.00
#define SPEED_WARP     0.060
#define SPEED_BASE     0.023
#define WARP_AMOUNT    0.35
#define GAMMA          2.6
#define GLOW_CENTER    vec2(0.12, 0.015)
#define GLOW_FALLOFF   3.2
#define GLOW_INTENSITY 0.42
#define GRAIN_AMOUNT   0.03

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

// Darkest stop is the site's --sumi so the hero melts into the page below.
vec3 ramp(float t) {
  const vec3 c0 = vec3(0.0510, 0.0431, 0.0588); // #0d0b0f
  const vec3 c1 = vec3(0.4196, 0.0784, 0.0941); // #6b1418
  const vec3 c2 = vec3(0.8902, 0.2588, 0.2039); // #E34234
  float a = smoothstep(0.00, 0.72, t);
  float b = smoothstep(0.72, 1.00, t);
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

vec3 screenBlend(vec3 base, vec3 top) {
  return 1.0 - (1.0 - base) * (1.0 - top);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y * SCALE;

  float tW = uTime * SPEED_WARP;
  float tB = uTime * SPEED_BASE;

  vec2 q;
  q.x = fbm(p + vec2(0.00, 0.00) + vec2( tW,        tW * 0.41));
  q.y = fbm(p + vec2(5.20, 1.30) + vec2(-tW * 0.63, tW * 0.87));

  float f = fbm(p + WARP_AMOUNT * q + vec2(tB * 0.9, -tB * 0.5));

  float v = clamp(f * 0.5 + 0.5, 0.0, 1.0);
  float t = pow(v, GAMMA);

  vec3 col = ramp(t);

  vec2 sp = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float d = length(sp - GLOW_CENTER);
  float glow = exp(-d * GLOW_FALLOFF) * GLOW_INTENSITY;
  col = screenBlend(col, glow * vec3(0.86, 0.19, 0.13));

  vec2 vc = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  float vig = smoothstep(1.05, 0.32, length(vc));
  col *= mix(0.55, 1.0, vig);

  float g = hash12(gl_FragCoord.xy + uSeed);
  col = mix(col, overlay(col, vec3(g)), GRAIN_AMOUNT);

  col += (hash12(gl_FragCoord.yx * 1.37 + uSeed) - 0.5) / 255.0;

  fragColor = vec4(max(col, 0.0), 1.0);
}`;

const MAX_DPR = 1.5;

export type SmokeBackground = { destroy: () => void };

export function createSmokeBackground(
  canvas: HTMLCanvasElement,
): SmokeBackground {
  const container = canvas.parentElement ?? canvas;

  let gl: WebGL2RenderingContext | null = null;
  let program: WebGLProgram | null = null;
  let vao: WebGLVertexArrayObject | null = null;
  let uniforms: {
    res: WebGLUniformLocation | null;
    time: WebGLUniformLocation | null;
    seed: WebGLUniformLocation | null;
  } | null = null;

  let time = 0;
  let last = 0;
  let raf = 0;
  let running = false;
  let inView = true;
  let destroyed = false;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const compile = (
    context: WebGL2RenderingContext,
    type: number,
    source: string,
  ) => {
    const shader = context.createShader(type);
    if (!shader) return null;
    context.shaderSource(shader, source);
    context.compileShader(shader);
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      console.error("[smoke-bg] shader:", context.getShaderInfoLog(shader));
      context.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const buildProgram = (context: WebGL2RenderingContext) => {
    const vs = compile(context, context.VERTEX_SHADER, VERT);
    const fs = vs && compile(context, context.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;

    const p = context.createProgram();
    if (!p) return null;
    context.attachShader(p, vs);
    context.attachShader(p, fs);
    context.linkProgram(p);
    context.deleteShader(vs);
    context.deleteShader(fs);

    if (!context.getProgramParameter(p, context.LINK_STATUS)) {
      console.error("[smoke-bg] link:", context.getProgramInfoLog(p));
      return null;
    }
    return p;
  };

  const render = () => {
    if (!gl || gl.isContextLost() || !program || !uniforms) return;
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.uniform2f(uniforms.res, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, time);
    gl.uniform1f(uniforms.seed, Math.random() * 1000);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const resize = () => {
    if (!gl) return;
    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = Math.max(1, Math.round(rect.width * dpr));
    const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    // Repaint even while paused, or a resize would leave a stretched frame.
    if (!running) render();
  };

  const frame = (now: number) => {
    if (!running) return;
    raf = requestAnimationFrame(frame);
    // Clamping the delta stops a long pause from jumping the animation.
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    render();
  };

  const start = () => {
    if (running) return;
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
      render();
      return;
    }
    if (inView && !document.hidden) start();
    else stop();
  };

  const fail = () => {
    // Leaves the container's CSS gradient showing in place of the canvas.
    container.dataset.webgl = "unavailable";
  };

  const init = () => {
    const context = canvas.getContext("webgl2", {
      alpha: false,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: "low-power",
      desynchronized: true,
    });
    if (!context) return false;
    gl = context;

    program = buildProgram(context);
    if (!program) return false;

    // WebGL2 requires a bound VAO even with no attributes.
    vao = context.createVertexArray();
    context.bindVertexArray(vao);

    uniforms = {
      res: context.getUniformLocation(program, "uRes"),
      time: context.getUniformLocation(program, "uTime"),
      seed: context.getUniformLocation(program, "uSeed"),
    };
    context.useProgram(program);
    return true;
  };

  const onContextLost = (event: Event) => {
    event.preventDefault();
    stop();
  };

  const onContextRestored = () => {
    if (init()) {
      resize();
      sync();
    } else {
      fail();
    }
  };

  const onVisibility = () => sync();
  const onMotionPref = () => sync();
  const onWindowResize = () => resize();

  canvas.addEventListener("webglcontextlost", onContextLost, false);
  canvas.addEventListener("webglcontextrestored", onContextRestored, false);

  if (!init()) {
    fail();
    canvas.removeEventListener("webglcontextlost", onContextLost);
    canvas.removeEventListener("webglcontextrestored", onContextRestored);
    return { destroy: () => {} };
  }

  const resizeObserver =
    "ResizeObserver" in window ? new ResizeObserver(() => resize()) : null;
  if (resizeObserver) resizeObserver.observe(container);
  else window.addEventListener("resize", onWindowResize);

  const intersectionObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            inView = entries[0].isIntersecting;
            sync();
          },
          { threshold: 0 },
        )
      : null;
  if (intersectionObserver) intersectionObserver.observe(container);

  document.addEventListener("visibilitychange", onVisibility);
  reduceMotion.addEventListener("change", onMotionPref);

  resize();
  sync();

  return {
    destroy() {
      destroyed = true;
      stop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      window.removeEventListener("resize", onWindowResize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduceMotion.removeEventListener("change", onMotionPref);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);

      // Deliberately no WEBGL_lose_context here. React reuses the same canvas
      // across remounts (StrictMode mounts twice in development), and a
      // force-lost context cannot hand out a new one — the shader would fall
      // back to the static gradient for the rest of the session. Dropping the
      // references is enough; the context goes with the canvas.
      if (gl) {
        if (program) gl.deleteProgram(program);
        if (vao) gl.deleteVertexArray(vao);
      }
      gl = null;
      program = null;
      vao = null;
      uniforms = null;
    },
  };
}
