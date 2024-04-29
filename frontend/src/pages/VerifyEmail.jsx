import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    axios
      .get(
        `https://accesskeymanagerbackend.onrender.com/auth/verify-email/${token}`
      )
      .then((response) => {
        setMessage(response.data.message);
        setVerified(true);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error verifying email:", error);
        setMessage("Error verifying email");
        setVerified(false);
      });
  }, []);

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        <p className="text-center">{message}</p>

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
