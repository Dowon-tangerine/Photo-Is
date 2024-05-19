import { instance } from './axiosModule';

// 사진 업로드
export const uploadGalleryPhoto = async (photoData: FormData) => {
	const url = `/photos/upload`;

	return await instance.post(url, photoData, 
    )
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		return true;
	})
	.catch(err => {
		console.log(err)
	})
}

// 내 public/private/studio 사진 목록 조회
// photos/my/{access-type}?page= api에서 isLiked 주도록 수정
export const selectEachPhotoList = async (accessType: string, page: number) => {
	const url = `/photos/my/${accessType}?page=${page}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		return res.data.data.photoList;
	})
	.catch(err => {
		console.log(err)
	})
}

// 사진 상세 조회
export const selectDetailPhoto = async (photoId: number) => {
	const url = `/photos/${photoId}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		return res.data.data;
	})
	.catch(err => {
		console.log(err)
	})
}

// 내 전체 사진목록 조회
export const selectAllPhotoList = async (page: number) => {
	const url = `/photos/my/all?page=${page}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		return res.data.data.photoList;
	})
	.catch(err => {
		console.log(err)
	})
}
