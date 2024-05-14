import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import StudioLayout from "./components/layouts/StudioLayout";
import Home from "./components/home/Home";
import StudioEnterPage from "./components/studio/StudioEnterPage";
import Gallery from "./components/gallery/Gallery";
import SearchName from "./components/gallery/SearchName"
import SearchTitle from "./components/gallery/SearchTitle"
import SearchTag from "./components/gallery/SearchTag"
import MyPage from "./components/mypage/MyPage";
import HelloPhoto from "./components/docs/HelloPhoto";
import Dictionary from "./components/docs/Dictionary";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signin/SignUp";
import LandScapePage from "./components/studio/LandScapePage";
import TutorialPage from "./components/studio/TutorialPage";

export default function App() {
  const [profileUpdated, setProfileUpdated] = useState(false);

  const updateProfile = () => {
    setProfileUpdated((prev) => !prev); // 상태를 변경하여 리렌더링을 유도
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout updateProfile={updateProfile} profileUpdated={profileUpdated} />}>
          <Route path="/" element={<Home />} />
          <Route path="/studio-enter" element={<StudioEnterPage />} />
          <Route path="/community/gallery" element={<Gallery />} />
          <Route path="/community/gallery/searchName" element={<SearchName />} />
          <Route path="/community/gallery/searchTitle" element={<SearchTitle />} />
          <Route path="/community/gallery/searchTag" element={<SearchTag />} />
          <Route path="/myPage" element={<MyPage />}></Route>
          <Route path="/docs/product1" element={<HelloPhoto />} />
          <Route path="/docs/product2" element={<Dictionary />} />
          <Route path="/signin" element={<SignIn updateProfile={updateProfile} />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        <Route element={<StudioLayout />}>
          <Route path="/landscape" element={<LandScapePage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
