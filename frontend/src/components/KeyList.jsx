import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../features/formatDate";

function KeyList({ accessKeys, getStatusColor, isAdmin, handleCopy }) {
  return (
    <div>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {accessKeys.map((key) => (
          <li
            key={key._id}
            className={`border p-4 rounded-md flex flex-col justify-between ${getStatusColor(
              key
            )}`}
          >
            <Link to={`/keys/${key._id}`} className="hover:underline">
              <div>
                <h3 className="font-semibold">{key.keyName}</h3>
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
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xs">{key.key}</span>
                {key.status === "active" && (
                  <button
                    onClick={() => handleCopy(key.key)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md"
                  >
                    Copy
                  </button>
                )}
              </div>
            </Link>
            {isAdmin && key.status == "active" && (
              <button
                onClick={() => handleRevoke(key.id)}
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
