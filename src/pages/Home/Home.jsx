import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import classes from "./Home.module.css";
import LandingImg from "./assets/images/landing-img.png";
import { Link } from "react-router-dom";
import BlobBackground from "../../components/common/BlobBackground";
const LoginBtn = () => {
  return (
    <Link to="/login" className={classes["login-btn"]}>
      Login
    </Link>
  );
};
const Home = () => {
  return (
    <>
      <Navbar right={<LoginBtn />} />

      <BlobBackground />
      <div className={classes.main}>
        <div className={classes["landing-page"]}>
          <div className={classes["heading-text"]}>
            Learning <br />
            Management
            <br /> System
          </div>
          <div className={classes["landing-image"]}>
            <img src={LandingImg} alt="landing-img" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
