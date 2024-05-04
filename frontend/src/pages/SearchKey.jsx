import { useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import formatDate from "../features/formatDate";

const SearchKey = () => {
  const [email, setEmail] = useState("");
  const [keyData, setKeyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [revoked, setRevoked] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

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
          withCredentials: true,
        }
      );
      setKeyData(response.data.key[0]);
      setMessage(response.data.msg);
      console.log(response.data);
      if (response.data.key.length === 0) {
        setError("User doesn't have a token");
      }
      setLoading(false);
    } catch (error) {
      console.log("error by search", error);
      setError(
        error.response.data.msg || "No active key found for the entered email."
      );
      setKeyData(null);
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!keyData) return;

    try {
      await axios.patch(
        `${API_URL}/keys/revoke-key/${keyData._id}`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      setRevoked(false);
      console.log("error by revoke", error);
      setError(error.response.data.msg || "Error revoking key");
    }
  };

  return (
    <div className="h-80vh  p-5 flex flex-col items-center ">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Search Key by Email
        </h2>
        <form
          onSubmit={handleSearch}
          className="flex justify-center items-center space-x-4 mb-4"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-80 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={email === ""}
            className="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Search
          </button>
        </form>
        {loading ? (
          <LoadingSpinner />
        ) : keyData ? (
          <div className="max-w-md bg-white rounded-lg shadow-md p-4 mx-auto ">
            <h3 className="text-xl font-bold mb-2">Key Found</h3>
            <p>
              <strong>Key Name:</strong> {keyData.keyName}
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
            <p className="overflow-auto max-w-full">
              <strong>Key:</strong> {keyData.key}
            </p>
            <button
              onClick={handleRevoke}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 transition duration-300"
            >
              {revoked ? "Revoked!" : "Revoke Key"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            {message && (
              <p className="text-lg font-bold text-gray-600">{message}</p>
            )}
            <p className="text-lg font-bold text-gray-600">
              {(error && error) ||
                `No active key found for the email (${email})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchKey;
