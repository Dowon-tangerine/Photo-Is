// SignIn.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './css/signin.module.css';

const emailCheck = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SignIn: React.FC<{ updateProfile: () => void }> = ({ updateProfile }) => {
  const [email, setEmail] = useState<string>('');  
  const [password, setPassword] = useState<string>('');  
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault(); 
    console.log('로그인 시도:', email, password);

    // 입력 값 정합성 체크
    if (email === "" || password === "") {
      window.alert("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    if (!emailCheck(email)) {
      window.alert("이메일 형식이 맞지 않습니다.");
      return;
    }

    try {
      const response = await axios.post('https://k10d103.p.ssafy.io/api/members/login', {
        email: email,
        password: password
      });

      if (response.status === 200 && response.data.msg === "로그인에 성공하였습니다.") {
        // 로그인 성공 처리
        console.log('로그인 성공:', response.data);
        const token = response.headers['authorization']; // 응답 헤더에서 토큰 추출
        const memberId = response.data.data.memberId; // 응답 바디에서 memberId 추출
        const nickname = response.data.data.nickname;
        const profileUrl = response.data.data.profileUrl;

        if (token) {
          localStorage.setItem('authToken', token); // 로컬 스토리지에 토큰 저장
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Axios 인스턴스에 기본 Authorization 헤더 설정
        }

        localStorage.setItem('memberId', memberId); // 로컬 스토리지에 memberId 저장
        localStorage.setItem('nickname', nickname);
        localStorage.setItem('profileUrl', profileUrl);

        // 프로필 업데이트 함수 호출
        updateProfile();

        navigate('/');  // 로그인 성공 시 리디렉트할 경로
      } else {
        // 오류 처리
        const errorMessage = response.data.errorResponse ? response.data.errorResponse.msg : '로그인 실패';
        console.log('로그인 실패:', errorMessage);
        alert(`로그인 실패: ${errorMessage}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.data && error.response.data.errorResponse) {
          console.error('로그인 실패:', error.response.data.errorResponse.msg);
          alert(`로그인 실패: ${error.response.data.errorResponse.msg}`);
        } else {
          console.error('로그인 요청 중 오류 발생:', error);
          alert('로그인 요청 중 오류가 발생했습니다.');
        }
      } else {
        console.error('예상치 못한 오류 발생:', error);
        alert('예상치 못한 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className={styles.signinContainer}>
      <div className={styles.imageSide}>
        <img src={`./imgs/flower_signin.png`} alt="Flower Background" className={styles.backgroundImage} />
        <div className={styles.overlayText}>Sign in</div>
      </div>
      <div className={styles.formSide}>
        <form onSubmit={handleLogin} className={styles.signinForm}>
          <h1>Sign in</h1>
          <input
            type="text"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className={styles.forgetPassword}>비밀번호를 잊으셨나요?</div>
          <button type="submit">로그인</button>
          <div className={styles.notsignup}>
            <span>아직 회원이 아니신가요?</span>
            <Link to="/signup" className={styles.signupLink}> 회원가입 하러가기</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
