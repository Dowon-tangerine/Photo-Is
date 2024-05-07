import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import styles from './css/Dictionary.module.css';

const modelUrl = '../src/assets/models/FujiFilm_X_T4.obj.glb';

function Model() {
  const gltf = useLoader(GLTFLoader, modelUrl);
  return (
    <>
      <primitive object={gltf.scene} />
      <Html position={[0, 0, 0]}>
        {/* <div>3D Model Loaded</div> */}
      </Html>
    </>
  );
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(13, 13, 13);
  }, [camera]);
  return null;
}

const Dictionary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchTerm);
    navigate(`/search/${searchTerm}`);
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    canvasElement?.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvasElement?.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1>Dictionary</h1>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            onKeyPress={(event) => event.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className={styles.searchButton}>🔍</button>
        </div>
        <ol>
          <button onClick={() => navigate("/docs/product2")}>카메라의 기본 구성</button>
          <button onClick={() => navigate("/docs/product2")}>노출의 3요소</button>
          <button onClick={() => navigate("/docs/product2")}>촬영모드와 설정</button>
          <button onClick={() => navigate("/docs/product2")}>사진의 구도</button>
          <button onClick={() => navigate("/docs/product2")}>카메라 액세서리</button>
          <button onClick={() => navigate("/docs/product2")}>조명의 원리</button>
        </ol>
      </div>
      <div className={styles.content} ref={canvasRef}>
        <Canvas>
          <CameraController />
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={<Html><div>Loading Model...</div></Html>}>
            <Model />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </div>
  );
};

export default Dictionary;
