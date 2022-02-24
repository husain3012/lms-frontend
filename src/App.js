import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import { loginExistingUser } from "./app/authSlice";
import { Toast } from "./components/common/Toast";
// Pages
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
// css
import "./App.css";
import BackDrop from "./components/common/BackDrop";
import Modal from "./components/common/Modal";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user) {
      dispatch(loginExistingUser(user));
    }
  }, [dispatch]);

  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userType = useSelector((state) => state.auth.type);
  console.log(userType);
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
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
