import {instance} from './axiosModule';
import { dateFormatter } from '../components/utils/changeDateFormat';

interface exhibitionInterface {
	exhibitionId: number,
	title: string,
	posterUrl: string,
	memberId: number,
	startDate: string,
	endDate: string,
	likeCnt: number,
	liked: boolean,
	nickname: string,
	profileUrl: string,
}

interface photoInterface {
	photoId: number,
	number: number
}

interface exhibitionDetailInterface {
	posterId: number,
	title: string | undefined,
	description: string | undefined,
	endDate: string | undefined,
	photoList: Array<photoInterface>
}

// 전시회 전체목록 조회
export const getExhibitionList = async () => {
    const url = `/exhibitions/`;

    return await instance.get(url)
    .then(res => {
			if(res.data.data){
				res.data.data.followExhibition.forEach((exhibition: exhibitionInterface)  => {
					exhibition.startDate = dateFormatter.changeDateFormat(exhibition.startDate);
					exhibition.endDate = dateFormatter.changeDateFormat(exhibition.endDate);
				});
				res.data.data.exhibition.forEach((exhibition: exhibitionInterface)  => {
					exhibition.startDate = dateFormatter.changeDateFormat(exhibition.startDate);
					exhibition.endDate = dateFormatter.changeDateFormat(exhibition.endDate);
				});
				console.log(res.data.data)
				return res.data.data;  
			} 
    })
    .catch(error => {
        console.log(error);
        return false;
    })
}

// 전시회 상세정보 조회
export const getExhibitionDetail = async (exhibitionId: number) => {
	const url = `/exhibitions/${exhibitionId}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.data){
			const exhibition = res.data.data;
			exhibition.startDate = dateFormatter.changeDateFormat(exhibition.startDate);
			exhibition.endDate = dateFormatter.changeDateFormat(exhibition.endDate);
		}
		return res.data.data;    
	})
	.catch(error => {
			console.log(error);
			return false;
	})
}

// 전시회 개회
export const postExhibition = async (exhibitionInfo: exhibitionDetailInterface) => {
	const url = `/exhibitions/`;

	return await instance.post(url, exhibitionInfo)
	.then(res => {
		if(res.data.data){
			console.log(res.data.data)
		}
		return res.data.data;    
	})
	.catch(error => {
			console.log(error);
			return false;
	})
}

// 전시회 사진목록 조회
export const getExhibitionPhotos = async (exhibitionId: number) => {
	const url = `/exhibitions/photos/${exhibitionId}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.data){
			console.log(res)
			res.data.data.content.forEach((data: any) => {
				data.photoUrl = data.photoUrl + '?not-from-cache-please';
			})
		}
		return res.data.data;    
	})
	.catch(error => {
			console.log(error);
			return false;
	})
}