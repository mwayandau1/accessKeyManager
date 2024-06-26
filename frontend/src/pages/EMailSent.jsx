import axios from "axios";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import SmallSpinner from "../components/SmallSpinner";

const EmailSentPage = () => {
  const [error, setError] = useState("");
  const { email } = useParams();
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;
  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await axios.get(`${API_URL}/auth/resend-email/${email}`);
      setLoading(false);
    } catch (error) {
      setError(error.response.data.msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-4">
          Email Sent!
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          An email has been sent to{" "}
          <span className="font-semibold">{email}</span>. Please check your
          email and verify your account to continue
        </p>
        {loading && <SmallSpinner />}
        {error && (
          <p className="text-center text-sm text-red-500 mb-4">{error}</p>
        )}
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="bg-blue-500 text-white px-4 py-2 rounded-md font-semibold text-sm hover:bg-blue-600 transition duration-300"
          >
            Login
          </Link>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-semibold text-sm hover:bg-gray-300 transition duration-300"
            onClick={handleResendEmail}
          >
            Resend Email
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSentPage;
