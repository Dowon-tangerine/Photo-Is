import { useState, useEffect } from "react";
import { Canvas, useLoader, useThree, useFrame } from "@react-three/fiber";
import StudioStyle from "./css/Studio.module.css";
import Spinner from "./3Delement/spinner";
import CameraSettings from "./element/CameraSettings"; // 경로는 실제 구조에 맞게 조정해야 합니다.
import * as THREE from "three";
import Capture from "./element/Capture";
import { useCameraStore } from "./store/useCameraStore";
import { Vector3 } from "three";

function ExposureControl() {
    const { gl } = useThree();
    const { exposure } = useCameraStore(); // Zustand 스토어에서 exposure 값을 가져옴

    useEffect(() => {
        gl.toneMappingExposure = Math.pow(2, exposure); // exposure 값에 따라 toneMappingExposure 조절
    }, [exposure, gl]);

    return null;
}

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

function CameraController() {
    const { camera } = useThree();

    useFrame(() => {
        camera.lookAt(new Vector3(0, 6.5, 0.5)); // 매 프레임마다 카메라가 (0, 6.8, 0)을 바라보게 설정
    });

    return null;
}

function TutorialPage() {
    const [takeScreenshot, setTakeScreenshot] = useState<(() => void) | null>(null);
    const { iso, shutterSpeed, aperture, exposure } = useCameraStore();

    return (
        <>
            <div className={StudioStyle.container}>
                <div className={StudioStyle.canvasContainer}>
                    <Canvas
                        gl={{ alpha: true }}
                        shadows
                        camera={{ rotation: [0, 0, 0], position: [10, 6.8, 0], far: 10000 }}
                    >
                        <ambientLight intensity={1} />
                        <Background />
                        <Capture setTakeScreenshot={setTakeScreenshot} />
                        <CameraController />
                        <ExposureControl />
                        <Spinner />
                    </Canvas>
                    <div className={StudioStyle.imageOverlay}>
                        <img src="/imgs/viewFinder.png" alt="Overlay Image" style={{ width: "100%", height: "100%" }} />
                    </div>
                    <div className="mt-6 setting-info flex justify-center items-center">
                        <div className="font-digital  text-[45px] mx-10 text-green-400">F {aperture}</div>
                        {(shutterSpeed == 1 && (
                            <div className="font-digital  text-[45px] mx-10 text-green-400">SS 1</div>
                        )) || (
                            <div className="font-digital  text-[45px] mx-10 text-green-400">SS 1/ {shutterSpeed} </div>
                        )}

                        <div className="font-digital text-[45px] mx-10 text-green-400">{iso} </div>
                        <div className="font-digital text-[45px] mx-10 text-green-400">{exposure} EV</div>
                    </div>
                </div>

                <div className=" w-[300px] border-l-[1px] bg-black h-full flex flex-col items-center">
                    <p className="py-5 text-white font-bookkMyungjoBold text-[30px] ">Setting</p>

                    <CameraSettings />
                    {takeScreenshot && (
                        <button
                            onClick={takeScreenshot}
                            className="mt-64 rounded-[80px] flex items-center justify-center bg-white w-[170px] h-[50px]"
                        >
                            <p className="font-bookkGothicBold mr-2 text-[18px]">SHOOT</p>
                            <img src="./imgs/camera.png" alt="Camera Icon" className="w-[25px]" />
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default TutorialPage;
