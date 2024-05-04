import { useState, useEffect } from "react";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { token, role } = user;
  const [revoked, setRevoked] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    setIsAdmin(role === "admin");
  }, [role]);
  useEffect(() => {
    const fetchKey = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/keys/${id}`, {
          withCredentials: true, // Send cookies along with the request
        });
        setKeyData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response.data.message || "An error occurred!");
        setLoading(false);
      }
    };

    fetchKey();
  }, [id, token]);

  const handleRevoke = async () => {
    try {
      const response = await axios.patch(
        `${API_URL}/keys/revoke-key/${id}`,
        {},
        {
          withCredentials: true, // Send cookies along with the request
        }
      );
      setRevoked(true);
      return response.data;
    } catch (error) {
      console.error("Error revoking key:", error);
      throw error;
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-center mt-4 text-red-500">{error}</p>;
  if (!keyData)
    return <p className="text-center mt-4">No key data available</p>;

  const { keyName, key, status, procurementDate, expiryDate, email } = keyData;

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">{keyName}</h2>
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
          <p className="font-semibold">
            <strong>Email:</strong> {email}
          </p>
        </div>
      </div>
      {isAdmin && status === "active" && (
        <button
          onClick={() => handleRevoke(key._id)}
          className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md self-center"
        >
          {revoked ? "Revoked" : "Revoke"}
        </button>
      )}
    </div>
  );
};

export default KeyPage;
