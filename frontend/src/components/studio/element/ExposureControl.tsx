import { useRef, useEffect } from "react";
import { useThree, useFrame, extend } from "@react-three/fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { useCameraStore } from "../store/useCameraStore";

extend({ EffectComposer, RenderPass, ShaderPass });

function ExposureControl() {
    const { gl, scene, camera } = useThree();
    const { exposure } = useCameraStore((state) => ({ exposure: state.exposure }));
    const composerRef = useRef<EffectComposer | null>(null);

    useEffect(() => {
        gl.toneMappingExposure = Math.pow(2, exposure); // exposure 값에 따라 toneMappingExposure 조절
    }, [exposure, gl]);

    useEffect(() => {
        const composer = new EffectComposer(gl);
        composer.addPass(new RenderPass(scene, camera));
        composerRef.current = composer;

        return () => {
            composer.dispose();
        };
    }, [gl, scene, camera]);

    useFrame(() => {
        if (composerRef.current) {
            composerRef.current.render();
            console.log("Composer rendered");
        }
    });

    return null;
}

export default ExposureControl;
