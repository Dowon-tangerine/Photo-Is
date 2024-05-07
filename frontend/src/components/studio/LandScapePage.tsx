import React from "react";
import { Canvas } from "@react-three/fiber";
import { ThreeElement } from "./element/ThreeElement";
import { OrbitControls, Sky } from "@react-three/drei";
import StudioStyle from "./css/Studio.module.css"; // CSS 모듈 임포트 확인
import AmusementPark from "./element/AmusementPark";
function LandScapePage() {
    console.log(Canvas);
    return (
        <>
            <div className={StudioStyle.container}>
                <div className={StudioStyle.canvasContainer}>
                    <Canvas camera={{ position: [150, 5, 60], fov: 50, far: 10000 }}>
                        <ambientLight intensity={2} />
                        <Sky
                            distance={450000} // Sky의 반지름
                            sunPosition={[0, 1, 0]} // 태양의 위치
                            inclination={0} // 경사
                            azimuth={0.25} // 방위각
                        />
                        <OrbitControls />
                        <ThreeElement></ThreeElement>
                        <AmusementPark></AmusementPark>
                    </Canvas>
                </div>
                <div className="absolute top-0 right-0 w-[300px] bg-black bg-opacity-90  h-full flex flex-col items-center">
                    <p className="text-white font-bookkMyungjoBold text-[30px] p-5">Setting</p>
                </div>
            </div>
        </>
    );
}

export default LandScapePage;
