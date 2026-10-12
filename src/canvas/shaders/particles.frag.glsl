uniform vec3 uColor;
uniform vec3 uAccent;
uniform float uOpacity;

varying float vAccent;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d);
  if (a < 0.02) discard;
  vec3 color = mix(uColor, uAccent, vAccent);
  gl_FragColor = vec4(color, a * vAlpha * uOpacity);
}
