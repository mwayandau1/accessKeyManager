// components/ForgotPassword.js
import { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

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
      console.log(response);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error sending reset password email");
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Please enter your email to continue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
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
