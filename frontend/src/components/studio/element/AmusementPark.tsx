import React from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function AmusementPark() {
    const gltf = useLoader(GLTFLoader, "/models/amusement_park_1.glb");

    // 모델의 각 메시에 그림자 생성 활성화
    gltf.scene.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return <primitive object={gltf.scene} />;
}

export default AmusementPark;
