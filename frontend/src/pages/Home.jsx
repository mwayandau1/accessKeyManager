import React, { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import KeyList from "../components/KeyList";

const Home = () => {
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [accessKeys, setAccessKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    handleFetchKeys();
  }, []);

  const token = localStorage.getItem("token");

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      setCreatingKey(true);
      const response = await axios.post(
        "http://localhost:5000/keys",
        { keyName: newKeyName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setMessage(response.data.message);
      setCreatingKey(false);
      setNewKeyName("");
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error occurred");
    }
  };

  const handleFetchKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/keys", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setMessage(response.data.message);
      setAccessKeys(response.data.keys);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      setMessage("Error occurred");
    }
  };

  const handleCopy = (key) => {
    if (!navigator.clipboard) {
      console.error("Clipboard API not supported");
      return;
    }

    navigator.clipboard
      .writeText(key)
      .then(() => {
        console.log("Key copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying key to clipboard:", error);
      });
  };

  const getStatusColor = (key) => {
    if (key.status === "revoked") {
      return "bg-red-500";
    } else if (key.status === "expired") {
      return "bg-yellow-500";
    } else {
      return "bg-blue-500";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h3>{message}</h3>
      <div className="mb-4 flex items-center justify-center">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="Enter key name"
          className="mr-2 p-2 border rounded-md"
        />
        <button
          onClick={handleCreateKey}
          disabled={creatingKey}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          {creatingKey ? "Creating..." : "Create Key"}
        </button>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 text-center">All Access Keys</h2>
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <KeyList
          accessKeys={accessKeys}
          getStatusColor={getStatusColor}
          isAdmin={isAdmin}
          handleCopy={handleCopy}
        />
      )}
    </div>
  );
};

export default Home;
