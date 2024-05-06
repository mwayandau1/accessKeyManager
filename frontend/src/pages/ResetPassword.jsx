import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SmallSpinner from "../components/SmallSpinner";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.patch(
        `${API_URL}/auth/reset-password/${token}`,
        {
          password,
        }
      );
      setMessage(response.data.msg);
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage(error.response.data.msg || "Error resetting password");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form onSubmit={handleResetPassword}>
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
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Reset Password
          </button>
          {loading && <SmallSpinner />}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
