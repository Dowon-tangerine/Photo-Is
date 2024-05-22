import { useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import StudioStyle from "./css/Studio.module.css";
import AmuseCameraController from "./element/AmuseCameraController";
import CameraSettings from "./element/CameraSettings";
import Capture from "./element/Capture";
import { EffectComposer } from "@react-three/postprocessing";
import { useCameraStore } from "./store/useCameraStore";
import AmuseUserController from "./element/AmuseUserController";
import { EffectComposer as EffectComposerImpl } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import AmusementPark from "./3Delement/AmusementPark";
import styles from "../exhibition/css/ExhibitionArea.module.css";

// import { ApertureShaderMaterial } from "./element/apertureShader";
import { DepthOfField } from "@react-three/postprocessing";

import Modal from "./element/Modal";
import Effects from "./element/Effects";

extend({ EffectComposer: EffectComposerImpl, RenderPass, ShaderPass });

const PinwheelPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ImgUrl, setImgUrl] = useState<string | null>(null);
    const [takeScreenshot, setTakeScreenshot] = useState<(() => void) | null>(null);
    const { iso, shutterSpeed, aperture, exposure } = useCameraStore();
    const [tutorialClosed, setTutorialClosed] = useState<boolean>(false);

    const handleCloseClick = () => {
        setTutorialClosed(true);
    };

    return (
        <>
            <div className={StudioStyle.container}>
                <div className="m-auto w-[70%] h-[70vh]">
                    <Canvas gl={{ alpha: true }} shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                        <ambientLight intensity={1} />
                        <directionalLight position={[10, 10, 10]} intensity={2} />
                        <Capture
                            setTakeScreenshot={setTakeScreenshot}
                            setImgUrl={setImgUrl}
                            setModalIsOpen={setModalIsOpen}
                        />
                        <EffectComposer>
                            <DepthOfField
                                focusDistance={0} // focus distance in world units
                                focalLength={0.02} // focal length in world units
                                bokehScale={aperture} // bokeh size
                                height={480} // render height
                            />
                        </EffectComposer>
                        <AmuseCameraController />
                        <AmusementPark />
                        <AmuseUserController /> {/* 사용자 컨트롤러 추가 */}
                        <Effects shutterSpeed={shutterSpeed} iso={iso} aperture={aperture} />
                    </Canvas>
                    {modalIsOpen && ImgUrl ? <Modal setModalIsOpen={setModalIsOpen} ImgUrl={ImgUrl}></Modal> : null}
                    <div className="absolute top-36 m-auto w-[70%]">
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
                            className="mt-36 rounded-[80px] flex items-center justify-center bg-white w-[170px] h-[50px]"
                        >
                            <p className="font-bookkGothicBold mr-2 text-[18px]">SHOOT</p>
                            <img src="./imgs/camera.png" alt="Camera Icon" className="w-[25px]" />
                        </button>
                    )}
                </div>
                {!tutorialClosed && (
                    <div className={styles.tutorial}>
                        <div className={styles.description_exit}>
                            <img src="imgs/twisted_arrow.png" alt="arrow" />
                            <h1 style={{ fontFamily: "부크크고딕bold", fontSize: "25px" }}>
                                나가고 싶을 때 클릭하세요
                            </h1>
                        </div>
                        <div className={styles.description_move}>
                            <img src="imgs/keyboard.png" alt="arrow" />
                            <h1
                                style={{
                                    fontFamily: "부크크고딕bold",
                                    fontSize: "25px",
                                    marginLeft: "-20px",
                                    marginBottom: "20px",
                                }}
                            >
                                W,A,S,D로 이동하세요
                            </h1>
                        </div>
                        <div className={styles.description_camera}>
                            <img src="imgs/directional_arrow.png" alt="arrow" />
                            <h1
                                style={{
                                    fontFamily: "부크크고딕bold",
                                    width: "990px",
                                    marginLeft: "-190px",
                                    fontSize: "25px",
                                }}
                            >
                                클릭 & ESC키를 눌러 모드를 전환하세요!
                            </h1>
                        </div>
                        <div
                            className={styles.exit_tutorial}
                            onClick={handleCloseClick}
                            style={{ fontSize: "30px", padding: "20px", fontFamily: "부크크고딕bold" }}
                        >
                            튜토리얼 닫기
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default PinwheelPage;
