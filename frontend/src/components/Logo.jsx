import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link
      to="/home"
      className="hidden md:block bg-gray-500 p-2 rounded-lg mr-4"
    >
      <div className="flex items-center">
        <span className="text-white text-3xl font-bold mr-2">Micro</span>
        <span className="text-gold-500 text-3xl font-serif font-bold">
          Focus
        </span>
      </div>
    </Link>
  );
};

export default Logo;
