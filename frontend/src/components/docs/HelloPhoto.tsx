import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/HelloPhoto.module.css';

function ChatBotModal({ isOpen, onClose }) {
  return (
    isOpen && (
      <div className={styles.chatBotModal}>
        <div className={styles.modalContent}>
          <span className={styles.closeButton} onClick={onClose}>&times;</span>
          <p>AI 챗봇과 대화를 시작하세요.</p>
          {/* 대화 내용을 여기에 추가 */}
        </div>
      </div>
    )
  );
}

const HelloPhoto = () => {
  const navigate = useNavigate();
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const toggleSubMenu = () => setShowSubMenu(!showSubMenu);
  const toggleModal = () => setModalOpen(!isModalOpen);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h1>Hello Photo</h1>
        <ol>
          <button onClick={toggleSubMenu}>1. 카메라란?</button>
          {showSubMenu && (
            <>
              <button className={styles.subItem} onClick={() => navigate("/docs/product1")}>1.1 카메라의 원리</button>
              <button className={styles.subItem} onClick={() => navigate("/docs/product1")}>1.2 카메라의 종류</button>
              <button className={styles.subItem} onClick={() => navigate("/docs/product1")}>1.3 카메라의 역사</button>
            </>
          )}
          <button onClick={() => navigate("/docs/product1")}>2. 사진이란?</button>
          <button onClick={() => navigate("/docs/product1")}>3. 사진 촬영 기초</button>
        </ol>
      </div>
      <div className={styles.content}>
        {/* 메인 컨텐츠 */}
      </div>
      <button onClick={toggleModal} className={styles.chatButton}>
        <img src="/imgs/mage_robot-happy-fill.png" alt="AI Chat" />
      </button>
      <ChatBotModal isOpen={isModalOpen} onClose={toggleModal} />
    </div>
  );
};

export default HelloPhoto;
