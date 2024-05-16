import React, { useState, useEffect} from 'react';
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

    const [sortType, setSortType] = useState<String>("전체");
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);

    // const navigate = useNavigate();
    
    // const moveToGallery = function(){
    //     navigate("/community/gallery")
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

    const [listNum, setListNum] = useState<number>(1231);

    useEffect(() => {
        setListNum(listNum);
    })

    return (
        <>
        

        <div className={styles.main_container}>
            <div className={styles.page_intro}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-QnA-</p>
            </div>

            <div className={styles.article_title_container}>
                <p style={{fontSize : '32px'}}>{sortType}글</p>
                <p style={{marginTop : '-15px', marginBottom : '10px'}}>{listNum}개의 글</p>

                <div className={styles.btn_container}>
                    <div className={styles.photo_btn} onClick={() => {openUploadModal();}}>
                        <p>글쓰기</p>
                    </div>
                    <div className={styles.sort_btn}>
                        <div className={styles.dropdown_container} onClick={() => {openSortTypeList();}}>
                            <p className={styles.dropdown_txt2}>{sortType}</p>
                            <FaAngleDown  className={`${styles.dropdown_icon2} ${isRotated2 ? styles.rotated : ''}`}/>
                        </div>

                        {sortTypeList && (
                            <>
                                <div className={styles.typeList_container2}>
                                    <p className={styles.type_txt2_1} onClick={() => {setSortType("전체"); openSortTypeList();}}>전체</p>
                                    <p className={styles.type_txt2_2} onClick={() => {setSortType("일반"); openSortTypeList();}}>일반</p>
                                    <p className={styles.type_txt2_3} onClick={() => {setSortType("스튜디오"); openSortTypeList();}}>스튜디오</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>
        </div>
        </>
    );
};

export default Qna;