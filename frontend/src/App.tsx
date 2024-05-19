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
import Exhibition from "./components/exhibition/Exhibition";
import Qna from "./components/qna/Qna";
import WriteQna from "./components/qna/WriteQna";
import QnaDetail from "./components/qna/QnaDetail";
import UserPage from "./components/userpage/UserPage";
import HelloPhoto from "./components/docs/HelloPhoto";
import Dictionary from "./components/docs/Dictionary";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signin/SignUp";
import LandScapePage from "./components/studio/LandScapePage";
import TutorialPage from "./components/studio/TutorialPage";
import MyPageEdit from "./components/mypage/MyPageEdit";

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout/>}>
          <Route path="/" element={<Home />} />
          <Route path="/studio-enter" element={<StudioEnterPage />} />
          <Route path="/community/gallery" element={<Gallery />} />
          <Route path="/community/gallery/searchName" element={<SearchName />} />
          <Route path="/community/gallery/searchTitle" element={<SearchTitle />} />
          <Route path="/community/gallery/searchTag" element={<SearchTag />} />
          <Route path="/myPage" element={<MyPage />}></Route>
          <Route path="/myPageEdit" element={<MyPageEdit />}></Route>
          <Route path="/Exhibition" element={<Exhibition />}></Route>
          <Route path="/community/qna" element={<Qna />}></Route>
          <Route path="/community/qna/writeqna" element={<WriteQna />}></Route>
          <Route path="/community/qna/detail" element={<QnaDetail />}></Route>
          <Route path="/userPage" element={<UserPage />}></Route>
          <Route path="/docs/product1" element={<HelloPhoto />} />
          <Route path="/docs/product2" element={<Dictionary />} />
          <Route path="/signin" element={<SignIn />} />
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
