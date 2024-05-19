import {instance} from './axiosModule';
// 갤러리

// 갤러리 랭킹
export const getRanking = async (type : string) => {
    const url = `/photos/ranking/${type}`

    return await instance.get(url)
    .then(res => {
        return res.data.data.rankings;    
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

export const getSorting = async (type : string, page : number) => {
    const url = `/photos/gallery/${type}?page=${page}`

    return await instance.get(url)
    .then(res => {
        console.log(res);
        return res.data.data.photoList;
    })    
    .catch(error => {
        error
        return false;
    })

}

export const getPhotoDetail = async (id : number | undefined) => {
    const url = `/photos/${id}`

    return await instance.get(url)
    .then(res => {
        console.log(res);
        return res.data.data;
    })    
    .catch(error => {
        error
        return false;
    })

}

export const getSearching = async (type : string, keyword : string, page : number) => {
    const url = `/photos/search/${type}?keyword=${keyword}&page=${page}`

    return await instance.get(url)
    .then(res => {
        console.log(res);
        return res.data.data.resultList;
    })    
    .catch(error => {
        error
        return false;
    })
}

export const postLiked = async (id : number | undefined) => {
    const url = `/photos/${id}/change-like`

    return await instance.post(url)
    .then(res => {
        console.log(res);
        return res.data.data;
    })    
    .catch(error => {
        error
        return false;
    })
}

export const getComment = async (id : number | undefined) => {
    const url = `/photos/${id}/comment`

    return await instance.get(url)
    .then(res => {
        console.log(res);
        return res.data.data.commentCnt != 0 ? res.data.data.commentList : false;
    })    
    .catch(error => {
        error
        return false;
    })
}

export const postComment = async (id : number | undefined, comment : string) => {
    const url = `/photos/${id}/comment`

    const data = {comment: comment}
    return await instance.post(url, data)
    .then(res => {
        console.log(res);
        return res.data.data.commentList;
    })    
    .catch(error => {
        error
        return false;
    })
}

export const postFollow = async (id : number) => {
    const url = `/follows/follow/${id}`

    return await instance.post(url)
    .then(res => {
        console.log(res);
        return res.data.data;
    })    
    .catch(error => {
        error
        return false;
    })
}

export const deleteUnFollow = async (id : number) => {
    const url = `/follows/unfollow/${id}`

    return await instance.delete(url)
    .then(res => {
        console.log(res);
        return res.data.data;
    })    
    .catch(error => {
        error
        return false;
    })
}