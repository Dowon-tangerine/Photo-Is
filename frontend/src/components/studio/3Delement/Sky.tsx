import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";

const Sky: React.FC<{ url: string }> = ({ url }) => {
    return (
        <Canvas style={{ background: "#000" }}>
            <Html>
                <div style={{ width: "100%", height: "100%" }}>
                    <img src={url} alt="Background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
            </Html>
        </Canvas>
    );
};

export default Sky;
