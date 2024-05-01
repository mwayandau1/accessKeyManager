import React from "react";

function UserHeader({ user, email }) {
  return (
    <div className="text-lg font-bold">
      {user.role === "admin" ? (
        <p className="text-white">Micro-Focus Admin</p>
      ) : (
        <p className="text-white">{email}</p>
      )}
    </div>
  );
}

export default UserHeader;
