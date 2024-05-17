import {instance} from './axiosModule';
// 다른 사용자 정보 페이지

export const getPhoto = async (id : number, page : number) => {
    const url = `/photos/others/${id}?page=${page}`

    return await instance.get(url)
    .then(res => {
        return res.data.data.photoList;    
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

export const getExhibition = async (id : number) => {
    const url = `/exhibitions/all/${id}`
    return await instance.get(url)
    .then(res => {
        console.log(res);
        return res.data.data.exhibition;   
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

// 전시회 상세 정보 요청
export const getExhibitionDetail = async (id : number) => {
    const url = `/exhibitions/${id}`
    return await instance.get(url)
    .then(res => {
        console.log(res);
        return res.data.data;   
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

// 전시회 좋아요 요청
export const changeExhibitionLike = async (id : number) => {
    const url = `/exhibitions/change-like`
    return await instance.put(url, {
        exhibitionId: id
    })
    .then(res => {
        if(res){
            return res.data.data;
        }
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}