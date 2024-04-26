import { useState, useEffect } from "react";
import backgroundImage from "/imgs/homeMainPic.jpg";

const Home: React.FC = () => {
    const [sectionHeight, setSectionHeight] = useState("0vh"); // 초기 섹션 높이 설정

    useEffect(() => {
        const handleResize = () => {
            const headerHeight = document.querySelector("header")?.offsetHeight || 0; // 헤더 높이 가져오기
            const fullHeight = window.innerHeight; // 전체 창 높이
            const availableHeight = fullHeight - headerHeight; // 헤더를 제외한 사용 가능 높이의 절반
            setSectionHeight(`${availableHeight}px`); // 섹션 높이 업데이트
        };

        handleResize(); // 컴포넌트 마운트 시 초기 실행
        window.addEventListener("resize", handleResize); // 창 크기 조절 감지

        return () => {
            window.removeEventListener("resize", handleResize); // 이벤트 리스너 제거
        };
    }, []);

    return (
        <div className="wrap relative top-0 w-full h-full transition duration-500">
            <div
                className="page w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})`, height: sectionHeight }}
            >
                <div className="flex flex-col justify-center items-center h-full text-white font-bookkMyungjoBold text-[60px]">
                    <p>TAKE YOUR </p>
                    <p>OWN PICTURE</p>
                    <p>AT</p>
                    <p>PHOTO IS</p>
                </div>
            </div>
            <div className="page w-full h-screen bg-cover bg-center">
                <p>Photo Is 초기 세팅</p>
                <p className="font-bookkGothic">부크크 고딕 얇게: Hello PhotoIs!</p>
                <p className="font-bookkGothicBold">부크크 고딕 굵게: Hello PhotoIs!</p>
                <p className="font-bookkMyungjo">부크크 명조: Hello PhotoIs!</p>
                <p className="font-bookkMyungjoBold">부크크 명조 굵게: Hello PhotoIs!</p>
            </div>
        </div>
    );
};

export default Home;
