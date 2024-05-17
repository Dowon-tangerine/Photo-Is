import React, { useState, useEffect } from 'react';
import './css/MyPageEdit.module.css';
import styles from './css/MyPage.module.css';
import editStyles from './css/MyPageEdit.module.css';
import { searchProfile, editBackgroundImg, editProfile } from '../../apis/memberApi';

interface memberInfoInterface { 
	memberId: number;
	nickname: string;
	profileUrl: string;
	backgroundUrl: string;
	photoCnt: number;
	introduction: string;
	followerCnt: number;
	followingCnt: number;
	useYear: number;
	birthYear: number;
	camera: string;
	country: string;
	city: string;
	password: string;
}

const MyPageEdit: React.FC = () =>{

	const [memberInfo, setMemberInfo] = useState<memberInfoInterface>({ 
		memberId: -1,
		nickname: '',
		profileUrl: '',
		backgroundUrl: '',
		photoCnt: -1,
		introduction: '',
		followerCnt: -1,
		followingCnt: -1,
		useYear: -1,
		birthYear: -1,
		camera: '',
		country: '',
		city: '',
		password: '',
	});
	const [backgroundImg, setBackgroundImg] = useState<ArrayBuffer | string | null>(null);
	const [profileImg, setProfileImg] = useState<ArrayBuffer | string | null>(null);
	const [backgroundImgFile, setBackgroundImgFile] = useState<File | null>(null);
	const [profileImgFile, setProfileImgFile] = useState<File | null>(null);

	useEffect(()=>{
		loadMemberInfo();
	}, [])
	const loadMemberInfo = ()=>{
		const myId = localStorage.getItem('memberId');
		if(myId != null){
			searchProfile(Number(myId))
			.then((res)=>{
				console.log(res)
				if(res.city === null){
					res.city = '';
				}
				if(res.country === null){
					res.country = '';
				}
				setMemberInfo(res);
			})
		}
	}

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
		const name = e.target.name;
		setMemberInfo({
			...memberInfo,
			[name]: e.target.value
		});
	}

	const onSelectHandler = (e: React.ChangeEvent<HTMLSelectElement>)=>{
		const name = e.target.name;
		alert(name)
		setMemberInfo({
			...memberInfo,
			[name]: e.target.value
		});
	}

	const onFileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
        if (name === 'background') {
            setBackgroundImgFile(files[0]); // 파일 객체 저장
            const reader = new FileReader();
            reader.onload = () => setBackgroundImg(reader.result as string); // 미리보기 용
            reader.readAsDataURL(files[0]);
			const formData = new FormData();
			formData.append('background', files[0]);
			editBackgroundImg(formData)
			.then(()=>{})
        } else if (name === 'profile') {
            setProfileImgFile(files[0]); // 파일 객체 저장
            const reader = new FileReader();
            reader.onload = () => setProfileImg(reader.result as string); // 미리보기 용
            reader.readAsDataURL(files[0]);
        }
	  }
	};

	const onSubmitHandler = ()=>{
		const formData = new FormData();
		formData.append('photo', profileImgFile!);
		const blob = new Blob([JSON.stringify(memberInfo)], {type: "application/json"});
		formData.append("memberInfo", blob);

		editProfile(formData)
		.then(res=>{
			if(res){
				alert('정보 수정에 성공하였습니다!');
			}
			else{
				alert('중복된 닉네임입니다.')
			}
		})
		.catch(err=>console.log(err))
		.finally(()=>{
			loadMemberInfo();
		})
	}

	return(
		<div className={styles.main_container} >
			<label htmlFor='background'>
				<div style={{position: 'absolute', zIndex: '2', right: '2%', top: '25%', height:'50px', width: '50px', cursor:'pointer', background:'black',borderRadius: '200px',}}>
					<img src='imgs/upload_icon.png'/>
				</div>
			</label>
			<input type='file' name='background' id='background' style={{position: 'absolute'}} onChange={onFileChangeHandler}/>
			<input type='file' name='profile' id='profile' style={{position: 'absolute'}} onChange={onFileChangeHandler}/>
				<div className={styles.mypage_info_container} style={{backgroundImage : `url(${backgroundImg || memberInfo.backgroundUrl})`, backgroundSize : 'cover', height : '350px', position : 'relative', backgroundPosition : 'center'}}>
						<div className={styles.info_container}>
						
						<div style={{margin: 'auto', position: 'relative'}}>
							
						<label htmlFor='profile'>
							<div style={{display:'flex', alignItems:'center', justifyContent:'center', position: 'absolute', zIndex: '2', height:'50px', right: '0', bottom: '0', width: '50px', cursor:'pointer', background:'rgba(0, 0, 0, 0.8)', borderRadius: '200px'}}>
								<img src='imgs/upload_icon.png' style={{width: 'auto', height: '40px'}}/>
							</div>
						</label>
							<img src={profileImg as string || memberInfo.profileUrl} alt='프로필' style={{marginTop: '-40px', width: '200px', height: '200px', margin: 'auto', borderRadius: '200px', objectFit:'cover'}}></img>
						</div>
						 </div>
						 <table style={{background: 'white', width: '80%', marginTop: '1200px', marginBottom: '100px'}}>
							<caption><h1 className={editStyles.h1}>Edit</h1></caption>
							<tbody>
							<tr>
								<th>Nickname</th>
								<td><input name='nickname' value={memberInfo.nickname} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>Password</th>
								<td><input name='password' value={memberInfo.password} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>Birthyear</th>
								<td><input name='birthYear' type='number'  value={memberInfo.birthYear} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>MyCamera</th>
								<td style={{paddingLeft: '15px'}}>
									<select style={{height: '60px', outline: 'none'}} name='camera' onChange={onSelectHandler}>
										<option value="FUJI">FUJI</option>
										<option value="CANON">CANON</option>
										<option value="NIKON">NIKON</option>
										<option value="SONY">SONY</option>
									</select>
								</td>
							</tr>
							<tr>
								<th>Useyear</th>
								<td><input name='useYear' type='number' value={memberInfo.useYear} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>Country</th>
								<td><input name='country' value={memberInfo.country} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>City</th>
								<td><input name='city' value={memberInfo.city} onChange={onChangeHandler}/></td>
							</tr>
							</tbody>
							
						 </table>
				</div>
				<div className={editStyles.button} onClick={onSubmitHandler}><p>Submit</p></div>
		</div>
	);
}

export default MyPageEdit;