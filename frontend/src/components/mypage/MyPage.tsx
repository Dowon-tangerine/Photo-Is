import React, { useState, useEffect } from 'react';
import styles from "./css/MyPage.module.css";
import Masonry from 'react-masonry-css';
import MapComponent from '../gallery/MapComponent';
import Toggle2 from '../gallery/ToggleBtn2';
import {useNavigate } from "react-router-dom";
import { searchProfile, deletePhoto, putEditPhoto } from '../../apis/memberApi';
import { uploadGalleryPhoto, selectEachPhotoList } from '../../apis/photoApi';
import { getPhotoDetail, postComment, getComment, postLiked } from '../../apis/galleryApi';
import { getMyExhibitionList, getExhibitionDetail } from '../../apis/exhibitionApi';
import { changeExhibitionLike } from '../../apis/otherMemberApi';
import { getFollowerList, getFollowingList } from '../../apis/followApi';

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
    description: string
}
// 팔로우 인터페이스
interface profileInterface {
    memberId: number,
    profileUrl: string,
    nickname: string
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
}
interface uploadPhotoInterface {
    title: string;
    accessType: string;
    hashtag: Array<string>
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

  
const MyPage: React.FC = () => {

    const [tabIndex, settabIndex] = useState<number>(0);
    const [tabIndex2, settabIndex2] = useState<number>(0);
    const [tabIndex3, settabIndex3] = useState<number>(0);
    const [imgDetail, setImgDetail] = useState<boolean>(false);
    const [isUploadFinished, setIsUploadFinished] = useState<boolean>(false);
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
    });
    const [uploadPhotoInfo, setUploadPhotoInfo] = useState<uploadPhotoInterface>({
        title: '',
        accessType: 'PUBLIC',
        hashtag: [],
    });
    const [accessType, setAccessType] = useState<string>('PUBLIC');
    
    const navigate = useNavigate();
    
    const moveToGallery = function(){
        navigate("/community/gallery")
    }

    const moveToMypage = function(){
        navigate("/mypage")
    }

    const tabClickHandler = function(index : number){
        let accessType = '';
        if(index <3){
            if(index == 0){
                accessType = 'PUBLIC';
                setAccessType('PUBLIC');
            }
            else if(index == 1){
                accessType = 'PRIVATE';
                setAccessType('PRIVATE');
            }
            else{
                accessType = 'STUDIO';
                setAccessType('STUDIO');
            }
            selectEachPhotoList(accessType, 1)
            .then(res=>{
                setImgArr(res)
            })
        } else{
            getMyExhibitionList('current')
            .then(res=>{
                setExhibitionArr(res.content);
            })
        }
        settabIndex(index);
    }

    const [exhibitionType, setExhibitionType] = useState<string>('current');
    const tabClickHandler2 = function(index : number){
        let type = 'current';
        if(index === 1){
            type = 'closed';
            setExhibitionType(type);
        }
        getMyExhibitionList(type)
        .then(res=>{
            setExhibitionArr(res.content);
            settabIndex2(index);
        })
    }

    const tabClickHandler3 = function(index : number){
        if(index === 0){
            // 팔로워 목록 조회
            getFollowerList()
            .then(res=>{
                setProfileArr(res);
            })
            // setProfileArr();
        }
        else{
            // 팔로잉 목록 조회
            getFollowingList()
            .then(res=>{
                setProfileArr(res);
            })
            // setProfileArr();
        }
        settabIndex3(index);
    }
    
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [imgArr, setImgArr] = useState<imgInterface[]>([]);
    const [exhibitionArr, setExhibitionArr] = useState<Array<exhibitionInterface>>([]);
    const [profileArr, setProfileArr] = useState<profileInterface[]>([]);

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
    const memberId = Number(localStorage.getItem('memberId'));
    searchProfile(memberId)
    .then((res)=>{
        if(res){
            setMemberInfo(res);
        }
        else{
            console.log("예기치 못한 에러가 발생했습니다.");
        }
    })
    selectEachPhotoList('PUBLIC', 1)
    .then(res=>{
        setImgArr(res);
    })

  }, []);

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        setIsLoading(true);
        selectEachPhotoList(accessType, page)
        .then(res=>{
            if(res){
                setImgArr(res);
            }
        })
        setIsLoading(false);
    };

    const [isEdit, setIsEdit] = useState<boolean>(false);

    const openEdit = function(){
        setIsEdit(!isEdit);
    }

    const handleMouseLeave = () => {
        setIsEdit(false); // 마우스가 컴포넌트를 벗어날 때 isEdit 상태를 초기값(false)으로 변경
    };

    
    const [editModal, setEditModal] = useState<boolean>(false);

    const openEditmodal = function(){
        setEditModal(!editModal);
    }

    const [editOk, setEditOk] = useState<boolean>(false);

    const openEditOk = function(){
        setEditOk(!editOk);
    }

    const [shareModal, setShareModal] = useState<boolean>(false);

    const openSharemodal = function(){
        setShareModal(!shareModal);
    }

    const [shareOk, setShareOk] = useState<boolean>(false);

    const openShareOk = function(){
        setShareOk(!shareOk);
    }
    
    const [photoLiked2, setPhotoLiked2] = useState<boolean>(false);

    const clickHeart2 = function(id: number){
        setPhotoLiked2(!photoLiked2);
        changeExhibitionLike(id);
    }

    const clickHeart3 = function(id: number){
        setDetailedExhibition({
            ...detailedExhibition!,
            liked: !detailedExhibition!.liked
        })
        changeExhibitionLike(id);
    }

    const [exhibitionDetail, setExhibitionDetail] = useState<boolean>(false);
    const [detailedExhibition, setDetailedExhibition] = useState<exhibitionInterface | null>(null);

    const openExhibitionDetails = (exhibitionId: number) => {
        if(!exhibitionDetail){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
        if(exhibitionId != -1){
            getExhibitionDetail(exhibitionId)
            .then(res=>{
                setDetailedExhibition(res);
            })
        }
        else{
            getMyExhibitionList(exhibitionType)
            .then(res=>{
                setExhibitionArr(res.content);
            })

        }
        setExhibitionDetail(!exhibitionDetail);
    }

    const [finExhibitionDetail, setFinExhibitionDetail] = useState<boolean>(false);

    const openFinExhibitionDetails = function(exhibitionId: number){
        if(!finExhibitionDetail){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
        if(exhibitionId != -1){
            getExhibitionDetail(exhibitionId)
            .then(res=>{
                setDetailedExhibition(res);
            })
        }
        else{
            getMyExhibitionList(exhibitionType)
            .then(res=>{
                setExhibitionArr(res.content);
            })
        }
        setFinExhibitionDetail(!finExhibitionDetail);
    }

    const handleEditClick = () =>{
        navigate('/myPageEdit');
    }

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
        }
        else {
            selectEachPhotoList(accessType, 1)
            .then((res) => {
                if(res){
                    setImgArr(res);
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

    const deleteimg = function(id : number){
        deletePhoto(id)
        .then(() => {
            selectEachPhotoList(accessType, 1)
            .then((res) => {
                if(res){
                    setImgArr(res);
                }
            })
        })
    }

    const tabArr2=[{
        tabTitle:(
            <>
                <div className={styles.mode_style2}>
                    <div className={tabIndex2===0 ? styles.select_tab_style2 : styles.tab_style2}>
                        <p onClick={() => tabClickHandler2(0)}>전시중인 전시회</p>
                    </div>
                </div>

            </>
        ),
        tabCont:(
            exhibitionArr.length !== 0 ?
            <> 
            <div className={styles.profile_card_container}>
                {exhibitionArr &&
                    exhibitionArr.map((exhibition: exhibitionInterface, idx: number) => (
                        <div key={idx + 'g'} className={styles.card} onClick={() => {openExhibitionDetails(exhibition.exhibitionId);}}>
                            {/* 내 전시회 목록은 프로필사진이 없어야 함 */}
                            {/* <img src={Imgs.} alt='프로필' className={styles.card_img}/> */}
                            <img src={exhibition.posterUrl} alt='커버' className={styles.cover}></img>
                            
                            <div className={styles.card_whole_info}>
                                <p className={styles.card_title}>{exhibition.title}</p>
                                <p className={styles.card_date}>{exhibition.startDate} ~ {exhibition.endDate}</p>
                                <div className={styles.photo_card_info}>
                                    {/* 내 전시회 목록은 프로필사진이 없어야 함 */}
                                    {/* <img src={Imgs.url} alt='프로필 사진' className={styles.card_photo_profile}></img> */}
                                    <p className={styles.card_info_txt}>{exhibition.title}</p>
                                    <div className={styles.card_like_container}>
                                        <p className={styles.card_like_txt}>{exhibition.likeCnt}</p>
                                        <img src={`/imgs/${exhibition.liked ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart} onClick={() => {clickHeart2(exhibition.exhibitionId);}}></img>
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
            : <h3 style={{margin: '150px', textAlign:'center', fontFamily: "부크크고딕bold"}}>등록된 전시회가 없습니다...</h3>
        )
    },
    {
        tabTitle:(
            <>
                <div className={styles.mode_style2}>
                    <div className={tabIndex2===1 ? styles.select_tab_style2 : styles.tab_style2}>
                        <p onClick={() => tabClickHandler2(1)}>종료된 전시회</p>
                    </div>
                </div>

            </>
        ),
        tabCont:(
            exhibitionArr.length !== 0 ?
            <> 
            <div className={styles.profile_card_container}>
                {exhibitionArr &&
                    exhibitionArr.map((exhibition: exhibitionInterface, idx) => (
                        <div key={idx + 'g'} className={styles.card} onClick={() => {openFinExhibitionDetails(exhibition.exhibitionId);}}>
                            {/* <img src={Imgs.url} alt='프로필' className={styles.card_img}/> */}
                            <img src={exhibition.posterUrl} alt='커버' className={styles.cover}></img>
                            
                            <div className={styles.card_whole_info}>
                                <p className={styles.card_title}>{exhibition.title}</p>
                                <p className={styles.card_date}>{exhibition.startDate} ~ {exhibition.endDate}</p>
                                <div className={styles.photo_card_info}>
                                    {/* 내 전시회 목록은 프로필 사진이 없어야 함 */}
                                    {/* <img src={Imgs.url} alt='프로필 사진' className={styles.card_photo_profile}></img> */}
                                    <p className={styles.card_info_txt}>{exhibition.title}</p>
                                    <div className={styles.card_like_container}>
                                        <p className={styles.card_like_txt}>{exhibition.likeCnt}</p>
                                        <img src={`/imgs/${photoLiked2 ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart} onClick={() => {clickHeart2(exhibition.exhibitionId);}}></img>
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
            : <h3 style={{margin: '150px', textAlign:'center', fontFamily: "부크크고딕bold"}}>등록된 전시회가 없습니다...</h3>
        )
    },]

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
            imgArr ?
            <> 
                <Masonry 
                breakpointCols={3}
                className={styles.my_masonry_grid}
                columnClassName={styles.my_masonry_grid_column}>
                    
                    {imgArr &&
                        imgArr.map((Imgs: imgInterface, idx) => (
                            <div key={idx + 'g'} className={styles.img_card} onMouseLeave={handleMouseLeave}>
                                <div className={styles.edit_photo_container}>
                                    <div className={styles.sam_container} onClick={openEdit}>
                                        <img src='/imgs/samjum.png' alt='삼점' style={{width : '30px', height : 'auto'}}></img>
                                    </div>

                                    {isEdit && <>
                                        <div className={styles.edit}>
                                            <img src='/imgs/malpoongsun.png' alt='말풍선' style={{width : '100px', height : 'auto', right : '10px', position : 'absolute'}}></img>

                                            <div className={styles.edit_container} onClick={() => {editImgDetail(Imgs.photoId);}}>
                                                <img src='/imgs/pencil.png' alt='연필' className={styles.pencil}></img>
                                                <p>Edit</p>
                                            </div>
                                            
                                            <div className={styles.delete_container} onClick={() => {deleteimg(Imgs.photoId);}}>
                                                <img src='/imgs/trash.png' alt='연필' className={styles.trash}></img>
                                                <p>Delete</p>
                                            </div>
                                        </div>
                                    </>}
                                </div>
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
            : <h3 style={{fontFamily : '부크크고딕bold', textAlign:'center', margin: '100px'}}>등록한 사진이 없습니다..</h3>
        )
    },
    {
        tabTitle:(
            <>
                <div className={styles.mode_style}>
                    <div className={tabIndex===1 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(1)}>Private</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            imgArr ?
            <>  
                <Masonry 
                breakpointCols={3}
                className={styles.my_masonry_grid}
                columnClassName={styles.my_masonry_grid_column}>
                    
                    {imgArr &&
                        imgArr.map((Imgs: imgInterface, idx) => (
                            <div key={idx + 'g'} className={styles.img_card} onMouseLeave={handleMouseLeave}>
                                <div className={styles.edit_photo_container}>
                                    <div className={styles.sam_container} onClick={openEdit}>
                                        <img src='/imgs/samjum.png' alt='삼점' style={{width : '30px', height : 'auto'}}></img>
                                    </div>

                                    {isEdit && <>
                                        <div className={styles.edit}>
                                            <img src='/imgs/malpoongsun.png' alt='말풍선' style={{width : '100px', height : 'auto', right : '10px', position : 'absolute'}}></img>

                                            <div className={styles.edit_container} onClick={() => {editImgDetail(Imgs.photoId);}}>
                                                <img src='/imgs/pencil.png' alt='연필' className={styles.pencil}></img>
                                                <p>Edit</p>
                                            </div>
                                            
                                            <div className={styles.delete_container}  onClick={() => {deleteimg(Imgs.photoId);}}>
                                                <img src='/imgs/trash.png' alt='연필' className={styles.trash}></img>
                                                <p>Delete</p>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                                <img src={Imgs.thumbnailUrl} className={styles.img2}  onClick={() => {openPhotoDetails(Imgs.photoId);}} />
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
            :
            <h3 style={{fontFamily : '부크크고딕bold', textAlign:'center', margin: '100px'}}>등록한 사진이 없습니다..</h3>
        )
    },
    {
        tabTitle:(
            <>
                 <div className={styles.mode_style}>
                    <div className={tabIndex===2 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(2)}>Studio</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            imgArr ?
            <>
                <Masonry 
                breakpointCols={3}
                className={styles.my_masonry_grid}
                columnClassName={styles.my_masonry_grid_column}>
                    {imgArr &&
                        imgArr.map((Imgs: imgInterface, idx) => (
                            <div key={idx + 'g'} className={styles.img_card} onMouseLeave={handleMouseLeave}>
                                <div className={styles.edit_photo_container}>
                                    <div className={styles.sam_container} onClick={openEdit}>
                                        <img src='/imgs/samjum.png' alt='삼점' style={{width : '30px', height : 'auto'}}></img>
                                    </div>

                                    {isEdit && <>
                                        <div className={styles.edit}>
                                            <img src='/imgs/malpoongsun.png' alt='말풍선' style={{width : '100px', height : 'auto', right : '10px', position : 'absolute'}}></img>

                                            <div className={styles.edit_container} onClick={openSharemodal}>
                                                <img src='/imgs/share.png' alt='공유' className={styles.pencil}></img>
                                                <p>Share</p>
                                            </div>
                                            
                                            <div className={styles.delete_container}>
                                                <img src='/imgs/trash.png' alt='연필' className={styles.trash}></img>
                                                <p>Delete</p>
                                            </div>
                                        </div>
                                    </>}
                                </div>
                                <img src={Imgs.thumbnailUrl} className={styles.img2}  onClick={() => {openPhotoDetails(Imgs.photoId);}} />
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
            : <h3 style={{fontFamily : '부크크고딕bold', textAlign:'center', margin: '100px'}}>등록한 사진이 없습니다..</h3>
        )
    },
    {
        tabTitle:(
            <>
                 <div className={styles.mode_style}>
                    <div className={tabIndex===3 ? styles.select_tab_style : styles.tab_style}>
                        <p onClick={() => tabClickHandler(3)}>Exhibition</p>
                    </div>
                </div>
            </>
        ),
        tabCont:(
            <>
            <div className={styles.photo_mode_container2}>
                <div className={styles.mode_tabs}>
                        {tabArr2.map((mode, index)=>{
                            return <div key={index}>{mode.tabTitle}</div>
                        })}
   
                </div>

                <div>
                    {tabArr2[tabIndex2].tabCont}
                </div>
            </div>
            
            </>
        )
    }    
    ]

    
    // const following = function(idx : number, follow : boolean){

    //     let newArr = [...imgArr];

    //     newArr[idx].isLiked = !follow;

    //     setImgArr(newArr);
    // }

    const tabArr3=[{
        tabTitle:(
            <>
                <div className={styles.mode_style2}>
                    <div className={tabIndex3===0 ? styles.select_tab_style3 : styles.tab_style3}>
                        <p onClick={() => tabClickHandler3(0)}>Follower</p>
                    </div>
                </div>

            </>
        ),
        tabCont:(
            profileArr.length !== 0 ?
            <> 
             <div className={styles.profile_card_container2}>
                {profileArr &&
                    profileArr.map((Profiles: profileInterface, idx) => (
                        <div key={idx + 'g'} className={styles.follow_profile}>
                            <img src={Profiles.profileUrl} alt='프로필' className={styles.card_profile}/>
                            <p className={styles.profile_name2}>{Profiles.nickname}</p>
                            {/* <div className={Profiles.liked ? styles.follower_btn_container: styles.no_follower_btn_container} onClick={() => {following(idx, Imgs.liked);}}>
                                <p className={styles.f_b_t}>{Profiles.liked ? `Following` : `Follow`}</p>
                            </div> */}
                        </div>
                ))}
            </div>
            {isLoading && <p style={{width : '100%', textAlign : 'center'}}>Loading...</p>}
            
            <div className="dog-imgs-container"> 
            <div id="observer" style={{ height: "10px" }}></div>
            </div>
            </>
            : <h3 style={{fontFamily : '부크크고딕bold', textAlign:'center', margin: '100px 50px'}}>팔로우한 유저가 없습니다</h3>
        )
    },
    {
        tabTitle:(
            <>
                <div className={styles.mode_style2}>
                    <div className={tabIndex3===1 ? styles.select_tab_style3 : styles.tab_style3}>
                        <p onClick={() => tabClickHandler3(1)} className={styles.tab_txt}>Following</p>
                    </div>
                </div>

            </>
        ),
        tabCont:(
            profileArr.length !== 0 ?
            <> 
             <div className={styles.profile_card_container2}>
                {profileArr &&
                    profileArr.map((Profiles: profileInterface, idx) => (
                        <div key={idx + 'g'} className={styles.follow_profile}>
                            <img src={Profiles.profileUrl} alt='프로필' className={styles.card_profile}/>
                            <p className={styles.profile_name2}>{Profiles.nickname}</p>
                            {/* <div className={Imgs.liked ? styles.follower_btn_container: styles.no_follower_btn_container} onClick={() => {following(idx, Imgs.liked);}}>
                                <p className={styles.f_b_t}>{Imgs.liked ? `Delete` : `Follow`}</p>
                            </div> */}
                        </div>
                ))}
            </div>
            {isLoading && <p style={{width : '100%', textAlign : 'center'}}>Loading...</p>}
            
            <div className="dog-imgs-container"> 
            <div id="observer" style={{ height: "10px" }}></div>
            </div>
            </>
            : <h3 style={{fontFamily : '부크크고딕bold', textAlign:'center', margin: '100px 50px'}}>팔로우한 유저가 없습니다</h3>
        )
    },]


    const [uploadPhoto, setUploadPhoto] = useState<boolean>(false);

    const openUploadModal = function(){
        if(!uploadPhoto){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
        setUploadPhoto(!uploadPhoto);
    }

    const [uploadPhotoDetail, setUploadPhotoDetail] = useState<boolean>(false);

    const openUploadDetailModal = function(){
        if(!uploadPhotoDetail){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
        setUploadPhotoDetail(!uploadPhotoDetail);
    }

    const uploadClickHandler = () => {
        setUploadPhotoDetail(false);
        setIsUploadFinished(true);
    }

    const closeModalHandler = () => {
        openUploadModal();
        setIsUploadFinished(false);
    }
    

    const [inputText, setInputText] = useState(''); // 입력된 텍스트 상태 변수
    const [tags, setTags] = useState<Array<string>>([]); // 태그 배열 상태 변수


    // 입력된 텍스트를 태그 배열에 추가하는 함수
    const addTag = () => {
        console.log(inputText)
        if (inputText.trim() !== '') { // 입력된 텍스트가 공백이 아닌 경우에만 추가
            setTags([...tags, inputText]); // 이전 태그 배열에 새로운 텍스트 추가
            setInputText(''); // 입력된 텍스트 초기화
        }
    }

    const removeTag = (index : number) => {
        const newTags = [...tags]; // 새로운 배열 생성
        newTags.splice(index, 1); // 해당 인덱스의 태그 제거
        setTags(newTags); // 새로운 배열로 상태 업데이트
    };

    const [isExhibition, setIsExhibition] = useState<boolean>(false);

    const openExhibitionModal = function(){
        if(!isExhibition){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
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

    const [isFollowList, setIsFollowList] = useState<boolean>(false);

    const openFollowList = function(){
        if(!isFollowList){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
        setIsFollowList(!isFollowList);
    }

    
    const [mainImg, setMainImg] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const setPreviewImg = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];

        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target && e.target.result) {
                    setMainImg(e.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
        // 이걸로 사진 올려야 함
    };

    const handleUploadPhotoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadPhotoInfo({
            ...uploadPhotoInfo,
            title: e.target.value
        })
        console.log(uploadPhotoInfo)
    }

    const handleUploadPhotoTitle2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhotoDetails({
            ...photoDetails!,
            title: e.target.value
        })
        console.log(uploadPhotoInfo)
    }

    const changeAccessType = (accessType: string) => {
        setUploadPhotoInfo({
            ...uploadPhotoInfo,
            accessType: accessType
        })
    }

    const handleUploadPhoto = () => {
        if(!selectedFile)
        {
            alert('사진을 첨부해주세요.');
            return;
        }
        else if(uploadPhotoInfo.title === ''){
            alert('제목을 입력해주세요.');
            return;
        }
        else if(!uploadPhotoInfo.accessType){
            alert('접근 범위를 지정해주세요.');
            return;
        }
        else{
            const formData = new FormData();
            formData.append('photo', selectedFile);
            const photoInfo = JSON.stringify({
                title: uploadPhotoInfo.title,
                accessType: uploadPhotoInfo.accessType,
                hashtagList: tags
            });
            const blob = new Blob([photoInfo], {type: "application/json"});
            formData.append("photoInfo", blob);
            setIsUploading(true);

            uploadGalleryPhoto(formData)
            .then(res=>{
                if(res){
                    setUploadPhotoInfo({
                        title: '',
                        accessType: 'PUBLIC',
                        hashtag: [],
                    });
                    setTags([]);
                    setMainImg("");
                    setSelectedFile(null);
                }
                else{
                    alert('문제가 발생했습니다..');
                }
            })
            .catch(err=>console.log(err))
            .finally(()=>{
                setIsUploading(false);
            })
            uploadClickHandler();
        }
    }

    const editImgDetail = function(id : number){
        getPhotoDetail(id)
        .then((res) => {
            if(res){
                setPhotoDetails(res);
                setTags(res.hashtagList === undefined ? [] : [...res?.hashtagList])
                openEditmodal();
            }   
        })
    }

    const [editTitle, setEditTitle] = useState<string>('');

    const editOkImgDetail = function(id : number){
        putEditPhoto(id, editTitle, tags, uploadPhotoInfo.accessType)
    }


    return (
        <>
        {isFollowList && (
            <>
            <div className={styles.modal_background}> 
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openFollowList();}}></img>
            <div className={styles.follow_modal_container}>

                <div className={styles.mode_tabs2}>
                    {tabArr3.map((mode, index)=>{
                        return <div key={index}>{mode.tabTitle}</div>
                    })}
                </div>

                <div className={styles.line2}></div>
                <div className={styles.photo_mode_container3}>
                    {tabArr3[tabIndex3].tabCont}
                </div>
                
            </div>
            </div>
            </>
        )}

        {editModal && ( <>
            {editOk
            ? <>
            <div className={styles.modal_background}> 
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openEditOk(); openEditmodal();}}></img>
            <div className={styles.upload_modal_container}>
                <img src='/imgs/check_gif.gif' alt='체크' style={{height : '100px', width : 'auto'}}></img>
                <p className={styles.upload_ok_txt}>정보를 성공적으로 수정하였습니다.</p>
                <p className={styles.go_detail_txt}>당신의 소중하고 특별한 순간을 다른사람들과 함께 빛내보세요. <br></br> 행복은 나눌수록 커진답니다.</p>
                <div  className={styles.go_all_btn_container}>
                    <div className={styles.go_gallery_btn_container} onClick={() => {moveToGallery(); closeModalHandler()}}>
                        <p className={styles.go_txt}>Community</p>
                    </div>
                    <div className={styles.go_mypage_btn_container} onClick={() => {openEditOk(); openEditmodal(); moveToMypage();}}>
                        <p className={styles.go_txt}>MyPage</p>
                    </div>
                </div>
            </div></div>
            </>
            :<>
                <div className={styles.modal_background}>
                <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openEditmodal();}}></img>
                <div  className={styles.edit_detail_modal_container}>
                    <div className={styles.edit_photos_container}>
                        {/* 고쳐야함 */}
                        <img src={photoDetails?.imageUrl} alt='사진' className={styles.edit_photo}></img>
                    </div>
                    <div className={styles.edit_detail_info_container}>
                        <p style={{fontSize : '36px', margin : '10%'}}>Edit</p>
                        <div className={styles.edit_title_container}>
                            <p style={{fontSize : '20px'}}>Title</p>
                            <input className={styles.edit_input_box3} type="text" placeholder="제목을 입력해주세요." value={photoDetails?.title} onChange={(e) => {handleUploadPhotoTitle2(e); setEditTitle(e.target.value);}}></input>
                        </div>
                        <div className={styles.edit_publish_container}>
                            <p style={{fontSize : '20px'}}>Publish</p>
                            <Toggle2 changeAccessType={changeAccessType}/>
                        </div>
                        <div className={styles.edit_tag_container}>
                            <p style={{fontSize : '20px'}}>Tags</p>
                            <div className={styles.edit_tag_input_container}>
                                <input className={styles.edit_input_box4} value={inputText} type="text" placeholder="사진에 태그를 추가해 보세요." onChange={(e) => {setInputText(e.target.value)}}></input>
                                <div className={styles.edit_plus_btn} onClick={() => {addTag();}}>
                                    <img src='/imgs/white_plus.png' alt='플러스' style={{width : '22px', height : '22px'}}></img>
                                </div>
                
                            </div>
                            <div className={styles.edit_tags_container}>
                                    {tags.map((tag, index)=>{
                                        return <div key={index + 'n'} className={`${styles.edit_tag} ${index %2 != 0 ? styles.float : ''}`}>{tag.length > 5 ? '# ' + tag.slice(0, 5) + '..' :  '# ' + tag}
                                            <img src='/imgs/black_x.png' alt='x' style={{height : '13px', width : 'auto', position : 'absolute', right : '7px', cursor : 'pointer'}} onClick={() => {removeTag(index);}}></img>
                                        </div>

                                    })}
                            </div>
                            {/* 추가함 */}
                            <div className={styles.edit_btn_container} onClick={() => {openEditOk(); editOkImgDetail(photoDetails!.photoId);}}>
                                <p className={styles.edit_upload_txt3}>Save</p>
                            </div>
                        </div>
                    </div>
                </div></div>
            </>
            }
            </>
        )}

        {shareModal && ( <>
            {shareOk
            ? <>
            <div className={styles.modal_background}>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openShareOk(); openSharemodal();}}></img>
            <div className={styles.upload_modal_container}>
                <img src='/imgs/check_gif.gif' alt='체크' style={{height : '100px', width : 'auto'}}></img>
                <p className={styles.upload_ok_txt}>게시물을 성공적으로 업로드하였습니다.</p>
                <p className={styles.go_detail_txt}>질문은 배움의 첫 걸음입니다.<br></br>다양한 질문을 통해 사진에 한 걸음 더 가까워져보세요.</p>
                <div  className={styles.go_all_btn_container}>
                    <div className={styles.go_gallery_btn_container} onClick={() => {moveToGallery(); closeModalHandler();}}>
                        <p className={styles.go_txt}>Q&A</p>
                    </div>
                    <div className={styles.go_mypage_btn_container} onClick={() => {openSharemodal(); openShareOk(); moveToMypage();}}>
                        <p className={styles.go_txt}>MyPage</p>
                    </div>
                </div>
            </div></div>
            </>
            :<>
                <div className={styles.modal_background}>
                <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openSharemodal();}}></img>
                <div  className={styles.edit_detail_modal_container}>
                    <div className={styles.edit_photos_container}>
                        {/* 고쳐야함 */}
                        <img src={'photoDetailInfo.url'} alt='사진' className={styles.edit_photo}></img>
                    </div>
                    <div className={styles.edit_detail_info_container}>
                        <p style={{fontSize : '36px', margin : '10%'}}>Share</p>
                        <div className={styles.share_title_container}>
                            <p style={{fontSize : '20px'}}>Title</p>
                            <input className={styles.edit_input_box3} type="text" placeholder="제목을 입력해주세요." ></input>
                        </div>
                        <div className={styles.share_description_container}>
                            <p style={{fontSize : '20px'}}>Describe</p>
                            <textarea className={styles.share_description_input_box} placeholder="질문 내용을 입력해주세요." ></textarea>
                        </div>

                        <div className={styles.edit_btn_container} onClick={() => {openShareOk();}}>
                            <p className={styles.edit_upload_txt3}>Save</p>
                        </div>
                    </div>
                </div></div>
            </>
            }
            </>
        )}

        {isExhibition && (
            <>
            <div className={styles.modal_background}> 
            <img src='/imgs/x.png' alt='x' className={styles.modal_x}  onClick={() => {openExhibitionModal();}}></img>
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
                                        <div key={index + 'o'} className={styles.upload_photos_list} onClick={() => {handleIsImg(image.thumbnailUrl);}}>
                                            <div className={`${styles.upload_photos_list_overlay} ${selectedImageIndex === index && styles.upload_photos_list_overlay_clicked}`} onClick={() => {handleImageClick(index);}}>
                                                {selectedImageIndex === index && <img src='/imgs/check_white.png'></img>}
                                            </div>
                                            {/* 고쳐야함 */}
                                            <img src={'image.url'} alt='이미지' className={styles.photos_list_upimg}></img>
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
                            {/* <Calendar handleDateChange={handleDateChange} /> */}
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
            </div></div>
            </>
        )}

            {imgDetail && (
            <>
                <div className={styles.modal_background}>
                <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openPhotoDetails(photoDetails?.photoId);}}></img>
                <div className={styles.photo_modal_container} >
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
                                <input className={styles.input_box2} type="text" placeholder="댓글" onChange={(e) => setMyComment(e.target.value)} value={myComment}></input>
                                <img className={styles.send_icon} src="/imgs/send_icon.png" alt='보내기' onClick={() => {sendClick(photoDetails?.photoId);}}></img>
                            </div>
                        </div>  
                    </div>
                </div></div>
            </>
        )}

        {uploadPhoto && (
            <>
                {uploadPhotoDetail 
                ? <>
                <div className={styles.modal_background}>
                <img src='/imgs/x.png' alt='x'  className={styles.modal_x} onClick={() => {openUploadDetailModal(); openUploadModal();}}></img>
                <div  className={styles.upload_detail_modal_container}>
                    {
                        isUploading
                        ? <h1>업로드중...</h1>
                        : <>
                        <div className={styles.upload_photos_container}>
                        {mainImg == ''
                        ? <>
                            <div style={{width : '100%', height : '650px', objectFit : 'contain', background : 'black', color : 'white', display : 'flex', alignItems : 'center', justifyContent : 'center'}}>
                                <p className={styles.input_t}>등록된 사진이 없습니다. <br></br> 당신의 사진을 업로드 해보세요. </p>
                            </div>
                        </>
                        :<>
                            <img src={mainImg} style={{width : '100%', height : '650px', objectFit : 'contain', background : 'black', color : 'white'}} />
                        </>}
                        <div className={styles.input_container}>
                            {selectedFile && (
                                <p className={styles.input_name}>사진 이름 : {selectedFile.name}</p>
                            )}
                            <label className={styles.input_file_btn} htmlFor="image">
                                <p className={styles.input_txt}>사진 선택</p>
                                <img src='/imgs/white_plus.png' style={{height : '18px', width : 'auto', marginLeft : '10px'}}></img>
                            </label>
                            <input type="file" id="image" accept="image/*" style = {{display : 'none'}} onChange={setPreviewImg} />
                        </div>
                    </div>
                    <div className={styles.edit_detail_info_container}>
                        <p style={{fontSize : '36px', margin : '10%'}}>Detail</p>
                        <div className={styles.edit_title_container}>
                            <p style={{fontSize : '20px'}}>Title</p>
                            <input className={styles.edit_input_box3} type="text" placeholder="제목을 입력해주세요." value={uploadPhotoInfo.title} onChange={handleUploadPhotoTitle}></input>
                        </div>
                        <div className={styles.edit_publish_container}>
                            <p style={{fontSize : '20px'}}>Publish</p>
                            <Toggle2 changeAccessType={changeAccessType}/>
                        </div>
                        <div className={styles.edit_tag_container}>
                            <p style={{fontSize : '20px'}}>Tags</p>
                            <div className={styles.edit_tag_input_container}>
                                <input className={styles.edit_input_box4} value={inputText} type="text" placeholder="사진에 태그를 추가해 보세요." onChange={(e) => {setInputText(e.target.value)}}></input>
                                <div className={styles.edit_plus_btn} onClick={() => {addTag();}}>
                                    <img src='/imgs/white_plus.png' alt='플러스' style={{width : '22px', height : '22px'}}></img>
                                </div>
                
                            </div>
                            <div className={styles.edit_tags_container}>
                                    {tags.map((tag, index)=>{
                                        return <div key={index + 'n'} className={`${styles.edit_tag} ${index %2 != 0 ? styles.float : ''}`}>{tag.length > 5 ? '# ' + tag.slice(0, 5) + '..' :  '# ' + tag}
                                            <img src='/imgs/black_x.png' alt='x' style={{height : '13px', width : 'auto', position : 'absolute', right : '7px', cursor : 'pointer'}} onClick={() => {removeTag(index);}}></img>
                                        </div>

                                    })}
                            </div>
                            <div className={styles.edit_btn_container} onClick={handleUploadPhoto}>
                                <p className={styles.upload_txt3} style={{color : 'white'}}>Upload</p>
                                <img src='/imgs/upload_icon.png' alt='아이콘' style={{height : '45px', width : 'auto', marginLeft : '10%'}}></img>
                            </div>
                        </div>
                    </div>
                        </>
                    }
                </div></div>
                </> 
                : // 이 안에 삼항 연산자가 하나 더 있어야 함
                (
                    isUploadFinished 
                    ?
                    <>
                        <div className={styles.modal_background}>
                        <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={closeModalHandler}></img>
                        <div className={styles.upload_modal_container} >
                            <img src='/imgs/check_gif.gif' alt='체크' style={{height : '100px', width : 'auto'}}></img>
                            <p className={styles.upload_ok_txt}>사진을 성공적으로 업로드하였습니다.</p>
                            <p className={styles.go_detail_txt}>당신의 소중하고 특별한 순간을 다른사람들과 함께 빛내보세요. <br></br> 행복은 나눌수록 커진답니다.</p>
                            <div  className={styles.go_all_btn_container}>
                                <div className={styles.go_gallery_btn_container} onClick={closeModalHandler}>
                                    <p className={styles.go_txt} onClick={() => {moveToGallery();}}>Community</p>
                                </div>
                                <div className={styles.go_mypage_btn_container} onClick={closeModalHandler}>
                                    <p className={styles.go_txt}>MyPage</p>
                                </div>
                            </div>
                        </div></div>
                    </>
                    :
                    <>
                        <div className={styles.modal_background}>
                        <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openUploadModal();}}></img>
                        <div  className={styles.upload_modal_container} >
                            <p className={styles.upload_modal_title}>당신의 사진을 업로드해 보세요.</p>
                            <div className={styles.go_upload_btn_container} onClick={() => {openUploadDetailModal();}}>
                                <p className={styles.upload_txt}>업로드할 사진 선택하기</p>
                                <img src='/imgs/upload_icon.png' alt='업로드 아이콘' className={styles.upload_icon}></img>
                            </div>
                            <p className={styles.upload_txt2}>*최대 200mb / JPEG,PNG만 허용</p>
                        </div>
                        </div>
                    </>
                )
                
            }
                
            </>
        )}

        {exhibitionDetail && (
            <>
            <div className={styles.modal_background}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openExhibitionDetails(-1);}}></img>
            <div className={styles.open_exhibition_modal_container}>
            <img src={`/imgs/${detailedExhibition?.liked ? 'heart' : 'empty_heart2'}.png`} alt='하트' className={styles.exhibition_heart} onClick={() => {clickHeart3(detailedExhibition!.exhibitionId);}}></img>
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
                            <p style={{fontFamily : '부크크고딕bold'}}>{detailedExhibition?.description}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.exhibition_open_btn}>
                    <p className={styles.open_btn_txt}>Enter</p>
                </div>
            </div>
            </>
        )}

        {finExhibitionDetail && (
            <>
            <div className={styles.modal_background}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openFinExhibitionDetails(-1);}}></img>
            <div className={styles.open_exhibition_modal_container}>
            <img src={`/imgs/${detailedExhibition?.liked ? 'heart' : 'empty_heart2'}.png`} alt='하트' className={styles.exhibition_heart} onClick={() => {clickHeart3(detailedExhibition!.exhibitionId);}}></img>
                <p className={styles.open_exhibition_title} style={{marginBottom : '20px'}}>Exhibition Info</p>
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
                            <p style={{fontFamily : '부크크고딕bold'}}>{detailedExhibition?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}


        <div className={styles.main_container}>
            <div className={styles.mypage_info_container} style={{backgroundImage : `url(${memberInfo.backgroundUrl})`, backgroundSize : 'cover', height : '350px', position : 'relative', backgroundPosition : 'center'}}>
                <div className={styles.info_container}>
                    <img src={memberInfo.profileUrl} alt='프로필' className={styles.profile}></img>
                    <div className={styles.info}>
                        <div className={styles.edit_btn} onClick={handleEditClick}>
                            <p>Edit</p>
                        </div>
                        <p>{memberInfo.nickname}</p>
                        <p style={{fontSize : '16px' , fontFamily : "부크크명조bold" }}>Camera using by {memberInfo.useYear} years</p>
                        <p style={{fontSize : '16px' , fontFamily : "부크크명조bold" , cursor : 'pointer' }} onClick={() => {openFollowList();}}>{memberInfo.followerCnt} Follower / {memberInfo.followingCnt} Following</p>
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
                        <div className={styles.btn_photo_container}>
                            {/* <div className={styles.exhibition_btn} onClick={() => {openExhibitionModal();}}>
                                <p>전시회 개최</p>
                            </div>    */}
                            <div className={styles.photo_btn} onClick={() => {openUploadModal();}}>
                                <p>사진 업로드</p>
                            </div>   
                        </div>
   
                </div>

                <div>
                    {tabArr[tabIndex].tabCont}
                </div>
            </div>
        </div>
        </>
    );
};

export default MyPage;
