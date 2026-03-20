/** WebGL terminal-like animation with scrolling characters and interactive effects */

const VERT = `
attribute vec2 a_pos;
attribute vec2 a_uv;
varying vec2 v_uv;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
  v_uv = a_uv;
}`;

const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_color;
uniform float u_broken;
varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;

  /* terminal scanline effect */
  float scanline = sin(uv.y * 120.0 + u_time * 2.0) * 0.03 + 0.97;
  
  /* subtle noise */
  float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.05;

  /* mouse interaction - break effect near cursor */
  vec2 delta = uv - u_mouse;
  float dist = length(delta);
  
  /* broken text effect near mouse */
  float breakRadius = 0.15;
  float breakRange = smoothstep(breakRadius, breakRadius * 0.7, dist);
  
  /* char distortion based on break amount */
  float charDist = sin(u_time * 20.0 + uv.x * 30.0 + uv.y * 20.0) * 0.1 * breakRange;
  float charDist2 = cos(u_time * 15.0 + uv.y * 40.0) * 0.08 * breakRange;
  
  /* apply distortion based on break state */
  vec2 uvDistorted = uv + vec2(charDist, charDist2) * u_broken;
  
  /* chromatic aberration near cursor */
  float ca = smoothstep(0.30, 0.0, dist) * 0.0045;
  vec2 uvCB = uvDistorted + vec2( ca, 0.0);
  vec2 uvCG = uvDistorted;
  vec2 uvCC = uvDistorted - vec2( ca, 0.0);

  /* read from texture with distortion */
  float aR = texture2D(u_tex, uvCB).a;
  float aG = texture2D(u_tex, uvCG).a;
  float aB = texture2D(u_tex, uvCC).a;
  
  vec3 baseColor = vec3(aR, aG, aB) * u_color;
  float alpha = max(aR, max(aG, aB));

  /* terminal cursor blink effect at mouse position */
  float cursorBlink = mod(floor(u_time * 5.0), 2.0);
  float cursorDist = length(uv - u_mouse);
  float cursorEffect = smoothstep(0.02, 0.0, cursorDist) * cursorBlink;
  
  /* only add cursor when not broken */
  cursorEffect = cursorEffect * (1.0 - min(u_broken * 2.0, 1.0));
  baseColor += cursorEffect * vec3(1.0, 1.0, 1.0);

  /* mouse glow effect - reduced when broken */
  float glow = smoothstep(0.25, 0.0, dist);
  float activeGlow = glow * (1.0 - min(u_broken * 1.5, 1.0));
  baseColor = baseColor + (vec3(1.0) - baseColor) * activeGlow * 0.30;

  /* terminal text flicker effect */
  float flicker = fract(sin(u_time * 60.0 + uv.y * 50.0) * 0.5) * 0.1;
  
  /* combine all terminal effects */
  vec3 final = (baseColor + charDist * 0.5) * scanline + noise + flicker;
  gl_FragColor = vec4(final, alpha);
}`;

/* ─── helpers ──────────────────────────────────────────────────────────────── */

function hexToRgb(hex) {
  hex = hex.trim().replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255,
  ];
}

function compileShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn('[ascii-webgl] shader error:', gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function makeProgram(gl, vertSrc, fragSrc) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.warn('[ascii-webgl] link error:', gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

/**
 * Render ASCII text to an offscreen canvas and upload as a WebGL texture.
 * Returns { tex, logicalW, logicalH } in CSS pixels.
 */
function buildTexture(gl, lines, fontSize, fontFamily) {
  const dpr = window.devicePixelRatio || 1;
  const lh  = Math.ceil(fontSize * 1.2);

  /* measure the widest line */
  const probe = document.createElement('canvas');
  const px    = probe.getContext('2d');
  px.font     = `400 ${fontSize}px ${fontFamily}`;
  let logicalW = Math.ceil(Math.max(...lines.map(l => px.measureText(l).width)));
  const logicalH = lh * lines.length;

  /* guard against zero dimensions */
  if (logicalW < 1 || logicalH < 1) return null;

  const oc  = document.createElement('canvas');
  oc.width  = Math.ceil(logicalW * dpr);
  oc.height = Math.ceil(logicalH * dpr);
  const ctx = oc.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.font         = `400 ${fontSize}px ${fontFamily}`;
  ctx.fillStyle    = 'white';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => ctx.fillText(line, 0, i * lh));

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, oc);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  return { tex, logicalW, logicalH };
}

/* ─── main export ──────────────────────────────────────────────────────────── */

/* ASCII art lines — single source of truth, no <pre> element needed */
const ASCII_LINES = [
  ' \u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2588\u2557',
  ' \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d',
  ' \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2551',
  ' \u2588\u2588\u2551 \u255a\u2550\u2550\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2551',
  ' \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551 \u255a\u2588\u2588\u2588\u2588\u2588\u2588\u2557',
  ' \u255a\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d  \u255a\u2550\u2550\u2550\u2550\u2550\u255d',
  '',
  ' \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2557      \u2588\u2588\u2551  \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557',
  ' \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d \u2588\u2588\u2551      \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255d',
  ' \u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2551      \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255d \u2588\u2588\u2588\u2588\u2588\u2557',
  ' \u2588\u2588\u2554\u2550\u2550\u255d   \u2588\u2588\u2551      \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2550\u255d  \u2588\u2588\u2554\u2550\u2550\u255d',
  ' \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551      \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557',
  ' \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d \u255a\u2550\u255d \u255a\u2550\u255d  \u255a\u2550\u255d \u255a\u2550\u255d      \u255a\u2550\u2550\u2550\u2550\u2550\u2550\u255d',
  '',
  '', 
  '  terminal> _         [move mouse to interact]',
  '',
];

export async function initAsciiWebGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const container = document.querySelector('.ascii-container');
  if (!container) return;

  await document.fonts.ready;
  /* Also wait for JetBrains Mono specifically — fonts.ready can resolve
     before a Google Fonts stylesheet finishes downloading the font files */
  await document.fonts.load('400 1em "JetBrains Mono"').catch(() => {});

  /* WebGL support check */
  const testC = document.createElement('canvas');
  if (!testC.getContext('webgl') && !testC.getContext('experimental-webgl')) return;

  /* collect font metrics from the container element */
  const style      = getComputedStyle(container);
  const fontSize   = parseFloat(style.fontSize);
  const fontFamily = style.fontFamily;

  if (fontSize < 1) return;

  /* ── create canvas & WebGL context ── */
  const canvas = document.createElement('canvas');
  canvas.className = 'ascii-webgl';
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
          || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  const prog = makeProgram(gl, VERT, FRAG);
  if (!prog) return;

  const texResult = buildTexture(gl, ASCII_LINES, fontSize, fontFamily);
  if (!texResult) return;
  const { tex, logicalW, logicalH } = texResult;

  const dpr = window.devicePixelRatio || 1;
  canvas.width        = Math.ceil(logicalW * dpr);
  canvas.height       = Math.ceil(logicalH * dpr);
  canvas.style.width  = logicalW + 'px';
  canvas.style.height = logicalH + 'px';

  /* fade in via JS — reliable regardless of async CSS load state */
  canvas.style.opacity    = '0';
  canvas.style.transition = 'opacity 0.6s ease';
  canvas.style.display    = 'block';
  canvas.style.marginBottom = '1.5rem';

  /* mount canvas directly into the container */
  container.appendChild(canvas);

  /* trigger opacity transition on next frame so it's visible */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { canvas.style.opacity = '1'; });
  });
  /* fallback: rAF doesn't fire in backgrounded tabs — use a timeout too */
  setTimeout(() => { canvas.style.opacity = '1'; }, 200);

  /* ── geometry: fullscreen quad ── */
  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1,   1, -1,   -1,  1,
     1, -1,   1,  1,   -1,  1,
  ]), gl.STATIC_DRAW);

  const uvBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    0, 0,   1, 0,   0, 1,
    1, 0,   1, 1,   0, 1,
  ]), gl.STATIC_DRAW);

   /* ── uniform / attribute locations ── */
   const aPos   = gl.getAttribLocation(prog, 'a_pos');
   const aUV    = gl.getAttribLocation(prog, 'a_uv');
   const uTime  = gl.getUniformLocation(prog, 'u_time');
   const uMouse = gl.getUniformLocation(prog, 'u_mouse');
   const uColor = gl.getUniformLocation(prog, 'u_color');
   const uBroken = gl.getUniformLocation(prog, 'u_broken');
   const uTex   = gl.getUniformLocation(prog, 'u_tex');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

   /* ── mouse / touch tracking ── */
   let mx = -1.0, my = -1.0;
   let tmx = mx, tmy = my;
   
   /* broken state management */
   let isBroken = false;
   let lastMouseDist = 999;
   let reconstructTimer = null;
   const reconstructionTime = 3000; /* 3 seconds to reconstruct */
   
   function updateMouse(cx, cy) {
     const r = canvas.getBoundingClientRect();
     tmx = (cx - r.left)  / r.width;
     tmy = 1.0 - (cy - r.top) / r.height;
     
     const dx = tmx - mx;
     const dy = tmy - my;
     const dist = Math.sqrt(dx * dx + dy * dy);
     lastMouseDist = dist;
     
     if (dist < 0.05 && !isBroken) {
       /* mouse entered area - break the ASCII art */
       isBroken = true;
       if (reconstructTimer) {
         clearTimeout(reconstructTimer);
         reconstructTimer = null;
       }
     }
   }

   document.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY));
   canvas.addEventListener('touchmove', e => {
     updateMouse(e.touches[0].clientX, e.touches[0].clientY);
   }, { passive: true });
   
   /* check if mouse has left and start reconstruction timer */
   setInterval(() => {
     if (isBroken && lastMouseDist > 0.2) {
       if (!reconstructTimer) {
         reconstructTimer = setTimeout(() => {
           isBroken = false;
         }, reconstructionTime);
       }
     } else if (!isBroken) {
       if (reconstructTimer) {
         clearTimeout(reconstructTimer);
         reconstructTimer = null;
       }
     }
   }, 100);

  /* ── render loop ── */
  const t0 = performance.now();
  let rafId = 0;
  let paused = false;

  function render() {
    if (paused) return;
    const time = (performance.now() - t0) / 1000;

    mx += (tmx - mx) * 0.09;
    my += (tmy - my) * 0.09;

    const accentHex = getComputedStyle(document.documentElement)
                        .getPropertyValue('--accent').trim();
    const [r, g, b] = hexToRgb(accentHex || '#00d4aa');

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(prog);

     gl.uniform1f(uTime, time);
     gl.uniform2f(uMouse, mx, my);
     gl.uniform3f(uColor, r, g, b);
     gl.uniform1f(uBroken, isBroken ? 1.0 : 0.0);
     gl.uniform1i(uTex, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.enableVertexAttribArray(aUV);
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    rafId = requestAnimationFrame(render);
  }

  /* start immediately */
  render();

  /* pause when scrolled out of view or tab hidden */
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      if (paused) { paused = false; render(); }
    } else {
      paused = true;
      cancelAnimationFrame(rafId);
    }
  }, { threshold: 0 }).observe(canvas);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      paused = true;
      cancelAnimationFrame(rafId);
    } else if (!paused) {
      render();
    } else {
      paused = false;
      render();
    }
  });
}
