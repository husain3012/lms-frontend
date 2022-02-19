import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BrandLogo from "../../assets/svg/BrandLogo.svg";

import classes from "./Navbar.module.css";

const Navbar = (props) => {
  // const dispatch = useDispatch();
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthenticated = false;

  return (
    <nav className={classes["navbar"]}>
      <div className={classes["nav-brand"]}>
      <Link to="/">
        <img src={BrandLogo} alt="Brand Logo" />
        </Link>
      </div>
      <div className={classes["nav-links"]}>
        {isAuthenticated && (
          <ul>
            <li>
              <a href="/">Stream</a>
            </li>
            <li>
              <a href="/">Class Work</a>
            </li>
            <li>
              <a href="/">People</a>
            </li>
          </ul>
        )}
      </div>
      <div className={classes["nav-right"]}>{props.right}</div>
    </nav>
  );
};

export default Navbar;
