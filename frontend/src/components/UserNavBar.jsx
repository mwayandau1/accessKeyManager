import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/redux/userSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      localStorage.clear("user");
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
