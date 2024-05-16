// ToggleBtn.tsx
import React, { useState } from 'react';
import styles from './css/ToggleBtn2.module.css';

type Props ={
  changeAccessType: (accessType: string) => void;
}

const ToggleBtn2: React.FC<Props> = ({ changeAccessType }) => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [accessType, setAccessType] = useState<string>('');

  const toggleClickHandler = () => {
    setClicked(!clicked);
    setAccessType(clicked ? 'PRIVATE' : 'PUBLIC');
    changeAccessType(accessType);
    console.log(accessType);
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
