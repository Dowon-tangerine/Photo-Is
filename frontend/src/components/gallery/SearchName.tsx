import React, { useState, useEffect } from 'react';
import styles from "./css/SearchName.module.css";
import { FaAngleDown } from 'react-icons/fa';
import { useLocation, useNavigate } from "react-router-dom";
import { getSearching } from '../../apis/galleryApi';

interface imgInterface {
    nickname: string,
    profileUrl: string,
    city: null | string,
    country: null | string,
    uploadedPhotoCnt: number,
    followingCnt: number,
    followerCnt: number,
    follow: boolean,
    useYear: number,
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
    
    const moveToMyPage = function(){
        navigate("/myPage")
    }    
    
    const [word, setWord] = useState<string>(location.state ? location.state.searchWord : "")
    const [word2, setWord2] = useState<string>("");

    const moveToSearch = function(){
        if(type === "작가"){
            getSearching("author", word2, 1)
            .then((res) => {
                setImgArr(res);
            })
            setWord(word2)
        }
        else if(type === "제목"){
            navigate("/community/gallery/searchTitle", { state: { searchWord :  word2} })
        }
        else if(type === "태그"){
            navigate("/community/gallery/searchTag", { state: { searchWord :  word2} })
        }
        else{
            alert("검색 카테고리를 선택해주세요!")
        }
    } 

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

        getSearching("author", word, page)
        .then((res) => {
            if(res){
                setImgArr([...imgArr, ...res]);
            }
        })

        setIsLoading(false);
    };


    
    const openPhotoDetails = function(){
        setImgDetail(!imgDetail);
    }

    const following = function(idx : number, follow : boolean){

        let newArr = [...imgArr];

        newArr[idx].follow = !follow;

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
                            <img src={Imgs.profileUrl} alt='프로필' className={styles.card_profile} onClick={moveToMyPage}/>
                            <p className={styles.profile_name}>{Imgs.nickname}</p>
                            <div className={styles.profile_info}>
                                <p>Cameara use {Imgs.useYear} years</p>
                                <div className={styles.imgs_cnt}>
                                    <img src='/imgs/photo_icon.png' alt='사진 아이콘' className={styles.photo_icon}></img>
                                    <p style={{marginLeft : '10px'}}>180</p>
                                </div>
                                <p>follower {Imgs.followerCnt} / following {Imgs.followingCnt} </p>
                            </div>
                            <div className={Imgs.follow ? styles.follow_btn_container : styles.no_follow_btn_container} onClick={() => {following(idx, Imgs.follow);}}>
                                <p className={styles.plus_txt}>{Imgs.follow ? `Follower` : `Follow`}</p>
                                <img src={Imgs.follow ? `` : `/imgs/white_plus.png`} className={Imgs.follow ? `` : styles.plus_icon}></img>
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
