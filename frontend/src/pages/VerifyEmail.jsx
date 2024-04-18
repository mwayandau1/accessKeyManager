// components/VerifyEmail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
  const { token, email } = useParams();
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Verify email
    axios
      .post(`/verify-email/${token}&${email}`)
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
      </div>
    </div>
  );
};

export default VerifyEmail;
