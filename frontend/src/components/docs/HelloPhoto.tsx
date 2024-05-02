import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/HelloPhoto.module.css';

const HelloPhoto = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h1>Hello Photo</h1>
                <ul>
                    <li onClick={() => navigate("/docs/product1")}>1. 카메라란?</li>
                    <li onClick={() => navigate("/docs/product1")}>2. 사진이란?</li>
                    <li onClick={() => navigate("/docs/product1")}>3. 사진 촬영 기초</li>
                </ul>
            </div>
            <div className={styles.content}>
                {/* 여기에 Hello Photo 페이지의 메인 컨텐츠 */}
            </div>
        </div>
    );
};

export default HelloPhoto;
