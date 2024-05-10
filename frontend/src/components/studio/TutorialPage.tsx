import { useState, useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import StudioStyle from "./css/Studio.module.css";
import Spinner from "./3Delement/spinner";
import CameraSettings from "./element/CameraSettings"; // 경로는 실제 구조에 맞게 조정해야 합니다.

import * as THREE from "three";

function Background() {
    const texture = useLoader(THREE.TextureLoader, "imgs/sky.jpg");
    const { gl, scene } = useThree();

    useEffect(() => {
        if (texture) {
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            scene.background = texture;
            gl.setClearColor(new THREE.Color(0x000000), 0); // 배경을 투명하게 설정
        }
    }, [texture, scene, gl]);

    return null;
}

function TutorialPage() {
    const [iso, setIso] = useState(100);
    const [shutterSpeed, setShutterSpeed] = useState(1);
    const [aperture, setAperture] = useState(2.8);
    return (
        <>
            <div className={StudioStyle.container}>
                <div className={StudioStyle.canvasContainer}>
                    <Canvas
                        gl={{ alpha: true }}
                        shadows
                        camera={{ rotation: [0, 0, 0], position: [30, 10, 0], far: 10000 }}
                    >
                        <ambientLight intensity={1} />
                        <Background />
                        <Spinner />
                    </Canvas>
                    <div className="mt-6 setting-info flex justify-center items-center">
                        <div className="font-digital text-[45px] mx-10 text-green-400">{iso} </div>
                        <div className="font-digital  text-[45px] mx-10 text-green-400">1/ {shutterSpeed}</div>
                        <div className="font-digital  text-[45px] mx-10 text-green-400">{aperture}</div>
                    </div>
                </div>

                <div className=" w-[300px] border-l-[1px] bg-black h-full flex flex-col items-center">
                    <p className="py-5 text-white font-bookkMyungjoBold text-[30px] ">Setting</p>

                    <CameraSettings
                        iso={iso}
                        setIso={setIso}
                        shutterSpeed={shutterSpeed}
                        setShutterSpeed={setShutterSpeed}
                        aperture={aperture}
                        setAperture={setAperture}
                    />

                    <button className="mt-64 rounded-[80px] flex items-center justify-center bg-white w-[170px] h-[50px]">
                        <p className="font-bookkGothicBold mr-2 text-[18px]">SHOOT</p>
                        <img src="./imgs/camera.png" alt="Camera Icon" className="w-[25px]" />
                    </button>
                </div>
            </div>
        </>
    );
}

export default TutorialPage;
