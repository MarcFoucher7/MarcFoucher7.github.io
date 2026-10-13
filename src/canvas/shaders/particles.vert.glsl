uniform float uTime;
uniform float uMorph;
uniform float uIntro;
uniform vec3 uMouse;
uniform float uMouseStrength;
uniform float uSize;
uniform float uPixelRatio;
uniform float uAgitation;
uniform float uMotion;
uniform float uHitAge;
uniform float uHitAmp;

attribute vec3 aS1;
attribute vec3 aS2;
attribute vec3 aS3;
attribute vec3 aS4;
attribute vec4 aRandom;
attribute float aAccent;

varying float vAccent;
varying float vAlpha;

vec3 shapeAt(float i) {
  if (i < 0.5) return position;
  if (i < 1.5) return aS1;
  if (i < 2.5) return aS2;
  if (i < 3.5) return aS3;
  return aS4;
}

void main() {
  // Morphing décalé par particule : la transition se propage, mais au repos
  // (uMorph entier) toutes les particules sont exactement sur la forme.
  float m = clamp(uMorph, 0.0, 4.0);
  float i0 = min(floor(m), 3.0);
  float g = m - i0;
  float f = smoothstep(0.0, 1.0, clamp((g - aRandom.w * 0.45) / 0.55, 0.0, 1.0));
  vec3 p = mix(shapeAt(i0), shapeAt(i0 + 1.0), f);
  float t = i0 + f;

  // Pendant la transition, les particules décrivent un arc vers l'extérieur.
  p += aRandom.xyz * sin(f * 3.14159) * 0.9;

  // Relief animé de la vague (forme 1).
  float waveW = 1.0 - clamp(abs(t - 1.0), 0.0, 1.0);
  p.y += waveW * uMotion * (sin(p.x * 0.8 + uTime * 0.9) * 0.32 + cos(p.z * 1.4 + uTime * 0.6) * 0.2);

  // Cymbale frappée (formes 0 et 4) : onde radiale qui part de la cloche et s'amortit.
  float cymW = max(1.0 - clamp(t, 0.0, 1.0), clamp(t - 3.0, 0.0, 1.0));
  float rad = length(p.xz);
  float front = smoothstep(uHitAge * 5.0 + 0.4, uHitAge * 5.0 - 0.2, rad);
  float ring = sin(rad * 4.5 - uHitAge * 16.0) * exp(-uHitAge * 1.4) * front;
  p.y += cymW * uMotion * (uHitAmp * ring * (0.35 + rad * 0.22) + sin(rad * 3.0 + uTime * 1.2) * 0.015);

  // Respiration + agitation liée à la vitesse de scroll.
  float n = sin(uTime * 0.7 + aRandom.w * 6.2831);
  p += aRandom.xyz * (0.025 + uAgitation * 0.35) * n * uMotion;

  // Intro : le nuage se rassemble depuis un état éclaté.
  p = mix(aRandom.xyz * 10.0, p, uIntro);

  // Répulsion autour du curseur (coordonnées locales du nuage).
  vec2 d = p.xy - uMouse.xy;
  float dist = length(d);
  float force = smoothstep(1.3, 0.0, dist) * uMouseStrength;
  p.xy += normalize(d + 1e-4) * force * 0.6;
  p.z += force * 0.5;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.55 + aRandom.w * 0.9) * (1.0 + aAccent * 0.9);
  gl_PointSize = size * uPixelRatio * (10.0 / -mv.z);

  vAccent = aAccent;
  vAlpha = (0.35 + 0.65 * aRandom.w) * smoothstep(-14.0, -4.0, mv.z);
}
