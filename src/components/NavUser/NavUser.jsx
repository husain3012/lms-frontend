import React from "react";
import { useSelector, useDispatch } from "react-redux";
import UserIcon from "../../assets/svg/UserIcon.svg";
import { Link } from "react-router-dom";
import axios from "axios";
import classes from "./NavUser.module.css";
import { logout } from "../../app/authSlice";
import AddIcon from "../../assets/svg/AddIcon.svg";
import { showModal } from "../../app/uiSlice";
import CreateClassroom from "../CreateClassroom/CreateClassroom";
import JoinClassroom from "../JoinClassroom/JoinClassroom";
const NavUser = (props) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const userType = useSelector((state) => state.auth.type);
  const logoutHandler = () => {
    dispatch(logout());
  };
  const addHandler = () => {
    dispatch(showModal());
  };
  return (
    <>
      {userType === "teacher" ? <CreateClassroom /> : <JoinClassroom />}

      <div className={classes.main}>
        <div className={classes["icon-container"]}>
          <img onClick={addHandler} className={classes.add} src={AddIcon} alt="Create or Join" />
        </div>
        <div className={classes["icon-container"]}>
          <img className={classes.avatar} src={user.avatar || UserIcon} alt="User Icon" />
        </div>
        <button onClick={logoutHandler}>Logout</button>
      </div>
    </>
  );
};

export default NavUser;
