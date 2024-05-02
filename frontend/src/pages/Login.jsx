import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../features/redux/userReducer";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://accesskeymanagerbackend.onrender.com/auth/login",
        { email, password }
      );
      setMessage(response.data.message);
      const user = {
        email: response.data.user.email,
        role: response.data.user.role,
        token: response.data.token,
      };
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(setUser(user));
      navigate("/home");
    } catch (error) {
      console.error("Error:", error);
      setMessage(error?.response?.data?.msg || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
          Welcome back to Micro Focus
        </h2>
        <h2 className="text-2xl font-bold mb-4 text-center"> Please Sign In</h2>
        {message && <p className="text-center mb-4 text-red-500">{message}</p>}
        <form onSubmit={handleLogin}>
          <InputField
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
          />
          <InputField
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />
          <p className="mt-2 mb-4 text-sm text-center flex justify-end">
            <Link
              to="/forgot-password"
              className="text-gray-500 hover:underline"
            >
              Forgot your password?
            </Link>
          </p>
          <CustomButton>Sign In</CustomButton>

          <p className="mt-2 mb-4 text-sm text-center flex justify-center">
            Not a member yet?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
