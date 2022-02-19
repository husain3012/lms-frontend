import React from "react";
import classes from "./BlobBackground.module.css";
import BackgroundBlob from "../../assets/svg/Background.svg";
const BlobBackground = () => {
  return <img src={BackgroundBlob} alt="background" className={classes.background} />;
};

export default BlobBackground;
