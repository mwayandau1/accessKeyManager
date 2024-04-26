// components/VerifyEmail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token, email } = useParams();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Verify email
    axios
      .post(`/verify-email/${token}`)
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error verifying email:", error);
        setMessage("Error verifying email");
      });
  }, [token]);

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-4">Verify Email</h2>
        <p className="text-center">{message}</p>
        <h4>
          Please continue to login <Link to="/login">Login</Link>
        </h4>
      </div>
    </div>
  );
};

export default VerifyEmail;
