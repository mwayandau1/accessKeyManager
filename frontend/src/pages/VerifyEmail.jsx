import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import SmallSpinner from "../components/SmallSpinner";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/auth/verify-email/${token}`)
      .then((response) => {
        setMessage(response.data.message);
        setLoading(false);
        setVerified(true);
      })
      .catch((error) => {
        console.error("Error verifying email:", error);
        setMessage("Error verifying email");
        setLoading(false);
        setVerified(false);
      });
  }, []);

  return (
    <div className="container mx-auto flex justify-center items-center h-screen max-w-screen-lg">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        {loading ? <SmallSpinner /> : <p className="text-center">{message}</p>}
        {verified ? (
          <Link to="/" className="text-blue-500 font-bold ">
            Please continue to Login
          </Link>
        ) : (
          <h2>Invalid token </h2>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
