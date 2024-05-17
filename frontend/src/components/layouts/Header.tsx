import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import headerStyle from "./css/Header.module.css";
import useLoginStatus from "../stores/member";

interface MenuItem {
    name: string;
    path: string;
}

interface MenuItems {
    [key: string]: MenuItem[] | never[];
}

const menuItems: MenuItems = {
    Docs: [
        { name: "Hello Photo!", path: "/docs/product1" },
        { name: "Dictionary", path: "/docs/product2" },
    ],
    Studio: [], // Studio에는 메뉴 아이템이 없으므로 never[] 타입을 유지
    Community: [
        { name: "Gallery", path: "/community/gallery" },
        { name: "QnA", path: "/community/topic3" },
    ],
    Exhibition: [],
};

const Header: React.FC = () => {
    const [openMenu, setOpenMenu] = useState<string>("");
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const { isLogin } = useLoginStatus();

    const navigate = useNavigate();
    const location = useLocation(); // useLocation 훅 추가

    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
                setOpenMenu("");
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
    }, [headerRef]);

    // 페이지 경로 변경 시 드롭다운 메뉴 닫기
    useEffect(() => {
        setOpenMenu("");
    }, [location]);

    useEffect(() => {
        const savedProfileUrl = localStorage.getItem("profileUrl");
        setIsLoggedIn(true);
        setProfileUrl(savedProfileUrl);
    }, [isLogin]);

    const handleMenuClick = (item: string) => {
        if (item === "Studio") {
            navigate("/studio-enter"); // Studio 메뉴 클릭 시 이동
        }
        if (item === "Exhibition") {
            navigate("/Exhibition"); // Studio 메뉴 클릭 시 이동
        } else {
            setOpenMenu(openMenu === item ? "" : item);
        }
    };

    return (
        <div ref={headerRef} className="header" style={{position:'fixed', width: '100%', zIndex:'9', top:'0.01px'}}>
            <header className="h-[80px] bg-black text-white font-bookkMyungjoBold p-3 flex justify-between items-center">
                <button className={headerStyle.logo} onClick={() => navigate("/")}>
                    PhotoIs
                </button>
                <div className="rightSection flex items-center">
                    {Object.keys(menuItems).map((item) => (
                        <div className="relative" onClick={() => handleMenuClick(item)} key={item}>
                            <button className={headerStyle.btn}>{item}</button>
                            {openMenu === item && menuItems[item].length > 0 && (
                                <div
                                    className={` absolute left-1/2 transform -translate-x-1/2 top-[51.5px] mt-px w-40 bg-white text-black shadow-md ${headerStyle.dropdown}`}
                                >
                                    <ul className="list-none">
                                        {menuItems[item].map((subItem: MenuItem) => (
                                            <li
                                                key={subItem.name}
                                                className="px-4 py-2 hover:bg-[#4C4C4C] hover:text-whiteu "
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(subItem.path);
                                                }}
                                            >
                                                {subItem.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoggedIn && profileUrl ? (
                        <img
                            src={profileUrl}
                            alt="Profile"
                            className={headerStyle["btn-profile"]}
                            onClick={() => navigate("/mypage")}
                        />
                    ) : (
                        <button className={headerStyle["btn-signin"]} onClick={() => navigate("/signin")}>
                            SIGN IN
                        </button>
                    )}
                </div>
            </header>
        </div>
    );
};

export default Header;
