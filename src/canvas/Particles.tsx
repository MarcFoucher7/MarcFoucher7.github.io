import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  MathUtils,
  NormalBlending,
  Quaternion,
  ShaderMaterial,
  Vector3,
  type Points,
} from 'three';
import { useApp } from '../store/app';
import { scrollState } from '../store/scroll';
import { LOW_QUALITY_RATIO, PARTICLE_COLORS, PLACEMENT, SHAPE_FOR_SECTION } from './config';
import { buildParticles, D20_FACE_ORIENTATIONS } from './shapes';
import vertexShader from './shaders/particles.vert.glsl';
import fragmentShader from './shaders/particles.frag.glsl';

interface ParticlesProps {
  count: number;
  reduced: boolean;
}

const Y_AXIS = new Vector3(0, 1, 0);
const X_AXIS = new Vector3(1, 0, 0);

/**
 * Nuage de particules unique (un seul draw call) qui se transforme selon la section :
 * globe → vague → D20 → champ d'étoiles → anneau.
 */
export function Particles({ count, reduced }: ParticlesProps) {
  const points = useRef<Points>(null);
  const theme = useApp((s) => s.theme);
  const quality = useApp((s) => s.quality);
  const { camera, gl } = useThree();

  const geometry = useMemo(() => {
    const data = buildParticles(count);
    const g = new BufferGeometry();
    const [s0, s1, s2, s3, s4] = data.shapes as [
      Float32Array,
      Float32Array,
      Float32Array,
      Float32Array,
      Float32Array,
    ];
    g.setAttribute('position', new BufferAttribute(s0, 3));
    g.setAttribute('aS1', new BufferAttribute(s1, 3));
    g.setAttribute('aS2', new BufferAttribute(s2, 3));
    g.setAttribute('aS3', new BufferAttribute(s3, 3));
    g.setAttribute('aS4', new BufferAttribute(s4, 3));
    g.setAttribute('aRandom', new BufferAttribute(data.random, 4));
    g.setAttribute('aAccent', new BufferAttribute(data.accent, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uMouse: { value: new Vector3(99, 99, 0) },
      uMouseStrength: { value: 0 },
      uSize: { value: 2 },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uAgitation: { value: 0 },
      uMotion: { value: reduced ? 0 : 1 },
      uColor: { value: new Color() },
      uAccent: { value: new Color() },
      uOpacity: { value: 0 },
    }),
    [reduced],
  );

  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        transparent: true,
        depthWrite: false,
      }),
    [uniforms],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  // Qualité réduite : on dessine seulement une partie du nuage (ordre déjà mélangé).
  useEffect(() => {
    geometry.setDrawRange(0, quality === 'low' ? Math.floor(count * LOW_QUALITY_RATIO) : count);
  }, [geometry, quality, count]);
  useEffect(() => () => material.dispose(), [material]);

  // Couleurs et mode de fusion selon le thème.
  useEffect(() => {
    const c = PARTICLE_COLORS[theme];
    uniforms.uColor.value.set(c.base);
    uniforms.uAccent.value.set(c.accent);
    uniforms.uSize.value = c.size;
    material.blending = c.additive ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  }, [theme, material, uniforms]);

  const tmp = useMemo(
    () => ({
      spin: 0,
      q: new Quaternion(),
      qSpin: new Quaternion(),
      qTilt: new Quaternion(),
      ray: new Vector3(),
      hit: new Vector3(),
    }),
    [],
  );

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    const { section, stageStep, loaded } = useApp.getState();
    const dt = Math.min(delta, 0.1);
    const k = (lambda: number): number => (reduced ? 1 : 1 - Math.exp(-lambda * dt));

    const { width, height } = state.viewport.getCurrentViewport(camera, [0, 0, 0]);
    const mobile = width / height < 0.9;
    const place = PLACEMENT[section][mobile ? 'mobile' : 'desktop'];
    const fit = Math.min(height / 6.3, mobile ? width / 3.4 : width / 6);

    uniforms.uTime.value += reduced ? 0 : dt;
    uniforms.uMorph.value = MathUtils.lerp(
      uniforms.uMorph.value,
      SHAPE_FOR_SECTION[section],
      k(1.8),
    );
    uniforms.uIntro.value = MathUtils.lerp(uniforms.uIntro.value, loaded ? 1 : 0, k(1.4));
    uniforms.uOpacity.value = MathUtils.lerp(
      uniforms.uOpacity.value,
      loaded ? place.opacity : 0,
      k(2.5),
    );

    const ax = Math.min(Math.abs(scrollState.velocity) / 40, 1);
    uniforms.uAgitation.value = MathUtils.lerp(uniforms.uAgitation.value, ax, k(4));

    // Placement du nuage.
    p.position.x = MathUtils.lerp(p.position.x, place.x * (mobile ? 1 : width / 11), k(2.2));
    p.position.y = MathUtils.lerp(p.position.y, place.y * (height / 6.3), k(2.2));
    p.scale.setScalar(MathUtils.lerp(p.scale.x, place.scale * fit, k(2.2)));

    // Rotation : le D20 présente une face par étape, sinon rotation lente.
    if (section === 'stage') {
      const face = D20_FACE_ORIENTATIONS[stageStep] ?? D20_FACE_ORIENTATIONS[0];
      tmp.qTilt.setFromAxisAngle(X_AXIS, 0.18);
      tmp.q.copy(tmp.qTilt).multiply(face as Quaternion);
    } else {
      tmp.spin += reduced ? 0 : dt * 0.09;
      tmp.qSpin.setFromAxisAngle(Y_AXIS, tmp.spin);
      tmp.qTilt.setFromAxisAngle(X_AXIS, section === 'intro' ? 0.25 : 0.12 + scrollState.ny * 0.08);
      tmp.q.copy(tmp.qTilt).multiply(tmp.qSpin);
    }
    p.quaternion.slerp(tmp.q, k(section === 'stage' ? 3.2 : 1.5));

    // Curseur : intersection du rayon avec le plan z = 0, ramenée dans le repère du nuage.
    tmp.ray
      .set(scrollState.nx, scrollState.ny, 0.5)
      .unproject(camera)
      .sub(camera.position)
      .normalize();
    const dist = -camera.position.z / tmp.ray.z;
    tmp.hit.copy(camera.position).addScaledVector(tmp.ray, dist);
    p.worldToLocal(uniforms.uMouse.value.copy(tmp.hit));
    const active = !reduced && performance.now() - scrollState.movedAt < 1600 ? 1 : 0;
    uniforms.uMouseStrength.value = MathUtils.lerp(uniforms.uMouseStrength.value, active, k(3));
  });

  useEffect(() => {
    gl.domElement.dataset.particles = String(count);
  }, [gl, count]);

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}
