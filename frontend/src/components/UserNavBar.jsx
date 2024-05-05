import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/redux/userSlice";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      await axios.delete(`${API_URL}/auth/logout`, {
        withCredentials: true,
      });
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  };

  return (
    <nav className="bg-blue-500 py-4 px-8 flex justify-between items-center">
      <div className="flex items-center">
        <NavLink to="/home">
          <Logo />
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        {/* <UserHeader user={user} email={user.email} /> */}
        <button
          onClick={handleLogout}
          className="bg-slate-500  px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
