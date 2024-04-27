// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import SingleKey from "./pages/SingleKey";
import VerifyEmail from "./pages/VerifyEmail";
import Layout from "./pages/Layout";
import SearchKey from "./pages/SearchKey";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/home"
          element={
            <Layout>
              <Home />{" "}
            </Layout>
          }
        />
        <Route path="keys/:id" element={<SingleKey />} />
        <Route path="/search-key" element={<SearchKey />} />
      </Routes>
    </Router>
  );
};

export default App;
