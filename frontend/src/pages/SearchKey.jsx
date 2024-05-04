import { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import formatDate from "../features/formatDate";
import { useSelector } from "react-redux";

const SearchKey = () => {
  const [email, setEmail] = useState("");
  const [keyData, setKeyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revoked, setRevoked] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/keys/email`,
        {
          email,
        },
        {
          withCredentials: true, // Send cookies along with the request
        }
      );
      setKeyData(response.data.key[0]);
      setLoading(false);
    } catch (error) {
      console.log("error by search", error);
      setError(
        error.response.data.msg || "No active key found for the entered email."
      );
      setKeyData(null);
    }
    setLoading(false);
  };

  const handleRevoke = async () => {
    if (!keyData) return;

    try {
      await axios.patch(
        `${API_URL}/keys/revoke-key/${keyData._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setKeyData(null);
      setRevoked(false);
    } catch (error) {
      console.log("error by revoke", error);
      setError(error.response.data.msg || "Error revoking key");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-gray-100 rounded-lg shadow-md p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Search Key by Email
        </h2>
        <form onSubmit={handleSearch} method="POST" className="mb-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md mt-2 hover:bg-blue-600 transition duration-300"
              >
                Search
              </button>
            </>
          )}
        </form>
        {error && <p className="text-center mt-4 text-red-500">{error}</p>}
        {keyData ? (
          <div className="mt-4 bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold mb-2">Key Found</h3>
            <p>
              <strong>Key Name:</strong> {keyData.keyName}
            </p>
            <p>
              <strong>Key:</strong> {keyData.key}
            </p>
            <p>
              <strong>Status:</strong> {keyData.status}
            </p>
            <p>
              <strong>Procurement Date:</strong>{" "}
              {formatDate(keyData.procurementDate)}
            </p>
            <p>
              <strong>Expiry Date:</strong> {formatDate(keyData.expiryDate)}
            </p>
            <button
              onClick={handleRevoke}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 transition duration-300"
            >
              {revoked ? "Revoked!" : "Revoke Key"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-bold text-gray-600">
              No active key found for the email ({email})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchKey;
