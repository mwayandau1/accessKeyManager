import React from "react";
import { Link } from "react-router-dom";

const CustomButton = ({ to, onClick, children }) => {
  if (to) {
    return (
      <Link
        to={to}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full inline-block text-center"
      >
        {children}
      </Link>
    );
  } else {
    return (
      <button
        type="submit"
        onClick={onClick}
        className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
      >
        {children}
      </button>
    );
  }
};

export default CustomButton;
