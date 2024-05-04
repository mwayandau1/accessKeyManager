/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";
import formatDate from "../features/formatDate";

function KeyList({ accessKeys, getStatusColor, isAdmin, handleRevoke }) {
  const [isCopied, setIsCopied] = useState(false);

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
    setIsCopied(true);
  };

  if (accessKeys.length <= 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg">
          {isAdmin ? "No keys created yet" : "You do not have  key yet"}
        </p>
      </div>
    );
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {accessKeys.map((key) => (
          <li
            key={key._id}
            className={`border p-4 rounded-md flex flex-col justify-between ${getStatusColor(
              key
            )}`}
          >
            <div>
              <Link to={`/keys/${key._id}`} className="hover:underline">
                <h3 className="font-semibold">
                  <span>{key.keyName}</span> By: <span>{key?.user?.email}</span>
                </h3>
              </Link>

              <p className="text-sm">
                {key.status === "revoked"
                  ? "(Revoked)"
                  : key.status === "active"
                  ? "(Active)"
                  : "(Expired)"}
              </p>
            </div>
            <div className="mt-2">
              <div className="flex justify-between">
                <span className="text-xs">Procurement Date:</span>
                <span>{formatDate(key.procurementDate)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs">Expiry Date:</span>
                <span>{formatDate(key.expiryDate)}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center flex-wrap">
              <span className="text-xs ">{key.key}</span>
              {key.status === "active" && !isAdmin && (
                <button
                  onClick={() => handleCopy(key.key)}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md"
                >
                  {isCopied ? "Copied" : "Copy"}
                </button>
              )}
            </div>
            {isAdmin && key.status === "active" && (
              <button
                onClick={() => handleRevoke(key._id)}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md self-center"
              >
                Revoke
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KeyList;
