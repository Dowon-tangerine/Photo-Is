import React, { useState, useEffect } from 'react';
import styles from "./css/SearchTitle.module.css";
import { FaAngleDown } from 'react-icons/fa';
import Masonry from 'react-masonry-css';
import { useLocation, useNavigate } from "react-router-dom";
import MapComponent from './MapComponent';
import { getSearching, getPhotoDetail, postComment, getComment, postLiked } from '../../apis/galleryApi';



interface imgInterface {
    photoId: number,
    thumbnailUrl: string,
    likeCnt: number,
    isLiked: boolean,
    title: string,
}

interface metadataInterface {
    time: string,
    cameraType : string,
    cameraModel : string,
    lensModel : string,
    aperture : string,
    focusDistance : string,
    shutterSpeed : string,
    iso : string,
    latitude : number,
    longtitude : number,
}

interface photoDetailInterface {
    photoId: number,
    memberId : number,
    nickname : string,
    profileUrl : string,
    title : string,
    imageUrl : string,
    likeCnt : number,
    isLiked : boolean,
    createdAt : string,
    commentCnt : number,
    accessType : string,
    metadata: metadataInterface,
    hashtagList : Array<string>,

}

interface commentInterface{
    commentId: number,
    nickname: string,
    profileUrl: string,
    comment: string,
    createdAt: string,
}

const SearchTitle: React.FC = () => {

    const [type, setType] = useState<String>("선택");
    const [typeList, setTypeList] = useState<boolean>(false);
    const [isRotated, setIsRotated] = useState<boolean>(false);    
    const [imgDetail, setImgDetail] = useState<boolean>(false);
    const [photoDetails, setPhotoDetails] = useState<photoDetailInterface | null>(null);

    const location = useLocation();
    const navigate = useNavigate();


    const moveToGallery = function(){
        navigate("/community/gallery")
    }

    const [word, setWord] = useState<string>(location.state ? location.state.searchWord : "")
    const [word2, setWord2] = useState<string>("");

    const moveToSearch = function(){
        if(type === "작가"){
            navigate("/community/gallery/searchName", { state: { searchWord :  word2} })
        }
        else if(type === "제목"){
            getSearching("title", word2, 1)
            .then((res) => {
                setImgArr(res);
            })
            setWord(word2)
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

    getPhotoDetail(0);

  }, []);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setIsLoading(true);
        getSearching("title", word, page)
        .then((res) => {
            if(res){
                setImgArr([...imgArr, ...res]);
            }
        })
        setIsLoading(false);
    };

    const [commentList, setCommentList] = useState<Array<commentInterface>>();

    const openPhotoDetails = function(id : number | undefined){
        document.body.style.overflow = 'hidden';

        if(!imgDetail) {
            // 상세정보 불러오기
            getPhotoDetail(id)
            .then((res) => {
                if(res){
                    setPhotoDetails(res);
                    getComment(id)
                    .then((res) => {
                        if(res){
                            setCommentList(res);
                        }
                    })
                    setImgDetail(!imgDetail);
                }
            })
        } else {
            getSearching("title", word, 1)
            .then((res) => {
                if(res){
                    setImgArr([...res]);
                    setPhotoDetails(null);
                    setCommentList([]);
                    setImgDetail(!imgDetail);
                }
            })
        }
    }

    const sendClick = function(id : number | undefined){
        setMyComment("");
        postComment(id, myComment)
        .then((res) => {
            if(res){
                console.log("댓글 목록 조회 " + res)
                setCommentList(res);
            }
            else{
                setCommentList([]);
            }
        })
    }

    const [myComment, setMyComment] = useState<string>("");

    const clickHeart = function(id : number | undefined){
        postLiked(id)
        .then((res) => {
            setPhotoDetails({
                ...photoDetails!,
                isLiked: res.liked,
                likeCnt: res.likeCnt
            })
        })
    }


    return (
        <>
        {imgDetail && (
            <>
                <div className={styles.modal_background}></div>
                <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openPhotoDetails(photoDetails?.photoId);}}></img>
                <div className={styles.photo_modal_container}>
                    <div className={styles.img_container}>
                        <img src={photoDetails?.imageUrl} alt='사진' className={styles.photo}></img>
                        <div className={styles.detail_photo_info}>
                            <img src={photoDetails?.profileUrl} alt='프로필' className={styles.detail_photo_profile}></img>
                            <div className={styles.detail_photo_info_container}>
                                <p className={styles.photo_title}>{photoDetails?.title}</p>
                                <p className={styles.photo_date}>{photoDetails?.createdAt.substring(0,10)} by {photoDetails?.nickname}</p>
                            </div>
                            <div className={styles.detail_photo_like}>
                                <p className={styles.heart_txt}>{photoDetails?.likeCnt}</p>
                                <img src={`/imgs/${photoDetails?.isLiked ? 'heart' : 'empty_heart2'}.png`} alt='하트' className={styles.heart3} onClick={() => {clickHeart(photoDetails?.photoId);}}></img>
                            </div>
                        </div>
                    </div>
                    <div className={styles.other_info_container}>
                        <div style={{width : '300px', height : 'fit-content', display : 'flex', justifyContent : 'center', alignItems: 'center', background : 'white'}}>
                            <p className={styles.camera_info_title}>Information</p>
                        </div>
                        <div className={styles.camera_info}>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>카메라 모델 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.cameraModel}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>렌즈 모델 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.lensModel}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>조리개 / F : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.aperture}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>초점 거리 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.focusDistance}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>셔터 스피드 / SS : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.shutterSpeed}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>심도 / ISO : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.iso}</p>
                            </div>
                            <div><MapComponent/></div>
                        </div>
                        <div style={{width : '300px', height : 'fit-content', display : 'flex', justifyContent : 'center', alignItems: 'center', marginTop : '10px', background : 'white'}}>
                            <p className={styles.camera_info_title}>Tags</p>
                        </div>
                        <div className={styles.tags_container}>
                            <div className={styles.tags}>
                                {photoDetails?.hashtagList.map((tag, index)=>{
                                return <a key={index + 'k'} href='#'>#{tag} </a>

                                })}
                            </div>
                        </div>
                        <div style={{width : '300px', height : 'fit-content', display : 'flex', alignItems: 'center', marginTop : '10px', background : 'white'}}>
                                <p className={styles.camera_info_title2}>{commentList?.length} Comments</p>
                        </div>
                        <div className={styles.comment_container}>
                            {(commentList === undefined || commentList.length === 0)
                            ? <>
                                <div style={{display : "flex", alignItems : 'center', justifyContent : 'center'}}>
                                    <p style={{fontFamily : '부크크고딕bold', marginTop : '90px'}}>등록돤 댓글이 없습니다.</p>
                                </div>
                            </>
                            :
                            commentList.map((comment, index)=>{
                                return <div key={index + 'm'} style={{padding : '5px', display : 'flex'}}>
                                    <img src={comment.profileUrl} alt='프로필' className={styles.comment_profile}></img>
                                    <div className={styles.comment_info}>
                                        <p style={{fontFamily : '부크크고딕bold', fontSize : '14px'}}>{comment.nickname}</p>
                                        <p style={{fontFamily : '부크크고딕', fontSize : '12px', marginTop : '-10px', color : 'black'}}>{comment.comment}</p>
                                        <p style={{fontFamily : '부크크고딕', fontSize : '10px', marginTop : '-10px', color : 'gray'}}>{comment.createdAt.slice(0,10)}</p>
                                    </div>
                                </div>
                            })}
                        </div>
                        <div className={styles.send_comment_container}>
                            <div className={styles.send_box}>
                                <input className={styles.input_box2} type="text" placeholder="댓글" onChange={(e) => setMyComment(e.target.value)} value={myComment}></input>
                                <img className={styles.send_icon} src="/imgs/send_icon.png" alt='보내기' onClick={() => {sendClick(photoDetails?.photoId);}}></img>
                            </div>
                        </div>  
                    </div>
                </div>
            </>
        )}


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
                <p style={{fontSize : '20px'}}>제목</p>
            </div>

            <Masonry 
                breakpointCols={3}
                className={styles.my_masonry_grid}
                columnClassName={styles.my_masonry_grid_column}>
                    
                    {/* <div className="dog-imgs-container"> */}
                        {imgArr &&
                            imgArr.map((Imgs: imgInterface, idx) => (
                                <div key={idx + 'g'} className={styles.img_card} onClick={() => {openPhotoDetails(Imgs.photoId);}}>
                                    <img src={Imgs.thumbnailUrl} />
                                    <div className={styles.photo_info2}>
                                        <p className={styles.info_txt2}>{Imgs.title}</p>
                                        <div className={styles.like_container2}>
                                            <p className={styles.like_txt2}>{Imgs.likeCnt}</p>
                                            <img src={`/imgs/${Imgs.isLiked ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.heart2}></img>
                                        </div>
                                    </div>
                                </div>
                                ))}
            </Masonry>
            {isLoading && <p>Loading...</p>}
            
            <div className="dog-imgs-container"> 
            <div id="observer" style={{ height: "10px" }}></div>
            </div>
        </div>
        </>
    );
};

export default SearchTitle;
