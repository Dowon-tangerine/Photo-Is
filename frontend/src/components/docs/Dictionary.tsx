import { Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree, useLoader, extend } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ConeGeometry, SphereGeometry } from 'three';
import * as THREE from 'three';
import axios from 'axios';
import { marked } from 'marked';
import styles from './css/Dictionary.module.css';

// Extend THREE with Geometry
extend({ ConeGeometry, SphereGeometry });

const modelUrl = '/imgs/FujiFilm_X_T4.obj.glb';

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
  return (
    <group position={[-1, -1, 0]}>
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

function CameraController() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(10, 10, 10);
  }, [camera]);
  return null;
}

interface Annotation {
  position: [number, number, number];
  label: string;
}

interface AnnotationsProps {
  onAnnotationClick: (annotation: Annotation) => void;
}

function Annotations({ onAnnotationClick }: AnnotationsProps) {
  const annotations: Annotation[] = [
    { position: [-6.4, 6.7, -4.4], label: '노출 보정 다이얼' },
    { position: [-6.5, 6.2, -2.7], label: 'Fn1 버튼' },
    { position: [-5.1, 6.7, -2.6], label: '셔터 버튼' },
    { position: [-3.1, 7.2, -3.7], label: '다이얼 잠금 해제' },
    { position: [-3.5, 4.2, -2], label: 'Fn2 버튼' },
    { position: [0.3, 7.8, -5], label: '핫 슈' },
    { position: [4, 7.2, -3.85], label: '다이얼 잠금 해제' },
    { position: [4.1, 0.7, -2.1], label: '초점 모드 셀렉터' },
    { position: [-4.7, 5.9, -5.8], label: '후면 커맨드 다이얼' },
  ];

  return (
    <>
      {annotations.map((annotation, index) => (
        <group key={index} position={annotation.position} onClick={() => onAnnotationClick(annotation)}>
          <mesh position={[0, 0.225, 0]}>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.15, 0]}>
            <coneGeometry args={[0.15, 0.3, 32]} />
            <meshStandardMaterial color="#FFFF00" />
          </mesh>
        </group>
      ))}
    </>
  );
}

interface ChatMessage {
  sender: 'user' | 'bot' | 'loading';
  text: string;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBotModal({ isOpen, onClose }: ChatBotModalProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId] = useState(() => `session-${Math.random().toString(36).substr(2, 9)}`);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
      const res = await axios.post('https://k10d103.p.ssafy.io/api/chatbot/chat', {
        question,
        sessionId,
      });
      const botMessage: ChatMessage = { sender: 'bot', text: res.data.answer };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = botMessage; // Replace loading message with bot message
        return newMessages;
      });
    } catch (error: unknown) {
      const errorMessage = axios.isAxiosError(error)
        ? `Error: ${error.response?.data?.message || error.message}`
        : error instanceof Error
          ? `Error: ${error.message}`
          : 'An unexpected error occurred';

      const botMessage: ChatMessage = { sender: 'bot', text: errorMessage };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = botMessage; // Replace loading message with error message
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
  ) : null;
}

interface AnnotationModalProps {
  annotation: Annotation;
  onClose: () => void;
}

function AnnotationModal({ annotation, onClose }: AnnotationModalProps) {
  return (
    <div className={styles.annotationModal}>
      <div className={styles.modalHeader}>
        <h2 className={styles.annotationTitle}>{annotation.label}</h2>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
      </div>
      <div className={styles.modalContent}>
        {/* Add detailed content for each annotation here */}
      </div>
    </div>
  );
}

interface SidebarItem {
  title: string;
  content: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: '카메라의 기본 구성',
    content: ['렌즈', '바디', '뷰파인더', '센서'],
  },
  {
    title: '노출의 3요소',
    content: ['조리개', '셔터 스피드', 'ISO'],
  },
  {
    title: '촬영모드와 설정',
    content: ['매뉴얼 모드', '자동 모드', '프로그램 모드', '셔터 우선 모드'],
  },
  {
    title: '사진의 구도',
    content: ['삼분할 법칙', '중심 구도', '대각선 구도', '프레임 안의 프레임'],
  },
  {
    title: '카메라 액세서리',
    content: ['삼각대', '필터', '플래시', '배터리'],
  },
  {
    title: '조명의 원리',
    content: ['자연광', '인공광', '조명의 방향', '조명의 색온도'],
  },
];

function Dictionary() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatBotModalOpen, setChatBotModalOpen] = useState(false);
  const [isAnnotationModalOpen, setAnnotationModalOpen] = useState(false);
  const [annotation, setAnnotation] = useState<Annotation | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedSidebarItem, setSelectedSidebarItem] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search/${searchTerm}`);
  };

  const toggleChatBotModal = () => setChatBotModalOpen(!isChatBotModalOpen);

  const handleAnnotationClick = (annotation: Annotation) => {
    setAnnotation(annotation);
    setAnnotationModalOpen(true);
  };

  const closeAnnotationModal = () => {
    setAnnotation(null);
    setAnnotationModalOpen(false);
  };

  const handleSidebarItemClick = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title);
  };

  const handleContentItemClick = (item: string) => {
    setSelectedSidebarItem(item);
  };

  const closeSidebarDetail = () => {
    setSelectedSidebarItem(null);
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
          <div>
            {sidebarItems.map((item) => (
              <div key={item.title}>
                <button onClick={() => handleSidebarItemClick(item.title)}>{item.title}</button>
                {openDropdown === item.title && (
                  <div className={styles.dropdownContent}>
                    {item.content.map((subItem) => (
                      <button key={subItem} onClick={() => handleContentItemClick(subItem)}>{subItem}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.content} ref={canvasRef}>
        <div className={styles.canvasContainer}>
          <Canvas>
            <CameraController />
            <Lights />
            <Suspense fallback={<Html><div>Loading Model...</div></Html>}>
              <Model />
            </Suspense>
            <Annotations onAnnotationClick={handleAnnotationClick} />
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      {selectedSidebarItem && (
        <div className={`${styles.sidebarDetail} ${selectedSidebarItem ? styles.sidebarDetailOpen : ''}`}>
          <div className={styles.sidebarDetailHeader}>
            <h2>{selectedSidebarItem}</h2>
            <span className={styles.closeButton} onClick={closeSidebarDetail}>&times;</span>
          </div>
          <div className={styles.sidebarDetailContent}>
            {/* Add detailed content for each sidebar item here */}
          </div>
        </div>
      )}
      <button onClick={toggleChatBotModal} className={styles.chatButton}><img src="/imgs/mage_robot-happy-fill.png" alt="AI Chat" /></button>
      <ChatBotModal isOpen={isChatBotModalOpen} onClose={toggleChatBotModal} />
      {isAnnotationModalOpen && annotation && (
        <AnnotationModal annotation={annotation} onClose={closeAnnotationModal} />
      )}
    </div>
  );
}

export default Dictionary;
