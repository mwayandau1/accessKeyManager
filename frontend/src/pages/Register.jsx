import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import SmallSpinner from "../components/SmallSpinner";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        password,
      });
      setMessage(response.data.msg);
      setLoading(false);
      navigate(`/email-sent/${email}`);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error?.response?.data?.msg || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">
          Sign up with Micro Focus
        </h2>
        {message && <p className="text-center mb-4 text-blue-500">{message}</p>}
        {errorMessage && (
          <p className="text-center mb-4 text-red-500">{errorMessage}</p>
        )}
        <form onSubmit={handleRegister} method="POST">
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
          {loading ? (
            <SmallSpinner />
          ) : (
            <>
              <CustomButton>Sign Up</CustomButton>

              <p className="mt-2 mb-4 text-sm text-center flex justify-end">
                Already have an account?{" "}
                <Link to="/" className="text-blue-500 hover:underline">
                  Login
                </Link>
              </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
