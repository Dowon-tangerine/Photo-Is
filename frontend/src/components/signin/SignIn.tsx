import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './css/signin.module.css';

const SignIn: React.FC = () => {
  const [username, setUsername] = useState<string>('');  // 상태에 타입 지정
  const [password, setPassword] = useState<string>('');  // 상태에 타입 지정
  const navigate = useNavigate();

  const handleLogin = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();  // 폼의 기본 제출 동작 방지
    console.log('로그인 시도:', username, password);
    // 실제 로그인 로직 (예: API 호출)

    // 임시로 홈 페이지로 이동
    navigate('/');  // 로그인 성공 시 리디렉트할 경로
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
