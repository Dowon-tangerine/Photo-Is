import { useLoader, useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DirectionalLight } from "three";
import { Sky, OrbitControls } from "@react-three/drei";

function AmusementPark() {
    const lightRef = useRef<DirectionalLight>(null);

    useEffect(() => {
        if (lightRef.current) {
            const light = lightRef.current;
            light.castShadow = true;
            light.shadow.bias = -0.005;
            light.shadow.mapSize.width = 4096;
            light.shadow.mapSize.height = 4096;
            light.shadow.camera.near = 1;
            light.shadow.camera.far = 1000;
            light.shadow.camera.left = -200;
            light.shadow.camera.right = 200;
            light.shadow.camera.top = 200;
            light.shadow.camera.bottom = -200;
        }
    }, []);

    const gltf = useLoader(GLTFLoader, "/models/amusement_park_1.glb");
    const { gl } = useThree(); // 이제 올바른 위치에 있음
    console.log(gl);

    // 모델의 각 메시에 그림자 생성 활성화
    gltf.scene.traverse((child: any) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight ref={lightRef} castShadow position={[0, 100, -50]} intensity={2} />
            <OrbitControls />
            <Sky distance={40000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
            <primitive object={gltf.scene} />
        </>
    );
}

export default AmusementPark;
