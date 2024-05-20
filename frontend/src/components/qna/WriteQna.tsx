import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./css/WriteQna.module.css";
import { FaAngleDown } from 'react-icons/fa';
import { postQna, postPhoto } from '../../apis/qnaApi';

  
const WriteQna: React.FC = () => {

    const navigate = useNavigate();
    
    const moveToqna = function(){
        navigate("/community/qna")
    }

    const [postTitle, setPostTitle] = useState<string>("");
    const [postContent, setPostContent] = useState<string>("");

    const [sortType, setSortType] = useState<string>("일반");
    const [sortTypeList, setSortTypeList] = useState<boolean>(false);
    const [isRotated2, setIsRotated2] = useState<boolean>(false);

    const openSortTypeList = function(){
        setSortTypeList(!sortTypeList);
        setIsRotated2(!isRotated2);
    }

    const [mainImg, setMainImg] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // const [uploadPhotoId, setUploadPhotoId] = useState<number | null>();

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

    const [typess, setTypess] = useState<string>("normal");

    const postArticle = function(){
        if(selectedFile === null){
            if(sortType === "일반"){
                setTypess("normal")
            }
            else if(sortType === "스튜디오"){
                setTypess("studio")
            }

            postQna(null, typess, postTitle, postContent)
            .then((res) => {
                if(res){
                    setPostTitle("일반")
                    setPostTitle("")
                    setPostContent("")
                    setMainImg("");
                    setSelectedFile(null);
                    
                    navigate("/community/qna")
                }
                else{
                    alert('문제가 발생했습니다..');
                }
            })
        }
        else{
            postPhoto(selectedFile, selectedFile!.name, 'qna', [])
            .then((res) => {
                // setUploadPhotoId(res.photoId)

                if(sortType === "일반"){
                    setTypess("normal")
                }
                else if(sortType === "스튜디오"){
                    setTypess("studio")
                }
                
                postQna(res.photoId, typess, postTitle, postContent)
                .then((res) => {
                    if(res){
                        setPostTitle("일반")
                        setPostTitle("")
                        setPostContent("")
                        setMainImg("");
                        setSelectedFile(null);
                        
                        navigate("/community/qna")
                    }
                    else{
                        alert('문제가 발생했습니다..');
                    }
                })
            })
        }
    }

    return (
        <>
        <div className={styles.main_container} style={{marginTop: '80px'}}>
            <div className={styles.page_intro} onClick={() => {moveToqna();}}>
                <p className={styles.intro_txt1}>Community</p>
                <p className={styles.intro_txt2}>-QnA-</p>
            </div>

            <div className={styles.article_title_container}>
                <p style={{fontSize : '32px'}}>글쓰기</p>

                <div className={styles.btn_container}>
                    <div className={styles.photo_btn} onClick={() => {postArticle();}}>
                        <p>등록</p>
                    </div>
                </div>
            </div>

            <div style={{width : "90vw", height : "1px", background : "black", padding : "1px"}}></div>

            <div className={styles.writing_container}>
                <div className={styles.write_content_container}>
                    <div className={styles.choose_category_container}>
                        <div className={styles.sort_btn}>
                            <div className={styles.dropdown_container} onClick={() => {openSortTypeList();}}>
                                <p className={styles.dropdown_txt2}>{sortType}</p>
                                <FaAngleDown  className={`${styles.dropdown_icon2} ${isRotated2 ? styles.rotated : ''}`}/>
                            </div>

                            {sortTypeList && (
                                <>
                                    <div className={styles.typeList_container2}>
                                        <p className={styles.type_txt2_1} onClick={() => {setSortType("일반"); openSortTypeList();}}>일반</p>
                                        <p className={styles.type_txt2_3} onClick={() => {setSortType("스튜디오"); openSortTypeList();}}>스튜디오</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <input className={styles.write_title} placeholder='제목을 입력하세요.' onChange={(e) => {setPostTitle(e.target.value)}}></input>
                    </div>
                    <textarea className={styles.writing} placeholder='내용' onChange={(e) => {setPostContent(e.target.value)}}></textarea>
                    <div className={styles.photo_upload_container}>
                        <div className={styles.upload_txt_container}>
                            <p>사진 첨부</p>
                        </div>
                        <div className={styles.upload_btn_container}>
                            {selectedFile && (
                                <p className={styles.input_name}>사진 이름 : {selectedFile.name}</p>
                            )}
                            <label className={styles.input_file_btn} htmlFor="image">
                                <p className={styles.input_txt}>사진 업로드</p>
                                <img src='/imgs/photo_icon.png' style={{height : '18px', width : 'auto', marginLeft : '10px'}}></img>
                            </label>
                            <input type="file" id="image" accept="image/*" style = {{display : 'none'}} onChange={setPreviewImg} />
                        </div>
                        {mainImg == ''
                        ? <>
                            <div className={styles.intro_img}>
                                <p className={styles.input_t}>이미지<br></br>미리보기</p>
                            </div>
                        </>
                        :<>
                            <img src={mainImg} className={styles.intro_img}/>
                        </>}
                    </div>
                </div>
                <div className={styles.write_rule_container}>
                    <div className={styles.rule_background}>
                        <div className={styles.rule_title_container}>
                            <img src='/imgs/speak_icon.PNG' alt='확성기' style={{height: '30px', width: 'auto', marginRight: '5px', marginLeft: '-5px'}}></img>
                            <p>주의사항</p>
                        </div>
                        <div style={{width: '90%', background: 'white', height: '1px'}}></div>
                        <div className={styles.rule_content_container}>
                            <img src='/imgs/pin_icon.PNG' alt='핀' style={{height: '30px', width: 'auto', marginRight: '5px', marginLeft: '-5px'}}></img>
                            <p style={{fontSize: '16px', textAlign: 'center'}}>남을 비방하거나 욕설을 포함한 글 금지</p>
                        </div>
                        <div className={styles.rule_content_container}>
                            <img src='/imgs/pin_icon.PNG' alt='핀' style={{height: '30px', width: 'auto', marginRight: '5px', marginLeft: '-5px'}}></img>
                            <p style={{fontSize: '16px', textAlign: 'center'}}>사진과 관련없는 부적절한 내용의 글 금지</p>
                        </div>
                        <div className={styles.rule_content_container}>
                            <img src='/imgs/pin_icon.PNG' alt='핀' style={{height: '30px', width: 'auto', marginRight: '5px', marginLeft: '-5px'}}></img>
                            <p style={{fontSize: '16px', marginLeft: '9px'}}>지나친 친목 도모 금지</p>
                        </div>
                        <div className={styles.rule_content_container}>
                            <img src='/imgs/pin_icon.PNG' alt='핀' style={{height: '30px', width: 'auto', marginRight: '5px', marginLeft: '-5px'}}></img>
                            <p style={{fontSize: '16px', textAlign: 'center'}}>지나치게 상세한 개인정보 누출 주의</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
};

export default WriteQna;
