import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import StudioLayout from "./components/layouts/StudioLayout";
import Home from "./components/home/Home";
import StudioEnterPage from "./components/studio/StudioEnterPage";
import LandScapePage from "./components/studio/LandScapePage";
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/studio-enter" element={<StudioEnterPage />} />
                </Route>
                <Route element={<StudioLayout />}>
                    <Route path="/landscape" element={<LandScapePage />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
