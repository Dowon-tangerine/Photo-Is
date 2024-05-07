import * as THREE from "three";
import { useThree } from "@react-three/fiber";

export function ThreeElement() {
    const { size } = useThree();
    return (
        <>
            <directionalLight position={[5, 5, 5]} />
            <mesh rotation={[0, THREE.MathUtils.degToRad(45), 0]}>
                <boxGeometry />
                <meshStandardMaterial color="red"></meshStandardMaterial>
            </mesh>
        </>
    );
}
