import { Outlet, useNavigate } from "react-router-dom";

function StudioLayout() {
    const navigate = useNavigate(); // useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

    const goBack = () => {
        navigate(-1); // navigate 함수에 -1을 전달하여 이전 페이지로 이동
    };

    return (
        <div className="relative min-h-screen">
            <button onClick={goBack} className=" flex items-center absolute top-5 left-5 z-50">
                <img src="./imgs/back.png" alt="" className="w-[30px] mr-2" />
                <p className="text-[25px] font-bookkMyungjoBold text-white">BACK</p>
            </button>

            <Outlet />
        </div>
    );
}

export default StudioLayout;
