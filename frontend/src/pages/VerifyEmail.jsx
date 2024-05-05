import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SmallSpinner from "../components/SmallSpinner";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}/auth/verify-email/${token}`
        );
        setMessage(response.data.message);
        setLoading(false);
        // setVerified(true);
      } catch (error) {
        setMessage("Error verifying email");
        setLoading(false);
        // setVerified(false);
      }
    };

    verifyEmail();
  }, []);

  return (
    <div className="container mx-auto flex justify-center items-center h-screen max-w-screen-lg">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        {loading ? (
          <SmallSpinner />
        ) : (
          <>
            {" "}
            <p className="text-center">{message}</p>
            <Link to="/" className="text-blue-500 font-bold ">
              Please continue to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
