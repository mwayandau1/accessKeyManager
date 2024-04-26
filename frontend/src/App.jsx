// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import SingleKey from "./pages/SingleKey";
// import AccessKeys from "./pages/AccessKeys";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="keys/:id" element={<SingleKey />} />
        {/* <Route path="/access-keys" element={AccessKeys} /> */}
      </Routes>
    </Router>
  );
};

export default App;
