import { Renderer, Program, Mesh, Triangle } from './ogl.js';

const hexToRgb = hex => {
  const value = hex.trim().replace(/^#/, '');
  const normalized = value.length === 3 ? value.replace(/./g, channel => channel + channel) : value;
  const match = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  if (!match) return [1, 1, 1];
  return [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255];
};

const setColor = (uniform, hex) => {
  const color = hexToRgb(hex);
  uniform.value[0] = color[0];
  uniform.value[1] = color[1];
  uniform.value[2] = color[2];
};

const vertex = `#version 300 es
in vec2 position;

void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uLayers;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveSpeed;
uniform float uLayerSpeed;
uniform float uTwist;
uniform float uTwistFrequency;
uniform float uTwistSpeed;
uniform float uLineFrequency;
uniform float uLineSpacing;
uniform float uLineSharpness;
uniform float uGlowFalloff;
uniform float uGlowIntensity;
uniform float uBrightness;
uniform float uBlueBoost;
uniform float uVignette;
uniform float uGrain;
uniform float uRotationSpeed;
uniform float uLightMode;
uniform vec3 uLineColor;
uniform vec3 uGlowColor;
uniform vec3 uBackdropColor;

out vec4 fragColor;

#define MAX_LAYERS 10

mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}

float grainHash(vec2 point) {
  point = floor(point);
  float hash = 52.9829189 * fract(dot(point, vec2(0.065, 0.005)));
  return fract(hash);
}

float layeredGrain(vec2 fragmentPixel) {
  vec2 point = mod(fragmentPixel + vec2(uTime * 30.0, -uTime * 21.0), 1024.0);
  vec2 rotated = mat2(0.8, -0.5, 0.5, 0.8) * point;
  float grain = 0.0;
  grain += 0.40 * grainHash(rotated);
  grain += 0.25 * grainHash(rotated * 2.0 + 17.0);
  grain += 0.20 * grainHash(rotated * 4.0 + 47.0);
  grain += 0.10 * grainHash(rotated * 8.0 + 113.0);
  grain += 0.05 * grainHash(rotated * 16.0 + 191.0);
  return grain;
}

void main() {
  vec2 resolution = max(uResolution, vec2(1.0));
  vec2 uv = (2.0 * gl_FragCoord.xy - resolution) / resolution.y;
  float time = uTime * uSpeed;
  vec3 backdrop = mix(uBackdropColor, vec3(1.0), step(0.5, uLightMode));
  vec3 centerTone = max(uLineColor * 0.85567 - uGlowColor * 0.06186, vec3(0.0));
  vec3 cloudTone = uLineColor * 0.19588 + uGlowColor * 0.2268;
  vec2 p = uv;
  p /= max(uScale, 0.05);
  p = rotate2d(radians(uRotation) + time * uRotationSpeed) * p;
  vec3 color = vec3(0.0);
  float fiberField = 0.0;

  for (int index = 0; index < MAX_LAYERS; index++) {
    float fi = float(index) + 1.0;
    if (fi > uLayers) break;

    p += uWaveAmplitude * sin(p.yx * fi * uWaveFrequency + time * (uWaveSpeed + fi * uLayerSpeed));

    float radius = length(p);
    float polarAngle = atan(p.y, p.x);
    polarAngle += sin(radius * uTwistFrequency - time * uTwistSpeed + fi) * uTwist;
    p = vec2(cos(polarAngle), sin(polarAngle)) * radius;

    float lines = abs(sin(p.x * (uLineFrequency + fi * uLineSpacing) + sin(p.y * 3.0 + time)));
    lines = pow(max(0.0, 1.0 - lines), uLineSharpness);
    fiberField += lines / fi;
    color += uLineColor * lines / fi;

    float glow = exp(-uGlowFalloff * abs(sin(p.x * 3.0 + time + fi)));
    color += uGlowColor * glow * uGlowIntensity / (fi * 2.0);
  }

  float center = exp(-2.2 * dot(uv, uv));
  color += centerTone * center;

  float cloud = exp(-1.5 * length(uv + vec2(sin(time * 0.3) * 0.25, cos(time * 0.25) * 0.18)));
  color += cloudTone * cloud;

  float vignette = 1.0 - smoothstep(0.35, 1.45, length(uv));
  color *= mix(1.0 - uVignette, 1.0, vignette);
  color = 1.0 - exp(-color * uBrightness);
  color.b *= uBlueBoost;

  vec3 outputColor;
  if (uLightMode > 0.5) {
    float edgeFade = mix(1.0 - uVignette, 1.0, vignette);
    float fibers = pow(smoothstep(0.12, 1.05, fiberField) * edgeFade, 1.5);
    float atmosphere = (center * 0.025 + cloud * 0.015) * edgeFade;
    vec3 fiberInk = mix(backdrop, uLineColor, 0.52);
    vec3 airColor = mix(backdrop, uGlowColor, 0.16);

    outputColor = mix(backdrop, airColor, atmosphere);
    outputColor = mix(outputColor, fiberInk, fibers * 0.3);
  } else {
    outputColor = backdrop + color;
  }

  float noise = (layeredGrain(gl_FragCoord.xy) - 0.5) * uGrain;
  outputColor = clamp(outputColor + noise, 0.0, 1.0);
  fragColor = vec4(outputColor, 1.0);
}
`;

export function initGhostFibers(container, options = {}) {
  if (!container) return null;

  const config = {
    lineColor: '#f4510b',
    glowColor: '#ff6a26',
    backdropColor: '#140602',
    speed: 0.22,
    scale: 1.8,
    rotation: 0,
    rotationSpeed: 0.15,
    layers: 5,
    waveAmplitude: 0.016,
    waveFrequency: 2.8,
    waveSpeed: 0.14,
    layerSpeed: 0.07,
    twist: 0.08,
    twistFrequency: 4.5,
    twistSpeed: 1.0,
    lineFrequency: 4.5,
    lineSpacing: 1.8,
    lineSharpness: 12.0,
    glowFalloff: 7.5,
    glowIntensity: 2.2,
    brightness: 2.2,
    blueBoost: 0.85,
    vignette: 0.65,
    grain: 0.04,
    lightMode: false,
    dpr: Math.min(window.devicePixelRatio || 1, 2),
    fps: 60,
    paused: false,
    ...options
  };

  try {
    const renderer = new Renderer({
      webgl: 2,
      alpha: false,
      antialias: false,
      dpr: Math.min(Math.max(config.dpr, 0.5), 2)
    });
    const gl = renderer.gl;
    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) },
        uTime: { value: 0 },
        uSpeed: { value: config.speed },
        uScale: { value: config.scale },
        uRotation: { value: config.rotation },
        uRotationSpeed: { value: config.rotationSpeed },
        uLayers: { value: Math.min(Math.max(Math.round(config.layers), 1), 10) },
        uWaveAmplitude: { value: config.waveAmplitude },
        uWaveFrequency: { value: config.waveFrequency },
        uWaveSpeed: { value: config.waveSpeed },
        uLayerSpeed: { value: config.layerSpeed },
        uTwist: { value: config.twist },
        uTwistFrequency: { value: config.twistFrequency },
        uTwistSpeed: { value: config.twistSpeed },
        uLineFrequency: { value: config.lineFrequency },
        uLineSpacing: { value: config.lineSpacing },
        uLineSharpness: { value: config.lineSharpness },
        uGlowFalloff: { value: config.glowFalloff },
        uGlowIntensity: { value: config.glowIntensity },
        uBrightness: { value: config.brightness },
        uBlueBoost: { value: config.blueBoost },
        uVignette: { value: config.vignette },
        uGrain: { value: config.grain },
        uLightMode: { value: config.lightMode ? 1 : 0 },
        uLineColor: { value: new Float32Array(hexToRgb(config.lineColor)) },
        uGlowColor: { value: new Float32Array(hexToRgb(config.glowColor)) },
        uBackdropColor: { value: new Float32Array(hexToRgb(config.backdropColor)) }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    let frameId = 0;
    let elapsed = 0;
    let previousTime = performance.now();
    let lastRenderTime = 0;
    let frameRate = Math.min(Math.max(config.fps, 1), 120);
    let isPaused = config.paused;
    let isVisible = true;
    let isPageVisible = !document.hidden;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const render = () => renderer.render({ scene: mesh });
    const stop = () => {
      if (frameId !== 0) cancelAnimationFrame(frameId);
      frameId = 0;
    };
    const canAnimate = () => isVisible && isPageVisible && !isPaused && !reducedMotion.matches;

    const loop = now => {
      frameId = 0;
      if (!canAnimate()) return;

      const delta = Math.min((now - previousTime) / 1000, 0.1);
      previousTime = now;
      elapsed += delta;

      if (now - lastRenderTime >= 1000 / frameRate - 0.5) {
        program.uniforms.uTime.value = elapsed;
        render();
        lastRenderTime = now;
      }

      frameId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!canAnimate() || frameId !== 0) return;
      previousTime = performance.now();
      frameId = requestAnimationFrame(loop);
    };

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width || window.innerWidth));
      const h = Math.max(1, Math.floor(rect.height || window.innerHeight));
      renderer.setSize(w, h);
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth;
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight;
      render();
    };

    const handleVisibility = () => {
      isPageVisible = !document.hidden;
      if (canAnimate()) start();
      else stop();
    };
    const handleReducedMotion = () => {
      if (canAnimate()) start();
      else {
        stop();
        render();
      }
    };

    const resizeObserver = new ResizeObserver(setSize);
    resizeObserver.observe(container);
    window.addEventListener('resize', setSize);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (canAnimate()) start();
        else stop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(container);
    document.addEventListener('visibilitychange', handleVisibility);
    reducedMotion.addEventListener('change', handleReducedMotion);

    setSize();
    start();

    return {
      renderer,
      program,
      mesh,
      render,
      destroy() {
        stop();
        resizeObserver.disconnect();
        window.removeEventListener('resize', setSize);
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', handleVisibility);
        reducedMotion.removeEventListener('change', handleReducedMotion);
        if (canvas.parentNode === container) container.removeChild(canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      },
      update(newOptions) {
        if (newOptions.lineColor) setColor(program.uniforms.uLineColor, newOptions.lineColor);
        if (newOptions.glowColor) setColor(program.uniforms.uGlowColor, newOptions.glowColor);
        if (newOptions.backdropColor) setColor(program.uniforms.uBackdropColor, newOptions.backdropColor);
        if (newOptions.speed !== undefined) program.uniforms.uSpeed.value = newOptions.speed;
        if (newOptions.scale !== undefined) program.uniforms.uScale.value = newOptions.scale;
        if (newOptions.rotation !== undefined) program.uniforms.uRotation.value = newOptions.rotation;
        if (newOptions.rotationSpeed !== undefined) program.uniforms.uRotationSpeed.value = newOptions.rotationSpeed;
        if (newOptions.layers !== undefined) program.uniforms.uLayers.value = Math.min(Math.max(Math.round(newOptions.layers), 1), 10);
        if (newOptions.waveAmplitude !== undefined) program.uniforms.uWaveAmplitude.value = newOptions.waveAmplitude;
        if (newOptions.waveFrequency !== undefined) program.uniforms.uWaveFrequency.value = newOptions.waveFrequency;
        if (newOptions.waveSpeed !== undefined) program.uniforms.uWaveSpeed.value = newOptions.waveSpeed;
        if (newOptions.layerSpeed !== undefined) program.uniforms.uLayerSpeed.value = newOptions.layerSpeed;
        if (newOptions.twist !== undefined) program.uniforms.uTwist.value = newOptions.twist;
        if (newOptions.twistFrequency !== undefined) program.uniforms.uTwistFrequency.value = newOptions.twistFrequency;
        if (newOptions.twistSpeed !== undefined) program.uniforms.uTwistSpeed.value = newOptions.twistSpeed;
        if (newOptions.lineFrequency !== undefined) program.uniforms.uLineFrequency.value = newOptions.lineFrequency;
        if (newOptions.lineSpacing !== undefined) program.uniforms.uLineSpacing.value = newOptions.lineSpacing;
        if (newOptions.lineSharpness !== undefined) program.uniforms.uLineSharpness.value = newOptions.lineSharpness;
        if (newOptions.glowFalloff !== undefined) program.uniforms.uGlowFalloff.value = newOptions.glowFalloff;
        if (newOptions.glowIntensity !== undefined) program.uniforms.uGlowIntensity.value = newOptions.glowIntensity;
        if (newOptions.brightness !== undefined) program.uniforms.uBrightness.value = newOptions.brightness;
        if (newOptions.blueBoost !== undefined) program.uniforms.uBlueBoost.value = newOptions.blueBoost;
        if (newOptions.vignette !== undefined) program.uniforms.uVignette.value = newOptions.vignette;
        if (newOptions.grain !== undefined) program.uniforms.uGrain.value = newOptions.grain;
        if (newOptions.lightMode !== undefined) program.uniforms.uLightMode.value = newOptions.lightMode ? 1 : 0;
        if (newOptions.fps !== undefined) frameRate = Math.min(Math.max(newOptions.fps, 1), 120);
        if (newOptions.paused !== undefined) {
          isPaused = newOptions.paused;
          if (canAnimate()) start();
          else {
            stop();
            render();
          }
        }
        render();
      }
    };
  } catch (err) {
    console.error('[GhostFibers] Failed to initialize WebGL2 OGL context:', err);
    return null;
  }
}

function autoInit() {
  const container = document.getElementById('ghostFibers') || document.querySelector('.ghost-fibers-container');
  if (container && !container.dataset.ghostFibersInit) {
    container.dataset.ghostFibersInit = 'true';
    console.log('[GhostFibers] Initializing on container:', container);
    initGhostFibers(container);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInit);
} else {
  autoInit();
}
