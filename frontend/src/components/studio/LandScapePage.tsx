import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { DirectionalLight } from "three";
import StudioStyle from "./css/Studio.module.css";
import AmusementPark from "./3Delement/AmusementPark";
import ModeChooseModal from "./element/ModeChooseModal";

function LandScapePage() {
    const lightRef = useRef<DirectionalLight>(null);

    const [showSettings, setShowSettings] = useState(false);
    const [mode, setMode] = useState(null); // Manage mode state

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
                <div className={`${StudioStyle.canvasContainer} ${showSettings ? StudioStyle.shrink : ""}`}>
                    <Canvas shadows camera={{ rotation: [10, 0, 0], position: [162, 3, 60], far: 10000 }}>
                        <ambientLight intensity={1} />
                        <directionalLight ref={lightRef} castShadow position={[0, 100, -40]} intensity={2} />
                        <OrbitControls />
                        <AmusementPark />
                    </Canvas>
                </div>
                {!showSettings && (
                    <button
                        onClick={() => setShowSettings(true)}
                        className="camera-btn flex flex-col justify-center items-center absolute bottom-5 right-5 z-50 bg-white rounded-[100%] w-[80px] h-[80px] border-1 border-black"
                    >
                        <img src="./imgs/camera.png" alt="Camera Icon" className="w-[30px]" />
                        <p className="font-bookkMyungjoBold text-[10px]">CAMERA</p>
                    </button>
                )}
                {showSettings && (
                    <div className="absolute top-0 right-0 w-[300px] bg-black bg-opacity-90 h-full flex flex-col items-center">
                        <div className="title  items-center flex w-[100%] py-3">
                            <button
                                className=" w-[40px] flex items-center mx-2 "
                                onClick={() => setShowSettings(false)}
                            >
                                <img src="./imgs/cancel.png" alt="Right Arrow" />
                            </button>

                            <p className="text-white font-bookkMyungjoBold text-[25px] ml-[65px]">Setting</p>
                        </div>

                        <button className="rounded-[80px] flex items-center justify-center bg-white w-[170px] h-[50px]">
                            <p className="font-bookkGothicBold mr-2 text-[18px]">SHOOT</p>
                            <img src="./imgs/camera.png" alt="Camera Icon" className="w-[25px]" />
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default LandScapePage;
