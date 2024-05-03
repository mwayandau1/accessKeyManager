// App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import SingleKey from "./pages/SingleKey";
import VerifyEmail from "./pages/VerifyEmail";
import SearchKey from "./pages/SearchKey";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./components/MainLayout";
import EmailSentPage from "./pages/EMailSent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/email-sent/:email" element={<EmailSentPage />} />

        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route
          path="/keys/:id"
          element={
            <MainLayout>
              <SingleKey />
            </MainLayout>
          }
        />
        <Route
          path="/search-key"
          element={
            <MainLayout>
              <SearchKey />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
