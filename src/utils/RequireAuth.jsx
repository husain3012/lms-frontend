import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
const RequireAuth = (props) => {
  const authLevel = props.level;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userType = useSelector((state) => state.auth.type);
  return <>{isAuthenticated && (authLevel ? userType === authLevel : true) ? props.children : <Navigate to="/login" />}</>;
};

export default RequireAuth;
