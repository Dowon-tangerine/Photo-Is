import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../layouts/Header";

const MainLayout: React.FC<{ updateProfile: () => void, profileUpdated: boolean }> = ({ updateProfile, profileUpdated }) => {
  return (
    <>
      <Header updateProfile={updateProfile} profileUpdated={profileUpdated} />
      <Outlet />
    </>
  );
};

export default MainLayout;
