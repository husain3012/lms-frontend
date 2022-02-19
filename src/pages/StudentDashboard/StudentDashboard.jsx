import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import NavUser from "../../components/NavUser/NavUser";
const StudentDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <Navbar right={<NavUser />} />
      <div>
        <h1>Welcome, {user.name}!</h1>
      </div>
    </>
  );
};

export default StudentDashboard;
