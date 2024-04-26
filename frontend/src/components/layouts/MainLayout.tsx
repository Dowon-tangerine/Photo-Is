import Header from "./Header.tsx";
import { Outlet } from "react-router-dom";
function MainLayout() {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
}
export default MainLayout;
