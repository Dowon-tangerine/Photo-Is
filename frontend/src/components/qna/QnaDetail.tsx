import React, { useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from "./css/QnaDetail.module.css";
import MapComponent from '../gallery/MapComponent';
import { getQnaDetail, getComment, postComment } from '../../apis/qnaApi';

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
    content : string,
    photoUrl : string,
    createdAt : string,
    accessType : string,
    metadata: metadataInterface,
    category: string,
}

interface commentInterface{
    commentId: number,
    nickname: string,
    profileUrl: string,
    comment: string,
    createdAt: string,
}
  
const QnaDetail: React.FC = () => {

    const navigate = useNavigate();
    
    const moveToqna = function(){
        navigate("/community/qna")
    }

    const location = useLocation();
    const qnaId = location.state ? location.state.id : ""
    const [photoDetail, setPhotoDetail] = useState<photoDetailInterface | null>();
    const [commentList, setCommentList] = useState<Array<commentInterface>>();
    const [postComments, setPostComments] = useState<string>("");

    useEffect(() => {
        updateQnaInfo();
    }, []);
    const updateQnaInfo = () => {
        getQnaDetail(qnaId)
        .then((res) => {
            setPhotoDetail(res);
        })
        getComment(qnaId)
        .then((res) => {
            setCommentList(res);
        })
    }

    const sendComment = function(){
        if(postComments){
            postComment(qnaId, postComments)
            .then((res) => {
                setCommentList(res);
                updateQnaInfo();
                setPostComments('');
            })
        }
        else{
            alert("내용을 입력하세요");
        }
    }

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    
      const todayString = getTodayDateString();

    return (
        <>
        

        <div className={styles.main_container} style={{marginTop: '80px'}}>
            <div className={styles.page_intro} onClick={() => {moveToqna();}}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-QnA-</p>
            </div>

            <div className={styles.article_title_container}>
                <p style={{fontSize : '32px'}}>{photoDetail?.category}</p>

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
                            <p>Q. {photoDetail?.title}</p>
                        </div>
                        <div className={styles.content_container}>
                            <p>{photoDetail?.content}</p>
                        </div>
                        <div className={styles.photo_container}>
                            {photoDetail?.photoUrl &&
                            <img src={photoDetail?.photoUrl} alt='질문 사진' className={styles.qna_photo}></img>
                            }
                        </div>
                    </div>
                    <div className={styles.qna_comment_container}>
                        <p style={{fontFamily: '부크크고딕bold', fontSize: '28px'}}>Comments</p>
                        <div className={styles.comment_list_container}>
                        {(commentList === undefined || commentList.length === 0)
                            ? <>
                                <p>등록된 댓글이 없습니다.</p>
                            </>
                            :<>
                            {commentList.map((item) => (
                                <>
                                    <div className={styles.one_comment_container}>
                                        <img src={item.profileUrl} alt='프로필 사진' className={styles.comment_profile_img}></img>
                                        <div className={styles.comment_content_container}>
                                            <p style={{fontFamily: "부크크고딕bold"}}>{item.nickname}</p>
                                            <p style={{marginTop: '-15px'}}>{item.comment}</p>
                                            <p style={{marginTop: '-10px', fontSize: '12px', color: 'gray'}}>
                                            {
                                                item.createdAt.slice(0, 10) === todayString ? (
                                                item.createdAt.slice(11, 19)
                                                ) : (
                                                <>
                                                    {item.createdAt.slice(0, 10)}<br />
                                                </>
                                            )}    
                                            </p>
                                        </div>
                                    </div>
                                </>
                            ))
                            }
                            </>}
                        </div>
                        <div className={styles.comment_send_container}>
                            <p style={{fontFamily: "부크크고딕bold"}}>{localStorage.getItem('nickname')}</p>
                            <textarea className={styles.send} value={postComments} onChange={(e) => {setPostComments(e.target.value)}}></textarea>
                            <div className={styles.send_btn} onClick={sendComment}>
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
                            {
                                photoDetail?.metadata
                                ?
                                <>
                                 <div style={{width : '100%'}}>
                                    <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>카메라 모델 : </p>
                                    <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetail?.metadata === null ? "" : photoDetail?.metadata.cameraModel}</p>
                                </div>
                                <div style={{width : '100%'}}>
                                    <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>렌즈 모델 : </p>
                                    <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetail?.metadata === null ? "" : photoDetail?.metadata.lensModel}</p>
                                </div>
                                <div style={{width : '100%'}}>
                                    <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>조리개 / F : </p>
                                    <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetail === null ? "" : photoDetail?.metadata.aperture}</p>
                                </div>
                                <div style={{width : '100%'}}>
                                    <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>초점 거리 : </p>
                                    <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetail === null ? "" : photoDetail?.metadata.focusDistance}</p>
                                </div>
                                <div style={{width : '100%'}}>
                                    <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>셔터 스피드 / SS : </p>
                                    <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetail === null ? "" : photoDetail?.metadata.shutterSpeed}</p>
                                </div>
                                <div style={{width : '100%'}}>
                                    <p style={{float : 'left', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>심도 / ISO : </p>
                                    <p style={{float : 'right', margin : '2%', fontFamily : '부크크고딕bold', fontSize : '14px'}}>{photoDetail === null ? "" : photoDetail?.metadata.iso}</p>
                                </div>
                                <div style={{zIndex: 8}}><MapComponent/></div>
                                </>
                                : <p>메타 데이터가 없습니다.</p>
                            }
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default QnaDetail;
