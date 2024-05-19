import React, { useState } from "react";
import { useCameraStore } from "../store/useCameraStore";
import styles from "../../mypage/css/MyPage.module.css";
import { uploadGalleryPhoto, uploadMetaStudio, CameraSettings } from "../../../apis/studioApi";

interface ModalProps {
    setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    ImgUrl: string | null;
}
const Modal: React.FC<ModalProps> = ({ setModalIsOpen, ImgUrl }) => {
    const { iso, shutterSpeed, aperture, exposure } = useCameraStore();
    const [uploadPhoto, setUploadPhoto] = useState<boolean>(false);

    const uploadHandle = function () {
        setUploadPhoto(true);
    };

    interface uploadPhotoInterface {
        title: string;
        accessType: string;
        hashtag: Array<string>;
    }

    const [uploadPhotoInfo, setUploadPhotoInfo] = useState<uploadPhotoInterface>({
        title: "",
        accessType: "STUDIO",
        hashtag: [],
    });

    const handleUploadPhotoTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUploadPhotoInfo({
            ...uploadPhotoInfo,
            title: e.target.value,
        });
        console.log(uploadPhotoInfo);
    };

    const [inputText, setInputText] = useState(""); // 입력된 텍스트 상태 변수
    const [tags, setTags] = useState<Array<string>>([]); // 태그 배열 상태 변수
    const [isUploadFinished, setIsUploadFinished] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState(false);

    // 입력된 텍스트를 태그 배열에 추가하는 함수
    const addTag = () => {
        console.log(inputText);
        if (inputText.trim() !== "") {
            // 입력된 텍스트가 공백이 아닌 경우에만 추가
            setTags([...tags, inputText]); // 이전 태그 배열에 새로운 텍스트 추가
            setInputText(""); // 입력된 텍스트 초기화
        }
    };

    const removeTag = (index: number) => {
        const newTags = [...tags]; // 새로운 배열 생성
        newTags.splice(index, 1); // 해당 인덱스의 태그 제거
        setTags(newTags); // 새로운 배열로 상태 업데이트
    };

    // url to file

    const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        const file = new File([buffer], filename, { type: mimeType });
        return file;
    };

    //photo handel
    const handleUploadPhoto = async () => {
        if (uploadPhotoInfo.title === "") {
            alert("제목을 입력해주세요.");
            return;
        } else {
            try {
                const file = await urlToFile(ImgUrl!, "photo.jpg", "image/jpeg"); //url to photo

                const formData = new FormData();
                formData.append("photo", file);
                const photoInfo = JSON.stringify({
                    title: uploadPhotoInfo.title,
                    accessType: "STUDIO",
                    hashtagList: tags,
                });

                console.log(formData);
                const blob = new Blob([photoInfo], { type: "application/json" });
                formData.append("photoInfo", blob);
                setIsUploading(true);

                const res = await uploadGalleryPhoto(formData);
                if (res != false) {
                    console.log("photoId : ", res);
                    const settings: CameraSettings = {
                        iso: iso.toString(),
                        shutterSpeed: shutterSpeed === 1 ? "1 ss" : `1/${shutterSpeed} ss`,
                        aperture: `f / ${aperture}`,
                        exposure: `EV ${exposure}`,
                    };

                    try {
                        const metaRes = await uploadMetaStudio(settings, res);
                        if (!metaRes) {
                            alert("메다 테이터 저장 문제가 발생했습니다.");
                        } else {
                            console.log(metaRes);
                        }
                    } catch (error) {
                        console.log("메타 데이터 저장 중 에러");
                        console.log(error);
                    }
                    setUploadPhotoInfo({
                        title: "",
                        accessType: "STUDIO",
                        hashtag: [],
                    });
                } else {
                    alert("문제가 발생했습니다..");
                }
            } catch (err) {
                console.log(err);
            } finally {
                setIsUploading(false);
                console.log(isUploading);
            }
            uploadClickHandler();
        }
    };

    const uploadClickHandler = () => {
        setUploadPhoto(false);
        setIsUploadFinished(true);
    };

    const handelModal = () => {
        setModalIsOpen(false);
        setIsUploadFinished(false);
    };

    return (
        <div className="background w-full h-full bg-black bg-opacity-75 flex justify-center items-center absolute top-0 left-0 z-50">
            <img
                onClick={handelModal}
                src="/imgs/cancel.png"
                alt=""
                className="close-modal top-2 absolute left-2 w-[70px]"
            />
            {isUploadFinished ? (
                <div className="flex-col modal w-[950px] h-[450px] bg-white flex justify-center items-center">
                    <img src="/imgs/check_gif.gif" alt="체크" style={{ height: "100px", width: "100px" }}></img>
                    <p className="text-[30px] font-bookkGothicBold">사진을 성공적으로 업로드하였습니다.</p>
                    <div>
                        <p className="text-[15px] font-bookkGothic pt-4">
                            작은 노력이 모여 큰 성과를 이루게 합니다. <br></br>
                        </p>
                    </div>
                    <p className="text-[15px] font-bookkGothic ">꾸준하게 사진을 업로드 해보세요</p>
                    <div className="pt-12 w-full flex justify-center">
                        <button
                            onClick={handelModal}
                            className="w-48 h-12 border font-bookkGothicBold border-black rounded-lg mx-2"
                        >
                            CONTINUE
                        </button>
                        <button className="w-48 h-12 border bg-black text-white font-bookkGothicBold rounded-lg mx-2">
                            MY PAGE
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="modal w-[950px] h-[450px] bg-white flex">
                        <div className="img-section h-full bg-gray-400 aspect-[3/2]">
                            {ImgUrl && <img src={ImgUrl} alt="Captured" className="w-full h-full object-cover" />}
                        </div>

                        <div className="flex flex-col w-full">
                            {uploadPhoto ? (
                                <div className="flex flex-col items-center font-bookkGothic flex-grow text-[15px]">
                                    <p className="text-[30px] font-bookkMyungjoBold mt-4">Save</p>
                                    <div className={styles.edit_title_container}>
                                        <p style={{ fontSize: "20px" }}>Title</p>
                                        <input
                                            className={styles.edit_input_box3}
                                            type="text"
                                            placeholder="제목을 입력해주세요."
                                            value={uploadPhotoInfo.title}
                                            onChange={handleUploadPhotoTitle}
                                        ></input>
                                    </div>
                                    <div className={styles.edit_tag_container}>
                                        <p style={{ fontSize: "20px" }}>Tags</p>
                                        <div className={styles.edit_tag_input_container}>
                                            <input
                                                className={styles.edit_input_box4}
                                                value={inputText}
                                                type="text"
                                                placeholder="사진에 태그를 추가해 보세요."
                                                onChange={(e) => {
                                                    setInputText(e.target.value);
                                                }}
                                            ></input>
                                            <div
                                                className={styles.edit_plus_btn}
                                                onClick={() => {
                                                    addTag();
                                                }}
                                            >
                                                <img
                                                    src="/imgs/white_plus.png"
                                                    alt="플러스"
                                                    style={{ width: "22px", height: "22px" }}
                                                ></img>
                                            </div>
                                        </div>
                                        <div className={styles.edit_tags_container}>
                                            {tags.map((tag, index) => {
                                                return (
                                                    <div
                                                        key={index + "n"}
                                                        className={`${styles.edit_tag} ${
                                                            index % 2 != 0 ? styles.float : ""
                                                        }`}
                                                    >
                                                        {tag.length > 5 ? "# " + tag.slice(0, 5) + ".." : "# " + tag}
                                                        <img
                                                            src="/imgs/black_x.png"
                                                            alt="x"
                                                            style={{
                                                                height: "13px",
                                                                width: "auto",
                                                                position: "absolute",
                                                                right: "7px",
                                                                cursor: "pointer",
                                                            }}
                                                            onClick={() => {
                                                                removeTag(index);
                                                            }}
                                                        ></img>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className={styles.edit_btn_container} onClick={handleUploadPhoto}>
                                            <p className={styles.upload_txt3} style={{ color: "white" }}>
                                                Upload
                                            </p>
                                            <img
                                                src="/imgs/upload_icon.png"
                                                alt="아이콘"
                                                style={{ height: "45px", width: "auto", marginLeft: "10%" }}
                                            ></img>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center font-bookkGothic flex-grow text-[15px]">
                                    <p className="text-[30px] font-bookkMyungjoBold mt-4">My Setting</p>
                                    <div className="flex justify-between w-full px-4 pt-8 ">
                                        <p>조리개 / Aperture </p>
                                        <p>F {aperture} </p>
                                    </div>
                                    <div className="flex justify-between w-full  px-4 pt-5">
                                        <p>셔터스피드 / SS </p>
                                        {shutterSpeed === 1 ? <p>1</p> : <p>1/{shutterSpeed}</p>}
                                    </div>
                                    <div className="flex justify-between w-full  px-4 pt-5">
                                        <p>감도 / ISO </p>
                                        <p>{iso} </p>
                                    </div>
                                    <div className="flex justify-between w-full  px-4 pt-5">
                                        <p>노출 / Exposure </p>
                                        <p>{exposure} EV</p>
                                    </div>
                                    <button
                                        onClick={uploadHandle}
                                        className="bg-black text-white font-bookkGothicBold w-44 h-11 rounded-sm mt-auto mb-4"
                                    >
                                        SAVE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Modal;
