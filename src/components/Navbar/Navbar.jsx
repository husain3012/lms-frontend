import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import BrandLogo from "../../assets/svg/BrandLogo.svg";
import NavUser from "../NavUser/NavUser";
import classes from "./Navbar.module.css";

const Navbar = (props) => {
  // const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

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
            {props.links &&
              props.links.map((link, index) => {
                return (
                  <li key={index}>
                    <Link to={link.path}>{link.name}</Link>
                  </li>
                );
              })}
          </ul>
        )}
      </div>

      <div className={classes["nav-right"]}>{isAuthenticated ? <NavUser /> : props.right}</div>
    </nav>
  );
};

export default Navbar;
