import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { DirectionalLight, VSMShadowMap } from "three";
import StudioStyle from "./css/Studio.module.css";
import AmusementPark from "./element/AmusementPark";

function LandScapePage() {
    const lightRef = useRef<DirectionalLight>(null);

    useEffect(() => {
        if (lightRef.current) {
            const light = lightRef.current;
            light.castShadow = true;
            light.shadow.bias = -0.0001;
            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;
            light.shadow.camera.near = 0.5;
            light.shadow.camera.far = 1500;
            light.shadow.camera.left = -1000;
            light.shadow.camera.right = 1000;
            light.shadow.camera.top = 1000;
            light.shadow.camera.bottom = -1000;
        }
    }, []);

    return (
        <>
            <div className={StudioStyle.container}>
                <div className={StudioStyle.canvasContainer}>
                    <Canvas shadows camera={{ rotation: [10, 0, 0], position: [162, 5, 60], far: 10000 }}>
                        <ambientLight intensity={1} />
                        <directionalLight ref={lightRef} castShadow position={[0, 100, -40]} intensity={2} />
                        <Sky distance={40000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
                        <OrbitControls />
                        <AmusementPark />
                    </Canvas>
                </div>
                <div className="absolute top-0 right-0 w-[300px] bg-black bg-opacity-90 h-full flex flex-col items-center">
                    <p className="text-white font-bookkMyungjoBold text-[25px] p-5">Setting</p>
                </div>
            </div>
        </>
    );
}

export default LandScapePage;
