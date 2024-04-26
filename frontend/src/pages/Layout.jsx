import React from "react";
import NavBar from "../components/NavBar";

function Layout({ children }) {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      {children}
    </div>
  );
}

export default Layout;
