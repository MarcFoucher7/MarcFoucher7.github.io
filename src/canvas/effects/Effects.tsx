import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useApp } from '../../store/app';

/** Postprocessing léger : seul ce qui dépasse 1 en luminance (les paquets) brille. */
export function Effects() {
  const theme = useApp((s) => s.theme);
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        luminanceThreshold={1}
        luminanceSmoothing={0.2}
        intensity={theme === 'dark' ? 0.9 : 0.45}
        radius={0.6}
      />
    </EffectComposer>
  );
}
