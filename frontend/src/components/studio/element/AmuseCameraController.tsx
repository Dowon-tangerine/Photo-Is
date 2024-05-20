import { useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCameraStore } from "../store/useCameraStore";

function AmuseCameraController() {
    const { setFocusDistance } = useCameraStore(); // Zustand 스토어에서 exposure 값을 가져옴
    const { gl, camera } = useThree();
    const spinnerPosition = new THREE.Vector3(0, 6.7, 0.1); // Spinner의 위치
    useEffect(() => {
        // 카메라에서 Spinner까지의 거리 계산
        const distance = camera.position.distanceTo(spinnerPosition);
        console.log(camera);
        camera.position.set(65, 3, 50);
        camera.position.z -= 2;
        camera.far = 10000;
        setFocusDistance(distance);
    }, [gl, camera]);

    useFrame(() => {});

    return null;
}

export default AmuseCameraController;
