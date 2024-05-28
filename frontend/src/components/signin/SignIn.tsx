// SignIn.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './css/signin.module.css';
import { login } from '../../apis/memberApi';
import useLoginStatus from '../stores/member';

const emailCheck = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>('');  
  const [password, setPassword] = useState<string>('');  
  const navigate = useNavigate();
  const { updateLoginStatus } = useLoginStatus();

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

    login({
      email: email,
      password: password
    })
    .then((res)=>{
      if(res) {
        console.log('로그인 성공:', res);
        updateLoginStatus(true);
        navigate('/');
      }
      else{
        console.error('로그인 실패');
        alert('이메일 혹은 비밀번호를 확인하세요.');
      }
    })
    .catch(err =>{
      console.error('로그인 요청 중 오류 발생:', err);
      alert('로그인 요청 중 오류가 발생했습니다.');
    });
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
