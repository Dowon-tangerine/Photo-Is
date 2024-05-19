// src/components/Effects.tsx
import React, { useRef, useEffect } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { EffectComposer as EffectComposerImpl } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import { createMotionBlurMaterial } from "../element/MotionBlurShader";
import { createGrainMaterial } from "../element/GrainShader";
import { createExposureMaterial } from "../element/ExposureShader";
import { useCameraStore } from "../store/useCameraStore";

extend({ EffectComposer: EffectComposerImpl, RenderPass, ShaderPass, BokehPass });

interface EffectsProps {
    shutterSpeed: number;
    iso: number;
    aperture: number;
}

const Effects: React.FC<EffectsProps> = ({ shutterSpeed, iso, aperture }) => {
    const { gl, scene, camera } = useThree();
    const composer = useRef<EffectComposerImpl>();
    const { exposure, focusDistance } = useCameraStore((state) => ({
        exposure: state.exposure,
        focusDistance: state.focusDistance, // focusDistance 상태 추가
    }));
    const { resetSettings } = useCameraStore();

    useEffect(() => {
        const composerInstance = new EffectComposerImpl(gl);
        const renderPass = new RenderPass(scene, camera);

        // ShutterSpeed 설정
        const motionBlurMaterial = createMotionBlurMaterial();
        const baseSpeed = 2.0; // 기준 셔터 스피드
        const velocityFactor = baseSpeed / Math.pow(shutterSpeed, 0.2); // 여기서 지수를 조정하여 효과 조절
        motionBlurMaterial.uniforms["velocityFactor"].value = velocityFactor;
        const shutterPass = new ShaderPass(motionBlurMaterial);

        // ExposureShader 설정
        const exposureMaterial = createExposureMaterial();
        exposureMaterial.uniforms["exposure"].value = Math.pow(2, exposure);
        const exposurePass = new ShaderPass(exposureMaterial);

        // NoiseShader 설정
        const grainMaterial = createGrainMaterial();
        grainMaterial.uniforms["amount"].value = Math.min(0.2, iso / 12800); // ISO 값을 기반으로 그레인 강도 설정 (비율 낮춤)
        const grainPass = new ShaderPass(grainMaterial);

        // Depth of Field (Bokeh) 설정
        const bokehPass = new BokehPass(scene, camera, {
            focus: 15, // 초점 거리 설정
            aperture: aperture * 0.00001, // aperture 값을 조정하여 효과 조절
            maxblur: 0.03,
        });

        // Composer에 추가
        composerInstance.addPass(renderPass);
        composerInstance.addPass(shutterPass);
        composerInstance.addPass(exposurePass);
        composerInstance.addPass(grainPass);
        composerInstance.addPass(bokehPass);

        composer.current = composerInstance;

        return () => {
            composerInstance.dispose();
        };
    }, [gl, scene, camera, shutterSpeed, exposure, iso, aperture, focusDistance]);

    useEffect(() => {
        resetSettings();
    }, []);

    useFrame((_, delta) => {
        if (composer.current) {
            composer.current.render(delta);
        }
    }, 1);

    return null;
};

export default Effects;
