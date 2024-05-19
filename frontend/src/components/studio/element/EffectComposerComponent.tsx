// import { useEffect, useRef } from "react";
// import { useThree, useFrame } from "@react-three/fiber";
// import { Noise } from "@react-three/postprocessing";
// import { BlendFunction } from "postprocessing";
// import { useCameraStore } from "../store/useCameraStore";
// import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
// import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

// const EffectComposerComponent = () => {
//     const { gl, scene, camera } = useThree();
//     const { iso } = useCameraStore();
//     const composerRef = useRef<EffectComposer | null>(null);

//     useEffect(() => {
//         const composer = new EffectComposer(gl);
//         const renderPass = new RenderPass(scene, camera);
//         composer.addPass(renderPass);

//         const noiseEffect = new Noise({
//             premultiply: true,
//             blendFunction: BlendFunction.ADD,
//             opacity: Math.sqrt(iso / 100) * 0.2,
//         });
//         composer.addPass(noiseEffect);

//         composerRef.current = composer;

//         return () => {
//             composer.dispose();
//         };
//     }, [gl, scene, camera, iso]);

//     useEffect(() => {
//         if (composerRef.current) {
//             composerRef.current.setSize(window.innerWidth, window.innerHeight);
//         }
//     }, [gl]);

//     useFrame(() => {
//         if (composerRef.current) {
//             composerRef.current.render();
//         }
//     });

//     return null;
// };

// export default EffectComposerComponent;
