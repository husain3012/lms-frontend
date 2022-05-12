import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import NavUser from "../../components/NavUser/NavUser";
import axios from "axios";
import { ClassroomCardStudent } from "../../components/ClassroomCard/ClassroomCard";
import { getClassroomsAction, reorderClassrooms } from "../../app/classroomSlice";
import classes from "./StudentDashboard.module.css";
import { MdOutlineDraw } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { classrooms, loading, error } = useSelector((state) => state.classroom);
  const [enableDrawing, setEnableDrawing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  useEffect(() => {
    dispatch(getClassroomsAction());
  }, [dispatch]);

  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    dispatch(getClassroomsAction());
  }, [dispatch]);
  const handleCanvasChange = (value) => {
    setEnableDrawing((prevState) => !prevState);
  };

  useEffect(() => {
    if (!loading && !error) {
      setTimeout(() => {
        setShowCanvas(true);
      }, 1000);
    }
  }, [loading, error]);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("canvas"));
    if (showCanvas && canvasRef.current && localData && localData.userId === user._id) {
      canvasRef.current.loadSaveData(localData.canvasData);
    }
  }, [canvasRef, showCanvas, classrooms, user._id]);

  const reorderList = (sourceIndex, destinationIndex) => {
    dispatch(reorderClassrooms({ sourceIndex, destinationIndex }));
  };

  return (
    <>
      <Navbar right={<NavUser />} />
      <div className={classes.main}>
        <h1 className={classes.welcome}>Welcome, {user.name}!</h1>
        {
          <div ref={mainRef} className={classes.container}>
            {!loading && !error && classrooms.length === 0 && <h2>You have no classrooms yet!</h2>}
            {!loading && !error && classrooms.length > 0 && (
              <div className={classes.classrooms}>
                {classrooms.map((classroom, index) => {
                  return <ClassroomCardStudent key={classroom._id} {...classroom} />;
                })}
              </div>
            )}
          </div>
        }
      </div>
    </>
  );
};

export default StudentDashboard;
