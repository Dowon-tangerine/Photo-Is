import React from "react";
import { useLoader, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Sky } from "@react-three/drei";

function AmusementPark() {
    const gltf = useLoader(GLTFLoader, "/models/amusement_park_1.glb");
    const { gl } = useThree(); // 이제 올바른 위치에 있음

    // 모델의 각 메시에 그림자 생성 활성화
    gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <>
            <Sky distance={40000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
            <primitive object={gltf.scene} />
        </>
    );
}

export default AmusementPark;
