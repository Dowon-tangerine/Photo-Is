import * as THREE from "three";

export const MotionBlurShader = {
    uniforms: {
        tDiffuse: { value: null },
        velocityFactor: { value: 1.0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float velocityFactor; // 블러의 강도 조절
    varying vec2 vUv; // 텍스처 좌표

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      vec4 blurColor = vec4(0.0);
      float total = 0.0;
      float maxSamples = 60.0; // 부드러운 블러를 위한 샘플 수 증가
      for (float t = -maxSamples; t <= maxSamples; t++) {
        float percent = (t + maxSamples) / (2.0 * maxSamples);
        vec2 offset = vec2(percent * velocityFactor * 0.01, percent * velocityFactor * 0.01);
        blurColor += texture2D(tDiffuse, vUv + offset);
        total += 1.0;
      }
      blurColor /= total;
      gl_FragColor = mix(color, blurColor, clamp(velocityFactor, 0.0, 1.0)); // velocityFactor를 클램프
    }
  `,
};

export const createMotionBlurMaterial = () => new THREE.ShaderMaterial(MotionBlurShader);
