import { Link } from "react-router-dom";
import Logo from "./Logo";

const NavBar = () => {
  return (
    <nav className="bg-blue-500 py-4 px-8 flex justify-between items-center">
      <div className="flex items-center">
        <Logo />
        <div className="flex">
          <Link
            to="/search-key"
            className="text-white mr-4 hover:text-gray-200 hover:font-bold transition duration-300 border-b-2 border-transparent "
          >
            Search Key
          </Link>
        </div>
      </div>
      {/* <div className="flex items-center">
        <input
          type="text"
          placeholder="Search keys..."
          className="mr-4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-400"
        />
        <button className="bg-white text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 transition duration-300">
          Search
        </button>
      </div> */}
    </nav>
  );
};

export default NavBar;
