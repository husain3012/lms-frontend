import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import { loginExistingUser } from "./app/authSlice";
import { makeToast, Toast } from "./components/common/Toast";
import axios from "axios";
// Pages
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import TeacherClassroom from "./pages/TeacherClassroom/TeacherClassroom";
import StudentClassroom from "./pages/StudentClassroom/StudentClassroom";
import NotePage from "./pages/NotePage/NotePage";
// css
import "./App.css";
import BackDrop from "./components/common/BackDrop";
import Modal from "./components/common/Modal";
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.snow.css"; // ES6
import "highlight.js/styles/github.css";
import "bootstrap/dist/css/bootstrap.min.css";

let initialRender = true;
const App = () => {
  const dispatch = useDispatch();
  const [isBackendOffline, setIsBackendOffline] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(loginExistingUser(user));
    }
  }, [dispatch]);

  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const userType = useSelector((state) => state.auth.type);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // base url for backend
  let backend_host = "";
  console.log(process.env.REACT_APP_ENVIRONMENT);
  if (process.env.REACT_APP_ENVIRONMENT === "development") {
    backend_host = "";
  } else {
    backend_host = process.env.REACT_APP_BACKEND;
  }
  axios.defaults.baseURL = backend_host;

  useEffect(() => {
    if (initialRender) {
      initialRender = false;
      return;
    }
    if (!isBackendOffline) {
      makeToast.info("Service Online!", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: false,
        closeButton: false,
        duration: 1000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
      });
    } else {
      makeToast.error("Server is down, trying to reconnect...", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: false,
        closeOnClick: false,
        closeButton: false,
        duration: 1000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,

        
      });
    }
    initialRender = false;
  }, [isBackendOffline]);

  useEffect(() => {
    // ping server

    const ping = async () => {
      try {
        const res = await axios.get("/ping");
        console.log(res);
        if (res.status === 200) {
          setIsBackendOffline(false);
          console.log("server is up");
          return true;
        }
      } catch (error) {
        setIsBackendOffline(Math.random());

        return false;
      }
    };

    const pingRecursive = async () => {
      const isOnline = await ping();
      if (!isOnline) {
        setTimeout(() => {
          pingRecursive();
        }, 7000);
      }
    };

    pingRecursive();
  }, []);

  // default config for axios
  return (
    <>
      <Toast />
      <BackDrop />
      <Modal />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={isLoggedIn ? <Navigate to={"/" + userType} /> : <Home />} />
          <Route exact path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Auth type="login" />} />
          <Route exact path="/register" element={<Auth type="register" />} />
          <Route
            exact
            path="/student"
            element={
              <RequireAuth level="student">
                <StudentDashboard />
              </RequireAuth>
            }
          />
          <Route
            exact
            path="/teacher"
            element={
              <RequireAuth level="teacher">
                <TeacherDashboard />
              </RequireAuth>
            }
          />
          <Route path="/classroom/:id/*" element={<RequireAuth>{userType === "student" ? <StudentClassroom /> : <TeacherClassroom />}</RequireAuth>} />
          <Route
            exact
            path="/note/:id"
            element={
              <RequireAuth>
                <NotePage />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
