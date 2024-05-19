import {instance} from './axiosModule';
// 갤러리

// 갤러리 랭킹
export const getQnaList = async (page : number) => {
    const url = `/questions?page=${page}`

    return await instance.get(url)
    .then(res => {
        return res.data.data;    
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

export const getQnaSortList = async (category : string, page : number) => {
    const url = `/questions/${category}?page=${page}`

    return await instance.get(url)
    .then(res => {
        console.log(res)
        return res.data.data;    
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

export const postQna = async (photoId : number | null, category : string, title : string, content : string) => {
    const url = `/questions/upload`

    const data = {
        photoId: photoId === null ? "" : photoId, category: category, title: title, content: content
    }
    return await instance.post(url, data)
    .then(res => {
        console.log(photoId)
        console.log("글업로드" + res)
        return res.data.data;    
    })
    .catch(error => {
        console.log("글업로드" + error);
        return false;
    })
}

export const postPhoto = async (사진 : File, title : string, accessType : string, hashtag: Array<string> ) => {
	const url = `/photos/upload`;

    const formData = new FormData();
    formData.append('photo', 사진);

    const photoInfo = JSON.stringify({
        title: title,
        accessType: accessType,
        hashtagList: hashtag
    });
    const blob = new Blob([photoInfo], {type: "application/json"});
    formData.append("photoInfo", blob);

	return await instance.post(url, formData)
    .then(res => {
        // console.log(res)
        return res.data.data;    
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

