import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import classes from "./Auth.module.css";
import BlobBackground from "../../components/common/BlobBackground";
import StudentImg from "./assets/images/student.png";
import TeacherImg from "./assets/images/teacher.png";
import AuthForm from "./components/AuthForm/AuthForm";

const NavButton = (props) => {
  const { type, onClick } = props;
  const onClickHandler = () => {
    onClick(type === "student" ? "teacher" : "student");
  };

  return (
    <button className={classes["login-type-btn"]} onClick={onClickHandler}>
      {type === "student" ? "Login As Teacher" : "Login As Student"}
    </button>
  );
};

const Auth = (props) => {
  const authType = props.authType || "login";
  const [userType, setUserType] = useState(props.userType || "student");

  return (
    <>
      <Navbar right={<NavButton type={userType} onClick={setUserType} />} />
      <BlobBackground />

      <div className={classes.main}>
        <div className={classes["form-container"]}>
          <h3 className={classes["form-title"]}> {userType === "student" ? "Student" : "Teacher"}</h3>
          <AuthForm authType={authType} userType={userType} />
        </div>
        <div className={classes["landing-img"]}>
          <img src={userType === "student" ? StudentImg : TeacherImg} alt="landing-img" />
        </div>
      </div>
    </>
  );
};

export default Auth;
