import React, { useState } from 'react';
import styles from "./css/Qna.module.css";
import { FaAngleDown } from 'react-icons/fa';
// import axios from 'axios';


// interface imgInterface {
//     id: number;
//     url: string;
//     likeCnt: number,
//     liked: boolean,
//     title: string,
//   }
  
const Qna: React.FC = () => {

    // const [type, setType] = useState<String>("선택");
    // const [typeList, setTypeList] = useState<boolean>(false);
    // const [isRotated, setIsRotated] = useState<boolean>(false);    
    // const [tabIndex, settabIndex] = useState<number>(0);
    const [sortType, setSortType] = useState<String>("최신");
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);

    // const navigate = useNavigate();
    
    // const moveToGallery = function(){
    //     navigate("/community/gallery")
    // }

    // const [word, setWord] = useState<String>("");

    // const moveToSearch = function(){
    //     if(type === "작가"){
    //         navigate("/community/gallery/searchName", { state: { searchWord :  word + "1"} })
    //     }
    //     else if(type === "제목"){
    //         navigate("/community/gallery/searchTitle", { state: { searchWord :  word} })
    //     }
    //     else if(type === "태그"){
    //         navigate("/community/gallery/searchTag", { state: { searchWord :  word} })
    //     }
    // }

    const openSortTypeList = function(){
        setSortTypeList(!sortTypeList);
        setIsRotated2(!isRotated2);
    }

    // const [page, setPage] = useState(1);
    // const [isLoading, setIsLoading] = useState(false);
//     const [imgArr, setImgArr] = useState<imgInterface[]>([]);

//     useEffect(() => {
//       console.log("로드");
  
//       // key가 없으면 응답은 10개씩
//       const API_URL =
//         "https://k10d103.p.ssafy.io/api/photos/gallery/latest?page=1";
//       axios.get(API_URL).then((res) => {
//         console.log(res);
        
//         // id값과 url만 저장
//         const gotData = res.data.photoList.map((imgs: { photoId: string; thumbnailUrl: string; likeCnt: number; liked: boolean; title: string }) => ({
//           id: imgs.photoId,
//           url: imgs.thumbnailUrl,
//           likeCnt: imgs.likeCnt,
//           liked: imgs.liked,
//           title: imgs.title,
//         }));
//         setImgArr(gotData);
//       });
//     }, []);

//      // Intersection Observer 설정

//   const handleObserver = (entries: IntersectionObserverEntry[]) => {
//     const target = entries[0];
//     if (target.isIntersecting && !isLoading) {
//       setPage((prevPage) => prevPage + 1);
//     }
//   };

  
//   /*
//   handleObserver: 교차점이 발생했을 때 실행되는 콜백 함수.
//   entries: 교차점 정보를 담는 배열
//   isIntersecting: 교차점(intersection)이 발생한 요소의 상태
//   교차점이 발생하면 page 1 증가
//   */

//   useEffect(() => {
//     const observer = new IntersectionObserver(handleObserver, {
//       threshold: 0, //  Intersection Observer의 옵션, 0일 때는 교차점이 한 번만 발생해도 실행, 1은 모든 영역이 교차해야 콜백 함수가 실행.
//     });
//     // 최하단 요소를 관찰 대상으로 지정함
//     const observerTarget = document.getElementById("observer");
//     // 관찰 시작
//     if (observerTarget) {
//       observer.observe(observerTarget);
//     }
//   }, []);

//     useEffect(() => {
//         fetchData();
//     }, [page]);

//     const fetchData = async () => {
//         setIsLoading(true);
//         try {
//             const API_URL = `https://k10d103.p.ssafy.io/api/photos/gallery/latest?page=${page}`;
//             const response = await axios.get(API_URL);
//             const newData = response.data.data.photoList.map((imgs: { photoId: number; thumbnailUrl: string; likeCnt: number; liked: boolean; title: string }) => ({
//                 id: imgs.photoId,
//                 url: imgs.thumbnailUrl,
//                 likeCnt: imgs.likeCnt,
//                 liked: imgs.liked,
//                 title: imgs.title,
//             }));
//             setImgArr((prevData) => [...prevData, ...newData]);
//         } catch (error) {
//             console.log(error);
//         }
//         setIsLoading(false);
//     };


    const [uploadPhoto, setUploadPhoto] = useState<boolean>(false);

    const openUploadModal = function(){
        setUploadPhoto(!uploadPhoto);
    }

    return (
        <>
        

        <div className={styles.main_container}>
            {/* <div className={styles.search_container}>
                <div className={styles.combo_box}>
                    <div className={styles.dropdown_container} onClick={() => {openTypeList(); toggleRotation();}}>
                        <p className={styles.dropdown_txt}>{type}</p>
                        <FaAngleDown  className={`${styles.dropdown_icon} ${isRotated ? styles.rotated : ''}`} />
                    </div>

                    {typeList && (
                        <>
                            <div className={styles.typeList_container}>
                                <p className={styles.type_txt1} onClick={() => {setType("작가"); openTypeList();}}>작가</p>
                                <p className={styles.type_txt2} onClick={() => {setType("제목"); openTypeList();}}>제목</p>
                                <p className={styles.type_txt3} onClick={() => {setType("태그"); openTypeList();}}>태그</p>
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.line}></div>
                <input className={styles.input_box} type="text" placeholder="검색어를 입력해주세요." onChange={(e) => {setWord(e.target.value)}}></input>
                <img className={styles.find_icon} src="/imgs/search_icon.png" alt='돋보기' onClick={moveToSearch}></img>
            </div> */}

            <div className={styles.page_intro}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-Gallery-</p>
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>
            <div className={styles.btn_container}>
                <div className={styles.photo_btn} onClick={() => {openUploadModal();}}>
                    <p>사진 업로드</p>
                </div>
                <div className={styles.sort_btn}>
                    <div className={styles.dropdown_container} onClick={() => {openSortTypeList();}}>
                        <p className={styles.dropdown_txt2}>{sortType}순</p>
                        <FaAngleDown  className={`${styles.dropdown_icon2} ${isRotated2 ? styles.rotated : ''}`}/>
                    </div>

                    {sortTypeList && (
                        <>
                            <div className={styles.typeList_container2}>
                                <p className={styles.type_txt1_2} onClick={() => {setSortType("인기"); openSortTypeList();}}>인기</p>
                                <p className={styles.type_txt2_2} onClick={() => {setSortType("최신"); openSortTypeList();}}>최신</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    );
};

export default Qna;
