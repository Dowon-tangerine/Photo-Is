import React, { useState, useEffect } from 'react';
import styles from "./css/UserPage.module.css";
import Masonry from 'react-masonry-css';
import MapComponent from '../gallery/MapComponent';
import { useLocation } from "react-router-dom";
import { searchProfile } from '../../apis/memberApi';
import { getPhoto, getExhibition, getExhibitionDetail, changeExhibitionLike } from '../../apis/otherMemberApi';
import { getPhotoDetail, postComment, getComment, postLiked, postFollow, deleteUnFollow } from '../../apis/galleryApi';


interface imgInterface {
    photoId: number;
    thumbnailUrl: string;
    likeCnt: number,
    title: string,
    isLiked: boolean,
}

// 전시회 인터페이스
interface exhibitionInterface {
    exhibitionId: number,
    title: string,
    posterUrl: string,
    startDate: string,
    endDate: string,
    profileUrl: string,
    nickname: string,
    likeCnt: number,
    liked: boolean,
}
interface exhibitionWithoutLikedInterface {
    exhibitionId: number,
    title: string,
    posterUrl: string,
    startDate: string,
    endDate: string,
    profileUrl: string,
    nickname: string,
    likeCnt: number,
    liked: boolean,
}

interface memberInfoInterface { 
    memberId: number;
    nickname: string;
    profileUrl: string;
    backgroundUrl: string;
    photoCnt: number;
    introduction: string;
    followerCnt: number;
    followingCnt: number;
    useYear: number,
    follow: boolean,
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

const UserPage: React.FC = () => {
    const [tabIndex, settabIndex] = useState<number>(0);
    const [imgDetail, setImgDetail] = useState<boolean>(false);
    const [memberInfo, setMemberInfo] = useState<memberInfoInterface>({
        memberId: -1,
        nickname: '',
        profileUrl: '',
        backgroundUrl: '',
        photoCnt: 0,
        introduction: '',
        followerCnt: 0,
        followingCnt: 0,
        useYear: 0,
        follow: false,
    });

    const tabClickHandler = function(index : number){
        settabIndex(index);
    }

    const location = useLocation();

    const targetId  =  location.state ? location.state.userId : "";

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [imgArr, setImgArr] = useState<imgInterface[]>([]);
    const [exhibitionArr, setExhibitionArr] = useState<exhibitionInterface[]>([]);
    const [detailedExhibition, setDetailedExhibition] = useState<exhibitionWithoutLikedInterface>();
    // const [profileArr, setProfileArr] = useState<profileInterface[]>([]);

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

        const targetId  =  location.state ? location.state.userId : "";
        
        const observer = new IntersectionObserver(handleObserver, {
        threshold: 0, //  Intersection Observer의 옵션, 0일 때는 교차점이 한 번만 발생해도 실행, 1은 모든 영역이 교차해야 콜백 함수가 실행.
        });
        // 최하단 요소를 관찰 대상으로 지정함
        const observerTarget = document.getElementById("observer");
        // 관찰 시작
        if (observerTarget) {
        observer.observe(observerTarget);
        }
        searchProfile(targetId)
        .then((res)=>{
            if(res){
                setMemberInfo(res);
            }
            else{
                console.log("예기치 못한 에러가 발생했습니다.");
            }})

        getPhoto(targetId, 1)
        .then((res)=>{
            if(res){
                setImgArr(res);
            }
            else{
                console.log("이미지 로딩 중 예기치 못한 에러가 발생했습니다.");
            }
        })

        getExhibition(targetId)
        .then((res) => {
            console.log(res);
        })
    }, []);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setIsLoading(true);
        getPhoto(targetId, page)
        .then(res=>{
            if(res){
                setImgArr(res);
            }
        })
        
        getExhibition(targetId)
        .then((res) => {
            if(res){
                setExhibitionArr(res);
            }
        })

        setIsLoading(false);
    };

    const clickHeart3 = function(exhibitionId: number | undefined){
        setDetailedExhibition({
            ...detailedExhibition!,
            liked: !detailedExhibition!.liked
        })
        changeExhibitionLike(exhibitionId!)
    }

    const [exhibitionDetail, setExhibitionDetail] = useState<boolean>(false);

    const openExhibitionDetails = function(exhibitionId: number){
        // 상세 정보 요청
        document.body.style.overflow = 'hidden';
        getExhibitionDetail(exhibitionId)
        .then(res=>{
            setDetailedExhibition(res);
            setExhibitionDetail(true);
        })
    }
    const closeExhibitionDetails = ()=>{
        document.body.style.overflow = 'auto';
        getExhibition(targetId)
        .then((res) => {
            if(res){
                setExhibitionArr(res);
                setExhibitionDetail(false);
            }
        })
    }

    const tabArr=[{
        tabTitle:(
            <>
                <div className={styles.mode_style}>
                    <div className={tabIndex===0 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(0)}>Public</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            <> 
                <Masonry 
                breakpointCols={3}
                className={styles.my_masonry_grid}
                columnClassName={styles.my_masonry_grid_column}>
                    
                    {imgArr &&
                        imgArr.map((Imgs: imgInterface, idx) => (
                            <div key={idx + 'g'} className={styles.img_card}>
                                <img src={Imgs.thumbnailUrl} className={styles.img2}  onClick={() => {openPhotoDetails(Imgs.photoId)}} />
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

                {isLoading && <p style={{width : '100%', textAlign : 'center'}}>Loading...</p>}
            
                <div className="dog-imgs-container"> 
                <div id="observer" style={{ height: "10px" }}></div>
                </div>
            </>
        )
    },
    {
        tabTitle:(
            <>
                 <div className={styles.mode_style}>
                    <div className={tabIndex===1 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(1)}>Exhibition</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            <>
            <div className={styles.profile_card_container}>
                {exhibitionArr &&
                    exhibitionArr.map((Imgs: exhibitionInterface, idx) => (
                        <div key={idx + 'g'} className={styles.card} onClick={() => {openExhibitionDetails(Imgs.exhibitionId);}}>
                            {/* 내 전시회 목록은 프로필사진이 없어야 함 */}
                            <img src={Imgs.posterUrl} alt='프로필' className={styles.card_img}/>
                            <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                            
                            <div className={styles.card_whole_info}>
                                <p className={styles.card_title}>{Imgs.title}</p>
                                <p className={styles.card_date}>{Imgs.startDate.slice(0,10)} ~ {Imgs.endDate.slice(0,10)}</p>
                                <div className={styles.photo_card_info}>
                                    {/* 내 전시회 목록은 프로필사진이 없어야 함 */}
                                    <img src={Imgs.profileUrl} alt='프로필 사진' className={styles.card_photo_profile}></img>
                                    <p className={styles.card_info_txt}>{Imgs.nickname}</p>
                                    <div className={styles.card_like_container}>
                                        <p className={styles.card_like_txt}>{Imgs.likeCnt}</p>
                                        <img src={`/imgs/${Imgs.liked ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.heart2}></img>
                                    </div>
                                </div>
                            </div>
                        </div>
                ))}
            </div>

            {isLoading && <p style={{width : '100%', textAlign : 'center'}}>Loading...</p>}
            
            <div className="dog-imgs-container"> 
            <div id="observer" style={{ height: "10px" }}></div>
            </div>
            
            </>
        )
    }    
    ]

    const [photoDetails, setPhotoDetails] = useState<photoDetailInterface | null>(null);
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
            getPhoto(targetId, 1)
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

    const [isFollowList, setIsFollowList] = useState<boolean>(false);

    const openFollowList = function(){
        setIsFollowList(!isFollowList);
    }

    const clickFollow = function(id : number){
        postFollow(id)
        .then((res) => {
            setMemberInfo({
                ...memberInfo!,
                follow: res
            });
            searchProfile(targetId)
            .then((res)=>{
                if(res){
                    setMemberInfo(res);
                }
                else{
                    console.log("예기치 못한 에러가 발생했습니다.");
                }})
        })
    }

    const clickunFollow = function(id : number){
        deleteUnFollow(id)
        .then((res) => {
            setMemberInfo({
                ...memberInfo!,
                follow: res
            });
            searchProfile(targetId)
            .then((res)=>{
                if(res){
                    setMemberInfo(res);
                }
                else{
                    console.log("예기치 못한 에러가 발생했습니다.");
                }})
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

        {exhibitionDetail && (
            <>
            <div className={styles.modal_background}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={closeExhibitionDetails}></img>
            <div className={styles.open_exhibition_modal_container}>
            <img src={`/imgs/${detailedExhibition?.liked ? 'heart' : 'empty_heart2'}.png`} alt='하트' className={styles.exhibition_heart} onClick={() => {clickHeart3(detailedExhibition?.exhibitionId);}}></img>
                <p className={styles.open_exhibition_title}>Exhibition Info</p>
                <div className={styles.exhibition_info}>
                    <div className={styles.exhibition_photo_intro_container2}>
                        <img src={detailedExhibition?.posterUrl} alt='썸네일' className={styles.is_img}></img>
                    </div>

                    <div className={styles.exhibition_photo_info_container2}>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Title</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{detailedExhibition?.title}</p>
                        </div>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Date</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{detailedExhibition?.startDate} ~ {detailedExhibition?.endDate}</p>
                        </div>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Description</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>수정해야함</p>
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
            <div className={styles.mypage_info_container} style={{backgroundImage : `url(${memberInfo.backgroundUrl})`, backgroundSize : 'cover', height : '350px', position : 'relative', backgroundPosition : 'center'}}>
                <div className={styles.info_container}>
                    <img src={memberInfo.profileUrl} alt='프로필' className={styles.profile}></img>
                    <div className={styles.info}>
                        <div className={memberInfo.follow ? styles.follow_btn_container : styles.no_follow_btn_container} onClick={() => {memberInfo.follow ? clickunFollow(memberInfo.memberId) : clickFollow(memberInfo.memberId);}}>
                            <p className={styles.plus_txt}>{memberInfo.follow ? `Follower` : `Follow`}</p>
                            <img src={memberInfo.follow ? `` : `/imgs/white_plus.png`} className={memberInfo.follow ? `` : styles.plus_icon}></img>
                        </div>
                        <p>{memberInfo.nickname}</p>
                        <p style={{fontSize : '16px' , fontFamily : "부크크명조bold" }}>Camera using by {memberInfo.useYear} years</p>
                        <p style={{fontSize : '16px' , fontFamily : "부크크명조bold"}} onClick={() => {openFollowList();}}>{memberInfo.followerCnt} Follower / {memberInfo.followingCnt} Following</p>
                        <p style={{fontSize : '16px'}}>{memberInfo.introduction}</p>
                    </div>

                </div>
            </div>

            <div className={styles.photo_mode_container}>
                <div className={styles.line}></div>
                <div className={styles.mode_tabs}>
                        {tabArr.map((mode, index)=>{
                            return <div key={index}>{mode.tabTitle}</div>
                        })}
                </div>

                <div>
                    {tabArr[tabIndex].tabCont}
                </div>
            </div>
        </div>
        </>
    );
};

export default UserPage;
