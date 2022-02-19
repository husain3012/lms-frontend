import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
// Pages
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";

const App = () => {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);
  const userType = useSelector((state) => state.auth.type);
  console.log(userType);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={isLoggedIn ? <Navigate to={"/" + userType} /> : <Home />} />
          <Route exact path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Auth type="login" />} />
          <Route exact path="/register" element={<Auth type="register" />} />
          <Route
            exact
            path="/student"
            element={
              <RequireAuth>
                <StudentDashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
