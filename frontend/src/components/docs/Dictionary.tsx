import { Suspense, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import axios from 'axios';
import { marked } from 'marked';
import styles from './css/Dictionary.module.css';

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
        <div className={styles.canvasContainer}>
          <Canvas>
            <CameraController />
            <Lights />
            <Suspense fallback={<Html><div>Loading Model...</div></Html>}>
              <Model />
            </Suspense>
            <OrbitControls />
          </Canvas>
        </div>
      </div>
      <button onClick={toggleModal} className={styles.chatButton}><img src="/imgs/mage_robot-happy-fill.png" alt="AI Chat" /></button>
      <ChatBotModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default Dictionary;
