import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

/** Post-traitement (qualité haute) : halo des néons et des frappes, vignettage, tone mapping. */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        intensity={0.75}
        radius={0.7}
      />
      <Vignette offset={0.28} darkness={0.72} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
}
