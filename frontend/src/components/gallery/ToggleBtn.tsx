// ToggleBtn.tsx
import React, { useState } from 'react';
import styles from './css/ToggleBtn.module.css';

const ToggleBtn: React.FC = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [accessType, setAccessType] = useState<String>('');

  const toggleClickHandler = () => {
    setClicked(!clicked);
    setAccessType(clicked ? 'PRIVATE' : 'PUBLIC');
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

export default ToggleBtn;
