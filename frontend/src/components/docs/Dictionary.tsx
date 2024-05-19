import { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas, useThree, useLoader, extend } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ConeGeometry, SphereGeometry, Vector3 } from 'three';
import * as THREE from 'three';
import axios from 'axios';
import { marked } from 'marked';
import styles from './css/Dictionary.module.css';

extend({ ConeGeometry, SphereGeometry });

const modelUrl = '/imgs/FujiFilm_X_T4.obj.glb';

function Model({ setLoading }: { setLoading: (isLoading: boolean) => void }) {
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
    setLoading(false); // Set loading to false when the model is fully loaded
  }, [gltf, setLoading]);
  return (
    <group position={[-1, -4, 0]}>
      <primitive object={gltf.scene} />
    </group>
  );
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

interface CameraControllerProps {
  targetPosition: Vector3 | null;
  lookAtPosition: Vector3 | null;
  resetCamera: boolean;
}

function CameraController({ targetPosition, lookAtPosition, resetCamera }: CameraControllerProps) {
  const { camera } = useThree();
  const initialPosition = useRef(new Vector3(10, 7, 10));

  useEffect(() => {
    camera.position.copy(initialPosition.current);
    camera.lookAt(new Vector3(0, 0, 0));
  }, [camera]);

  useEffect(() => {
    if (targetPosition && lookAtPosition) {
      const duration = 1000; // 이동 시간 (밀리초)
      const start = Date.now();
      const initialPos = camera.position.clone();
      const animate = () => {
        const elapsed = Date.now() - start;
        if (elapsed < duration) {
          const t = elapsed / duration;
          camera.position.lerpVectors(initialPos, targetPosition, t);
          camera.lookAt(lookAtPosition);
          requestAnimationFrame(animate);
        } else {
          camera.position.copy(targetPosition);
          camera.lookAt(lookAtPosition);
        }
      };
      animate();
    }
  }, [targetPosition, lookAtPosition, camera]);

  useEffect(() => {
    if (resetCamera) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(new Vector3(0, 0, 0));
    }
  }, [resetCamera, camera]);

  return null;
}

interface Annotation {
  id: number;
  position: [number, number, number];
  label: string;
}

interface AnnotationsProps {
  onAnnotationClick: (annotation: Annotation) => void;
  selectedAnnotationId: number | null;
}

function Annotations({ onAnnotationClick, selectedAnnotationId }: AnnotationsProps) {
  const annotations: Annotation[] = [
    { id: 1, position: [-6.5, 3.2, -2.7], label: 'Fn1 버튼' },
    { id: 2, position: [-6.4, 3.7, -4.4], label: '노출 보정 다이얼' },
    { id: 3, position: [-5.1, 3.7, -2.6], label: '셔터 버튼' },
    { id: 5, position: [-3.1, 4.2, -3.7], label: '다이얼 잠금 해제' },
    { id: 5, position: [4, 4.2, -3.85], label: '다이얼 잠금 해제' },
    { id: 6, position: [0.3, 4.8, -5], label: '핫 슈' },
    { id: 14, position: [4.1, -2.4, -2.0], label: '초점 모드 셀렉터' },
    { id: 17, position: [-3.5, 1.2, -2], label: 'Fn2 버튼' },
    { id: 35, position: [-4.7, 2.9, -5.6], label: '후면 커맨드 다이얼' },
  ];

  return (
    <>
      {annotations.map((annotation, index) => (
        <group
          key={index}
          position={annotation.position}
          onClick={() => onAnnotationClick(annotation)}
        >
          <mesh position={[0, 0.225, 0]}>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshStandardMaterial
              color={selectedAnnotationId === annotation.id ? 'red' : 'yellow'}
              emissive={selectedAnnotationId === annotation.id ? 'red' : 'yellow'}
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.15, 0]}>
            <coneGeometry args={[0.15, 0.3, 32]} />
            <meshStandardMaterial
              color={selectedAnnotationId === annotation.id ? 'red' : 'yellow'}
              emissive={selectedAnnotationId === annotation.id ? 'red' : 'yellow'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

interface AnnotationModalProps {
  annotation: Annotation;
  onClose: () => void;
}

function AnnotationModal({ annotation, onClose }: AnnotationModalProps) {
  const [details, setDetails] = useState('');

  useEffect(() => {
    const fetchAnnotationDetails = async () => {
      try {
        const response = await axios.get(`https://k10d103.p.ssafy.io/api/camera-parts/${annotation.id}`);
        setDetails(response.data.description);
      } catch (error) {
        console.error('Failed to fetch annotation details:', error);
      }
    };

    fetchAnnotationDetails();
  }, [annotation.id]);

  return (
    <div className={styles.annotationModal}>
      <div className={`${styles.annotationModalHeader} font-bookkGothic`}>
        <h2 className={`${styles.annotationTitle} font-bookkGothic`}>{annotation.label}</h2>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
      </div>
      <div className={`${styles.modalContent} font-bookkGothic`}>
        {details || 'Loading...'}
      </div>
    </div>
  );
}

type SenderType = 'user' | 'assistant' | 'loading';

interface ChatMessage {
  sender: SenderType;
  text: string;
}

interface ApiResponse {
  answer: string;
  sessionId: number;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBotModal({ isOpen, onClose }: ChatBotModalProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const memberId = localStorage.getItem('memberId'); // Get memberId from localStorage

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: question };
    const loadingMessage: ChatMessage = { sender: 'loading', text: 'Loading...' };

    setMessages((prevMessages) => [...prevMessages, userMessage, loadingMessage]);
    setQuestion('');

    try {
      const params = new URLSearchParams({
        memberId: memberId || '',
        question: question,
      });

      const res = await axios.post<ApiResponse>(`https://k10d103.p.ssafy.io/api/chatbot/chat?${params.toString()}`);

      const assistantMessage: ChatMessage = { sender: 'assistant', text: res.data.answer };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = assistantMessage;
        return newMessages;
      });

    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? `Error: ${error.response?.data?.message || error.message}`
        : error instanceof Error
        ? `Error: ${error.message}`
        : 'An unexpected error occurred';

      const assistantMessage: ChatMessage = { sender: 'assistant', text: errorMessage };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = assistantMessage;
        return newMessages;
      });
    }
  };

  const handleRecommendedQuestionClick = (question: string) => {
    setQuestion(question);
  };

  const toggleRecommendations = () => {
    setShowRecommendations((prev) => !prev);
  };

  const preventScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    e.currentTarget.scrollTop += e.deltaY;
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return isOpen ? (
    <div className={styles.chatBotContainer}>
      <div className={styles.chatBotModal} onWheel={preventScroll}>
        <div className={styles.modalHeader}>
          <span>Ai 챗봇</span>
          <span className={styles.closeButton} onClick={onClose}>&times;</span>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.chatContainer} ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={message.sender === 'user' ? styles.userMessage : styles.botMessage}
                dangerouslySetInnerHTML={{ __html: marked(message.text) }}
              ></div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <input
              type="text"
              value={question}
              onChange={handleQuestionChange}
              placeholder="질문을 입력하세요."
              className={styles.questionInput}
            />
            <button type="submit" className={styles.submitButton}>보내기</button>
          </form>
          <button className={styles.recommendationsToggle} onClick={toggleRecommendations}>
            {showRecommendations ? '추천 질문 숨기기' : '추천 질문 보기'}
          </button>
          {showRecommendations && (
            <div className={styles.recommendedQuestions}>
              <p>추천 질문</p>
              <ul>
                <li onClick={() => handleRecommendedQuestionClick('셔터 스피드 조절하는 법')}>셔터 스피드 조절하는 법</li>
                <li onClick={() => handleRecommendedQuestionClick('ISO가 뭐야?')}>ISO가 뭐야?</li>
                <li onClick={() => handleRecommendedQuestionClick('노출값 어떻게 설정해?')}>노출값 어떻게 설정해?</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
}

function Dictionary() {

  const [isChatBotModalOpen, setChatBotModalOpen] = useState(false);
  const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
  const [annotation, setAnnotation] = useState<Annotation | null>(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null); // Add target position state
  const [lookAtPosition, setLookAtPosition] = useState<Vector3 | null>(null); // Add lookAt position state
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<number | null>(null); // 클릭된 핀의 ID를 저장하는 상태 추가
  const [resetCamera, setResetCamera] = useState(false); // 카메라 초기 위치로 복귀
  const canvasRef = useRef<HTMLDivElement>(null);



  const toggleChatBotModal = () => setChatBotModalOpen((prev) => !prev);

  const handleAnnotationClick = (annotation: Annotation) => {
    setAnnotation(annotation);
    setAnnotationModalOpen(true);

    const lookAtPos = new Vector3(annotation.position[0], annotation.position[1], annotation.position[2]);

    // 카메라 위치를 설정합니다 (핀 위치에서 약간 떨어진 곳에 위치하게 설정).
    let cameraPos;
    switch (annotation.id) {
      case 1:
        cameraPos = new Vector3(lookAtPos.x - 3, lookAtPos.y + 3, lookAtPos.z + 1);
        break;
      case 2:
        cameraPos = new Vector3(lookAtPos.x - 7, lookAtPos.y + 3, lookAtPos.z - 1);
        break;
      case 3:
        cameraPos = new Vector3(lookAtPos.x - 5, lookAtPos.y + 5, lookAtPos.z + 4);
        break;
      case 5:
        cameraPos = new Vector3(lookAtPos.x - 5, lookAtPos.y + 3, lookAtPos.z - 8);
        break;
      case 6:
        cameraPos = new Vector3(lookAtPos.x + 4, lookAtPos.y + 4, lookAtPos.z - 6);
        break;
      case 14:
        cameraPos = new Vector3(lookAtPos.x + 6, lookAtPos.y + 3, lookAtPos.z + 6);
        break;
      case 17:
        cameraPos = new Vector3(lookAtPos.x - 5, lookAtPos.y + 3, lookAtPos.z + 5);
        break;
      case 35:
        cameraPos = new Vector3(lookAtPos.x - 5, lookAtPos.y + 3, lookAtPos.z - 6);
        break;
      default:
        cameraPos = new Vector3(lookAtPos.x + 5, lookAtPos.y + 5, lookAtPos.z + 5);
    }

    setTargetPosition(cameraPos);
    setLookAtPosition(lookAtPos);
    setSelectedAnnotationId(annotation.id); // 클릭된 핀의 ID를 저장합니다.
  };

  const closeAnnotationModal = () => {
    setAnnotation(null);
    setAnnotationModalOpen(false);
    setResetCamera(true); // 카메라 초기 위치로 복귀
    setSelectedAnnotationId(null); // 핀의 색상을 초기 상태로 되돌립니다.
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
      <div className={styles.content} ref={canvasRef}>
        <div className={styles.canvasContainer}>
          <Canvas>
            <CameraController targetPosition={targetPosition} lookAtPosition={lookAtPosition} resetCamera={resetCamera} />
            <Lights />
            <Suspense fallback={<Html center className={styles.loadingWrapper}><div className={styles.loadingCircle}></div><div className={styles.loadingText}>Loading...</div></Html>}>
              <Model setLoading={setLoading} />
            </Suspense>
            {!loading && <Annotations onAnnotationClick={handleAnnotationClick} selectedAnnotationId={selectedAnnotationId} />}
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      <button onClick={toggleChatBotModal} className={styles.chatButton}><img src="/imgs/mage_robot-happy-fill.png" alt="AI Chat" /></button>
      <ChatBotModal isOpen={isChatBotModalOpen} onClose={toggleChatBotModal} />
      {isAnnotationModalOpen && annotation && (
        <AnnotationModal annotation={annotation} onClose={closeAnnotationModal} />
      )}
    </div>
  );
}

export default Dictionary;
