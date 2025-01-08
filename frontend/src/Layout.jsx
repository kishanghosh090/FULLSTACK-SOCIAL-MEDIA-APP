import React from "react";

import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "./Components/BottomNav/BottomNav";

function Layout() {
  const location = useLocation();
  const shouldRenderHeader =
    location.pathname === "/ViewChat" ||
    location.pathname === "/Friends" ||
    location.pathname === "/ViewPost";

  return (
    <>
      <Outlet />
      {shouldRenderHeader && <BottomNav />}
    </>
  );
}

export default Layout;
