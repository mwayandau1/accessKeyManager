// components/ForgotPassword.js
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    console.log("forgot password frontend");

    try {
      const response = await axios.post(
        "https://accesskeymanagerbackend.onrender.com/auth/forgot-password",
        {
          email,
        }
      );
      setMessage(response.data.msg);
      navigate(`/email-sent/${email}`);
      console.log(response.data);
    } catch (error) {
      setMessage(
        error.response.data.msg || "Error sending reset password email"
      );
      console.log("Error here", error);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password?
        </h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form>
          <div className="mb-4">
            <InputField
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />
          </div>
          <button
            onClick={handleForgotPassword}
            type="button"
            disabled={email === " "}
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
