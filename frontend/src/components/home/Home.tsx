import backgroundImage from "/imgs/homeMainPic.jpg";

const Home: React.FC = () => {
    return (
        <div className="wrap relative top-0 w-full h-full transition duration-500">
            <div
                className="page w-full h-screen bg-cover bg-center"
                style={{ backgroundImage: `url(${backgroundImage})` }}
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
