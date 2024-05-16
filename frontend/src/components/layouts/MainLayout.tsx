import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";

const MainLayout: React.FC = () => {
  return (
    <>
      <Header />
      <div style={{paddingTop: '80px'}}></div>
      <Outlet />
    </>
  );
};

export default MainLayout;
