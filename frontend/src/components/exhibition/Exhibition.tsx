import React, { useState, useEffect } from 'react';
import styles from "./css/Exhibition.module.css";
import { FaAngleDown } from 'react-icons/fa';
import axios from 'axios';
import Calendar from '../mypage/Calendar';

interface imgInterface {
    id: number;
    url: string;
    likeCnt: number,
    liked: boolean,
    title: string,
  }
  
const Exhibition: React.FC = () => {

    const [sortType, setSortType] = useState<String>("최신");
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);
    
    const exhibition = {
        thumbNail : 'imgs/photo4.jpg',
        title : '먹을 수 없는 감은 장난감ㅋ',
        date : '2024/04/17 ~ 2024/05/17',
        description : '제 전시회로 말할거 같으면 ~~~~~~~ 짱구 보고 오세요 보고 오면 이해됨 이상무 전현무 깔깔'
    }

    const [isExhibition, setIsExhibition] = useState<boolean>(false);

    const openExhibitionModal = function(){
        setIsExhibition(!isExhibition);
    }

    const [plusImg, setPlusImg] = useState<boolean>(false);

    const openImgList = function(){
        setPlusImg(!plusImg)
    }

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // 선택된 이미지의 인덱스

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index); // 이미지 클릭 시 선택된 이미지의 인덱스를 설정
    };

    const [selectedImg, setSelectedImg] = useState<string>('');

    const handleSelectedImg = function(url : string){
        setSelectedImg(url);
    }

    const [isImg, setIsImg] = useState<string>('');

    const handleIsImg = function(url : string){
        setIsImg(url);
    }

    const [exhibitionDetail, setExhibitionDetail] = useState<boolean>(false);

    const openExhibitionDetails = function(){
        setExhibitionDetail(!exhibitionDetail);
    }

    const [photoLiked2, setPhotoLiked2] = useState<boolean>(false);

    const clickHeart2 = function(){
        setPhotoLiked2(!photoLiked2);
    }

    
    const [photoLiked3, setPhotoLiked3] = useState<boolean>(false);

    const clickHeart3 = function(){
        setPhotoLiked3(!photoLiked3);
    }

    const openSortTypeList = function(){
        setSortTypeList(!sortTypeList);
        setIsRotated2(!isRotated2);
    }

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [imgArr, setImgArr] = useState<imgInterface[]>([]);

    useEffect(() => {
      console.log("로드");
  
      // key가 없으면 응답은 10개씩
      const API_URL =
        "https://k10d103.p.ssafy.io/api/photos/gallery/latest?page=1";
      axios.get(API_URL).then((res) => {
        console.log(res);
        
        // id값과 url만 저장
        const gotData = res.data.photoList.map((imgs: { photoId: string; thumbnailUrl: string; likeCnt: number; liked: boolean; title: string }) => ({
          id: imgs.photoId,
          url: imgs.thumbnailUrl,
          likeCnt: imgs.likeCnt,
          liked: imgs.liked,
          title: imgs.title,
        }));
        setImgArr(gotData);
      });
    }, []);

     // Intersection Observer 설정

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  
  /*
  handleObserver: 교차점이 발생했을 때 실행되는 콜백 함수.
  entries: 교차점 정보를 담는 배열
  isIntersecting: 교차점(intersection)이 발생한 요소의 상태
  교차점이 발생하면 page 1 증가
  */

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0, //  Intersection Observer의 옵션, 0일 때는 교차점이 한 번만 발생해도 실행, 1은 모든 영역이 교차해야 콜백 함수가 실행.
    });
    // 최하단 요소를 관찰 대상으로 지정함
    const observerTarget = document.getElementById("observer");
    // 관찰 시작
    if (observerTarget) {
      observer.observe(observerTarget);
    }
  }, []);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const API_URL = `https://k10d103.p.ssafy.io/api/photos/gallery/latest?page=${page}`;
            const response = await axios.get(API_URL);
            const newData = response.data.data.photoList.map((imgs: { photoId: number; thumbnailUrl: string; likeCnt: number; liked: boolean; title: string }) => ({
                id: imgs.photoId,
                url: imgs.thumbnailUrl,
                likeCnt: imgs.likeCnt,
                liked: imgs.liked,
                title: imgs.title,
            }));
            setImgArr((prevData) => [...prevData, ...newData]);
        } catch (error) {
            console.log(error);
        }
        setIsLoading(false);
    };


    const [animate, setAnimate] = useState(true);
    const onStop = () => setAnimate(false);
    const onRun = () => setAnimate(true);

    return (
        <>
            {isExhibition && (
            <>
            <div className={styles.modal_background}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openExhibitionModal();}}></img>
            <div className={styles.open_exhibition_modal_container}>
                <p className={styles.open_exhibition_title}>Exhibition Info</p>
                <div className={styles.exhibition_info}>
                    <div className={styles.exhibition_photo_intro_container} onClick={openImgList}>
                        <img src={selectedImg == '' ? '/imgs/circle_plus.png' : selectedImg} alt='플러스' className={selectedImg == '' ? styles.circle_plus : styles.is_img}></img>
                    </div>

                    {plusImg && (
                        <>
                        <div className={styles.modal_background}> </div>
                        <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openImgList();}}></img>
                        <div className={styles.open_photo_list_container}>
                            <div className={styles.upload_photos_list_container}>
                                {imgArr.map((image, index)=>{
                                    return( 
                                        <div key={index + 'o'} className={styles.upload_photos_list} onClick={() => {handleIsImg(image.url);}}>
                                            <div className={`${styles.upload_photos_list_overlay} ${selectedImageIndex === index && styles.upload_photos_list_overlay_clicked}`} onClick={() => {handleImageClick(index);}}>
                                                {selectedImageIndex === index && <img src='/imgs/check_white.png'></img>}
                                            </div>
                                            <img src={image.url} alt='이미지' className={styles.photos_list_upimg}></img>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={styles.selected_img_ok} onClick={() => {openImgList(); handleSelectedImg(isImg);}}>
                                <p>Select</p>
                            </div>
                        </div>
                        </>
                    )}
                    <div className={styles.exhibition_photo_info_container}>
                        <div className={styles.open_title_container}>
                            <p style={{fontSize : '24px'}}>Title</p>
                            <input className={styles.open_input_box} type="text" placeholder="제목을 입력해주세요." ></input>
                        </div>
                        <div className={styles.open_title_container}>
                            <p style={{fontSize : '24px'}}>Date</p>
                            <Calendar />
                        </div>
                        <div className={styles.open_title_container}>
                            <p style={{fontSize : '24px'}}>Description</p>
                            <textarea className={styles.open_description_input_box} placeholder="전시회를 간단히 소개해주세요." ></textarea>
                        </div>
                    </div>
                </div>
                <div className={styles.exhibition_open_btn}>
                    <p className={styles.open_btn_txt}>Open</p>
                </div>
            </div>
            </>
        )}

        {exhibitionDetail && (
            <>
            <div className={styles.modal_background}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openExhibitionDetails();}}></img>
            <div className={styles.open_exhibition_modal_container}>
            <img src={`/imgs/${photoLiked3 ? 'heart' : 'empty_heart2'}.png`} alt='하트' className={styles.exhibition_heart} onClick={() => {clickHeart3();}}></img>
                <p className={styles.open_exhibition_title}>Exhibition Info</p>
                <div className={styles.exhibition_info}>
                    <div className={styles.exhibition_photo_intro_container2}>
                        <img src={exhibition.thumbNail} alt='썸네일' className={styles.is_img}></img>
                    </div>

                    <div className={styles.exhibition_photo_info_container2}>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Title</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{exhibition.title}</p>
                        </div>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Date</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{exhibition.date}</p>
                        </div>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Description</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{exhibition.description}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.exhibition_open_btn}>
                    <p className={styles.open_btn_txt}>Enter</p>
                </div>
            </div>
            </>
        )}
        

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
                <p className={styles.intro_txt1}>Exhibition</p>
            </div>

            <div className={styles.wrapper}>
                <div className={styles.slide_container}>
                    <ul
                        className={styles.slide_wrapper}
                        onMouseEnter={onStop}
                        onMouseLeave={onRun}>
                        <div
                            className={styles.slide + " " +  styles.original + " " + (
                                animate ? "" : styles.stop
                            )}
                        >
                           {imgArr.map((Imgs, i) => (
                                <li key={Imgs.id}  onClick={() => {openExhibitionDetails();}}>
                                    <p className={styles.item}>

                                    <div key={i + 'g'} className={styles.card}>
                                        <img src={Imgs.url} alt='프로필' className={styles.card_img}/>
                                        <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                                        
                                        <div className={styles.card_whole_info}>
                                            <p className={styles.card_title}>{Imgs.title}</p>
                                            <p className={styles.card_date}>2024.04.21 ~ 2024.04.30</p>
                                            <div className={styles.photo_card_info2}>
                                                <img src={Imgs.url} alt='프로필 사진' className={styles.card_photo_profile2} style={{width : '40px', height : '40px', borderRadius : '50px', objectFit : 'cover'}}></img>
                                                <p className={styles.card_info_txt}>{Imgs.title}</p>
                                                <div className={styles.card_like_container}>
                                                    <p className={styles.card_like_txt}>{Imgs.likeCnt}</p>
                                                    <img src={`/imgs/${photoLiked2 ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart} onClick={() => {clickHeart2();}}></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </p>
                                </li>
                            ))}
                        </div>
                        <div
                            className={styles.slide + " " +  styles.clone + " " + (
                                animate ? "" : styles.stop
                            )}
                        >
                            {imgArr.map((Imgs, i) => (
                                <li key={Imgs.id} onClick={() => {openExhibitionDetails();}}>
                                    <p className={styles.item}>

                                    <div key={i + 'g'} className={styles.card}>
                                        <img src={Imgs.url} alt='프로필' className={styles.card_img}/>
                                        <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                                        
                                        <div className={styles.card_whole_info}>
                                            <p className={styles.card_title}>{Imgs.title}</p>
                                            <p className={styles.card_date}>2024.04.21 ~ 2024.04.30</p>
                                            <div className={styles.photo_card_info2}>
                                                <img src={Imgs.url} alt='프로필 사진' className={styles.card_photo_profile2}  style={{width : '40px', height : '40px', borderRadius : '50px', objectFit : 'cover'}}></img>
                                                <p className={styles.card_info_txt}>{Imgs.title}</p>
                                                <div className={styles.card_like_container}>
                                                    <p className={styles.card_like_txt}>{Imgs.likeCnt}</p>
                                                    <img src={`/imgs/${photoLiked2 ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart} onClick={() => {clickHeart2();}}></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </p>
                                </li>
                            ))}
                        </div>
                    </ul>
                </div>
            </div>
            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>
            <div className={styles.btn_container}>
                <div className={styles.photo_btn} onClick={() => {openExhibitionModal();}}>
                    <p>전시회 개최</p>
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
            
            <div className={styles.profile_card_container}>
                {imgArr &&
                    imgArr.map((Imgs: imgInterface, idx) => (
                        <div key={idx + 'g'} className={styles.card} onClick={() => {openExhibitionDetails();}}>
                            <img src={Imgs.url} alt='프로필' className={styles.card_img}/>
                            <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                            
                            <div className={styles.card_whole_info}>
                                <p className={styles.card_title}>{Imgs.title}</p>
                                <p className={styles.card_date}>2024.04.21 ~ 2024.04.30</p>
                                <div className={styles.photo_card_info}>
                                    <img src={Imgs.url} alt='프로필 사진' className={styles.card_photo_profile}></img>
                                    <p className={styles.card_info_txt}>{Imgs.title}</p>
                                    <div className={styles.card_like_container}>
                                        <p className={styles.card_like_txt}>{Imgs.likeCnt}</p>
                                        <img src={`/imgs/${photoLiked2 ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart} onClick={() => {clickHeart2();}}></img>
                                    </div>
                                </div>
                            </div>
                        </div>
                ))}
            </div>
            {isLoading && <p>Loading...</p>}
            
            <div className="dog-imgs-container"> 
            <div id="observer" style={{ height: "10px" }}></div>
            </div>
        </div>
        </>
    );
};

export default Exhibition;
