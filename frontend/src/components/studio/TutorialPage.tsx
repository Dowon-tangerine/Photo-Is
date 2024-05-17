import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import StudioStyle from "./css/Studio.module.css";
import Spinner from "./3Delement/spinner";
import CameraSettings from "./element/CameraSettings";
import Capture from "./element/Capture";
import { Noise } from "@react-three/postprocessing";
import { useCameraStore } from "./store/useCameraStore";
import CameraController from "./element/CameraController";
import ExposureControl from "./element/ExposureControl";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { MotionBlurShader } from "./element/MotionBlurShader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { createMotionBlurMaterial } from "./element/MotionBlurShader";
import { createExposureMaterial } from "./element/ExposureShader"; // Import the ExposureShader
import Modal from "./element/Modal";

extend({ EffectComposer, RenderPass, ShaderPass });

function Effects({ shutterSpeed }: { shutterSpeed: number }) {
    const { gl, scene, camera } = useThree();
    const composer = useRef<EffectComposer>();
    const { exposure } = useCameraStore((state) => ({ exposure: state.exposure }));

    useEffect(() => {
        const composerInstance = new EffectComposer(gl);
        const renderPass = new RenderPass(scene, camera);
        const motionBlurMaterial = createMotionBlurMaterial();

        // 반비례 계산, 셔터 스피드의 로그 스케일을 사용하여 velocityFactor 계산
        // 셔터 스피드가 커질수록 velocityFactor가 충분히 감소하도록 조정
        const baseSpeed = 2.0; // 기준 셔터 스피드
        const velocityFactor = baseSpeed / Math.pow(shutterSpeed, 0.2); // 여기서 지수를 조정하여 효과 조절
        motionBlurMaterial.uniforms["velocityFactor"].value = velocityFactor;
        const shaderPass = new ShaderPass(motionBlurMaterial);

        // ExposureShader 설정
        const exposureMaterial = createExposureMaterial();
        exposureMaterial.uniforms["exposure"].value = Math.pow(2, exposure);
        const exposurePass = new ShaderPass(exposureMaterial);

        composerInstance.addPass(renderPass);
        composerInstance.addPass(shaderPass);
        composerInstance.addPass(exposurePass);

        composer.current = composerInstance;

        return () => {
            composerInstance.dispose();
        };
    }, [gl, scene, camera, shutterSpeed, exposure]);

    useFrame((_, delta) => {
        if (composer.current) {
            composer.current.render(delta);
        }
    }, 1);

    return null;
}

const TutorialPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ImgUrl, setImgUrl] = useState<string | null>(null);
    const [takeScreenshot, setTakeScreenshot] = useState<(() => void) | null>(null);
    const { iso, shutterSpeed, aperture, exposure } = useCameraStore();

    return (
        <>
            <div className={StudioStyle.container}>
                <div className={StudioStyle.canvasContainer}>
                    <Canvas gl={{ alpha: true }} shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[10, 10, 10]} intensity={1} />
                        <Capture
                            setTakeScreenshot={setTakeScreenshot}
                            setImgUrl={setImgUrl}
                            setModalIsOpen={setModalIsOpen}
                        />
                        <CameraController />
                        <ExposureControl />
                        <Spinner />
                        <Effects shutterSpeed={shutterSpeed} />
                    </Canvas>
                    {modalIsOpen && ImgUrl ? <Modal setModalIsOpen={setModalIsOpen} ImgUrl={ImgUrl}></Modal> : null}
                    <div className={StudioStyle.imageOverlay}>
                        <img src="/imgs/viewFinder.png" alt="Overlay Image" style={{ width: "100%", height: "100%" }} />
                    </div>
                    <div className="mt-6 setting-info flex justify-center items-center">
                        <div className="font-digital   text-[45px] mx-10 text-green-400">F {aperture}</div>
                        {shutterSpeed === 1 ? (
                            <div className="font-digital  text-[45px] mx-10 text-green-400"> 1</div>
                        ) : (
                            <div className="font-digital  text-[45px] mx-10 text-green-400"> 1 / {shutterSpeed} </div>
                        )}
                        <div className="font-digital text-[45px] mx-10 text-green-400">{iso} </div>
                        {exposure > 0 ? (
                            <div className="font-digital text-[45px] mx-10 text-green-400"> +{exposure} EV</div>
                        ) : (
                            <div className="font-digital text-[45px] mx-10 text-green-400">{exposure} EV</div>
                        )}
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
