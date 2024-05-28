import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

const SPEED = 5; // 이동 속도

const AmuseUserController = () => {
    const { camera, gl } = useThree();
    const controlsRef = useRef<any>();
    const velocity = useRef(new THREE.Vector3());

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyW":
                case "ArrowUp":
                    velocity.current.z = -SPEED;
                    break;
                case "KeyS":
                case "ArrowDown":
                    velocity.current.z = SPEED;
                    break;
                case "KeyA":
                case "ArrowLeft":
                    velocity.current.x = -SPEED;
                    break;
                case "KeyD":
                case "ArrowRight":
                    velocity.current.x = SPEED;
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            switch (event.code) {
                case "KeyW":
                case "ArrowUp":
                case "KeyS":
                case "ArrowDown":
                    velocity.current.z = 0;
                    break;
                case "KeyA":
                case "ArrowLeft":
                case "KeyD":
                case "ArrowRight":
                    velocity.current.x = 0;
                    break;
                default:
                    break;
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useFrame((_, delta) => {
        if (controlsRef.current) {
            const direction = new THREE.Vector3();
            controlsRef.current.getDirection(direction);

            direction.multiplyScalar(velocity.current.z * delta);
            camera.position.add(direction);

            const strafe = new THREE.Vector3();
            strafe.setFromMatrixColumn(camera.matrix, 0);
            strafe.multiplyScalar(velocity.current.x * delta);
            camera.position.add(strafe);
        }
    });

    return <PointerLockControls ref={controlsRef} args={[camera, gl.domElement]} />;
};

export default AmuseUserController;
