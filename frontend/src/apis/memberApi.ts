import { instance } from './axiosModule';

interface UserData {
  email: string;
  password: string;
  nickname: string;
  birthYear: number; 
  useYear: number;
}

interface LoginData{
	email: string;
	password: string;
}

// 회원가입 요청
export const register = async (userData: UserData) => {
	const url = `/members/`;

	return await instance.post(url, userData)
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

// 로그인
export const login = async (loginData: LoginData) => {
	const url = `/members/login`;

	return await instance.post(url, loginData)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		console.log('로그인 성공:', res.data);
		const token = res.headers['authorization']; 
		const memberId = res.data.data.memberId; 
		const nickname = res.data.data.nickname;
		const profileUrl = res.data.data.profileUrl;
		if (token) {
			localStorage.setItem('tokens', token); 
		}
		localStorage.setItem('memberId', memberId);
		localStorage.setItem('nickname', nickname);
		localStorage.setItem('profileUrl', profileUrl);
		return res.data.data;
	})
	.catch(err => {
		console.log(err)
	})
}

// 이메일 중복 검사
export const checkEmail = async (email: string) => {
	const url = `/members/check-email/${email}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		return res.data.data.isValid;
	})
	.catch(err => {
		console.log(err)
	})
}

// 닉네임 중복 검사 
export const checkNickname = async (nickname: string) => {
	const url = `/members/check-nickname/${nickname}`;

	return await instance.get(url)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		return res.data.data.isValid;
	})
	.catch(err => {
		console.log(err)
	})
}

// 프로필 조회
export const searchProfile = async (memberId: number) => {
	const url = `/members/profile/${memberId}`;

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

// 프로필 수정
// 수정해야함
export const editProfile = async (memberInfo: FormData) => {
	const url = `/members/`;

	return await instance.put(url, memberInfo)
	.then(res => {
		if(res.data.errorResponse){
			return false;
		}
		localStorage.setItem('profileUrl', res.data.data.profileUrl);
		return res.data.data;
	})
	.catch(err => {
		console.log(err)
	})
}

// 배경화면 사진 수정
export const editBackgroundImg = async (background: FormData) => {
	const url = `/members/change-background`;

	return await instance.put(url, background, {
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
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