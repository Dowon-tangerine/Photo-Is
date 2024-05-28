import { useState } from "react";
import { Canvas, extend } from "@react-three/fiber";
import StudioStyle from "./css/Studio.module.css";
import Spinner from "./3Delement/spinner";
import CameraSettings from "./element/CameraSettings";
import Capture from "./element/Capture";
import { useCameraStore } from "./store/useCameraStore";
import CameraController from "./element/CameraController";
import { EffectComposer as EffectComposerImpl } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
// import { ApertureShaderMaterial } from "./element/apertureShader";
import Modal from "./element/Modal";
import Effects from "./element/Effects";

import Lottie from "lottie-react";
import arrow from "../../../public/imgs/arrow.json";

extend({ EffectComposer: EffectComposerImpl, RenderPass, ShaderPass });

const steps = [
    {
        title: "Step 0 : 인트로 ",
        descriptions: [
            "안녕하세요. 카메라 튜토리얼에 오신 여러분들을 환영합니다!",
            "지금부터 여러분은 실제 카메라에서 사용되는 여러가지 요소들을 순서에 따라 차근차근 배우게 될 것 입니다.",
            "순서대로 잘 따라와 다 함께 멋진 사진을 찍을 수 있을거에요!",
            "자 그럼 지금부터 시작해보겠습니다.",
        ],
    },
    {
        title: "Step 1 : 화면 설명 ",
        descriptions: [
            "먼저 화면에 대해서 알려드리겠습니다.",
            "가운데 보이는 것은 우리가 찍을 풍경과 피사체입니다.",
            "오른쪽 Setting 에서는 실제 카메라를 조작하는 것 처럼 다양한 값을 조정할 수 있는 설정 값입니다.",
            " 사용자는 이곳에서 카메라 모드, 조리개, 셔터스피드 ,iso를 조절할 수 있습니다.",
            "세팅 섹션 하단에 있는 Shoot 버튼을 클릭해 사진을 찍고 결과를 확인할 수 있습니다.",
            "장면 밑으로 보이는 숫자는 각 setting값을 뜻합니다.",
            " 왼쪽부터 순서대로 조리개, 셔터스피드, iso, 노출값을 뜻합니다.",
        ],
    },
    {
        title: "Step 2 : 조리개",
        descriptions: [
            "다음으로 카메라의 기본 설정인 3요소중 하나인 조리개 에 대해서 공부하겠습니다.",
            "카메라의 기본 3요소에는 조리개, 셔터스피드, iso 가 있습니다.",
            "그 중 조리개는 카메라 렌즈 안에 있는 개구 장치로, 렌즈를 통해 들어오는 빛의 양을 조절하는 역할을 합니다. ",
            "조리개 값이 낮을수록 조리개가 크게 열려 더 많은 빛이 들어오고, 높을수록 조리개가 작게 열려 빛의 양이 줄어듭니다. ",
            "조리개는 사진에서  1. 노출 2. 피사계 심도 에 영향을 미칩니다. ",
            "조리개를 조절해서 각 값이 어떻게 변화하는지 확인해 보세요! ",
        ],
    },
    {
        title: "Step 3 : 셔터스피드",
        descriptions: [
            "다음으로 셔터스피드에 대해서 공부하겠습니다. ",
            "가운데 보이는 것은 우리가 찍을 풍경과 피사체입니다.",
            "오른쪽 Setting 에서는 실제 카메라를 조작하는 것 처럼 다양한 값을 조정할 수 있는 설정 값입니다 <br /> 사용자는 이곳에서 카메라 모드, 조리개, 셔터스피드 ,iso를 조절할 수 있습니다.",
            "세팅 섹션 하단에 있는 Shoot 버튼을 클릭해 사진을 찍고 결과를 확인할 수 있습니다.",
            "장면 밑으로 보이는 숫자는 각 setting값을 뜻합니다.",
            " 왼쪽부터 차래대로 조리개, 셔터스피드, iso, 노출값 을 뜻합니다.",
            "Setting 에서 Mode를 Av 모드로 바꾸고 자유롭게 조절해 보면서 테스트해보세요!",
        ],
    },
    {
        title: "Step 4 : ISO",
        descriptions: [
            "조리개를 설정하여 심도와 카메라에 들어오는 빛의 양을 조절합니다.",
            "넓은 조리개(낮은 f-숫자)는 얕은 심도를 만듭니다.",
            "좁은 조리개(높은 f-숫자)는 심도를 증가시킵니다.",
        ],
    },
    {
        title: "Step 5 : 노출",
        descriptions: [
            "노출을 설정하여 이미지가 너무 어둡거나 밝지 않도록 합니다.",
            "필요시 노출 보정을 사용합니다.",
        ],
    },
    {
        title: "Step 6 : 카메라 모드",
        descriptions: [
            "촬영 버튼을 눌러 사진을 촬영합니다.",
            "사진을 검토하여 설정이 올바른지 확인합니다.",
        ],
    },
];

const TutorialStep = ({ step, descriptionIndex }: { step: number; descriptionIndex: number }) => {
    const currentStep = steps[step];
    const currentDescription = currentStep.descriptions[descriptionIndex];
    const descriptions = currentDescription.split("<br />").map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));

    return (
        <div className={`${StudioStyle["tutorial-step"]}`}>
            <p className="font-bookkGothicBold absolute top-4 left-4 text-white  text-[20px]">{currentStep.title}</p>
            <p className="absolute top-14 left-4 text-left text-white text-[16px]">{descriptions}</p>
        </div>
    );
};

const TutorialPage = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ImgUrl, setImgUrl] = useState<string | null>(null);
    const [takeScreenshot, setTakeScreenshot] = useState<(() => void) | null>(null);
    const { iso, shutterSpeed, aperture, exposure } = useCameraStore();
    const [step, setStep] = useState(0);
    const [descriptionIndex, setDescriptionIndex] = useState(0);

    const nextStep = () => {
        const currentStep = steps[step];
        if (descriptionIndex < currentStep.descriptions.length - 1) {
            setDescriptionIndex(descriptionIndex + 1);
        } else {
            if (step < steps.length - 1) {
                setStep(step + 1);
                setDescriptionIndex(0);
            }
        }
    };

    const prevStep = () => {
        if (descriptionIndex > 0) {
            setDescriptionIndex(descriptionIndex - 1);
        } else {
            if (step > 0) {
                setStep(step - 1);
                const previousStep = steps[step - 1];
                setDescriptionIndex(previousStep.descriptions.length - 1);
            }
        }
    };

    return (
        <>
            <div className={StudioStyle.container}>
                {step === 1 && descriptionIndex === 1 ? (
                    <Lottie animationData={arrow} className="absolute top-56 left-36 w-36 -rotate-90  z-50  " />
                ) : null}
                {step === 1 && (descriptionIndex === 2 || descriptionIndex === 3) ? (
                    <Lottie animationData={arrow} className="absolute top-0 right-[300px] w-40 -rotate-90 z-50 " />
                ) : null}
                {step === 1 && descriptionIndex === 4 ? (
                    <Lottie animationData={arrow} className="absolute bottom-24 right-[75px] w-40  z-50 " />
                ) : null}
                {step === 1 && (descriptionIndex === 5 || descriptionIndex === 6) ? (
                    <Lottie animationData={arrow} className="absolute bottom-40 left-36 w-36 -rotate-90  z-50  " />
                ) : null}
                {step === 2 ? (
                    <Lottie animationData={arrow} className="absolute top-48 right-[300px] w-36 -rotate-90  z-50  " />
                ) : null}
                {step === 3 ? (
                    <Lottie
                        animationData={arrow}
                        className="absolute top-[300px] right-[300px] w-36 -rotate-90  z-50  "
                    />
                ) : null}

                <div className=" relative w-full h-full flex flex-col m-auto">
                    <div className={StudioStyle.canvasContainer}>
                        <Canvas gl={{ alpha: true }} shadows camera={{ position: [0, 0, 5], fov: 50 }}>
                            <ambientLight intensity={1} />
                            <directionalLight position={[10, 10, 10]} intensity={2} />
                            <Capture
                                setTakeScreenshot={setTakeScreenshot}
                                setImgUrl={setImgUrl}
                                setModalIsOpen={setModalIsOpen}
                            />

                            <CameraController />
                            <Spinner />

                            <Effects shutterSpeed={shutterSpeed} iso={iso} aperture={aperture} />
                        </Canvas>
                        {modalIsOpen && ImgUrl ? <Modal setModalIsOpen={setModalIsOpen} ImgUrl={ImgUrl}></Modal> : null}
                        <div className={StudioStyle.imageOverlay}>
                            <img
                                src="/imgs/viewFinder.png"
                                alt="Overlay Image"
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                        <div className="mt-6 setting-info flex justify-center items-center">
                            <div className="font-digital text-[30px] mx-8 text-green-400">F {aperture}</div>
                            {shutterSpeed === 1 ? (
                                <div className="font-digital text-[30px] mx-8 text-green-400"> 1</div>
                            ) : (
                                <div className="font-digital text-[30px] mx-8 text-green-400"> 1 / {shutterSpeed} </div>
                            )}
                            <div className="font-digital text-[30px] mx-8 text-green-400">{iso} </div>
                            {exposure > 0 ? (
                                <div className="font-digital text-[30px] mx-8 text-green-400"> +{exposure} EV</div>
                            ) : (
                                <div className="font-digital text-[30px] mx-8 text-green-400">{exposure} EV</div>
                            )}
                        </div>
                    </div>
                    <div className="absolute bottom-9 tutorial-footer rounded-[10px] w-[90%] bg-white bg-opacity-90 left-1/2 -translate-x-1/2 text-white py-4 flex justify-between items-center  transform h-[140px]">
                        {step === 0 && descriptionIndex === 0 ? null : (
                            <button
                                onClick={prevStep}
                                className="ml-4 bottom-2 left-2 absolute bg-black text-white py-2 px-4 rounded"
                            >
                                Previous
                            </button>
                        )}
                        <TutorialStep step={step} descriptionIndex={descriptionIndex} />
                        <button
                            onClick={nextStep}
                            className="absolute bottom-2 right-2 mr-4 bg-black text-white py-2 px-4 rounded"
                        >
                            Next
                        </button>
                    </div>
                </div>
                <div className="setting-section w-[380px] border-l-[1px] bg-black h-full flex flex-col items-center">
                    <p className="py-5 text-white font-bookkMyungjoBold text-[30px]">Setting</p>
                    <CameraSettings />
                    {takeScreenshot && (
                        <button
                            onClick={takeScreenshot}
                            className="absolute rounded-[80px] flex items-center justify-center bg-white w-[170px] h-[50px] bottom-10"
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
