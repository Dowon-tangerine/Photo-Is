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

export const getQnaDetail = async (id : number) => {
    const url = `/questions/detail/${id}`

    return await instance.get(url)
    .then(res => {
        return res.data.data;    
    })
    .catch(error => {
        console.log("fffccvb" + error);
        return false;
    })
}

export const getComment = async (id : number) => {
    const url = `/questions/${id}/comment`

    return await instance.get(url)
    .then(res => {
        console.log(res)
        return res.data.data.commentList;    
    })
    .catch(error => {
        console.log("fffccvb" + error);
        return false;
    })
}

export const postComment = async (id : number, comment : string) => {
    const url = `/questions/${id}/comment`

    return await instance.post(url, {comment})
    .then(res => {
        console.log("post" + res)
        return res.data.data.content;    
    })
    .catch(error => {
        console.log("post" + error);
        return false;
    })
}