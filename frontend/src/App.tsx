import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import Home from "./components/home/Home";
import StudioEnterPage from "./components/studio/StudioEnterPage";
import Gallery from "./components/gallery/Gallery";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/studio-enter" element={<StudioEnterPage />} />
                    <Route path="/community/gallery" element={<Gallery />}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
