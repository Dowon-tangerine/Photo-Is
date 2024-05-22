import React, { useState, useEffect } from 'react';
import styles from "./css/Gallery.module.css";
import { FaAngleDown } from 'react-icons/fa';
import Carousel from 'react-material-ui-carousel'
import Masonry from 'react-masonry-css';
import MapComponent from './MapComponent';
import {useNavigate } from "react-router-dom";
import { getRanking, getSorting, getPhotoDetail, postLiked, getComment, postComment } from '../../apis/galleryApi';


interface rankingInterface {
    photoId: number,
    thumbnailUrl: string,
    likeCnt: number,
    isLiked: boolean,
    profileUrl: string,
    nickname: string,
}

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
  
const Gallery: React.FC = () => {

    const [type, setType] = useState<String>("선택");
    const [typeList, setTypeList] = useState<boolean>(false);
    const [isRotated, setIsRotated] = useState<boolean>(false);    
    const [tabIndex, settabIndex] = useState<number>(0);
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);
    const [imgDetail, setImgDetail] = useState<boolean>(false);
    
    const navigate = useNavigate();

    const [word, setWord] = useState<String>("");

    const moveToSearch = function(){
        if(type === "작가"){
            navigate("/community/gallery/searchName", { state: { searchWord :  word} })
        }
        else if(type === "제목"){
            navigate("/community/gallery/searchTitle", { state: { searchWord :  word} })
        }
        else if(type === "태그"){
            navigate("/community/gallery/searchTag", { state: { searchWord :  word} })
        }
    }

    const toggleRotation = () => {
        setIsRotated(!isRotated);
    };


    const openTypeList = function(){
        setTypeList(!typeList);

        setIsRotated(!isRotated);
    }

    const openSortTypeList = function(){
        setSortTypeList(!sortTypeList);
        setIsRotated2(!isRotated2);
    }
  /*
  handleObserver: 교차점이 발생했을 때 실행되는 콜백 함수.
  entries: 교차점 정보를 담는 배열
  isIntersecting: 교차점(intersection)이 발생한 요소의 상태
  교차점이 발생하면 page 1 증가
  */

  const [rankingArr, setRankingArr] = useState<Array<rankingInterface>>([])

  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [imgArr, setImgArr] = useState<imgInterface[]>([]);
  const slice_rank_arr = sliceArray(rankingArr, 3);
  
  const [sortType, setSortType] = useState<string>("latest");
  const [sortName, setSortName] = useState<string>('최신');

  const [photoDetails, setPhotoDetails] = useState<photoDetailInterface | null>(null);

  const handleSortType = function(sortType: string){
    getSorting(sortType, 1)
    .then((res) => {
        if(res){
            setImgArr(res);
        }
    })
  }

  const handleObserver = (entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  function sliceArray<T>(array: T[], size: number): T[][] {
      const sliced_arr: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
          sliced_arr.push(array.slice(i, i + size));
      }
      return sliced_arr;
  }

  const tabClickHandler = function(index : number){
    settabIndex(index);

    let type = ''
    if(index === 0){
        type = 'daily'
    }
    else if(index === 1){
        type = 'weekly'
    }
    else if(index === 2){
        type = 'monthly'
    }

    getRanking(type)
    .then((res)=>{
        if(res){
            setRankingArr(res);
            console.log(res);
        }
        else{
            alert('예기치 못한 에러가 발생했습니다...');
        }
    })
}

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

    getRanking("daily")
    .then((res)=>{
        if(res){
            setRankingArr(res);
        }
        else{
            alert('예기치 못한 에러가 발생했습니다...');
        }
    })
    .catch((err)=> console.log(err));

    getPhotoDetail(0);
  }, []);

useEffect(() => {
    fetchData();
}, [page]);

const fetchData = async () => {
    setIsLoading(true);
    
    getSorting(sortType, page)
    .then((res) => {
        if(res){
            setImgArr([...imgArr, ...res]);
        }
    })
    
    setIsLoading(false);
};


    const rankTabArr=[{
        tabTitle:(
            <>
                <div className={styles.mode_style}>
                    <div className={tabIndex===0 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(0)}>일간 랭킹</p>
                    </div>
                </div>

            </>
        ),
        tabCont:(
            <>
                <Carousel indicators={false}>   
                    {slice_rank_arr.map(
                        (slice_arr, i) => (
                            <div className={styles.rank_photos} key={i + 'a'}>
                                {slice_arr.map((item, idx) => (
                                    <div className={styles.rank_photo_frame} key={idx + 'b'} onClick={() => {openPhotoDetails(item.photoId);}}>
                                        <div className={styles.rank_number}>
                                            <p>{i * 3 + idx + 1}</p>
                                        </div>
                                        <img src={item.thumbnailUrl} alt='사진' className={styles.rank_photo} />
                                        <div className={styles.photo_info}>
                                            <img src={item.profileUrl} alt='프로필 사진' className={styles.rank_profile}></img>
                                            <p className={styles.info_txt}>{item.nickname}</p>
                                            <div className={styles.like_container}>
                                                <p className={styles.like_txt}>{item.likeCnt}</p>
                                                <img src={item.isLiked ? '/imgs/heart.png' : '/imgs/empty_heart.png'} alt='하트' className={styles.heart}></img>
                                            </div>
                                        </div>
                                    </div>              
                                ))}
                            </div>  
                        )                                            
                    )}
                </Carousel>
            </>
        )
    },
    {
        tabTitle:(
            <>
                <div className={styles.mode_style}>
                    <div className={tabIndex===1 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(1)}>주간 랭킹</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            <>
                <Carousel indicators={false}>   
                    {slice_rank_arr.map(
                        (slice_arr, i) => (
                            <div className={styles.rank_photos} key={i + 'c'}>
                                {slice_arr.map((item, idx) => (
                                    <div className={styles.rank_photo_frame} key={idx + 'd'} onClick={() => {openPhotoDetails(item.photoId);}}>
                                        <div className={styles.rank_number}>
                                            <p>{i * 3 + idx + 1}</p>
                                        </div>
                                        <img src={item.thumbnailUrl} alt='사진' className={styles.rank_photo} />
                                        <div className={styles.photo_info}>
                                            <img src={item.profileUrl} alt='프로필 사진' className={styles.rank_profile}></img>
                                            <p className={styles.info_txt}>{item.nickname}</p>
                                            <div className={styles.like_container}>
                                                <p className={styles.like_txt}>{item.likeCnt}</p>
                                                <img src={item.isLiked ? '/imgs/heart.png' : '/imgs/empty_heart.png'} alt='하트' className={styles.heart}></img>
                                            </div>
                                        </div>
                                    </div>              
                                ))}
                            </div>  
                        )                                            
                    )}
                </Carousel>
            </>    
        )
    },
    {
        tabTitle:(
            <>
                 <div className={styles.mode_style}>
                    <div className={tabIndex===2 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(2)}>월간 랭킹</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            <>
                <Carousel indicators={false}>   
                    {slice_rank_arr.map(
                        (slice_arr, i) => (
                            <div className={styles.rank_photos} key={i + 'e'}>
                                {slice_arr.map((item, idx) => (
                                    <div className={styles.rank_photo_frame} key={idx + 'f'} onClick={() => {openPhotoDetails(item.photoId);}}>
                                        <div className={styles.rank_number}>
                                            <p>{i * 3 + idx + 1}</p>
                                        </div>
                                        <img src={item.thumbnailUrl} alt='사진' className={styles.rank_photo} />
                                        <div className={styles.photo_info}>
                                            <img src={item.profileUrl} alt='프로필 사진' className={styles.rank_profile}></img>
                                            <p className={styles.info_txt}>{item.nickname}</p>
                                            <div className={styles.like_container}>
                                                <p className={styles.like_txt}>{item.likeCnt}</p>
                                                <img src={item.isLiked ? '/imgs/heart.png' : '/imgs/empty_heart.png'} alt='하트' className={styles.heart}></img>
                                            </div>
                                        </div>
                                    </div>              
                                ))}
                            </div>  
                        )                                            
                    )}
                </Carousel>
            
            </>
        )
    }    
    ]

    const [commentList, setCommentList] = useState<Array<commentInterface>>();

    const openPhotoDetails = function(id : number | undefined){
        document.body.style.overflow = 'hidden';

        if(!imgDetail) {
            // 상세정보 불러오기
            getPhotoDetail(id)
            .then((res) => {
                if(res){
                    setPhotoDetails(res);
                    if(res.metadata.latitude && res.metadata.longitude){
                        localStorage.setItem('lat', res.metadata.latitude);
                        localStorage.setItem('long', res.metadata.longitude);
                    }
                    else{
                        localStorage.setItem('lat', 'none');
                        localStorage.setItem('long', 'none');
                    }
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
            getSorting(sortType, 1)
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

    const [uploadPhoto, setUploadPhoto] = useState<boolean>(false);

    const openUploadModal = function(){
        setUploadPhoto(!uploadPhoto);
    }

    const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter'){
            moveToSearch();
        }
    }
    const onCommentKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>, id : number | undefined) => {
        if(e.key === 'Enter'){
            sendClick(id);
        }
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
                        {
                            photoDetails ?
                        <div className={styles.camera_info}>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>카메라 모델 : </p>
                                <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.cameraModel}</p>
                            </div>
                            <div style={{width : '100%'}}>
                                <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>렌즈 모델 : </p>
                                <p style={{width: '50%',float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetails?.metadata.lensModel}</p>
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
                        : <h3>상세정보가 없습니다.</h3>
                        }
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
                                    <p style={{fontFamily : '부크크고딕bold', marginTop : '90px'}}>등록된 댓글이 없습니다.</p>
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
                                <input className={styles.input_box2} type="text" placeholder="댓글" onChange={(e) => setMyComment(e.target.value)} value={myComment} onKeyDown={(e)=>onCommentKeyDownHandler(e, photoDetails?.photoId)}></input>
                                <img className={styles.send_icon} src="/imgs/send_icon.png" alt='보내기' onClick={() => {sendClick(photoDetails?.photoId);}}></img>
                            </div>
                        </div>  
                    </div>
                </div>
            </>
        )}

        <div className={styles.main_container}>
            <div className={styles.search_container} style={{marginTop: '120px'}}>
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
                <input className={styles.input_box} type="text" placeholder="검색어를 입력해주세요." onChange={(e) => {setWord(e.target.value)}} onKeyDown={onKeyDownHandler}></input>
                <img className={styles.find_icon} src="/imgs/search_icon.png" alt='돋보기' onClick={moveToSearch}></img>
            </div>

            <div className={styles.page_intro}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-Gallery-</p>
            </div>

            <div className={styles.rank_container}>
                <div className={styles.mode_tabs}>
                        {rankTabArr.map((mode, index)=>{
                            return <div key={index}>{mode.tabTitle}</div>
                        })}
                </div>

                <div>
                    {rankTabArr[tabIndex].tabCont}
                </div>
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>
            <div className={styles.btn_container}>
                <div className={styles.photo_btn} style={{visibility:'hidden'}} onClick={() => {openUploadModal();}}>
                    <p>사진 업로드</p>
                </div>
                <div className={styles.sort_btn}>
                    <div className={styles.dropdown_container} onClick={() => {openSortTypeList();}}>
                        <p className={styles.dropdown_txt2}>{sortName}순</p>
                        <FaAngleDown  className={`${styles.dropdown_icon2} ${isRotated2 ? styles.rotated : ''}`}/>
                    </div>

                    {sortTypeList && (
                        <>
                            <div className={styles.typeList_container2}>
                                <p className={styles.type_txt1_2} onClick={() => {setSortType("like"); openSortTypeList(); setSortName("인기"); handleSortType("like");}}>인기</p>
                                <p className={styles.type_txt2_2} onClick={() => {setSortType("view"); openSortTypeList(); setSortName("조회"); handleSortType("view");}}>조회</p>
                                <p className={styles.type_txt2_3} onClick={() => {setSortType("latest"); openSortTypeList(); setSortName("최신"); handleSortType("latest");}}>최신</p>
                            </div>
                        </>
                    )}
                </div>
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

export default Gallery;
