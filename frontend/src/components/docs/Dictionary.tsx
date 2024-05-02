import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/Dictionary.module.css';
import ModelViewer from './ModelViewer'; 


const Dictionary = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = () => {
        console.log("Searching for:", searchTerm);
        // 검색 로직 구현 필요 (예: navigate to a search page or filter content)
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h1>Dictionary</h1>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                        onKeyPress={event => event.key === 'Enter' && handleSearch()}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>
                        🔍
                    </button>
                </div>
                <ol>
                    <button onClick={() => navigate("/docs/product2")}>카메라의 기본 구성</button>
                    <button onClick={() => navigate("/docs/product2")}>노출의 3요소</button>
                    <button onClick={() => navigate("/docs/product2")}>촬영모드와 설정</button>
                    <button onClick={() => navigate("/docs/product2")}>사진의 구도</button>
                    <button onClick={() => navigate("/docs/product2")}>카메라 액세서리</button>
                    <button onClick={() => navigate("/docs/product2")}>조명의 원리</button>
                </ol>
            </div>
            <div className={styles.content}>
            </div>
        </div>
    );
};

export default Dictionary;
