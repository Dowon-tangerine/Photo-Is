import { useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCameraStore } from "../store/useCameraStore";

function CameraController() {
    const { setFocusDistance } = useCameraStore(); // Zustand 스토어에서 exposure 값을 가져옴
    const { gl, camera } = useThree();
    const spinnerPosition = new THREE.Vector3(0, 6.5, 0.5); // Spinner의 위치
    useEffect(() => {
        // 카메라에서 Spinner까지의 거리 계산
        const distance = camera.position.distanceTo(spinnerPosition);
        console.log(camera);
        camera.position.set(11, 4, 0);
        camera.far = 10000;
        setFocusDistance(distance);
    }, [gl, camera]);

    useFrame(() => {
        camera.lookAt(spinnerPosition); // 카메라가 항상 Spinner를 바라보도록 설정
    });

    return null;
}

export default CameraController;
