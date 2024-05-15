import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import headerStyle from "./css/Header.module.css";

interface MenuItem {
  name: string;
  path: string;
}

interface MenuItems {
  [key: string]: MenuItem[] | never[];
}

const menuItems: MenuItems = {
<<<<<<< HEAD
    Docs: [
        { name: "Hello Photo!", path: "/docs/product1" },
        { name: "Dictionary", path: "/docs/product2" },
    ],
    Studio: [], // Studio에는 메뉴 아이템이 없으므로 never[] 타입을 유지
    Community: [
        { name: "Gallery", path: "/community/gallery" },
        { name: "Exhibition", path: "/exhibition" },
        { name: "QnA", path: "/community/topic3" },
    ],
=======
  Docs: [
    { name: "Hello Photo!", path: "/docs/product1" },
    { name: "Dictionary", path: "/docs/product2" },
  ],
  Studio: [], // Studio에는 메뉴 아이템이 없으므로 never[] 타입을 유지
  Community: [
    { name: "Gallery", path: "/community/gallery" },
    { name: "Exhibition", path: "/community/topic2" },
    { name: "QnA", path: "/community/topic3" },
  ],
>>>>>>> a012d0e803e1fffc3c6ecf5ad3c8dd8eaf9d5a2f
};

interface HeaderProps {
  updateProfile: () => void;
  profileUpdated: boolean;
}

const Header: React.FC<HeaderProps> = ({ updateProfile, profileUpdated }) => {
  const [openMenu, setOpenMenu] = useState<string>("");
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const navigate = useNavigate();
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setOpenMenu("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [headerRef]);

  useEffect(() => {
    const savedProfileUrl = localStorage.getItem("profileUrl");
    if (savedProfileUrl) {
      setProfileUrl(savedProfileUrl);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
    updateProfile(); // 프로필이 업데이트될 때마다 호출
  }, [profileUpdated, updateProfile]);

  const handleMenuClick = (item: string) => {
    if (item === "Studio") {
      navigate("/studio-enter"); // Studio 메뉴 클릭 시 이동
    } else {
      setOpenMenu(openMenu === item ? "" : item);
    }
  };

  return (
    <div ref={headerRef} className="header">
      <header className="h-[80px] bg-black text-white font-bookkMyungjoBold p-3 flex justify-between items-center">
        <button className={headerStyle.logo} onClick={() => navigate("/")}>
          PhotoIs
        </button>
        <div className="rightSection flex items-center">
          {Object.keys(menuItems).map((item) => (
            <div
              className="relative"
              onClick={() => handleMenuClick(item)}
              key={item}
            >
              <button className={headerStyle.btn}>{item}</button>
              {openMenu === item && menuItems[item].length > 0 && (
                <div
                  className={`absolute left-1/2 transform -translate-x-1/2 top-[53px] mt-px w-40 bg-white text-black shadow-md ${headerStyle.dropdown}`}
                >
                  <ul>
                    {menuItems[item].map((subItem: MenuItem) => (
                      <li
                        key={subItem.name}
                        className="px-4 py-2 hover:bg-[#4C4C4C] hover:text-white"
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
            <button
              className={headerStyle["btn-signin"]}
              onClick={() => navigate("/signin")}
            >
              SIGN IN
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
