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
import HelloPhoto from "./components/docs/HelloPhoto";
import Dictionary from "./components/docs/Dictionary";
import SignIn from "./components/signin/SignIn";
import SignUp from "./components/signin/SignUp";

import LandScapePage from "./components/studio/LandScapePage";
import TutorialPage from "./components/studio/TutorialPage";
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/studio-enter" element={<StudioEnterPage />} />
                    <Route path="/community/gallery" element={<Gallery />}/>
                    <Route path="/community/gallery/searchName" element={<SearchName />}></Route>
                    <Route path="/community/gallery/searchTitle" element={<SearchTitle />}></Route>
                    <Route path="/community/gallery/searchTag" element={<SearchTag />}></Route>
                    <Route path="/Exhibition" element={<Exhibition />}></Route>
                    <Route path="/myPage" element={<MyPage />}></Route>
                    <Route path="/docs/product1" element={<HelloPhoto />} />
                    <Route path="/docs/product2" element={<Dictionary />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                </Route>
                

                <Route element={<StudioLayout />}>
                    <Route path="/landscape" element={<LandScapePage />}></Route>
                    <Route path="/tutorial" element={<TutorialPage />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
