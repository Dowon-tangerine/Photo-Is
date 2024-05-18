import { useNavigate } from "react-router-dom";
import tutorialPicture from "/imgs/tutorialBackImg.png";
import landscapePicture from "/imgs/landScapeBackImg.png";
import StudioStyle from "./css/Studio.module.css";

function StudioEnterPage() {
    const navigate = useNavigate();

    return (
        <div className="flex h-[693px] top-0 ">
            <div
                onClick={() => navigate("/tutorial")}
                className="tutorial  w-1/2 h-full flex flex-col items-center justify-center"
                style={{
                    backgroundImage: `url(${tutorialPicture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <p className={StudioStyle.enterTitle}>TUTORIAL</p>
                <p className={StudioStyle.enterInfo}>초보자들이 튜토리얼을 따라하며</p>
                <p className={StudioStyle.enterInfo}>사진의 기본기에 대해서 익힐 수 있습니다.</p>
            </div>
            <div
                onClick={() => navigate("/landscape")} // onClick에 arrow function을 사용하여 navigate 호출
                className="landscape  w-1/2 h-full flex flex-col items-center justify-center"
                style={{
                    backgroundImage: `url(${landscapePicture})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <p className={StudioStyle.enterTitle}>LANDSCAPE</p>
                <p className={StudioStyle.enterInfo}> 가상 맵을 자유롭게 돌아다니며 풍경 사진을 찍어볼 수 있습니다.</p>
            </div>
        </div>
    );
}

export default StudioEnterPage;
