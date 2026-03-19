/** WebGL ASCII art animation with interactive mouse effects */

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
varying vec2 v_uv;

void main() {
  vec2 uv = v_uv;

  vec2 delta = uv - u_mouse;
  float dist  = length(delta);

  /* gentle wave ripple */
  float wx = sin(uv.y * 14.0 + u_time * 1.6) * 0.0022;
  float wy = cos(uv.x * 11.0 + u_time * 1.3) * 0.0015;

  /* mouse repulsion nudge */
  float push  = smoothstep(0.38, 0.0, dist) * 0.016;
  vec2  repel = normalize(delta + vec2(0.00001, 0.00001)) * push;

  /* chromatic aberration near cursor */
  float ca = smoothstep(0.30, 0.0, dist) * 0.0045;

  vec2 uv2 = uv + vec2(wx, wy) + repel;

  float aR = texture2D(u_tex, uv2 + vec2( ca, 0.0)).a;
  float aG = texture2D(u_tex, uv2               ).a;
  float aB = texture2D(u_tex, uv2 - vec2( ca, 0.0)).a;
  float alpha = max(aR, max(aG, aB));

  /* colour wave */
  float wave  = sin(uv.x * 5.0 - u_time * 0.75) * 0.5 + 0.5;
  float wave2 = cos(uv.y * 4.0 + u_time * 0.50) * 0.5 + 0.5;

  vec3 alt = vec3(u_color.z * 0.80,
                  u_color.x * 0.50 + u_color.y * 0.50,
                  u_color.y * 0.55 + u_color.z * 0.45);

  vec3 col = mix(u_color, alt, wave * 0.45);
  col *= 0.82 + wave2 * 0.18;

  /* mouse glow */
  float glow = smoothstep(0.30, 0.0, dist);
  col = col + (1.0 - col) * glow * 0.50;

  vec3 final = vec3(aR, aG, aB) * col;
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

export async function initAsciiWebGL() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const pre = document.querySelector('.ascii');
  if (!pre) return;

  await document.fonts.ready;
  /* Also wait for JetBrains Mono specifically — fonts.ready can resolve
     before a Google Fonts stylesheet finishes downloading the font files */
  await document.fonts.load('400 1em "JetBrains Mono"').catch(() => {});

  /* WebGL support check */
  const testC = document.createElement('canvas');
  if (!testC.getContext('webgl') && !testC.getContext('experimental-webgl')) return;

  /* collect computed styles while pre is still in normal flow */
  const style      = getComputedStyle(pre);
  const fontSize   = parseFloat(style.fontSize);
  const fontFamily = style.fontFamily;

  /* trim leading/trailing newlines from the raw HTML content */
  const lines = pre.textContent.split('\n');
  /* drop empty leading/trailing lines added by HTML formatting */
  while (lines.length && lines[0].trim() === '')   lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop();

  if (!lines.length || fontSize < 1) return;

  /* ── create canvas & WebGL context ── */
  const canvas = document.createElement('canvas');
  canvas.className = 'ascii-webgl';
  canvas.setAttribute('aria-hidden', 'true');

  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false })
          || canvas.getContext('experimental-webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  const prog = makeProgram(gl, VERT, FRAG);
  if (!prog) return;

  const texResult = buildTexture(gl, lines, fontSize, fontFamily);
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
  canvas.style.marginBottom = style.marginBottom || '1.5rem';

  /* insert canvas before pre, then collapse pre */
  pre.parentNode.insertBefore(canvas, pre);
  pre.classList.add('ascii-webgl-hidden');

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
  const uTex   = gl.getUniformLocation(prog, 'u_tex');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  /* ── mouse / touch tracking ── */
  let mx = -1.0, my = -1.0;  /* start off-canvas so no initial glow */
  let tmx = mx, tmy = my;

  function updateMouse(cx, cy) {
    const r = canvas.getBoundingClientRect();
    tmx = (cx - r.left)  / r.width;
    tmy = 1.0 - (cy - r.top) / r.height;
  }

  document.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY));
  canvas.addEventListener('touchmove', e => {
    updateMouse(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

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
