import { instance } from "./axiosModule";

export interface CameraSettings {
    iso: string;
    shutterSpeed: string;
    aperture: string;
    exposure: string;
}

// 사진 업로드
export const uploadGalleryPhoto = async (photoData: FormData) => {
    const url = `/photos/upload`;

    return await instance
        .post(url, photoData)
        .then((res) => {
            if (res.data.errorResponse) {
                return false;
            }
            console.log("this : ", res.data.data.photoId);
            console.log("full response : ", res.data);

            return res.data.data.photoId;
        })
        .catch((err) => {
            console.log(err);
        });
};

//스튜디오 메타 데이터 업로드
export const uploadMetaStudio = async (setting: CameraSettings, photoId: string) => {
    const url = `/photos/${photoId}/save-metadata`;

    return await instance
        .put(url, setting)
        .then((res) => {
            if (res.data.errorResponse) {
                return false;
            }
            return true;
        })
        .catch((err) => {
            console.log(err);
            return false;
        });
};
