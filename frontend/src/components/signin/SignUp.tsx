import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/signup.module.css'; // CSS 모듈 파일을 import합니다.

const SignUp = () => {
  const [email, setEmail] = useState<string>('');  // 이메일 상태에 타입 지정
  const [password, setPassword] = useState<string>('');  // 비밀번호 상태에 타입 지정
  const [checkPassword, setCheckPassword] = useState<string>('');  // 비밀번호 확인 상태에 타입 지정 (이전에 confirmPassword)
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (password !== checkPassword) {
      alert("Passwords do not match.");
      return;
    }
    // 회원가입 처리 로직 (예: API 호출)
    console.log('회원가입 정보:', email, password);
    // 회원가입 성공 후 리다이렉트
    navigate('/signin'); // 회원가입 후 로그인 페이지로 이동
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.leftPanel}>
        <img src='./imgs/camera_signup.png' alt="Camera" className={styles.cameraImage} />
        <div className={styles.overlayText}>Sign up</div>
      </div>
      <div className={styles.rightPanel}>
        <form onSubmit={handleSubmit} className={styles.signupForm}>
          <ul className={styles.stepIndicator}>
            <div className={styles.stepContainer}>
              <li className={`${styles.active}`} data-step="1"></li>
              <div className={styles.stepText}>가입정보</div>
            </div>
            <div className={styles.stepContainer}>
              <li data-step="2"></li>
              <div className={styles.stepText}>회원정보</div>
            </div>
            <div className={styles.stepContainer}>
              <li data-step="3"></li>
              <div className={styles.stepText}>완료</div>
            </div>
          </ul>

          <input
            id="email"
            placeholder='이메일을 입력해주세요'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            id="password"
            placeholder='비밀번호를 입력해주세요'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            id="checkPassword"
            placeholder='비밀번호를 다시 한번 입력해주세요'
            type="password"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitButton}>다음</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
