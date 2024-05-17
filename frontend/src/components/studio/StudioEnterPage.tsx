import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tutorialPicture from "/imgs/tutorialBackImg.png";
import landscapePicture from "/imgs/landScapeBackImg.jpg";
import portraitPicture from "/imgs/portraitBackImg.jpg";
import StudioStyle from "./css/Studio.module.css";

function StudioEnterPage() {
    const navigate = useNavigate();
    const [sectionHeight, setSectionHeight] = useState("45vh"); // 초기 섹션 높이 설정

    useEffect(() => {
        const handleResize = () => {
            const headerHeight = document.querySelector("header")?.offsetHeight || 0; // 헤더 높이 가져오기
            const fullHeight = window.innerHeight; // 전체 창 높이
            const availableHeight = (fullHeight - headerHeight) / 2; // 헤더를 제외한 사용 가능 높이의 절반
            setSectionHeight(`${availableHeight}px`); // 섹션 높이 업데이트
        };

        handleResize(); // 컴포넌트 마운트 시 초기 실행
        window.addEventListener("resize", handleResize); // 창 크기 조절 감지

        return () => {
            window.removeEventListener("resize", handleResize); // 이벤트 리스너 제거
        };
    }, []);

    return (
        <>
            <div
                onClick={() => navigate("/tutorial")}
                className="tutorial flex flex-col items-center justify-center"
                style={{
                    backgroundImage: `url(${tutorialPicture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: '55vh',
                }}
            >
                <p className={StudioStyle.enterTitle}>TUTORIAL</p>
                <p className={StudioStyle.enterInfo}>초보자들이 튜토리얼을 따라하며</p>
                <p className={StudioStyle.enterInfo}>사진의 기본기에 대해서 익힐 수 있습니다.</p>
            </div>
            <div className="downSection flex items-center justify-center" style={{ height: sectionHeight }}>
                <div
                    onClick={() => navigate("/landscape")} // onClick에 arrow function을 사용하여 navigate 호출
                    className="landscape  w-1/2 h-full flex flex-col items-center justify-center"
                    style={{
                        backgroundImage: `url(${landscapePicture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: sectionHeight,
                    }}
                >
                    <p className={StudioStyle.enterTitle}>LANDSCAPE</p>
                    <p className={StudioStyle.enterInfo}>
                        {" "}
                        가상 맵을 자유롭게 돌아다니며 풍경 사진을 찍어볼 수 있습니다.
                    </p>
                </div>
                <div
                    className="portrait  w-1/2 h-full flex flex-col items-center justify-center"
                    style={{
                        backgroundImage: `url(${portraitPicture})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: sectionHeight,
                    }}
                >
                    <p className={StudioStyle.enterTitle}>PORTRAIT</p>
                    <p className={StudioStyle.enterInfo}>
                        가상 맵을 자유롭게 돌아다니며 인물사진을 찍어볼 수 있습니다.
                    </p>
                </div>
            </div>
        </>
    );
}

export default StudioEnterPage;
