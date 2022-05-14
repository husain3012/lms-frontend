import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { loginExistingUser } from "../app/authSlice";
const RequireAuth = (props) => {
  const dispatch = useDispatch();
  const authLevel = props.level;
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated) 
  
  if(!isAuthenticated){
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(loginExistingUser(user));
    }
  }

    

  const userType = useSelector((state) => state.auth.type);
  return <>{isAuthenticated && (authLevel ? userType === authLevel : true) ? props.children : <Navigate to="/login" />}</>;
};

export default RequireAuth;
