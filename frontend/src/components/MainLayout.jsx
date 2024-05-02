import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Navbar from "./NavBar";

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      {user?.token ? (
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
