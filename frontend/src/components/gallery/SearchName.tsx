import React, { useState, useEffect } from 'react';
import styles from "./css/SearchName.module.css";
import { FaAngleDown } from 'react-icons/fa';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

interface imgInterface {
    id: number;
    url: string;
    likeCnt: number,
    liked: boolean,
    title: string,
  }
  
const SearchName: React.FC = () => {

    const [type, setType] = useState<String>("선택");
    const [typeList, setTypeList] = useState<boolean>(false);
    const [isRotated, setIsRotated] = useState<boolean>(false);    
    const [imgDetail, setImgDetail] = useState<boolean>(false);


    const location = useLocation();
    const navigate = useNavigate();


    const moveToGallery = function(){
        navigate("/community/gallery")
    }    
    
    const [word2, setWord2] = useState<String>("");

    const moveToSearch = function(){
        if(type === "작가"){
            navigate("/community/gallery/searchName", { state: { searchWord :  word2 + "1"} })
        }
        else if(type === "제목"){
            navigate("/community/gallery/searchTitle", { state: { searchWord :  word2} })
        }
        else if(type === "태그"){
            navigate("/community/gallery/searchTag", { state: { searchWord :  word2} })
        }
    } 

    const word = location.state ? location.state.searchWord : "";

    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };


    const openTypeList = function(){
        setTypeList(!typeList);

        setIsRotated(!isRotated);
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


    
    const openPhotoDetails = function(){
        setImgDetail(!imgDetail);
    }

    const following = function(idx : number, follow : boolean){

        let newArr = [...imgArr];

        newArr[idx].liked = !follow;

        setImgArr(newArr);
    }

    return (
        <>
        <div className={styles.main_container}>
            <div className={styles.search_container}>
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
                <input className={styles.input_box} type="text" placeholder="검색어를 입력해주세요." onChange={(e) => {setWord2(e.target.value)}}></input>
                <img className={styles.find_icon} src="/imgs/search_icon.png" alt='돋보기' onClick={moveToSearch}></img>
            </div>

            <div className={styles.page_intro}>
                <p className={styles.intro_txt1} onClick={moveToGallery}>Community</p>
                <p className={styles.intro_txt2}>-Gallery-</p>
            </div>
            
            <div className={styles.search_word}>
                <p style={{fontSize : '20px'}}>"{word}" 검색결과</p>
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>
            
            <div className={styles.search_type}>
                <p style={{fontSize : '20px'}}>작가</p>
            </div>


                    
            <div className={styles.profile_card_container}>
                {imgArr &&
                    imgArr.map((Imgs: imgInterface, idx) => (
                        <div key={idx + 'g'} className={styles.card} onClick={() => {openPhotoDetails();}}>
                            <img src={Imgs.url} alt='프로필' className={styles.card_profile}/>
                            <p className={styles.profile_name}>김짱구잠옷</p>
                            <div className={styles.profile_info}>
                                <p>Cameara use 1 years</p>
                                <div className={styles.imgs_cnt}>
                                    <img src='/imgs/photo_icon.png' alt='사진 아이콘' className={styles.photo_icon}></img>
                                    <p style={{marginLeft : '10px'}}>180</p>
                                </div>
                                <p>following 170 / follower 230</p>
                            </div>
                            <div className={Imgs.liked ? styles.follow_btn_container : styles.no_follow_btn_container} onClick={() => {following(idx, Imgs.liked);}}>
                                <p className={styles.plus_txt}>{Imgs.liked ? `Follower` : `Follow`}</p>
                                <img src={Imgs.liked ? `` : `/imgs/white_plus.png`} className={Imgs.liked ? `` : styles.plus_icon}></img>
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

export default SearchName;
