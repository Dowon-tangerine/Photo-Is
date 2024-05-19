import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import styles from './css/HelloPhoto.module.css';

// ChatMessage 타입 정의
interface ChatMessage {
  sender: 'user' | 'assistant' | 'loading';
  text: string;
}

// Session 타입 정의
interface Session {
  sessionId: number;
  lastMessage: string;
}

// API 응답 타입 정의
interface ApiMessage {
  role: 'user' | 'assistant';
  message: string;
}

// API 응답 타입 정의 (수정된 형태)
interface ApiResponse {
  answer: string;
  sessionId: number;
}

// ChatBotModalProps 타입 정의
interface ChatBotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// SessionModalProps 타입 정의
interface SessionModalProps {
  isOpen: boolean;
  sessions: Session[];
  onSessionClick: (sessionId: number) => void;
  toggleModal: () => void;
}

function SessionModal({ isOpen, sessions, onSessionClick, toggleModal }: SessionModalProps) {
  return (
    <div className={`${styles.sessionModal} ${isOpen ? styles.open : ''}`}>
      <div className={styles.modalHeader}>
        <span>세션 목록</span>
        <button onClick={toggleModal}>&times;</button>
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
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isSessionModalOpen, setSessionModalOpen] = useState(false);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };

  const fetchSessions = async () => {
    try {
      const memberId = localStorage.getItem('memberId');
      const res = await axios.get('https://k10d103.p.ssafy.io/api/chatbot/sessions', {
        params: { memberId }
      });
      const fetchedSessions = res.data.map((session: { id: number; lastMessage: string }) => ({
        sessionId: session.id,
        lastMessage: session.lastMessage
      }));
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const fetchMessages = async (sessionId: number) => {
    try {
      const res = await axios.get('https://k10d103.p.ssafy.io/api/chatbot/messages', {
        params: { sessionId }
      });
      const sessionMessages: ChatMessage[] = res.data.map((message: ApiMessage) => ({
        sender: message.role === 'user' ? 'user' : 'assistant',
        text: message.message,
      }));
      setMessages(sessionMessages);
    } catch (error) {
      console.error('Failed to fetch session messages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage: ChatMessage = { sender: 'user', text: question };
    const loadingMessage: ChatMessage = { sender: 'loading', text: 'Loading...' };

    setMessages((prevMessages) => [...prevMessages, userMessage, loadingMessage]);
    setQuestion('');

    try {
      const memberId = localStorage.getItem('memberId');
      const params = new URLSearchParams({
        memberId: memberId || '',
        question: question,
      });
      if (sessionId !== null) {
        params.append('sessionId', sessionId.toString());
      }

      const res = await axios.post<ApiResponse>(`https://k10d103.p.ssafy.io/api/chatbot/chat?${params.toString()}`);

      const assistantMessage: ChatMessage = { sender: 'assistant', text: res.data.answer };
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        newMessages[newMessages.length - 1] = assistantMessage;
        return newMessages;
      });

      if (sessionId === null && res.data.sessionId) {
        setSessionId(res.data.sessionId);
      }

      fetchSessions(); // 새로운 세션이 생성된 후 세션 목록 갱신
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

  const handleSessionClick = async (sessionId: number) => {
    setSessionId(sessionId);
    await fetchMessages(sessionId);
    setSessionModalOpen(false); // 세션 선택 후 모달 닫기
  };

  const handleNewSessionClick = () => {
    setSessionId(null);
    setMessages([]);
  };

  const toggleSessionModal = () => {
    setSessionModalOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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
                className={message.sender === 'user' ? styles.userMessage : styles.assistantMessage}
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
          <button onClick={handleNewSessionClick} className={styles.newSessionButton}>
            새로운 세션 시작
          </button>
        </div>
      </div>
    </div>
  ) : null;
}

const HelloPhoto = () => {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // 총 페이지 수

  const toggleSubMenu = () => setShowSubMenu(!showSubMenu);
  const toggleModal = () => setModalOpen((prev) => !prev); // 수정된 toggleModal 함수

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <h2>1. 카메라란?</h2>
            <h3>1.1 카메라의 원리</h3>
            <img src="/imgs/camera_principle.png" alt="Camera Principle" />
            <p>
              빛과 피사체가 렌즈를 통해 카메라 내부로 들어온다. 렌즈 뒤에 위치하는 RGB(빨강, 초록, 파랑) 필터를 통과한 후에 이미지 센서에 피사체의 형상이 맺힌다. 그런 다음 펜타프리즘(Penta-prism)을 거쳐 뷰파인더를 통해 우리 눈에 보이게 된다.
              이미지 센서에 피사체의 상이 맺히면 이는 AD컨버터를 통해 아날로그 신호가 디지털 신호로 변환된다. 그리고 카메라 내 버퍼 메모리에 저장된 후 여러 가지 색상 처리가 이루어진 다음 이미지 압축 표준(JPEG 등)으로 압축되어 저장장치(SD메모리, CF메모리 등)에 최종 저장된다.
            </p>
            <h3>1.3 카메라의 역사</h3>
            <img src="/imgs/photo_origin.png" alt="Camera History" />
            <p>
              영어의 카메라라는 말은 카메라 옵스큐라(Camera obscura, 라틴어로 어두운 방을 뜻함)에서 온 용어이다. 카메라 옵스큐라의 원형은 어두운 공간의 한쪽 벽면에 작은 구멍을 뚫고 구멍의 반대쪽 벽면에 카메라 외부의 풍경을 투사시켜 개기일식을 관찰할 때 이용하였다. 
              카메라 옵스큐라는 레오나르도 다빈치가 고안하였다고 했지만 케플러의 설명은 네오키어가 알고 있었다고 하고 일식 등을 관찰했다고 한다. 또 포르타가 1558년 자연의 마술이라는 저서에서 카메라 옵스큐라를 이용하여 화가들이 그림을 그리는 도구로 사용하기도 하였다.
            </p>
          </>
        );
      case 2:
        return (
          <>
            <h2>2. 사진이란?</h2>
            <img src="/mnt/data/Docs Hello Photo(스크롤 내렸을 때).png" alt="What is Photography?" />
          </>
        );
      case 3:
        return (
          <>
            <h2>3. 사진 촬영 기초</h2>
            <p>사진 촬영 기초 내용...</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1 className="font-bookkMyungjoBold">Hello Photo</h1>
        <ol className='font-bookkGothic'>
          <button onClick={toggleSubMenu}>1. 카메라란?</button>
          {showSubMenu && (
            <>
              <button className={styles.subItem} onClick={() => setCurrentPage(1)}>1.1 카메라의 원리</button>
              <button className={styles.subItem} onClick={() => setCurrentPage(1)}>1.2 카메라의 종류</button>
              <button className={styles.subItem} onClick={() => setCurrentPage(1)}>1.3 카메라의 역사</button>
            </>
          )}
          <button onClick={() => setCurrentPage(2)}>2. 사진이란?</button>
          <button onClick={() => setCurrentPage(3)}>3. 사진 촬영 기초</button>
        </ol>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.content}>
          {renderContent()}
          <div className={styles.pagination}>
            <button onClick={handlePrevPage} disabled={currentPage === 1} className={styles.paginationButton}>이전</button>
            <span className={styles.pageIndicator}>{currentPage} / {totalPages}</span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages} className={styles.paginationButton}>다음</button>
          </div>
        </div>
      </div>
      <button onClick={toggleModal} className={styles.chatButton}>
        <img src="/imgs/mage_robot-happy-fill.png" alt="AI Chat" />
      </button>
      <ChatBotModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default HelloPhoto;
