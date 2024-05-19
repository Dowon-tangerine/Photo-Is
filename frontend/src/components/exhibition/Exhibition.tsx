import React, { useState, useEffect } from 'react';
import styles from "./css/Exhibition.module.css";
import { FaAngleDown } from 'react-icons/fa';
import Calendar from '../mypage/Calendar';
import { getExhibitionList, getExhibitionDetail, postExhibition } from '../../apis/exhibitionApi';
import { changeExhibitionLike } from '../../apis/otherMemberApi';
import { selectAllPhotoList } from '../../apis/photoApi';
import { dateFormatter } from '../utils/changeDateFormat';
import { useNavigate } from 'react-router-dom';

interface imgInterface {
    photoId: number;
    thumbnailUrl: string;
    likeCnt: number,
    liked: boolean,
    title: string,
    imageUrl: string,
  }
interface exhibitionInterface {
    exhibitionId: number,
    title: string,
    posterUrl: string,
    memberId: number,
    startDate: string,
    endDate: string,
    likeCnt: number,
    liked: boolean,
    nickname: string,
    profileUrl: string,
}
interface exhibitionDetailInterface {
    exhibitionId: number,
    title: string,
    posterUrl: string,
    memberId: number,
    startDate: string,
    endDate: string,
    likeCnt: number,
    liked: boolean,
    nickname: string,
    profileUrl: string,
    description: string,
}

interface exhibitionPhotoInterface {
    photoId: number,
    imageUrl: string,
}

interface photoInterface {
    photoId: number,
    number: number
}

interface exhibitionDetailDataInterface {
    posterId: number,
    title: string | undefined,
    description: string | undefined,
    endDate: string | undefined,
    photoList: Array<photoInterface>
}
const Exhibition: React.FC = () => {

    const [sortType, setSortType] = useState<String>("최신");
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);

    const [isExhibition, setIsExhibition] = useState<boolean>(false);
    const [photoPage, setPhotoPage] = useState<number>(1);
    const navigate = useNavigate();

    setPhotoPage
    const openExhibitionModal = function(){
        if(!isExhibition){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }
        setIsExhibition(!isExhibition);
        setIsRotatePhotos(false);
    }

    const [plusImg, setPlusImg] = useState<boolean>(false);

    const openImgList = function(){
        if(!plusImg){
            selectAllPhotoList(photoPage)
            .then(res=>{
                console.log(res)
                setImgArr(res);
            })
        }
        setPlusImg(!plusImg)
        setSelectedImageIndex(null);
    }

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null); // 선택된 이미지의 인덱스

    const handleImageClick = (index: number) => {
        setSelectedImageIndex(index); // 이미지 클릭 시 선택된 이미지의 인덱스를 설정
    };

    const [selectedImg, setSelectedImg] = useState<string>('');
    const [posterId, setPosterId] = useState<number>(-1);

    const handleSelectedImg = function(url : string){
        setSelectedImg(url);
    }

    const [isImg, setIsImg] = useState<string>('');

    const handleIsImg = function(url : string){
        setIsImg(url);
    }

    const [exhibitionDetail, setExhibitionDetail] = useState<exhibitionDetailInterface | null>(null);

    const [exhibitionDetailModalOpened, setExhibitionDetailModalOpened] = useState<boolean>(false);

    const openExhibitionDetailModalOpeneds = function(exhibitionId: number | undefined){
        if(!exhibitionDetailModalOpened){
            document.body.style.overflow = 'hidden';
            // 여기서 전시회정보 요청
            getExhibitionDetail(exhibitionId!)
            .then(res=>{
                setExhibitionDetail(res);
            })
            setExhibitionDetailModalOpened(true);
        }
        else{
            document.body.style.overflow = 'auto';
            requestExhibitionList();
        }
        setExhibitionDetailModalOpened(!exhibitionDetailModalOpened);
        requestExhibitionList();
    }



    const openSortTypeList = function(){
        setSortTypeList(!sortTypeList);
        setIsRotated2(!isRotated2);
    }

    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [imgArr, setImgArr] = useState<imgInterface[]>([]);

    const [exhibitionList, setExhibitionList] = useState<Array<exhibitionInterface>>([]);
    const [followExhibitionList, setFollowExhibitionList] = useState<Array<exhibitionInterface>>([]);

    // 전시회 목록 조회
    // 페이지네이션
    const requestExhibitionList = ()=>{
      getExhibitionList()
      .then(res=>{
        if(res){
            setExhibitionList(res.exhibition.reverse());
            setFollowExhibitionList(res.followExhibition);
        }
      });
    }

    useEffect(() => {
      requestExhibitionList();
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

    // 페이지네이션
    const fetchData = async () => {
        setIsLoading(true);
        requestExhibitionList();
        setIsLoading(false);
    };

    const changeExhibitionDetailLikeHandler = ()=>{
        setExhibitionDetail({
            ...exhibitionDetail!,
            liked: !exhibitionDetail?.liked
        })
        changeExhibitionLike(exhibitionDetail!.exhibitionId);
    }

    const [animate, setAnimate] = useState(true);
    const onStop = () => setAnimate(false);
    const onRun = () => setAnimate(true);

    const [exhibitionDetailData, setExhibitionDetailData] = useState<exhibitionDetailDataInterface>();

    const handleDateChange = (endDate: Date | null) => {
        const end = dateFormatter.changeDateFormatToLocalDate(endDate)

        setExhibitionDetailData({
            ...exhibitionDetailData!,
            endDate: end!
        })
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExhibitionDetailData({
            ...exhibitionDetailData!,
            title: e.target.value
        })
    }

    const handleDesciptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setExhibitionDetailData({
            ...exhibitionDetailData!,
            description: e.target.value
        })
    }

    const [isRotatePhotos, setIsRotatePhotos] = useState<boolean>(false);

    const changeMakeExhibitionStatus = () => {
        if(exhibitionDetailData?.description === undefined 
            || exhibitionDetailData?.title=== undefined 
            || posterId===-1 
            || exhibitionDetailData?.endDate === undefined){
            alert('모든 내용을 입력해주세요.');
            console.log(exhibitionDetailData?.endDate)
        }
        else{
            setIsRotatePhotos(!isRotatePhotos);
        }
    }

    const [exhibitionPhotoList, setExhibitionPhotoList] = useState<Array<exhibitionPhotoInterface>>([
        {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, 
        {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''},
        {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''},
    ]);

    const [selectedId, setSelectedId] = useState<number>(-1);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');

    const pickPhoto = () => {
        const tmp = exhibitionPhotoList;
        tmp[selectedPhotoNumber] = {photoId: selectedId, imageUrl: selectedImageUrl};
        setExhibitionPhotoList([
            ...tmp,
        ])
        openImgList();
    }

    const [selectedPhotoNumber, setSelectedPhotoNumber] = useState<number>(0);
    const makeExhibition = () =>{
        const photoIdxInfo: Array<photoInterface> = [];
        exhibitionPhotoList.forEach((data, i) =>{
            if(data.photoId >= 0) {
                photoIdxInfo.push({photoId: data.photoId, number: i})
            }
        })
        if(photoIdxInfo.length === 0){
            alert('전시회 개회에는 최소 한 개 이상의 사진이 필요합니다.');
        }
        else{
            postExhibition({
                posterId: posterId,
                title: exhibitionDetailData!.title,
                description: exhibitionDetailData!.description,
                endDate: exhibitionDetailData?.endDate,
                photoList: photoIdxInfo
            })
            .then(()=>{
                alert('성공적으로 전시회를 개회했습니다!')
                requestExhibitionList();
                setIsRotatePhotos(!isRotatePhotos);
                openExhibitionModal();
                setExhibitionDetailData(undefined);
                setExhibitionPhotoList([
                    {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, 
                    {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''},
                    {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''}, {photoId: -1, imageUrl: ''},
                ]);
                setSelectedImg('');
            })
        }
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const goToExhibitionArea = (exhibitionId: number) => {
        navigate('/exhibition-area', {state: {exhibitionId: exhibitionId}});
    }

    return (
        <>
            {isExhibition && (
            <>
            <div className={styles.modal_background} style={{paddingTop: '80px'}}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openExhibitionModal();}}></img>
            <div className={styles.open_exhibition_modal_container}>
                <p className={styles.open_exhibition_title}>Exhibition Info</p>
                <div className={styles.exhibition_info}>
                    {
                      !isRotatePhotos ?
                        <>
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
                                            <div key={index + 'o'} className={styles.upload_photos_list} onClick={() => {handleIsImg(image.thumbnailUrl); setPosterId(image.photoId)}}>
                                                <div className={`${styles.upload_photos_list_overlay} ${selectedImageIndex === index && styles.upload_photos_list_overlay_clicked}`} onClick={() => {handleImageClick(index);}}>
                                                    {selectedImageIndex === index && <img src='/imgs/check_white.png'></img>}
                                                </div>
                                                <img src={image.thumbnailUrl} alt='이미지' className={styles.photos_list_upimg}></img>
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
                                <input className={styles.open_input_box} type="text" placeholder="제목을 입력해주세요." value={exhibitionDetailData != null ? exhibitionDetailData.title : ''} onChange={handleTitleChange}></input>
                            </div>
                            <div className={styles.open_title_container}>
                                <p style={{fontSize : '24px'}}>Date</p>
                                <Calendar handleDateChange={handleDateChange}/>
                            </div>
                            <div className={styles.open_title_container}>
                                <p style={{fontSize : '24px'}}>Description</p>
                                <textarea className={styles.open_description_input_box} placeholder="전시회를 간단히 소개해주세요." onChange={handleDesciptionChange}></textarea>
                            </div>
                        </div>
                    </>
                    : 
                    // 전시회 사진 배치 부분
                    <div className={styles.exhibition_map} key={'unique'}>
                        {plusImg && (
                            <div>
                            <div className={styles.modal_background}> </div>
                            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openImgList();}}></img>
                            <div className={styles.open_photo_list_container}>
                                <div className={styles.upload_photos_list_container}>
                                    {imgArr.map((image, index)=>{
                                        return( 
                                            <div key={index + 'z'} className={styles.upload_photos_list} onClick={() => {handleIsImg(image.thumbnailUrl); setSelectedId(image.photoId); setSelectedImageUrl(image.imageUrl);}}>
                                                <div className={`${styles.upload_photos_list_overlay} ${selectedImageIndex === index && styles.upload_photos_list_overlay_clicked}`} onClick={() => {handleImageClick(index);}}>
                                                    {selectedImageIndex === index && <img src='/imgs/check_white.png'></img>}
                                                </div>
                                                <img src={image.thumbnailUrl} alt='이미지' className={styles.photos_list_upimg}></img>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className={styles.selected_img_ok} onClick={() => {pickPhoto();}}>
                                    <p>Select</p>
                                </div>
                            </div>
                            </div>
                        )}
                        {/* 1,2,3번 그림 배치 */}
                        <div className={`${styles.exhibition_default} ${styles.main_photos}`}>
                            {
                                [0, 1, 2].map((i) =>{
                                    return(
                                        <div className={styles.main_photo} 
                                             key={i+'a'}
                                             onClick={() =>{openImgList(); setSelectedPhotoNumber(i)}} 
                                             style={{backgroundImage: `url(${exhibitionPhotoList[i].imageUrl})`}}>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        {/* 4,5번 */}
                        {
                            [0, 1, 2].map((index) => {
                                return(
                                    <div className={`${styles.exhibition_default} ${styles.sub_photos}`} key={index+'tq'}>
                                        {
                                            [3+2*(index), 4+2*(index)].map((i) => {
                                                return(
                                                    <div className={styles.sub_photo_box} key={i+'b'}>
                                                        <div className={styles.sub_photo}>
                                                            <div className={styles.photo} 
                                                                onClick={() =>{openImgList(); setSelectedPhotoNumber(i)}} 
                                                                style={{backgroundImage: `url(${exhibitionPhotoList[i].imageUrl})`}}>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        

                    </div>
                    }
                </div>
                  {
                    !isRotatePhotos
                    ?
                    <div className={styles.exhibition_open_btn} onClick={changeMakeExhibitionStatus}>
                        <p className={styles.open_btn_txt}>Next</p>
                    </div>
                    :
                    <div className={styles.exhibition_open_btn} onClick={makeExhibition}>
                        <p className={styles.open_btn_txt}>Open</p>
                    </div>
                  }
            </div>
            </>
        )}

        {exhibitionDetailModalOpened && (
            <>
            <div className={styles.modal_background} style={{paddingTop: '80px'}}> </div>
            <img src='/imgs/x.png' alt='x' className={styles.modal_x} onClick={() => {openExhibitionDetailModalOpeneds(-1);}}></img>
            <div className={styles.open_exhibition_modal_container}>
            <img src={`/imgs/${exhibitionDetail?.liked ? 'heart' : 'empty_heart2'}.png`} alt='하트' className={styles.exhibition_heart} onClick={changeExhibitionDetailLikeHandler}></img>
                <p className={styles.open_exhibition_title}>Exhibition Info</p>
                <div className={styles.exhibition_info}>
                    <div className={styles.exhibition_photo_intro_container2}>
                        <img src={exhibitionDetail?.posterUrl} alt='썸네일' className={styles.is_img}></img>
                    </div>

                    <div className={styles.exhibition_photo_info_container2}>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Title</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{exhibitionDetail?.title}</p>
                        </div>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Date</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{exhibitionDetail?.startDate} ~ {exhibitionDetail?.endDate}</p>
                        </div>
                        <div className={styles.open_title_container2}>
                            <p style={{fontSize : '28px'}}>Description</p>
                            <p style={{fontFamily : '부크크고딕bold'}}>{exhibitionDetail?.description}</p>
                        </div>
                    </div>
                </div>
                {
                    exhibitionDetail?.endDate && new Date(exhibitionDetail.endDate) >= today &&
                    <div className={styles.exhibition_open_btn} onClick={() => {goToExhibitionArea(exhibitionDetail!.exhibitionId)}}>
                        <p className={styles.open_btn_txt}>Enter</p>
                    </div>
                }
            </div>
            </>
        )}
        

        <div className={styles.main_container} style={{paddingTop: '80px'}}>
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
                           {followExhibitionList.map((followExhibition, i) => (
                                <li key={followExhibition.exhibitionId}  onClick={() => {openExhibitionDetailModalOpeneds(-1);}}>
                                    <div className={styles.item}>

                                    <div key={i + 'g'} className={styles.card}>
                                        {
                                            new Date(followExhibition.endDate) < today &&
                                            <div className={styles.finished}>
                                                <p>종료된 전시회입니다!</p>
                                            </div>
                                        }
                                        <img src={followExhibition.posterUrl} alt='프로필' className={styles.card_img}/>
                                        <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                                        
                                        <div className={styles.card_whole_info}>
                                            <p className={styles.card_title}>{followExhibition.title}</p>
                                            <p className={styles.card_date}>{followExhibition.startDate} ~ {followExhibition.endDate}</p>
                                            <div className={styles.photo_card_info2}>
                                                <img src={followExhibition.profileUrl} alt='프로필 사진' className={styles.card_photo_profile2} style={{width : '40px', height : '40px', borderRadius : '50px', objectFit : 'cover'}}></img>
                                                <p className={styles.card_info_txt}>{followExhibition.nickname}</p>
                                                <div className={styles.card_like_container}>
                                                    <p className={styles.card_like_txt}>{followExhibition.likeCnt}</p>
                                                    <img src={`/imgs/${followExhibition.liked ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart}></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </div>
                                </li>
                            ))}
                        </div>
                        <div
                            className={styles.slide + " " +  styles.clone + " " + (
                                animate ? "" : styles.stop
                            )}
                        >
                            {followExhibitionList.length > 5 && followExhibitionList.map((followExhibition, i) => (
                                <li key={followExhibition.exhibitionId} onClick={() => {openExhibitionDetailModalOpeneds(followExhibition.exhibitionId);}}>
                                    <div className={styles.item}>
                                        
                                    <div key={i + 'g'} className={styles.card}>
                                        {
                                            new Date(followExhibition.endDate) < today &&
                                            <div className={styles.finished}>
                                                <p>종료된 전시회입니다!</p>
                                            </div>
                                        }
                                        <img src={followExhibition.posterUrl} alt='프로필' className={styles.card_img}/>
                                        <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                                        
                                        <div className={styles.card_whole_info}>
                                            <p className={styles.card_title}>{followExhibition.title}</p>
                                            <p className={styles.card_date}>{followExhibition.startDate} ~ {followExhibition.endDate}</p>
                                            <div className={styles.photo_card_info2}>
                                                <img src={followExhibition.profileUrl} alt='프로필 사진' className={styles.card_photo_profile2}  style={{width : '40px', height : '40px', borderRadius : '50px', objectFit : 'cover'}}></img>
                                                <p className={styles.card_info_txt}>{followExhibition.nickname}</p>
                                                <div className={styles.card_like_container}>
                                                    <p className={styles.card_like_txt}>{followExhibition.likeCnt}</p>
                                                    <img src={`/imgs/${followExhibition.liked ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart}></img>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    </div>
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
                {exhibitionList &&
                    exhibitionList.map((exhibition: exhibitionInterface, idx) => (
                        <div key={idx + 'g'} className={styles.card} onClick={() => {openExhibitionDetailModalOpeneds(exhibition.exhibitionId);}}>
                                {new Date(exhibition.endDate) < today &&
                                    <div className={styles.finished}>
                                        <p>종료된 전시회입니다!</p>
                                    </div>
                                }
                            <img src={exhibition.posterUrl} alt='프로필' className={styles.card_img}/>
                            <img src='/imgs/black_cover.png' alt='커버' className={styles.cover}></img>
                            
                            <div className={styles.card_whole_info}>
                                <p className={styles.card_title}>{exhibition.title}</p>
                                <p className={styles.card_date}>{exhibition.startDate} ~ {exhibition.endDate}</p>
                                <div className={styles.photo_card_info}>
                                    <img src={exhibition.profileUrl} alt='프로필 사진' className={styles.card_photo_profile}></img>
                                    <p className={styles.card_info_txt}>{exhibition.nickname}</p>
                                    <div className={styles.card_like_container}>
                                        <p className={styles.card_like_txt}>{exhibition.likeCnt}</p>
                                        <img src={`/imgs/${exhibition.liked ? 'heart' : 'empty_heart'}.png`} alt='하트' className={styles.card_heart}></img>
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
