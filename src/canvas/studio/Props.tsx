import { useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BoxGeometry,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DoubleSide,
  MeshStandardMaterial,
  Quaternion,
  ShaderMaterial,
  Vector3,
  type BufferGeometry,
} from 'three';
import { isGrooving } from '../../audio/groove';
import { useApp } from '../../store/app';
import { boomGeometry, merge, rod, tripodGeometry } from '../kit/geometry';
import { recTexture } from '../kit/textures';
import { kitState } from '../state';
import { KEY_LIGHT, ROOM } from './lighting';

/** Enceinte de monitoring : caisse, haut-parleur, tweeter. */
function speakerGeometry(): { box: BufferGeometry; cones: BufferGeometry } {
  const box = new BoxGeometry(0.26, 0.38, 0.28);
  const woofer = new CylinderGeometry(0.085, 0.085, 0.02, 32)
    .rotateX(Math.PI / 2)
    .translate(0, -0.05, 0.14);
  const tweeter = new CylinderGeometry(0.03, 0.03, 0.02, 24)
    .rotateX(Math.PI / 2)
    .translate(0, 0.11, 0.14);
  return { box, cones: merge([woofer, tweeter]) };
}

/** Pieds chromés des enceintes et du micro overhead, fusionnés. */
function propsChrome(): BufferGeometry {
  const parts: BufferGeometry[] = [];
  for (const x of [-1.95, 1.95]) {
    parts.push(tripodGeometry(1.0, 0.28).translate(x, 0, -2.2));
  }
  // Micro overhead : pied + perche au-dessus de la batterie.
  parts.push(tripodGeometry(1.55, 0.32).translate(-1.2, 0, -1.25));
  parts.push(boomGeometry(new Vector3(-1.2, 1.55, -1.25), new Vector3(-0.05, 1.92, -0.45)));
  // Guéridon (pied + base).
  parts.push(rod(new Vector3(-1.35, 0.02, 0.55), new Vector3(-1.35, 0.6, 0.55), 0.016));
  parts.push(new CylinderGeometry(0.16, 0.18, 0.02, 32).translate(-1.35, 0.01, 0.55));
  return merge(parts);
}

/** Faisceau lumineux visible sous le projecteur principal (cône additif dégradé). */
function beamMaterial(): ShaderMaterial {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    uniforms: { uColor: { value: new Color('#ffb066') }, uStrength: { value: 0.16 } },
    vertexShader: /* glsl */ `
      varying float vY;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vY = position.y;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vNormal = normalize(normalMatrix * normal);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uStrength;
      varying float vY;
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        float along = smoothstep(0.5, 0.3, vY) * mix(0.55, 1.0, smoothstep(-0.5, 0.3, vY));
        float edge = pow(abs(dot(vNormal, vView)), 1.6);
        gl_FragColor = vec4(uColor, along * edge * uStrength);
      }`,
  });
}

/** Accessoires : enceintes, micro overhead, guéridon, boîtier REC, faisceau. */
export function Props() {
  const theme = useApp((s) => s.theme);
  const geo = useMemo(() => {
    const sp = speakerGeometry();
    return {
      chrome: propsChrome(),
      speaker: sp.box,
      cones: sp.cones,
      mic: new CylinderGeometry(0.022, 0.018, 0.17, 20),
      table: new CylinderGeometry(0.25, 0.25, 0.03, 40),
      rec: new BoxGeometry(0.36, 0.13, 0.05),
      beam: new ConeGeometry(1.15, 1, 48, 1, true),
    };
  }, []);
  const mat = useMemo(() => {
    const rec = recTexture('JetBrains Mono');
    return {
      chrome: new MeshStandardMaterial({ color: '#cfcfd2', metalness: 1, roughness: 0.2 }),
      speaker: new MeshStandardMaterial({ color: '#141114', roughness: 0.4, metalness: 0.2 }),
      cones: new MeshStandardMaterial({ color: '#2a2629', roughness: 0.7 }),
      mic: new MeshStandardMaterial({ color: '#b9b9bd', metalness: 0.9, roughness: 0.35 }),
      walnut: new MeshStandardMaterial({ color: '#5a321c', roughness: 0.5 }),
      rec: new MeshStandardMaterial({
        map: rec,
        emissiveMap: rec,
        emissive: new Color('#ffffff'),
        emissiveIntensity: 0.4,
        toneMapped: false,
      }),
      beam: beamMaterial(),
      texture: rec,
    };
  }, []);
  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      Object.values(mat).forEach((m) => m.dispose());
    },
    [geo, mat],
  );

  // Le cône part du projecteur (sommet) et s'élargit vers la batterie.
  const beam = useMemo(() => {
    const dir = KEY_LIGHT.target.clone().sub(KEY_LIGHT.position);
    const length = dir.length() * 0.92;
    dir.normalize();
    const quaternion = new Quaternion().setFromUnitVectors(
      new Vector3(0, 1, 0),
      dir.clone().negate(),
    );
    const position = KEY_LIGHT.position.clone().addScaledVector(dir, length / 2);
    return { quaternion, position, length };
  }, []);

  useFrame((state) => {
    // REC clignote quand le groove tourne.
    const on = isGrooving() ? (Math.sin(state.clock.elapsedTime * 6) > 0 ? 2.2 : 0.5) : 0.35;
    mat.rec.emissiveIntensity = on;
    const strength = mat.beam.uniforms.uStrength;
    if (strength) strength.value = (theme === 'dark' ? 0.15 : 0.05) * (1 + kitState.pulse * 0.8);
  });

  return (
    <group>
      <mesh geometry={geo.chrome} material={mat.chrome} castShadow />
      {[-1.95, 1.95].map((x) => (
        <group key={x} position={[x, 1.2, -2.2]} rotation-y={x < 0 ? 0.35 : -0.35}>
          <mesh geometry={geo.speaker} material={mat.speaker} castShadow />
          <mesh geometry={geo.cones} material={mat.cones} />
        </group>
      ))}
      <mesh
        geometry={geo.mic}
        material={mat.mic}
        position={[-0.05, 1.86, -0.45]}
        rotation-x={0.25}
      />
      <mesh
        geometry={geo.table}
        material={mat.walnut}
        position={[-1.35, 0.6, 0.55]}
        castShadow
        receiveShadow
      />
      <mesh geometry={geo.rec} material={mat.rec} position={[2.65, 2.48, ROOM.back + 0.04]} />
      <mesh
        geometry={geo.beam}
        material={mat.beam}
        position={beam.position}
        quaternion={beam.quaternion}
        scale={[1, beam.length, 1]}
      />
    </group>
  );
}
