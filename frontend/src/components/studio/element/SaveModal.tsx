import React, { useState } from "react";

function SaveModal() {
    const [uploadPhotoDetail, setUploadPhotoDetail] = useState<boolean>(false);
    const openUploadDetailModal = function () {
        if (!uploadPhotoDetail) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
        setUploadPhotoDetail(!uploadPhotoDetail);
    };

    return (
        <div>
            {" "}
            <div className="background w-full h-full bg-black bg-opacity-75 flex justify-center items-center absolute top-0 left-0 z-50">
                <img
                    onClick={() => setModalIsOpen(false)}
                    src="/imgs/cancel.png"
                    alt=""
                    className="close-modal top-2 absolute left-2 w-[70px]"
                />
                <div className="modal w-[950px] h-[450px] bg-white flex">
                    <div className="img-section h-full bg-gray-400 aspect-[3/2]">
                        {ImgUrl && <img src={ImgUrl} alt="Captured" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex flex-col w-full">
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
                            <button className="bg-black text-white font-bookkGothicBold w-44 h-11 rounded-sm mt-auto mb-4">
                                SAVE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SaveModal;
