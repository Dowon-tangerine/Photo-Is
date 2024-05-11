import styles from './css/signin.module.css';  // 모듈 CSS 파일을 import 합니다.

const SignIn = () => {
  return (
    <div className={styles.signinContainer}>
      <div className={styles.imageSide}> {/* 배경 이미지를 위한 div */}
      </div>
      <div className={styles.formSide}>
        <div className={styles.signinForm}>
          <input type="text" placeholder="아이디" />
          <input type="password" placeholder="비밀번호" />
          <div className={styles.forgetPassword}>비밀번호를 잊으셨나요?</div>
          <button type="submit">로그인</button>
          <div className={styles.signupLink}>
            아직 회원이 아니신가요? 회원가입 하러가기
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
