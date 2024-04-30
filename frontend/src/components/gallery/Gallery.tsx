import React, { useState, useRef, useEffect } from 'react';
import styles from "./css/Gallery.module.css";
import { FaAngleDown } from 'react-icons/fa';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'

const Gallery: React.FC = () => {

    const [type, setType] = useState<String>("선택");
    const [typeList, setTypeList] = useState<boolean>(false);
    const [isRotated, setIsRotated] = useState(false);

    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };


    const openTypeList = function(){
        setTypeList(!typeList);
    }

    const imageData = [
        {
          label: "Image 1",
          alt: "image1",
          url: "/imgs/photo1.jpg",
        },
      
        {
          label: "Image 2",
          alt: "image2",
          url: "/imgs/photo2.jpg",
        },
      
        {
          label: "Image 3",
          alt: "image3",
          url: "/imgs/photo1.jpg",
        },
      
        {
          label: "Image 4",
          alt: "image4",
          url: "/imgs/photo2.jpg",
        },
      
        {
          label: "Image 5",
          alt: "image5",
          url: "/imgs/photo1.jpg",
        },
      ];

    return (
        <div className={styles.main_container}>
            <div className={styles.search_container}>
                <div className={styles.combo_box}>
                    <div className={styles.dropdown_container}>
                        <p className={styles.dropdown_txt}>{type}</p>
                        <FaAngleDown  className={`${styles.dropdown_icon} ${isRotated ? styles.rotated : ''}`}  onClick={() => {openTypeList(); toggleRotation();}}/>
                    </div>

                    {typeList && (
                        <>
                            <div className={styles.typeList_container}>
                                <p className={styles.type_txt1} onClick={() => setType("작가")}>작가</p>
                                <p className={styles.type_txt2} onClick={() => setType("제목")}>제목</p>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.line}></div>
                <input className={styles.input_box} type="text" placeholder="검색어를 입력해주세요." ></input>
                <img className={styles.find_icon} src="/imgs/search_icon.png" alt='돋보기'></img>
            </div>

            <div className={styles.page_intro}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-Gallery-</p>
            </div>

            <div className={styles.rank_container}>
                <div>

                </div>
                <Carousel indicators={false}>
                    {imageData.map(
                        (item, i) =>
                            <div style={{width: '100%', height: '260px'}} >
                                <img src={item.url} style={{width: '100%', height: 'auto'}} />
                            </div>                                              
                    )}
                </Carousel>
            </div>
        </div>
    );
};

export default Gallery;
