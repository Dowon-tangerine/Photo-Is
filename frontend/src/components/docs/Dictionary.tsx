import { Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface CameraControllerProps {
  targetPosition: Vector3 | null;
  lookAtPosition: Vector3 | null;
}

function CameraController({ targetPosition, lookAtPosition }: CameraControllerProps) {
  const { camera } = useThree();
  const initialPosition = useRef(new Vector3(9, 9, 9));

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

  return null;
}

interface Annotation {
  id: number;
  position: [number, number, number];
  label: string;
}

interface AnnotationsProps {
  onAnnotationClick: (annotation: Annotation) => void;
  selectedAnnotationId: number | null; // 추가
}

function Annotations({ onAnnotationClick, selectedAnnotationId }: AnnotationsProps) {
  const annotations: Annotation[] = [
    { id: 1, position: [-6.5, 6.2, -2.7], label: 'Fn1 버튼' },
    { id: 2, position: [-6.4, 6.7, -4.4], label: '노출 보정 다이얼' },
    { id: 3, position: [-5.1, 6.7, -2.6], label: '셔터 버튼' },
    { id: 5, position: [-3.1, 7.2, -3.7], label: '다이얼 잠금 해제' },
    { id: 5, position: [4, 7.2, -3.85], label: '다이얼 잠금 해제' },
    { id: 6, position: [0.3, 7.8, -5], label: '핫 슈' },
    { id: 14, position: [4.1, 0.7, -2.1], label: '초점 모드 셀렉터' },
    { id: 17, position: [-3.5, 4.2, -2], label: 'Fn2 버튼' },
    { id: 35, position: [-4.7, 5.9, -5.6], label: '후면 커맨드 다이얼' },
  ];

  return (
    <>
      {annotations.map((annotation, index) => (
        <group key={index} position={annotation.position} onClick={() => onAnnotationClick(annotation)}>
          <mesh position={[0, 0.225, 0]}>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshStandardMaterial
              color={selectedAnnotationId === annotation.id ? 'red' : 'yellow'} // 클릭된 핀의 색을 변경합니다.
              emissive={selectedAnnotationId === annotation.id ? 'red' : 'yellow'}
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh rotation={[Math.PI, 0, 0]} position={[0, -0.15, 0]}>
            <coneGeometry args={[0.15, 0.3, 32]} />
            <meshStandardMaterial
              color={selectedAnnotationId === annotation.id ? 'red' : 'yellow'} // 클릭된 핀의 색을 변경합니다.
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
      <div className={styles.modalHeader}>
        <h2 className={styles.annotationTitle}>{annotation.label}</h2>
        <span className={styles.closeButton} onClick={onClose}>&times;</span>
      </div>
      <div className={styles.modalContent}>
        {details || 'Loading...'}
      </div>
    </div>
  );
}

interface ChatMessage {
  sender: 'user' | 'bot' | 'loading';
  text: string;
}

interface Session {
  sessionId: string;
  lastMessage: string;
}

interface ApiMessage {
  role: 'user' | 'assistant';
  message: string;
}

interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SessionModalProps {
  isOpen: boolean;
  sessions: Session[];
  onSessionClick: (sessionId: string) => void;
  toggleModal: () => void; // Add this prop
}

function SessionModal({ isOpen, sessions, onSessionClick }: SessionModalProps) {
  return (
    <div className={`${styles.sessionModal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.modalHeader}>
        <span>세션 목록</span>
      </div>
      <div className={styles.modalContent}>
        <ul>
          {sessions.map((session) => (
            <li key={session.sessionId} onClick={() => onSessionClick(session.sessionId)}>
              {session.lastMessage}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ChatBotModal({ isOpen, onClose }: ChatBotModalProps) {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const memberId = 'someMemberId'; // Replace this with the actual memberId

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
        newMessages[newMessages.length - 1] = botMessage;
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
        newMessages[newMessages.length - 1] = botMessage;
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

  const handleSessionClick = async (sessionId: string) => {
    setSessionId(sessionId);
    try {
      const res = await axios.get(`https://k10d103.p.ssafy.io/api/chatbot/messages?sessionId=${sessionId}`);
      const sessionMessages: ChatMessage[] = res.data.map((message: ApiMessage) => ({
        sender: message.role === 'user' ? 'user' : 'bot',
        text: message.message,
      }));
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Failed to fetch session messages:', error);
    }
  };

  const toggleSessionModal = () => {
    setIsSessionModalOpen((prev) => !prev);
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get(`https://k10d103.p.ssafy.io/api/chatbot/sessions?memberId=${memberId}`);
        setSessions(res.data);
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      }
    };

    fetchSessions();
  }, [memberId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return isOpen ? (
    <div className={styles.chatBotContainer}>
      <SessionModal
        isOpen={isSessionModalOpen}
        sessions={sessions}
        onSessionClick={handleSessionClick}
        toggleModal={toggleSessionModal}
      />
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
  const [loading, setLoading] = useState(true); // Add loading state
  const [targetPosition, setTargetPosition] = useState<Vector3 | null>(null); // Add target position state
  const [lookAtPosition, setLookAtPosition] = useState<Vector3 | null>(null); // Add lookAt position state
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<number | null>(null); // 클릭된 핀의 ID를 저장하는 상태 추가
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search/${searchTerm}`);
  };

  const toggleChatBotModal = () => setChatBotModalOpen((prev) => !prev);

  const handleAnnotationClick = (annotation: Annotation) => {
    setAnnotation(annotation);
    setAnnotationModalOpen(true);

    const lookAtPos = new Vector3(annotation.position[0], annotation.position[1], annotation.position[2]);

    // 카메라 위치를 설정합니다 (핀 위치에서 약간 떨어진 곳에 위치하게 설정).
    let cameraPos;
    switch (annotation.id) {
      case 1:
        cameraPos = new Vector3(lookAtPos.x -3, lookAtPos.y + 3, lookAtPos.z + 1);
        break;
      case 2:
        cameraPos = new Vector3(lookAtPos.x -7, lookAtPos.y + 3, lookAtPos.z -1);
        break;
      case 3:
        cameraPos = new Vector3(lookAtPos.x - 5, lookAtPos.y + 5, lookAtPos.z + 4);
        break;
      case 5:
        cameraPos = new Vector3(lookAtPos.x -5, lookAtPos.y + 3, lookAtPos.z -8);
        break;
      case 6:
        cameraPos = new Vector3(lookAtPos.x + 4, lookAtPos.y + 4, lookAtPos.z -6);
        break;
      case 14:
        cameraPos = new Vector3(lookAtPos.x + 6, lookAtPos.y + 3, lookAtPos.z + 6);
        break;
      case 17:
        cameraPos = new Vector3(lookAtPos.x -5, lookAtPos.y + 3, lookAtPos.z +5);
        break;
      case 35:
        cameraPos = new Vector3(lookAtPos.x -5, lookAtPos.y + 3, lookAtPos.z -6);
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
          <h1 className="font-bookkMyungjoBold">Dictionary</h1>
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
          <div className='font-bookkGothic'>
            {sidebarItems.map((item) => (
              <div key={item.title} className='font-bookkGothic'>
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
            <CameraController targetPosition={targetPosition} lookAtPosition={lookAtPosition} />
            <Lights />
            <Suspense fallback={<Html><div>Loading Model...</div></Html>}>
              <Model setLoading={setLoading} />
            </Suspense>
            {!loading && <Annotations onAnnotationClick={handleAnnotationClick} selectedAnnotationId={selectedAnnotationId} />}
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
