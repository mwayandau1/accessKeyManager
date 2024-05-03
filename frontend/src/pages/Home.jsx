import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import KeyList from "../components/KeyList";
import { useSelector } from "react-redux";

const Home = () => {
  const [newKeyName, setNewKeyName] = useState("");
  const [creatingKey, setCreatingKey] = useState(false);
  const [accessKeys, setAccessKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { token, role } = user;

  useEffect(() => {
    handleFetchKeys();
    setIsAdmin(role === "admin");
  }, []);

  const handleCreateKey = async (e) => {
    e.preventDefault();
    try {
      setCreatingKey(true);
      const response = await axios.post(
        "https://accesskeymanagerbackend.onrender.com/keys",
        { keyName: newKeyName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.message);
      setCreatingKey(false);
      setNewKeyName("");
      handleFetchKeys();
    } catch (error) {
      setCreatingKey(false);
      console.log(error);
      setMessage(error.response?.data?.msg || "An error occurred");
    }
  };

  const handleFetchKeys = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://accesskeymanagerbackend.onrender.com/keys",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data.msg);
      setAccessKeys(response.data.keys);
      console.log(response.data.keys);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      setMessage(error?.response?.data?.msg || "Error occurred");
    }
  };

  const handleRevoke = async (id) => {
    console.log("The id of the key passed", id);
    try {
      const response = await axios.patch(
        `https://accesskeymanagerbackend.onrender.com/keys/revoke-key/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(response.data);
      console.log(response.data);
      handleFetchKeys();
    } catch (error) {
      console.error("Error revoking key:", error);
    }
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
      <h3 className="m-6 font-bold  ">{message}</h3>
      {!isAdmin && (
        <>
          <div className="mb-4 flex items-center justify-center">
            <form method="POST" onSubmit={handleCreateKey}>
              <input
                required
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Enter key name"
                className="mr-2 p-2 border rounded-md"
              />
              <button
                type="submit"
                disabled={creatingKey || newKeyName === ""}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                {creatingKey ? "Creating..." : "Create Key"}
              </button>
            </form>
          </div>
          <div>
            <hr className="text-gray-700 mt-12 font-bold border-double" />
          </div>
        </>
      )}

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
          handleRevoke={handleRevoke}
        />
      )}
    </div>
  );
};

export default Home;
