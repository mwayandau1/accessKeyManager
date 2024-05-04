import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useSelector, useDispatch } from "react-redux";
import UserHeader from "./UserHeader";
import { clearUser } from "../features/redux/userReducer";
import { IoIosPeople } from "react-icons/io";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.clear("token");
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <nav className="bg-blue-500 py-4 px-8 flex justify-between items-center">
      <div className="flex items-center">
        <Logo />
        {user?.role === "admin" && (
          <div className="flex items-center gap-4">
            <Link
              to="/search-key"
              className="bg-slate-500  px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300 "
            >
              Search Key
            </Link>
            <Link to="/schools">
              <IoIosPeople
                size={48}
                color="white"
                className="bg-slate-500 rounded-full"
              />
            </Link>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <UserHeader user={user} email={user.email} />
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
