import { Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import styles from './css/Dictionary.module.css';

const modelUrl = '../src/assets/models/FujiFilm_X_T4.obj.glb';

function Model() {
  const gltf = useLoader(GLTFLoader, modelUrl);
  useEffect(() => {
    gltf.scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material instanceof THREE.MeshStandardMaterial || mesh.material instanceof THREE.MeshPhysicalMaterial) {
          const material = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
          material.roughness = 0.5;
          material.metalness = 0.8;
        }
      }
    });
  }, [gltf]);
  return <primitive object={gltf.scene} />;
}

function Lights() {
  const { scene } = useThree();
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 50, 30);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(10, 10, 10);

    scene.add(ambientLight, directionalLight, pointLight);

    return () => {
      scene.remove(ambientLight, directionalLight, pointLight);
    };
  }, [scene]);

  return null;
}

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(12, 12, 12);
  }, [camera]);
  return null;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBotModal({ isOpen, onClose }: ChatBotModalProps) {
  return isOpen && (
    <div className={styles.chatBotModal}>
      <div className={styles.modalContent}>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
        <p>AI 챗봇과 대화를 시작하세요.</p>
      </div>
    </div>
  );
}

const Dictionary = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search/${searchTerm}`);
  };

  const toggleModal = () => setModalOpen(!isModalOpen);

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
    <div className={styles.sidebarTop}>
      <h1>Dictionary</h1>
      <div className={styles.searchContainer}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
            onKeyPress={(event) => event.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch} className={styles.searchButton}>
            <img src="/imgs/magnifier.png" alt="Search" />
          </button>
        </div>
      </div>
    </div>
    <div className={styles.sidebarBottom}>
      <ol>
        <button onClick={() => navigate("/docs/product2")}>카메라의 기본 구성</button>
        <button onClick={() => navigate("/docs/product2")}>노출의 3요소</button>
        <button onClick={() => navigate("/docs/product2")}>촬영모드와 설정</button>
        <button onClick={() => navigate("/docs/product2")}>사진의 구도</button>
        <button onClick={() => navigate("/docs/product2")}>카메라 액세서리</button>
        <button onClick={() => navigate("/docs/product2")}>조명의 원리</button>
      </ol>
    </div>
  </div>
  <div className={styles.content} ref={canvasRef}>
    <Canvas>
      <CameraController />
      <Lights />
      <Suspense fallback={<Html><div>Loading Model...</div></Html>}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  </div>
  <button onClick={toggleModal} className={styles.chatButton}><img src="/imgs/mage_robot-happy-fill.png" alt="AI Chat" /></button>
  <ChatBotModal isOpen={isModalOpen} onClose={toggleModal} />
</div>

  );
};

export default Dictionary;
