import * as THREE from "three";

export const ExposureShader = {
    uniforms: {
        tDiffuse: { value: null },
        exposure: { value: 1.0 },
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
    uniform float exposure;
    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      color.rgb *= exposure;
      gl_FragColor = color;
    }
  `,
};

export const createExposureMaterial = () => new THREE.ShaderMaterial(ExposureShader);
