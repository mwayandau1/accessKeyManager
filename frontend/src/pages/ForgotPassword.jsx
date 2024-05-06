// components/ForgotPassword.js
import { useState } from "react";
import axios from "axios";
import InputField from "../components/InputField";
import SmallSpinner from "../components/SmallSpinner";
import CustomButton from "../components/CustomButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });
      setMessage(response.data.msg);
      setLoading(false);
    } catch (error) {
      setMessage(
        error.response.data.msg || "Error sending reset password email"
      );
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Forgot Password?
        </h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form onSubmit={handleForgotPassword} method="POST">
          <div className="mb-4">
            <InputField
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
            />
          </div>
          <CustomButton>Continue</CustomButton>

          {loading && <SmallSpinner />}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
