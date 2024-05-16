import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import StudioStyle from "./css/Studio.module.css";
import Spinner from "./3Delement/spinner";
import CameraSettings from "./element/CameraSettings";
import Capture from "./element/Capture";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { useCameraStore } from "./store/useCameraStore";
import CameraController from "./element/CameraController";
import ExposureControl from "./element/ExposureControl";
import { BlendFunction } from "postprocessing";

const TutorialPage = () => {
    const [takeScreenshot, setTakeScreenshot] = useState<(() => void) | null>(null);
    const { iso, shutterSpeed, aperture, exposure } = useCameraStore();

    return (
        <>
            <div className={StudioStyle.container}>
                <div className={StudioStyle.canvasContainer}>
                    <Canvas gl={{ alpha: true }} shadows>
                        <ambientLight intensity={1} />
                        <Capture setTakeScreenshot={setTakeScreenshot} />
                        <CameraController />
                        <ExposureControl />
                        <Spinner />
                        <EffectComposer>
                            <Noise premultiply blendFunction={BlendFunction.ADD} opacity={Math.sqrt(iso / 100) * 0.2} />
                        </EffectComposer>
                    </Canvas>
                    <div className={StudioStyle.imageOverlay}>
                        <img src="/imgs/viewFinder.png" alt="Overlay Image" style={{ width: "100%", height: "100%" }} />
                    </div>
                    <div className="mt-6 setting-info flex justify-center items-center">
                        <div className="font-digital  text-[45px] mx-10 text-green-400">F {aperture}</div>
                        {shutterSpeed == 1 ? (
                            <div className="font-digital  text-[45px] mx-10 text-green-400">SS 1</div>
                        ) : (
                            <div className="font-digital  text-[45px] mx-10 text-green-400">SS 1/ {shutterSpeed}</div>
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
};

export default TutorialPage;