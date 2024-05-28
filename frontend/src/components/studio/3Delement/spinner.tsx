import { useRef, useState, useEffect } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { DirectionalLight, Object3D } from "three";
import { Sky } from "@react-three/drei";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

function Spinner() {
    const lightRef = useRef<DirectionalLight>(null);
    const bladesRefs = useRef<Object3D[]>([]);
    const [modelLoaded, setModelLoaded] = useState(false); // 모델 로드 상태 관리

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

    const bladeMaterial = useLoader(MTLLoader, "/models/blade.mtl");
    bladeMaterial.preload();
    const blade = useLoader(OBJLoader, "/models/blade.obj", (loader) => {
        loader.setMaterials(bladeMaterial);
    });
    const stickMaterial = useLoader(MTLLoader, "/models/stick.mtl");
    stickMaterial.preload();
    const stick = useLoader(OBJLoader, "/models/stick.obj", (loader) => {
        loader.setMaterials(stickMaterial);
    });
    const axisMaterial = useLoader(MTLLoader, "/models/axis.mtl");
    axisMaterial.preload();
    const axis = useLoader(OBJLoader, "/models/axis.obj", (loader) => {
        loader.setMaterials(axisMaterial);
    });

    const mountMaterial = useLoader(MTLLoader, "/models/mount.mtl");
    mountMaterial.preload();
    const mount = useLoader(OBJLoader, "/models/mount.obj", (loader) => {
        loader.setMaterials(mountMaterial);
    });

    useEffect(() => {
        if (blade) {
            bladesRefs.current.push(blade);
            console.log("blade : ", blade.position);
            blade.position.y = 6.7;
            setModelLoaded(true); // 모델 로드 완료 상태 설정
        }

        if (mount) {
            mount.position.x = -440;
            mount.position.y = -10;
            mount.scale.set(100, 190, 200); // mount 크기를 2배로 설정
            setModelLoaded(true); // 모델 로드 완료 상태 설정
        }
    }, [blade, mount]);

    useFrame((state, delta) => {
        state;
        if (modelLoaded) {
            bladesRefs.current.forEach((blade) => {
                if (blade) {
                    const rotationSpeed = 10; // 회전 속도 조절
                    const angle = rotationSpeed * delta; // 프레임 속도에 따른 회전 각도 계산
                    blade.rotation.x += angle; // X축을 기준으로 회전
                }
            });
        }
    });
    // const { gl } = useThree();

    return (
        <>
            {/* <ambientLight intensity={1} /> */}
            <directionalLight ref={lightRef} castShadow position={[0, 100, -50]} intensity={2} />
            <Sky distance={40000} sunPosition={[0, 0.1, 0]} inclination={0} azimuth={0.25} />
            {blade && <primitive object={blade} />}
            {axis && <primitive object={axis} />}
            {stick && <primitive object={stick} />}
            {mount && <primitive object={mount} />}
        </>
    );
}

export default Spinner;
