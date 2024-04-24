// components/ResetPassword.js
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token, email } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      // Reset password
      const response = await axios.post(
        `http://localhost:5000/auth/reset-password/${token}/${email}`,
        {
          password,
        }
      );
      setMessage(response.data); // Assuming the response from the server is the message string
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Error resetting password");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <button
            onSubmit={handleResetPassword}
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
