import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BrandLogo from "../../assets/svg/BrandLogo.svg";
import NavUser from "../NavUser/NavUser";
import classes from "./Navbar.module.css";

const Navbar = ({ links, right }) => {
  // const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { themeColor, themeColorDark } = useSelector((state) => state.ui);
  return (
    <>
      <nav className={classes["navbar"]} style={{ borderBottomColor: themeColorDark }}>
        <div className={classes["nav-brand"]}>
          <Link to="/">
            <img src={BrandLogo} alt="Brand Logo" />
          </Link>
        </div>

        <div className={classes["nav-right"]}>{isAuthenticated ? <NavUser /> : right}</div>
      </nav>
      <div className={classes["nav-links"]}>
        {isAuthenticated &&
          links &&
          links.map((link, index) => {
            return (
              <div style={{ backgroundColor: themeColorDark }} className={classes["nav-link-item"]} key={index}>
                <Link to={link.path}>{link.name}</Link>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Navbar;
