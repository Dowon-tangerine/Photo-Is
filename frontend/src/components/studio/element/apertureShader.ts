import * as THREE from "three";
import { extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";

const ApertureShaderMaterial = shaderMaterial(
    {
        tDiffuse: null as THREE.Texture | null,
        aperture: 0.5,
        resolution: new THREE.Vector2(),
    },
    // Vertex Shader
    `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform sampler2D tDiffuse;
    uniform float aperture;
    uniform vec2 resolution;

    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      vec2 center = vec2(0.5, 0.5);

      // Calculate the distance from the center
      float dist = distance(uv, center);

      // Blur factor based on the distance and aperture
      float blur = smoothstep(0.0, aperture, dist);

      vec4 color = texture2D(tDiffuse, uv);

      // Simple blur effect
      vec4 blurColor = vec4(0.0);
      float total = 0.0;
      for (float x = -4.0; x <= 4.0; x++) {
        for (float y = -4.0; y <= 4.0; y++) {
          vec2 offset = vec2(x, y) * blur / resolution;
          blurColor += texture2D(tDiffuse, uv + offset);
          total += 1.0;
        }
      }
      blurColor /= total;

      gl_FragColor = mix(color, blurColor, blur);
    }
  `
);

extend({ ApertureShaderMaterial });

export { ApertureShaderMaterial };
