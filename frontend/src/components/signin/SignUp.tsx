import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/signup.module.css';
import { checkEmail, checkNickname, register } from '../../apis/memberApi';

interface UserData {
  email: string;
  password: string;
  nickname: string;
  birthYear: number; 
  useYear: number; 
  confirmPassword: string;
}

interface InputFieldProps {
  name: string;
  placeholder: string;
  type: string;
  value: string | number;
  valid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
}

const InputField: React.FC<InputFieldProps> = ({ name, placeholder, type, value, valid, onChange }) => (
  <>
  {
    name === 'email' 
    ?
    <>
      {
        value === '' 
        ?
        <></>
        :
        valid 
        ?
        <p style={{margin: '-15px 0 -10px 5px', color:'green', fontSize: '10px'}}>올바른 이메일 형식입니다</p>
        :
        <p style={{margin: '-15px 0 -10px 5px', color:'red', fontSize: '10px'}}>올바르지 않은 이메일 형식입니다</p>
      }
      <input
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        required
        style={{border: `${value === '' ? '' : valid ? '2px solid green' : '2px solid red'}`}}
      />
    </>
    :
    <input
      name={name}
      placeholder={placeholder}
      type={type}
      value={value}
      onChange={onChange}
      required
    />
  }
    
  </>
);

const SignUp = () => {
  const [step, setStep] = useState<number>(1); 
  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
    nickname: '',
    birthYear: -1,
    useYear: -1,
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const navigate = useNavigate();

  const emailCheck = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleNext = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (step === 1) {
      const passwordMatch = checkPasswordMatch(userData.password, userData.confirmPassword);
      if (!passwordMatch) {
        alert("비밀번호가 일치하지 않습니다.");
        setLoading(false);
        return;
      }
      const emailAvailable = await checkEmail(userData.email);
      if (!emailAvailable) {
        alert("사용중인 이메일 입니다.");
        setLoading(false);
        return;
      }
    } else if (step === 3) {
      const nicknameAvailable = checkNickname(userData.nickname);
      if (!nicknameAvailable) {
        alert("이 닉네임은 사용할 수 없습니다.");
        setLoading(false);
        return;
      }

      register({
        email: userData.email,
        password: userData.password,
        nickname: userData.nickname,
        birthYear: userData.birthYear,
        useYear: userData.useYear,
      })
      .then(res =>{
        if(!res){
          alert('회원가입 중 오류가 발생했습니다.');
          setLoading(false);
          return;
        }
      })
    } else if (step === 5) {
        navigate('/signin'); // 회원가입 성공 후 로그인 페이지로 이동
    }
    setStep(step + 2);
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: name === 'birthYear' || name === 'useYear' ? parseInt(value, 10) : value
    }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(emailCheck(e.target.value)){
      setValid(true);
    } else{
      setValid(false);
    }
    setUserData({
      ...userData,
      email: e.target.value
    })
  }

  return (
    <div className={styles.signupContainer}>
      <div className={styles.leftPanel}>
        <img src='./imgs/camera_signup.png' alt="Camera" className={styles.cameraImage} />
        <div className={styles.overlayText}>Sign up</div>
      </div>
      <div className={styles.rightPanel}>
        <form onSubmit={handleNext} className={styles.signupForm}>
          <ul className={styles.stepIndicator}>
            {Array.from({ length: 5 }, (_, i) => (
              i%2 == 0 
              ?
              <div className={styles.stepContainer} key={i}>
                <li className={styles[i + 1 === step ? 'active' : '']} style={{color: `${i+1 === step ? 'white' : 'black'}`}}>{i/2+1}</li>
                <div className={styles.stepText}>{['가입정보', '', '회원정보', '', '완료'][i]}</div>
              </div>
              :
              <div key={i+'k'} style={{border: '1px solid black', height: '1px', width: '50px', margin: '45px -20px 0 -20px'}}></div>
            ))}
          </ul>

          {step === 1 && (
            <>
              <InputField name="email" placeholder='이메일을 입력해주세요' type="text" value={userData.email} valid={valid} onChange={handleEmailChange} />
              <InputField name="password" placeholder='비밀번호를 입력해주세요' type="password" value={userData.password} valid={true} onChange={handleChange} />
              <InputField name="confirmPassword" placeholder='비밀번호를 다시 한번 입력해주세요' type="password" value={userData.confirmPassword} valid={true} onChange={handleChange} />
            </>
          )}
          {step === 3 && (
            <>
              <InputField name="nickname" placeholder='닉네임을 입력해주세요' type="text" value={userData.nickname} valid={true} onChange={handleChange} />
              <InputField name="birthYear" placeholder='출생년도를 입력해주세요 (ex. 2000)' type="number" value={userData.birthYear === -1 ? '' : userData.birthYear} valid={true} onChange={handleChange} />
              <InputField name="useYear" placeholder='카메라 사용 경력을 입력해주세요 (ex. 1)' type="number" value={userData.useYear === -1 ? '' : userData.useYear} valid={true} onChange={handleChange} />
            </>
          )}

          {step === 5 && (
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

          <button type="submit" className={`${styles.submitButton} ${step === 5 && styles.gotoLogin}`} disabled={loading}>
            {loading ? 'Loading...' : (step === 5 ? '로그인 하러 가기' : step === 3 ? 'Register' : 'Next')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
