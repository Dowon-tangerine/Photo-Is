import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { marked } from 'marked';
import styles from './css/HelloPhoto.module.css';

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
  const memberId = localStorage.getItem('memberId');

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

const HelloPhoto = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const totalPages = 3; // 총 페이지 수

  const toggleModal = () => setModalOpen((prev) => !prev);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateExpandedSection(nextPage);
      scrollToPageStart();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      updateExpandedSection(prevPage);
      scrollToPageStart();
    }
  };

  const updateExpandedSection = (page: number) => {
    switch (page) {
      case 1:
        setExpandedSection(1);
        break;
      case 2:
        setExpandedSection(2);
        break;
      case 3:
        setExpandedSection(3);
        break;
      default:
        setExpandedSection(null);
    }
  };

  const scrollToPageStart = () => {
    document.getElementById('page-start')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleSection = (section: number) => {
    setExpandedSection((prevSection) => (prevSection === section ? null : section));
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div id="page-start" className='font-bookkGothic'>
            <h1 id="section-0-1">카메라란?</h1>
            <h1 id="section-1">1. 카메라란?</h1>
            
            <h2 id="section-1-1">1.1 카메라의 원리</h2>
            <p>카메라는 빛을 이용해 이미지를 포착하는 장치로, 여러 광학 및 전자적 요소가 결합되어 작동합니다. 카메라의 기본 원리는 렌즈를 통해 들어온 빛을 필름이나 이미지 센서에 집중시켜 이미지를 형성하는 것입니다.</p>
            <h2 id="section-1-2">1.2 카메라의 주요 구성 요소</h2>
            <h3 id="section-1-2-1">1.2.1 렌즈</h3>
            <ul>
              <li><strong>기능</strong>: 빛을 집속하여 이미지 센서나 필름에 투사합니다.</li>
              <li><strong>종류</strong>: 단일 초점 렌즈, 줌 렌즈 등 다양한 종류가 있습니다.</li>
            </ul>
            <img src="/mnt/data/A_detailed_diagram_showing_different_types_of_came.png" alt="렌즈의 단면도와 다양한 렌즈 종류" />
            <p>렌즈는 빛을 굴절시켜 초점을 맞추는 역할을 합니다. 단일 초점 렌즈는 고정된 초점 거리를 가지며, 줌 렌즈는 초점 거리를 변경할 수 있습니다. 다양한 종류의 렌즈는 촬영 목적에 따라 선택됩니다.</p>
            
            <h3 id="section-1-2-2">1.2.2 셔터</h3>
            <ul>
              <li><strong>기능</strong>: 빛이 이미지 센서나 필름에 도달하는 시간을 제어합니다.</li>
              <li><strong>종류</strong>: 전자식 셔터, 기계식 셔터 등.</li>
            </ul>
            <img src="/mnt/data/A_diagram_showing_the_shutter_mechanism_of_a_camer.png" alt="셔터가 열리고 닫히는 과정" />
            <p>셔터는 빛이 필름이나 이미지 센서에 도달하는 시간을 조절합니다. 셔터 속도가 빠를수록 빛이 닿는 시간이 짧아지며, 이는 빠르게 움직이는 물체를 포착하는 데 유리합니다.</p>
            
            <h3 id="section-1-2-3">1.2.3 조리개</h3>
            <ul>
              <li><strong>기능</strong>: 렌즈를 통과하는 빛의 양을 조절합니다.</li>
              <li><strong>특징</strong>: 조리개 값(F-stop)은 이미지의 노출과 심도에 영향을 줍니다.</li>
            </ul>
            <img src="/mnt/data/A_diagram_showing_different_aperture_sizes_in_a_ca.png" alt="조리개의 다양한 크기와 빛의 양 변화" />
            <p>조리개는 렌즈를 통과하는 빛의 양을 조절하여 이미지의 밝기와 심도를 제어합니다. 조리개 값이 낮을수록 더 많은 빛이 들어오고 배경이 흐려지며, 값이 높을수록 적은 빛이 들어오고 더 넓은 범위가 선명해집니다.</p>
            
            <h3 id="section-1-2-4">1.2.4 이미지 센서 또는 필름</h3>
            <ul>
              <li><strong>기능</strong>: 렌즈를 통해 들어온 빛을 받아들여 이미지를 형성합니다.</li>
              <li><strong>종류</strong>: CCD, CMOS (디지털 카메라의 경우), 필름 (아날로그 카메라의 경우).</li>
            </ul>
            <img src="/mnt/data/A_comparison_diagram_of_CCD_and_CMOS_image_sensors.png" alt="CCD 및 CMOS 센서의 구조와 필름 이미지" />
            <p>디지털 카메라는 CCD나 CMOS 센서를 사용하여 빛을 전기 신호로 변환하고, 아날로그 카메라는 필름을 사용하여 빛을 화학적으로 반응시켜 이미지를 만듭니다. 각 방식은 고유의 장단점을 가지고 있습니다.</p>
            
            <h2 id="section-1-3">1.3 카메라의 작동 원리</h2>
            <h3 id="section-1-3-1">1.3.1 빛의 입사</h3>
            <p>렌즈를 통해 빛이 카메라 내부로 들어옵니다. 이 과정에서 렌즈는 빛을 굴절시켜 초점을 맞춥니다.</p>
            <img src="image_url_5" alt="빛이 렌즈를 통해 들어오는 과정" />
            <p>빛은 물체에서 반사되어 렌즈를 통해 카메라 내부로 들어옵니다. 이때 렌즈는 빛을 굴절시켜 특정 지점에 초점을 맞추게 됩니다.</p>
            
            <h3 id="section-1-3-2">1.3.2 빛의 집속</h3>
            <p>렌즈는 빛을 집속하여 이미지 센서나 필름에 투사합니다. 이때 조리개와 셔터가 빛의 양과 노출 시간을 조절합니다.</p>
            <img src="image_url_6" alt="렌즈가 빛을 집속시키는 과정" />
            <p>렌즈를 통해 들어온 빛은 조리개를 통해 양이 조절되고, 셔터를 통해 노출 시간이 결정된 후 이미지 센서나 필름에 도달하여 이미지를 형성하게 됩니다.</p>
            
            <h2 id="section-1-4">1.4 카메라의 종류</h2>
            <p>카메라에는 다양한 종류가 있으며, 각기 다른 목적과 기능을 가지고 있습니다.</p>
            <h3 id="section-1-4-1">1.4.1 디지털 카메라</h3>
            <p>디지털 카메라는 이미지 센서를 사용하여 사진을 촬영하고, 전자적으로 이미지를 저장합니다. CCD와 CMOS 센서가 주로 사용됩니다.</p>
            <img src="image_url_10" alt="디지털 카메라" />
            <h3 id="section-1-4-2">1.4.2 필름 카메라</h3>
            <p>필름 카메라는 빛을 화학적으로 반응시키는 필름을 사용하여 이미지를 저장합니다. 필름은 현상 과정을 거쳐 이미지를 나타냅니다.</p>
            <img src="image_url_11" alt="필름 카메라" />
            <h3 id="section-1-4-3">1.4.3 미러리스 카메라</h3>
            <p>미러리스 카메라는 렌즈 교환이 가능하며, 미러를 사용하지 않아 더 가볍고 작습니다. 전자식 뷰파인더를 사용하여 실제 장면을 확인할 수 있습니다.</p>
            <img src="image_url_12" alt="미러리스 카메라" />
            <h3 id="section-1-4-4">1.4.4 DSLR 카메라</h3>
            <p>DSLR 카메라는 미러와 프리즘을 사용하여 광학식 뷰파인더를 통해 실제 장면을 볼 수 있습니다. 렌즈 교환이 가능하며, 다양한 렌즈를 사용할 수 있습니다.</p>
            <img src="image_url_13" alt="DSLR 카메라" />
          </div>
        );

      case 2:
        return (
          <div id="page-start">
            <h1 id="section-0-2">사진이란?</h1>
            <h1 id="section-2">2. 사진이란?</h1>
            <h2 id="section-2-1">2.1 사진술의 정의</h2>
            <p>사진술은 빛을 이용하여 이미지를 포착하고 기록하는 기술입니다. 이는 카메라를 사용하여 빛을 감광재에 노출시키는 과정을 통해 이루어집니다.</p>
            <img src="image_url_1" alt="사진술의 정의" />
            <h2 id="section-2-2">2.2 사진술의 역사적 배경</h2>
            <p>사진술은 19세기 초반에 처음 개발되었습니다. 초기 사진술은 프랑스의 루이 다게르(Louis Daguerre)가 1839년에 다게레오타입(Daguerreotype)을 발표하면서 시작되었습니다.</p>
            <img src="image_url_2" alt="다게레오타입" />
            <h3 id="section-2-2-1">2.2.1 카메라 옵스큐라</h3>
            <p>카메라 옵스큐라(camera obscura)는 어두운 방에 작은 구멍을 통해 들어온 빛이 반대편 벽에 상을 맺히게 하는 장치입니다. 이 원리는 현대 카메라의 기초가 되었습니다.</p>
            <img src="image_url_3" alt="카메라 옵스큐라" />
            <h3 id="section-2-2-2">2.2.2 필름 카메라의 발명</h3>
            <p>1826년 조셉 니세포르 니엡스(Joseph Nicéphore Niépce)가 최초로 영구적인 사진을 촬영했습니다. 이후 1888년 조지 이스트먼(George Eastman)이 롤 필름을 발명하여 카메라의 대중화에 기여했습니다.</p>
            <img src="image_url_4" alt="필름 카메라" />
            <h3 id="section-2-2-3">2.2.3 디지털 카메라의 등장</h3>
            <p>1975년 코닥의 스티븐 사순(Steven Sasson)이 최초의 디지털 카메라를 개발했습니다. 디지털 카메라는 필름 없이 전자적으로 이미지를 저장할 수 있어 사진 촬영 방식을 혁신적으로 바꾸었습니다.</p>
            <img src="image_url_5" alt="디지털 카메라" />
            <h2 id="section-2-3">2.3 사진의 과학적 특성</h2>
            <p>사진술은 과학적 원리에 기반합니다. 렌즈는 빛을 굴절시켜 초점을 맞추고, 카메라는 이를 통해 이미지를 형성합니다.</p>
            <img src="image_url_6" alt="과학적 원리" />
            <h3 id="section-2-3-1">2.3.1 빛의 입사</h3>
            <p>렌즈를 통해 빛이 카메라 내부로 들어옵니다. 렌즈는 빛을 굴절시켜 초점을 맞추는 역할을 합니다.</p>
            <img src="image_url_7" alt="빛의 입사" />
            <h3 id="section-2-3-2">2.3.2 빛의 집속</h3>
            <p>렌즈는 빛을 집속하여 이미지 센서나 필름에 투사합니다. 조리개는 렌즈를 통과하는 빛의 양을 조절하고, 셔터는 빛이 필름이나 이미지 센서에 도달하는 시간을 제어합니다.</p>
            <img src="image_url_8" alt="빛의 집속" />
            <h3 id="section-2-3-3">2.3.3 이미지 형성</h3>
            <p>이미지 센서 또는 필름은 렌즈를 통해 들어온 빛을 받아들여 이미지를 형성합니다. 디지털 카메라는 CCD나 CMOS 센서를 사용하여 빛을 전기 신호로 변환하고, 아날로그 카메라는 필름을 사용하여 빛을 화학적으로 반응시켜 이미지를 만듭니다.</p>
            <img src="image_url_9" alt="이미지 형성" />
            
          </div>
        );
      case 3:
        return (
          <div id="page-start">
            <h1 id="section-0-3">사진 촬영 기초 용어</h1>
            <h1 id="section-3">3. 사진 촬영 기초 용어</h1>
            <h2 id="section-3-1">3.1. 잠상과 현상</h2>
            <p>사진촬영 시 필름에 맺힌 상을 잠상(潛像)이라 하며, 이는 눈에 보이지 않습니다. 잠상은 현상 과정을 거쳐 비로소 눈에 보이게 되며, 처리 방법에 따라 음화(陰畵:negative picture) 또는 양화(陽畵:positive picture)로 나타낼 수 있습니다.</p>
            <img src="image_url_1" alt="잠상과 현상" />
            <h2 id="section-3-2">3.2. 아날로그와 디지털 방식</h2>
            <p>사진촬영은 최종적인 영상을 얻는 방법에 따라 아날로그 방식과 디지털 방식으로 나뉩니다. 디지털카메라가 등장하면서 CCD에 맺힌 화상은 LCD 화면으로 나타나게 되었습니다. 폴라로이드와 같은 즉석용 카메라는 현상이나 디지털 화상으로의 전환 과정이 없습니다.</p>
            <img src="image_url_2" alt="아날로그와 디지털 방식" />
            <h2 id="section-3-3">3.3. 노출</h2>
            <p>노출은 성공적인 촬영의 첫 단계입니다. 적정노출(適正露出)이란 최적의 사진을 얻기 위한 가장 알맞은 노출을 뜻합니다. 일반적으로 노출계의 지침에 맞추어 적정노출을 구할 수 있지만, 촬영자의 의도에 따라 노출을 과다 또는 부족하게 설정할 수 있습니다.</p>
            <img src="image_url_3" alt="노출" />
            <h3 id="section-3-3-1">3.3.1 셔터와 조리개의 역할</h3>
            <p>셔터는 카메라로 들어오는 빛의 양을 조절하고, 피사체의 움직임을 조절합니다. 셔터 속도는 카메라의 성능에 따라 달라지며, 빠른 셔터 속도는 피사체의 움직임을 정지시킵니다. 조리개는 빛의 양을 조절하며, 피사계 심도를 조절합니다. 조리개 수치는 F값으로 표시되며, 숫자가 작을수록 조리개가 열리고, 숫자가 클수록 조리개가 좁아집니다.</p>
            <img src="image_url_4" alt="셔터와 조리개의 역할" />
            <h2 id="section-3-4">3.4 초점</h2>
            <p>초점은 사진에서 피사체를 선명하게 보이도록 하는 요소입니다. 대부분의 카메라가 자동 초점 기능을 제공하지만, 표현 목적에 따라 수동 초점으로 전환하여 촬영하는 것이 유리할 때도 있습니다.</p>
            <img src="image_url_5" alt="초점" />
            <h2 id="section-3-5">3.5 구도</h2>
            <p>구도는 사진에서 피사체를 어떻게 배치할지 결정하는 요소입니다. 좋은 구도는 사진의 미적 감각을 높이고, 시각적 관심을 끌어냅니다.</p>
            <img src="image_url_6" alt="구도" />
            <h3 id="section-3-5-1">3.5.1 삼등분법</h3>
            <p>삼등분법은 화면을 가로와 세로로 3등분하여 9개의 구역으로 나누는 구도법입니다. 주 피사체를 이 교차점에 배치하면 안정적이고 균형 잡힌 사진을 얻을 수 있습니다.</p>
            <img src="image_url_7" alt="삼등분법" />
            <h3 id="section-3-5-2">3.5.2 대각선 구도</h3>
            <p>대각선 구도는 사진에 깊이와 움직임을 추가하는 데 유용합니다. 피사체를 대각선으로 배치하면 더 동적인 느낌을 줄 수 있습니다.</p>
            <img src="image_url_8" alt="대각선 구도" />
            <h3 id="section-3-5-3">중심 구도</h3>
            <p>중심 구도는 피사체를 화면의 중앙에 배치하는 방식입니다. 강한 주제를 표현할 때 효과적입니다.</p>
            <img src="image_url_9" alt="중심 구도" />
            <h2 id="section-3-6">3.6 조명</h2>
            <p>조명은 사진의 분위기와 피사체의 디테일을 강조하는 중요한 요소입니다. 자연광과 인공광을 활용하여 다양한 효과를 얻을 수 있습니다.</p>
            <img src="image_url_10" alt="조명" />
            <h3 id="section-3-6-1">3.6.1 자연광</h3>
            <p>자연광은 태양빛을 이용한 조명입니다. 자연광은 시간대와 날씨에 따라 다양한 분위기를 연출할 수 있습니다.</p>
            <img src="image_url_11" alt="자연광" />
            <h3 id="section-3-6-2">3.6.2 인공광</h3>
            <p>인공광은 플래시나 조명 장비를 이용한 조명입니다. 사용자가 원하는 대로 빛의 방향과 강도를 조절할 수 있습니다.</p>
            <img src="image_url_12" alt="인공광" />
            <h3 id="section-3-6-3">3.6.3 반사판</h3>
            <p>반사판은 빛을 반사시켜 그림자를 줄이거나 피사체를 강조하는 도구입니다. 간단한 장비로도 큰 효과를 볼 수 있습니다.</p>
            <img src="image_url_13" alt="반사판" />
            <h2 id="section-3-7">3.7 색온도</h2>
            <p>색온도는 빛의 색감을 나타내는 지표입니다. 낮은 색온도는 따뜻한 색감을, 높은 색온도는 차가운 색감을 나타냅니다.</p>
            <img src="image_url_14" alt="색온도" />
            <h3 id="section-3-7-1">3.7.1 백색광</h3>
            <p>백색광은 자연광에 가까운 색온도로, 대부분의 촬영 상황에 적합합니다. 일반적으로 5000K에서 6500K 사이의 색온도를 가집니다.</p>
            <img src="image_url_15" alt="백색광" />
            <h3 id="section-3-7-2">3.7.2 황색광</h3>
            <p>황색광은 따뜻한 느낌을 주는 낮은 색온도의 빛입니다. 실내 촬영이나 감성적인 장면에 적합합니다.</p>
            <img src="image_url_16" alt="황색광" />
            <h3 id="section-3-7-3">3.7.3 청색광</h3>
            <p>청색광은 차가운 느낌을 주는 높은 색온도의 빛입니다. 야외 촬영이나 시원한 느낌을 표현할 때 사용됩니다.</p>
            <img src="image_url_17" alt="청색광" />
          </div>
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
          <button onClick={() => {setCurrentPage(1); scrollToSection('section-0-1'); toggleSection(1) }}>1. 카메라란?</button>
          {expandedSection === 1 && (
            <>
              <button className={styles.subItem} onClick={() => { setCurrentPage(1); scrollToSection('section-1'); }}>1.1 카메라의 원리</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(1); scrollToSection('section-1-1'); }}>1.2 카메라의 주요 구성 요소</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(1); scrollToSection('section-1-2-4'); }}>1.3 카메라의 작동 원리</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(1); scrollToSection('section-1-3-2'); }}>1.4 카메라의 종류</button>
            </>
          )}
          <button onClick={() => {setCurrentPage(2); scrollToSection('section-0-2'); toggleSection(2)}}>2. 사진이란?</button>
          {expandedSection === 2 && (
            <>
              <button className={styles.subItem} onClick={() => { setCurrentPage(2); scrollToSection('section-2'); }}>2.1 사진술의 정의</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(2); scrollToSection('section-2-1'); }}>2.2 사진술의 역사적 배경</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(2); scrollToSection('section-2-2-3'); }}>2.3 사진의 과학적 특성</button>
            </>
          )}
          <button onClick={() => {setCurrentPage(3); scrollToSection('section-0-3'); toggleSection(3)}}>3. 사진 촬영 기초</button>
          {expandedSection === 3 && (
            <>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3'); }}>3.1 잠상과 현상</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3-1'); }}>3.2 아날로그와 디지털 방식</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3-2'); }}>3.3 노출</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3-3-1'); }}>3.4 초점</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3-4'); }}>3.5 구도</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3-5-3'); }}>3.6 조명</button>
              <button className={styles.subItem} onClick={() => { setCurrentPage(3); scrollToSection('section-3-6-3'); }}>3.7 색온도</button>
            </>
          )}
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