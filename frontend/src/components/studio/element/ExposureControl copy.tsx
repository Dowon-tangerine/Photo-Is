import { useRef, useEffect } from "react";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { NoiseShader } from "./NoiseShader";
import { useCameraStore } from "../store/useCameraStore";

extend({ EffectComposer, RenderPass, ShaderPass });

function ExposureControl() {
    const { gl, scene, camera, size } = useThree();
    const { iso, exposure } = useCameraStore((state) => ({ iso: state.iso, exposure: state.exposure }));
    const composerRef = useRef<EffectComposer | null>(null);
    const noisePassRef = useRef<ShaderPass | null>(null);

    useEffect(() => {
        const composer = new EffectComposer(gl); //렌더링 후 후처리 효과를 적용하는 시스템. 렌더 타겟 설정
        const renderPass = new RenderPass(scene, camera); //카메라, 장면을 렌더링하는 기본적인 페스
        const noisePass = new ShaderPass(NoiseShader); //커스텀 섀이더를 사용해서 이미지를 후처리
        noisePassRef.current = noisePass;

        composer.addPass(renderPass);
        composer.addPass(noisePass);
        composerRef.current = composer;

        console.log(renderPass);

        return () => {
            composer.dispose();
        };
    }, [gl, scene, camera]);

    // useEffect(() => {
    //     if (noisePassRef.current) {
    //         noisePassRef.current.uniforms.uNoiseFactor.value = iso;
    //         console.log("Updating uNoiseFactor:", iso); // iso 값 변경 시 콘솔 로그 출력
    //     }
    // }, [iso]);

    // useEffect(() => {
    //     gl.toneMappingExposure = Math.pow(2, exposure); // exposure 값에 따라 toneMappingExposure 조절
    // }, [exposure, gl]);

    useFrame(() => {
        if (composerRef.current) {
            composerRef.current.render();
        }
    });

    return null;
}

export default ExposureControl;
