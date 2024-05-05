import { FaBarsStaggered } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { useDispatch } from "react-redux";
import { clearUser } from "../features/redux/userSlice";

const Navbar = () => {
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
    <nav className="bg-blue-500 text-white shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* TITLE */}
            <NavLink to="/" className="hidden lg:flex font-bold text-xl mr-4">
              <Logo />
            </NavLink>
            {/* DROPDOWN */}
            <div className="dropdown lg:hidden">
              <label tabIndex={0} className="btn btn-ghost">
                <FaBarsStaggered className="h-6 w-6" />
              </label>
              <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52">
                <NavLinks />
                <p className="mx-4 mt-2">
                  {" "}
                  <button
                    className="capitalize text-black  bg-transparent self-center"
                    onClick={handleLogout}
                  >
                    logout
                  </button>
                </p>
              </ul>
            </div>
          </div>
          <div className="lg:flex items-center hidden">
            <ul className="menu menu-horizontal">
              <NavLinks />
              <button
                onClick={handleLogout}
                className="bg-transparent text-black  px-4 py-2 rounded-md hover:bg-red-400 transition duration-300"
              >
                Logout
              </button>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
