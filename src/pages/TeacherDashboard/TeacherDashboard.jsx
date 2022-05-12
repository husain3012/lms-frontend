import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import classes from "./TeacherDashboard.module.css";
import NavUser from "../../components/NavUser/NavUser";
import axios from "axios";
import { ClassroomCardTeacher } from "../../components/ClassroomCard/ClassroomCard";
import { getClassroomsAction, reorderClassrooms } from "../../app/classroomSlice";
//

//

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { classrooms, loading, error } = useSelector((state) => state.classroom);
  useEffect(() => {
    dispatch(getClassroomsAction());
  }, [dispatch]);
  const reorderList = (sourceIndex, destinationIndex) => {
    dispatch(reorderClassrooms({ sourceIndex, destinationIndex }));
  };

  return (
    <>
      <Navbar right={<NavUser />} />

      <div className={classes.main}>
        <h1 className={classes.welcome}>Welcome {user.name}! </h1>
        {
          <div className={classes.container}>
            {!loading && !error && classrooms.length === 0 && <h2>You have no classrooms yet!</h2>}
            {!loading && !error && classrooms.length > 0 && (
              <div className={classes.classrooms}>
                {/* <DragAndDrop>
                  {classrooms.map((classroom, index) => {
                    return <ClassroomCardTeacher key={classroom._id} {...classroom} /> 
                    return <div key={classroom._id}>sdjksjd</div>;
                  })}
                </DragAndDrop> */}
                {classrooms.map((classroom, index) => {
                  return <ClassroomCardTeacher key={classroom._id} {...classroom} />;
                })}

              </div>
            )}
          </div>
        }
      </div>
    </>
  );
};

export default TeacherDashboard;
