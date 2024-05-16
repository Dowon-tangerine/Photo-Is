// NoiseShader.js
export const NoiseShader = {
    uniforms: {
        tDiffuse: { value: null },
        amount: { value: 10 },
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
      uniform float amount;
      varying vec2 vUv;

      float random(vec2 co) {
          return fract(sin(dot(co.xy ,vec2(12.9898, 78.233))) * 43758.5453);
      }

      void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          float noise = random(vUv) * amount;
          gl_FragColor = vec4(color.rgb + noise, color.a);
      }
  `,
};
