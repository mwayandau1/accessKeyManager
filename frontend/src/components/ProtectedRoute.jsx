/* eslint-disable react/prop-types */
// PrivateRoute.jsx
import { Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ element, ...rest }) => {
  const { user } = useSelector((state) => state.user);

  return user?.token ? (
    <Route {...rest} element={element} />
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRoute;
