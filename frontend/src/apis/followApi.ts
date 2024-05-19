import { instance } from "./axiosModule";

// 팔로워 목록 조회
export const getFollowerList = async () => {
	const url = `/follows/follower-list`;

	return await instance.get(url)
	.then(res=>{
		if(!res.data.errorResponse){
			return res.data.data;
		}
	})
	.catch(err=>console.log(err))
}

// 팔로우 목록 조회
export const getFollowingList = async () => {
	const url = `/follows/following-list`;

	return await instance.get(url)
	.then(res=>{
		if(!res.data.errorResponse){
			return res.data.data;
		}
	})
	.catch(err=>console.log(err))
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