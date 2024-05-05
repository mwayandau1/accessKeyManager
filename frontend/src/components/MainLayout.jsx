import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import UserNavBar from "./UserNavBar";
import AdminNavBar from "./AdminNavBar";

// eslint-disable-next-line react/prop-types
const MainLayout = ({ children }) => {
  const { user } = useSelector((state) => state.user);

  return (
    <>
      {user?.token ? (
        <>
          {user.role === "admin" ? <AdminNavBar /> : <UserNavBar />}
          <main>{children}</main>
        </>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};

export default MainLayout;
