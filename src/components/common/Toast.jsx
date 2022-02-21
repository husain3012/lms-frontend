import React from "react";
import { ToastContainer, toast, ToastClassName } from "react-toastify";
import classes from "./Toast.module.css";
import "react-toastify/dist/ReactToastify.css";
const makeToast = toast;
const Toast = () => {
  return <ToastContainer className={classes["toast-container"]} />;
};

export { Toast, makeToast };
