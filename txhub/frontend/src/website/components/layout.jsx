import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      {/* ✅ Header always visible */}
      <Header />

      {/* ✅ Page content */}
      <main>
        <Outlet />
      </main>

      {/* ✅ Footer always visible */}
      <Footer />
    </>
  );
};

export default Layout;