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

export const getPhotoDetail = async (id : number) => {
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