import React, { useState, useEffect } from "react";
import axios from "axios";
import formatDate from "../features/formatDate";
import LoadingSpinner from "../components/LoadingSpinner";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const KeyPage = () => {
  const [keyData, setKeyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams();
  // const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  useEffect(() => {
    const fetchKey = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/keys/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response);
        setKeyData(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response.data.message || "An error occurred!");
        setLoading(false);
      }
    };

    fetchKey();
  }, [id, token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center mt-4">Error: {error}</p>;
  if (!keyData)
    return <p className="text-center mt-4">No key data available</p>;

  const { keyName, key, status, procurementDate, expiryDate } = keyData;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4">{keyName}</h2>
      <div className="bg-white shadow-md rounded px-8 py-6">
        <div className="mb-4">
          <p className="font-semibold">
            <strong>Status:</strong> {status}
          </p>
          <p className="font-semibold">
            <strong>Key:</strong> {key}
          </p>
          <p className="font-semibold">
            <strong>Procurement Date:</strong> {formatDate(procurementDate)}
          </p>
          <p className="font-semibold">
            <strong>Expiry Date:</strong> {formatDate(expiryDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyPage;
