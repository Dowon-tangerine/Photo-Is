// ToggleBtn.tsx
import React, { useEffect, useState } from 'react';
import styles from './css/ToggleBtn2.module.css';

type Props ={
  changeAccessType: (accessType: string) => void;
}

const ToggleBtn2: React.FC<Props> = ({ changeAccessType }) => {
  const [clicked, setClicked] = useState<boolean>(false);
  useEffect(()=>{
    changeAccessType('PUBLIC');
  }, [])
  const toggleClickHandler = () => {
    if(!clicked){
      changeAccessType('PRIVATE');
    }
    else{
      changeAccessType('PUBLIC');
    }
    setClicked(!clicked);
  }

  return (
    <>
      <div className={`${styles.toggle_container} ${clicked && styles.container_clicked}`} onClick={toggleClickHandler}>
        <div className={`${styles.toggle_circle} ${clicked && styles.circle_clicked}`}></div>
        <p className={`${styles.toggle_title} ${styles.toggle_private} ${clicked && styles.private_clicked}`}>PRIVATE</p>
        <p className={`${styles.toggle_title} ${styles.toggle_public} ${!clicked && styles.public_clicked}`}>PUBLIC</p>
      </div>
    </>
  );
}

export default ToggleBtn2;
