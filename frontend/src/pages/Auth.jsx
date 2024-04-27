import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/redux/userReducer";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuth = async (e) => {
    console.log("Here at the auth page");
    e.preventDefault();
    try {
      if (isSignup) {
        const response = await axios.post(
          "https://accesskeymanagerbackend.onrender.com/auth/register",
          { email, password }
        );
        setMessage(response.data.msg);
      } else {
        console.log("Login request");
        const response = await axios.post(
          "https://accesskeymanagerbackend.onrender.com/auth/login",
          {
            email,
            password,
          }
        );
        setMessage(response.data.message);
        console.log(response);
        const user = {
          email: response.data.user.email,
          role: response.data.user.role,
          token: response.data.token,
        };
        localStorage.setItem("user", JSON.stringify(user));

        dispatch(setUser(user));
        navigate("/home");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage(error?.response?.data?.msg || "An error occurred");
      console.log(message);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <div className="text-2xl font-bold mb-4 text-center text-blue-500">
          {isSignup ? "Micro-Focus Platform" : "Welcome back"}
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? "Sign Up" : "Sign In"}
        </h2>
        {message && <p className="text-center mb-4 text-red-500">{message}</p>}
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
