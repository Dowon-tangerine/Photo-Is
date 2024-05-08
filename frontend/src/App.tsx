import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import StudioLayout from "./components/layouts/StudioLayout";
import Home from "./components/home/Home";
import StudioEnterPage from "./components/studio/StudioEnterPage";
<<<<<<< HEAD
import HelloPhoto from "./components/docs/HelloPhoto";
import Dictionary from "./components/docs/Dictionary";

=======
import LandScapePage from "./components/studio/LandScapePage";
>>>>>>> origin/fe
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/studio-enter" element={<StudioEnterPage />} />
                    <Route path="/docs/product1" element={<HelloPhoto />} />
                    <Route path="/docs/product2" element={<Dictionary />} />
                </Route>
<<<<<<< HEAD
                
=======

                <Route element={<StudioLayout />}>
                    <Route path="/landscape" element={<LandScapePage />}></Route>
                </Route>
>>>>>>> origin/fe
            </Routes>
        </BrowserRouter>
    );
}
