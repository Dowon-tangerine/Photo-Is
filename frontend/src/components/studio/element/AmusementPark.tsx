import React, { useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function AmusementPark() {
    const gltf = useLoader(GLTFLoader, "/models/amusement_park_1.glb");
    return <primitive object={gltf.scene} />;
}

export default AmusementPark;
