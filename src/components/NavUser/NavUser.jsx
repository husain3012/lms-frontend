import React from "react";
import { useSelector, useDispatch } from "react-redux";
import UserIcon from "../../assets/svg/UserIcon.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import classes from "./NavUser.module.css";
import { logout } from "../../app/authSlice";
const NavUser = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userType = useSelector((state) => state.auth.type);
  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <div>
      <img className={classes.avatar} src={UserIcon} alt="User Icon" />
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default NavUser;
