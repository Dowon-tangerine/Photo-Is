import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/HelloPhoto.module.css';

const HelloPhoto = () => {
    const navigate = useNavigate();
    const [showSubMenu, setShowSubMenu] = useState(false); // 하위 메뉴 표시 상태

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu); // 토글 동작
    };

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
                {/* 여기에 Hello Photo 페이지의 메인 컨텐츠 */}
            </div>
        </div>
    );
};

export default HelloPhoto;
