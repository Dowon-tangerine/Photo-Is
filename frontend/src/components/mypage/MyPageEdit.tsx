import React, { useState, useEffect } from 'react';
import './css/MyPageEdit.module.css';
import styles from './css/MyPage.module.css';
import editStyles from './css/MyPageEdit.module.css';
import { searchProfile } from '../../apis/memberApi';

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
	});

	useEffect(()=>{
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
	}, [])

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>)=>{
		const name = e.target.name;
		setMemberInfo({
			...memberInfo,
			[name]: e.target.value
		});

		console.log(memberInfo)
	}

	return(
		<div className={styles.main_container} style={{height: '100vh'}}>
				<div className={styles.mypage_info_container} style={{backgroundImage : `url(${memberInfo.backgroundUrl})`, backgroundSize : 'cover', height : '350px', position : 'relative', backgroundPosition : 'center'}}>
						<div className={styles.info_container}>
								<img src={memberInfo.profileUrl} alt='프로필' style={{marginTop: '-40px', width: '200px', height: '200px', margin: 'auto'}}></img>
						 </div>
						
						 <table style={{background: 'white', width: '80%', marginTop: '70%', marginBottom: '100px'}}>
							<tbody>
							<tr>
								<th>Nickname</th>
								<td><input name='nickname' value={memberInfo.nickname} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>Birthyear</th>
								<td><input name='birthYear' type='number'  value={memberInfo.birthYear} onChange={onChangeHandler}/></td>
							</tr>
							<tr>
								<th>MyCamera</th>
								<td><input name='camera' value={memberInfo.camera} onChange={onChangeHandler}/></td>
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
						 <div className={editStyles.button}>Sumbit</div>
				</div>
		</div>
	);
}

export default MyPageEdit;