import React, { useState } from "react";
import axios from "axios";
import { Link, redirect } from "react-router-dom";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        const response = await axios.post(
          "http://localhost:5000/auth/register",
          { email, password }
        );
        setMessage(response.data.msg);
        console.log(response.data);
      } else {
        const response = await axios.post("http://localhost:5000/auth/login", {
          email,
          password,
        });
        setMessage(response.data.message);
        localStorage.setItem("token", response.data.token);
        console.log(response.data);
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error occurred");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isSignup ? "Sign Up" : "Sign In"}
        </h2>
        {message && <p className="text-center mb-4">{message}</p>}
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <p className="mt-2 mb-4 text-sm  flex justify-end">
            {!isSignup && (
              <button
                className=" text-gray-500 "
                onClick={() => (window.location.href = "/forgot-password")}
              >
                Forgot your password?
              </button>
            )}
          </p>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>

          <p className="mt-2 mb-4 text-sm  flex justify-end">
            {!isSignup && (
              <button
                className=" text-gray-500 "
                onClick={() => setIsSignup(true)}
              >
                Not a member yet?{" "}
                <span className="text-blue-500 italic">Please register</span>
              </button>
            )}
          </p>
          <p className="mt-2 mb-4 text-sm  flex justify-end">
            {isSignup && (
              <button
                className=" text-gray-500 "
                onClick={() => setIsSignup(false)}
              >
                Already have an account?{" "}
                <span className="text-blue-500 italic ">Please login</span>
              </button>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Auth;
