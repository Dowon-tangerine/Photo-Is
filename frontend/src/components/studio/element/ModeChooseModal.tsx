import { useNavigate } from "react-router-dom";

function ModeChooseModal() {
    const navigate = useNavigate();

    const handelModal = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    const handleNavigateToPinwheel = () => {
        navigate("/pinwheel");
    };

    const handleNavigateToLandscape = () => {
        navigate("/landscape");
    };

    return (
        <div className="background w-full h-full bg-black flex justify-start items-center absolute top-0 left-0 z-50 flex-col">
            <img
                onClick={handelModal}
                src="/imgs/cancel.png"
                alt="Cancel"
                className="close-modal top-2 absolute left-2 w-[70px]"
            />
            <p className="text-white font-bookkMyungjoBold text-[45px] mt-24 mb-20">Choose your map</p>

            <div className="modal w-[850px] h-[350px] bg-white flex">
                <div className="img-section w-1/2 h-full bg-gray-400 relative">
                    <img src="./imgs/tutorial.JPG" alt="Tutorial" className="w-full h-full object-cover" />
                    <div
                        onClick={handleNavigateToPinwheel}
                        className="absolute inset-0 bg-white opacity-0 hover:opacity-75 transition-opacity duration-300 flex flex-col justify-center items-center font-bookkGothicBold"
                    >
                        <p className="text-[20px] mb-8">바람개비</p>
                        <button className="bg-black text-white w-48 opacity-100">ENTER</button>
                    </div>
                </div>
                <div className="img-section w-1/2 h-full bg-black relative">
                    <img src="./imgs/amusementPark.JPG" alt="Amusement Park" className="w-full h-full object-cover" />
                    <div
                        onClick={handleNavigateToLandscape}
                        className="absolute inset-0 bg-white opacity-0 hover:opacity-75 transition-opacity duration-300 flex flex-col justify-center items-center font-bookkGothicBold"
                    >
                        <p className="text-[20px] mb-8">놀이동산</p>
                        <button className="bg-black text-white w-48 opacity-100">ENTER</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModeChooseModal;
