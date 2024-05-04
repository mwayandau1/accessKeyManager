import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Navbar from "./NavBar";
import { clearUser, setUser } from "../features/redux/userReducer";
import axios from "axios";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/auth/me`, {
        withCredentials: true,
      });
      dispatch(setUser(data.user));
      console.log("Data from me page:", data);
    } catch (error) {
      dispatch(clearUser);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {loading && <LoadingSpinner />}
      {user?.email ? (
        <>
          <Navbar />
          <main>{children}</main>
        </>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default MainLayout;
