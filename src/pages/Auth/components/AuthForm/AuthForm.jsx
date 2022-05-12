import React, { useEffect, useState } from "react";
import classes from "./AuthForm.module.css";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loginAction } from "../../../../app/authSlice";
import { useNavigate } from "react-router-dom";
import { RiLoader4Fill } from "react-icons/ri";
import { makeToast } from "../../../../components/common/Toast";

const AuthForm = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authType, setAuthType] = useState(props.authType || "signup");
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);

  const handleAuthTypeChange = () => {
    setAuthType((prevValue) => {
      return prevValue === "signup" ? "login" : "signup";
    });
  };

  const validateName = (value) => {
    let error;
    if (authType === "login") return;
    if (!value) {
      error = "Name is required";
    } else if (value.length < 3) {
      error = "Name must be at least 3 characters";
    }
    return error;
  };
  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };
  const validatePassword = (value) => {
    let error;
    if (!value) {
      error = "Required";
    } else if (value.length < 6) {
      error = "Password must be at least 6 characters";
    }
    return error;
  };
  const validateConfirmPassword = (pass, value) => {
    let error;
    if (authType === "login") return;
    if (pass && value) {
      if (pass !== value) {
        error = "Password not matched";
      }
    }
    return error;
  };
  return (
    <>
      <Formik
        initialValues={{
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={async (values, { resetForm }) => {
          // same shape as initial values
          const data = {
            ...values,
            userType: props.userType,
          };
          console.log(data);
          if (authType === "login") {
            dispatch(loginAction(data));
          }
          if (authType === "signup") {
            try {
           

              const response = await axios.post(`/api/${props.userType}/signup`, data);
              console.log(response);
              if (response.status === 200) {
                makeToast.success("Signup Successful!");
                setAuthType("login");
              }
            } catch (error) {
              console.log("Error", error.response.data.message);
              makeToast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              resetForm();
            }
          }
        }}
      >
        {({ errors, touched, isValidating, values, handleSubmit }) => (
          <Form className={classes["auth-form"]}>
            <h3 className={classes.title}>{authType === "signup" ? "Sign Up" : "Login"}</h3>

            <div className={`${classes["form-group"]} ${authType === "login" && classes.hidden}`}>
              <label htmlFor="name">Name</label>
              <Field placeholder="John Doe" className={errors.name && touched.name && classes.error} validate={validateName} type="text" name="name" />
              <div className={`${classes["error-message"]} ${errors.name && touched.name && classes["error-show"]}`}>{errors.name}&nbsp;</div>
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="email">Email</label>
              <Field placeholder="john@example.com" className={errors.email && touched.email && classes.error} validate={validateEmail} type="email" name="email" />
              <div className={`${classes["error-message"]} ${errors.email && touched.email && classes["error-show"]}`}>{errors.email}&nbsp;</div>
            </div>
            <div className={classes["form-group"]}>
              <label htmlFor="password">Password</label>
              <Field placeholder="donotuse1234" className={errors.password && touched.password && classes.error} validate={validatePassword} type="password" name="password" />
              <div className={`${classes["error-message"]} ${errors.password && touched.password && classes["error-show"]}`}>{errors.password}&nbsp;</div>
            </div>

            <div className={`${classes["form-group"]} ${authType === "login" && classes.hidden}`}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Field placeholder="donotuse1234" className={errors.confirmPassword && touched.confirmPassword && classes.error} validate={(value) => validateConfirmPassword(values.password, value)} type="password" name="confirmPassword" />
              <div className={`${classes["error-message"]} ${errors.confirmPassword && touched.confirmPassword && classes["error-show"]}`}>{errors.confirmPassword}&nbsp;</div>
            </div>

            <div className={classes["form-group"]}>
              <button
                disabled={loading}
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className={classes.submit}
              >
                {!loading && (authType === "signup" ? "Sign Up" : "Login")}
                {loading && (
                  <span className={classes.loading}>
                    {" "}
                    <RiLoader4Fill size={"1rem"} className={classes["loading-icon"]} />
                  </span>
                )}
              </button>
            </div>
            <div className={classes["form-footer"]}>
              <p>
                {authType === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <span className={classes.link} onClick={handleAuthTypeChange}>
                  {authType === "signup" ? "Login" : "Sign Up"}
                </span>
              </p>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default AuthForm;
