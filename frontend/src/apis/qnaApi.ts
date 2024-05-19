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