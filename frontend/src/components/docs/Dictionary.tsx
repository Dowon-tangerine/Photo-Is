import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/Dictionary.module.css';

const Dictionary = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h1>Dictionary</h1>
                <ul>
                    <li onClick={() => navigate("/docs/product2")}>카메라의 기본 구성</li>
                    <li onClick={() => navigate("/docs/product2")}>노출의 3요소</li>
                    <li onClick={() => navigate("/docs/product2")}>촬영모드와 설정</li>
                    <li onClick={() => navigate("/docs/product2")}>사진의 구도</li>
                    <li onClick={() => navigate("/docs/product2")}>카메라 액세서리</li>
                    <li onClick={() => navigate("/docs/product2")}>조명의 원리</li>
                </ul>
            </div>
            <div className={styles.content}>
                {/* 여기에 Dictionary 페이지의 메인 컨텐츠 */}
            </div>
        </div>
    );
};

export default Dictionary;
