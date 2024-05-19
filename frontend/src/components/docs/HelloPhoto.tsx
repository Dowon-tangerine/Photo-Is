import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import styles from './css/HelloPhoto.module.css';

type SenderType = 'user' | 'assistant' | 'loading';

interface ChatMessage {
  sender: SenderType;
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
          <body>
              <h1>1. 카메라란?</h1>
          
              <h2>1.1 카메라의 원리</h2>
              <p>카메라는 빛을 이용해 이미지를 포착하는 장치로, 여러 광학 및 전자적 요소가 결합되어 작동합니다. 카메라의 기본 원리는 렌즈를 통해 들어온 빛을 필름이나 이미지 센서에 집중시켜 이미지를 형성하는 것입니다.</p>
          
              <h2>1.2 카메라의 주요 구성 요소</h2>
          
              <h3>1.2.1 렌즈</h3>
              <ul>
                  <li><strong>기능</strong>: 빛을 집속하여 이미지 센서나 필름에 투사합니다.</li>
                  <li><strong>종류</strong>: 단일 초점 렌즈, 줌 렌즈 등 다양한 종류가 있습니다.</li>
              </ul>
              <img src="/mnt/data/A_detailed_diagram_showing_different_types_of_came.png" alt="렌즈의 단면도와 다양한 렌즈 종류" />
              <p>렌즈는 빛을 굴절시켜 초점을 맞추는 역할을 합니다. 단일 초점 렌즈는 고정된 초점 거리를 가지며, 줌 렌즈는 초점 거리를 변경할 수 있습니다. 다양한 종류의 렌즈는 촬영 목적에 따라 선택됩니다.</p>
          
              <h3>1.2.2 셔터</h3>
              <ul>
                  <li><strong>기능</strong>: 빛이 이미지 센서나 필름에 도달하는 시간을 제어합니다.</li>
                  <li><strong>종류</strong>: 전자식 셔터, 기계식 셔터 등.</li>
              </ul>
              <img src="/mnt/data/A_diagram_showing_the_shutter_mechanism_of_a_camer.png" alt="셔터가 열리고 닫히는 과정" />
              <p>셔터는 빛이 필름이나 이미지 센서에 도달하는 시간을 조절합니다. 셔터 속도가 빠를수록 빛이 닿는 시간이 짧아지며, 이는 빠르게 움직이는 물체를 포착하는 데 유리합니다.</p>
          
              <h3>1.2.3 조리개</h3>
              <ul>
                  <li><strong>기능</strong>: 렌즈를 통과하는 빛의 양을 조절합니다.</li>
                  <li><strong>특징</strong>: 조리개 값(F-stop)은 이미지의 노출과 심도에 영향을 줍니다.</li>
              </ul>
              <img src="/mnt/data/A_diagram_showing_different_aperture_sizes_in_a_ca.png" alt="조리개의 다양한 크기와 빛의 양 변화" />
              <p>조리개는 렌즈를 통과하는 빛의 양을 조절하여 이미지의 밝기와 심도를 제어합니다. 조리개 값이 낮을수록 더 많은 빛이 들어오고 배경이 흐려지며, 값이 높을수록 적은 빛이 들어오고 더 넓은 범위가 선명해집니다.</p>
          
              <h3>1.2.4 이미지 센서 또는 필름</h3>
              <ul>
                  <li><strong>기능</strong>: 렌즈를 통해 들어온 빛을 받아들여 이미지를 형성합니다.</li>
                  <li><strong>종류</strong>: CCD, CMOS (디지털 카메라의 경우), 필름 (아날로그 카메라의 경우).</li>
              </ul>
              <img src="/mnt/data/A_comparison_diagram_of_CCD_and_CMOS_image_sensors.png" alt="CCD 및 CMOS 센서의 구조와 필름 이미지" />
              <p>디지털 카메라는 CCD나 CMOS 센서를 사용하여 빛을 전기 신호로 변환하고, 아날로그 카메라는 필름을 사용하여 빛을 화학적으로 반응시켜 이미지를 만듭니다. 각 방식은 고유의 장단점을 가지고 있습니다.</p>
          
              <h2>1.3 카메라의 작동 원리</h2>
          
              <h3>1.3.1 빛의 입사</h3>
              <p>렌즈를 통해 빛이 카메라 내부로 들어옵니다. 이 과정에서 렌즈는 빛을 굴절시켜 초점을 맞춥니다.</p>
              <img src="image_url_5" alt="빛이 렌즈를 통해 들어오는 과정" />
              <p>빛은 물체에서 반사되어 렌즈를 통해 카메라 내부로 들어옵니다. 이때 렌즈는 빛을 굴절시켜 특정 지점에 초점을 맞추게 됩니다.</p>
          
              <h3>1.3.2 빛의 집속</h3>
              <p>렌즈는 빛을 집속하여 이미지 센서나 필름에 투사합니다. 이때 조리개와 셔터가 빛의 양과 노출 시간을 조절합니다.</p>
              <img src="image_url_6" alt="렌즈가 빛을 집속시키는 과정" />
              <p>렌즈를 통해 들어온 빛은 조리개를 통해 양이 조절되고, 셔터를 통해 노출 시간이 결정된 후 이미지 센서나 필름에 도달하여 이미지를 형성하게 됩니다.</p>
          
          </body>
          


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
