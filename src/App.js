import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import { loginExistingUser } from "./app/authSlice";
import { Toast } from "./components/common/Toast";
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
import 'react-quill/dist/quill.core.css'
import "react-quill/dist/quill.snow.css"; // ES6
import 'highlight.js/styles/github.css';
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch(loginExistingUser(user));
    }
  }, [dispatch]);

  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const token = useSelector((state) => state.auth.token);
  const userType = useSelector((state) => state.auth.type);
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  // base url for backend
  let backend_host;
  if (process.env.NODE_ENV === "development") {
    backend_host = "";
  } else {
    backend_host = "https://lms-backend-jmi.herokuapp.com";
  }
  axios.defaults.baseURL = backend_host;

  console.log(token);
  console.log(userType);

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
          <Route exact path="/classroom/:id" element={<RequireAuth>{userType === "student" ? <StudentClassroom /> : <TeacherClassroom />}</RequireAuth>} />
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
