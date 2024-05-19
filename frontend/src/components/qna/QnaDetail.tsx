import React, { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./css/QnaDetail.module.css";
import MapComponent from '../gallery/MapComponent';
// import axios from 'axios';


// interface imgInterface {
//     id: number;
//     url: string;
//     likeCnt: number,
//     liked: boolean,
//     title: string,
//   }

// interface metadataInterface {
//     time: string,
//     cameraType : string,
//     cameraModel : string,
//     lensModel : string,
//     aperture : string,
//     focusDistance : string,
//     shutterSpeed : string,
//     iso : string,
//     latitude : number,
//     longtitude : number,
// }

// interface photoDetailInterface {
//     photoId: number,
//     memberId : number,
//     nickname : string,
//     profileUrl : string,
//     title : string,
//     imageUrl : string,
//     createdAt : string,
//     accessType : string,
//     metadata: metadataInterface,
//     category: string,
// }
  
const QnaDetail: React.FC = () => {

    const navigate = useNavigate();
    
    const moveToqna = function(){
        navigate("/community/qna")
    }

    const article = {
        category: "일반",
        title: "흐규흐규 언제 끝나",
        content: "안녕하세요 안녕하세요 안녕하세요 안녕하세요",
        photoUrl: '/imgs/photo1.jpg',
        metadata: {
            cameraModel: "몰라",
            lensModel: "몰라",
            aperture: "몰라",
            focusDistance: "몰라",
            shutterSpeed: "a멀ㄹㄹ",
            iso: "ahffk",
        }
    }

    const comment = [
        {
            profileUrl: '/imgs/profile1.jpg',
            nickname: '하이',
            content: 'gkgkgkgkgkgkgkgggkgkgkk',
            date: '2222:@2222',
        },
        {
            profileUrl: '/imgs/profile1.jpg',
            nickname: '하sssss이',
            content: 'gkgkgkgkgkgkgkgggkgkgkk',
            date: '2222:@2222',
        },
        {
            profileUrl: '/imgs/profile1.jpg',
            nickname: '하ddddd이',
            content: '하하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ',
            date: '2222:@2222',
        },
        {
            profileUrl: '/imgs/profile1.jpg',
            nickname: '하ddssssdasdasdasdasdddd이',
            content: '하하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ',
            date: '2022/11/22',
        }, 
        {
            profileUrl: '/imgs/profile1.jpg',
            nickname: '하ddssssdasdasdasdasdddd이',
            content: '하하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ하ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏsdfsdffffffffff아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ닝ㄹ;ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ',
            date: '2022/11/22',
        },
        {
            profileUrl: '/imgs/profile1.jpg',
            nickname: '하이',
            content: 'gkgkgkgkgkgkgkgggkgkgkk',
            date: '2222:@2222',
        },
    ]
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


    const [listNum, setListNum] = useState<number>(1231);

    useEffect(() => {
        setListNum(listNum);
    })


    return (
        <>
        

        <div className={styles.main_container} style={{marginTop: '80px'}}>
            <div className={styles.page_intro} onClick={() => {moveToqna();}}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-QnA-</p>
            </div>

            <div className={styles.article_title_container}>
                <p style={{fontSize : '32px'}}>{article.category}</p>

                {/* <div className={styles.btn_container}>
                    <div className={styles.photo_btn} onClick={() => {openUploadModal();}}>
                        <p>등록</p>
                    </div>
                </div> */}
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>

            <div className={styles.writing_container}>
                <div className={styles.write_content_container}>
                    <div className={styles.qna_content}>
                        <div className={styles.title_container}>
                            <p>Q. {article.title}</p>
                        </div>
                        <div className={styles.content_container}>
                            <p>{article.content}</p>
                        </div>
                        <div className={styles.photo_container}>
                            <img src={article.photoUrl} alt='질문 사진' className={styles.qna_photo}></img>
                        </div>
                    </div>
                    <div className={styles.qna_comment_container}>
                        <p style={{fontFamily: '부크크고딕bold', fontSize: '28px'}}>Comments</p>
                        <div className={styles.comment_list_container}>
                            {comment.map((item) => (
                                <>
                                    <div className={styles.one_comment_container}>
                                        <img src={item.profileUrl} alt='프로필 사진' className={styles.comment_profile_img}></img>
                                        <div className={styles.comment_content_container}>
                                            <p style={{fontFamily: "부크크고딕bold"}}>{item.nickname}</p>
                                            <p style={{marginTop: '-15px'}}>{item.content}</p>
                                            <p style={{marginTop: '-10px', fontSize: '12px', color: 'gray'}}>{item.date}</p>
                                        </div>
                                    </div>
                                </>
                            ))
                            }
                        </div>
                        <div className={styles.comment_send_container}>
                            <p style={{fontFamily: "부크크고딕bold"}}>짱짱ㅇ아아아</p>
                            <textarea className={styles.send}></textarea>
                            <div className={styles.send_btn}>
                                <p>등록</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.write_rule_container}>
                    <div className={styles.detail_background}>
                        <div style={{width : '100%', height : 'fit-content', display : 'flex', justifyContent : 'center', alignItems: 'center', background : 'white', borderRadius: '10px'}}>
                            <p className={styles.camera_info_title}>Information</p>
                        </div>
                        <div className={styles.camera_info}>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>카메라 모델 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{article.metadata.cameraModel}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>렌즈 모델 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{article.metadata.lensModel}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>조리개 / F : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{article.metadata.aperture}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>초점 거리 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{article.metadata.focusDistance}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>셔터 스피드 / SS : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{article.metadata.shutterSpeed}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>심도 / ISO : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{article.metadata.iso}</p>
                            </div>
                            <div style={{zIndex: 8}}><MapComponent/></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default QnaDetail;
