import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/signup.module.css';

interface UserData {
  email: string;
  password: string;
  nickname: string;
  birthYear: string; 
  useYear: string; 
  confirmPassword: string;
}

interface InputFieldProps {
  name: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 이벤트 핸들러 타입 정의
}

const InputField: React.FC<InputFieldProps> = ({ name, placeholder, type, value, onChange }) => (
  <input
    name={name}
    placeholder={placeholder}
    type={type}
    value={value}
    onChange={onChange}
    required
  />
);

const SignUp = () => {
  const [step, setStep] = useState<number>(1); 
  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
    nickname: '',
    birthYear: '',
    useYear: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // const checkEmailAvailability = async (email: string) => {
  //   // 여기에 API 호출 로직을 구현합니다.
  //   // 이 예시는 단순화를 위해 바로 true를 반환합니다.
  //   return true;
  // };

  // const checkNicknameAvailability = async (nickname: string) => {
  //   // 여기에 API 호출 로직을 구현합니다.
  //   // 이 예시는 단순화를 위해 바로 true를 반환합니다.
  //   return true;
  // };

  const handleNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (step === 1) {
      if (userData.password !== userData.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        setLoading(false);
        return;
      }
      // const emailAvailable = await checkEmailAvailability(userData.email);
      // const nicknameAvailable = await checkNicknameAvailability(userData.nickname);

      // if (!emailAvailable) {
      //   alert("이 이메일은 사용할 수 없습니다.");
      //   setLoading(false);
      //   return;
      // }
      // if (!nicknameAvailable) {
      //   alert("이 닉네임은 사용할 수 없습니다.");
      //   setLoading(false);
      //   return;
      // }
    }

    if (step === 3) {
      // 회원가입 처리 로직 (예: API 호출)
      console.log('회원가입 정보:', userData);
      navigate('/signin'); // 회원가입 성공 후 로그인 페이지로 이동
      setLoading(false);
    } else {
      setStep(step + 1); // 다음 단계로
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === 'birthYear' || name === 'useYear') {
      formattedValue = value.replace(/[^\d]/g, '') + '년';  // Extract numbers and append '년'
    }
    setUserData(prev => ({ ...prev, [name]: formattedValue }));
  };

  
  return (
    <div className={styles.signupContainer}>
      <div className={styles.leftPanel}>
        <img src='./imgs/camera_signup.png' alt="Camera" className={styles.cameraImage} />
        <div className={styles.overlayText}>Sign up</div>
      </div>
      <div className={styles.rightPanel}>
        <form onSubmit={handleNext} className={styles.signupForm}>
          <ul className={styles.stepIndicator}>
            {Array.from({ length: 3 }, (_, i) => (
              <div className={styles.stepContainer} key={i}>
                <li className={styles[i + 1 === step ? 'active' : '']} data-step={i + 1}></li>
                <div className={styles.stepText}>{['가입정보', '회원정보', '완료'][i]}</div>
              </div>
            ))}
          </ul>

          {step === 1 && (
            <>
              <InputField name="email" placeholder='이메일을 입력해주세요' type="text" value={userData.email} onChange={handleChange} />
              <InputField name="password" placeholder='비밀번호를 입력해주세요' type="password" value={userData.password} onChange={handleChange} />
              <InputField name="confirmPassword" placeholder='비밀번호를 다시 한번 입력해주세요' type="password" value={userData.confirmPassword} onChange={handleChange} />
            </>
          )}
          {step === 2 && (
            <>
              <InputField name="nickname" placeholder='닉네임을 입력해주세요' type="text" value={userData.nickname} onChange={handleChange} />
              <InputField name="birthYear" placeholder='출생년도를 입력해주세요.' type="text" value={userData.birthYear} onChange={handleChange} />
              <InputField name="useYear" placeholder='카메라 사용 경력을 입력해주세요.' type="text" value={userData.useYear} onChange={handleChange} />
            </>
          )}

{step === 3 && (
  <div className={styles.finalStepContainer}>
    <div className={styles.finalCheckmark}>
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="white"/>
        <path fillRule="evenodd" clipRule="evenodd" d="M17.28 9.28001C17.68 8.89001 18.32 8.89001 18.72 9.28001C19.11 9.68001 19.11 10.31 18.72 10.7L11.72 17.7C11.33 18.09 10.69 18.09 10.3 17.7L5.29998 12.7C4.90998 12.31 4.90998 11.68 5.29998 11.29C5.68998 10.9 6.31998 10.9 6.70998 11.29L11 15.58L17.28 9.28001Z" fill="black"/>
      </svg>
    </div>
    <h3 className={styles.finalHeader}>회원가입이 성공적으로 완료되었습니다.</h3>
    <p className={styles.finalMessage}>축하합니다! 당신은 지금부터 PhotoIs의 회원입니다.<br/>지금 PhotoIs와 함께 멋진 사진을 만들어 보세요!</p>
  </div>
)}

<button type="submit" className={styles.submitButton} disabled={loading}>
  {loading ? 'Loading...' : (step === 3 ? '로그인 하러 가기' : 'Next')}
</button>

        </form>
      </div>
    </div>
  );
};

export default SignUp;