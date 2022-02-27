import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import NavUser from "../../components/NavUser/NavUser";
import { ListManager } from "react-beautiful-dnd-grid";
import axios from "axios";
import { ClassroomCardStudent } from "../../components/ClassroomCard/ClassroomCard";
import { getClassroomsAction, reorderClassrooms } from "../../app/classroomSlice";
import classes from "./StudentDashboard.module.css";
import CanvasDraw from "react-canvas-draw";
import { MdOutlineDraw } from "react-icons/md";
import { AiOutlineDelete } from "react-icons/ai";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { classrooms, loading, error } = useSelector((state) => state.classroom);
  const [enableDrawing, setEnableDrawing] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasData, setCanvasData] = useState(null);
  useEffect(() => {
    dispatch(getClassroomsAction());
  }, [dispatch]);

  const [canvas, setBrush] = useState("#908F9B");
  const [brush, setThick] = useState(1);
  const mainRef = useRef(null);
  const canvasRef = useRef(null);
  useEffect(() => {
    dispatch(getClassroomsAction());
  }, [dispatch]);
  const handleCanvasChange = (value) => {
    setEnableDrawing((prevState) => !prevState);
  };
  const canvasDrawHandler = (value) => {
    const data = value.getSaveData();
    setCanvasData(data);
    const storeData = {
      canvasData: data,
      userId: user._id,
    };
    localStorage.setItem("canvas", JSON.stringify(storeData));
  };
  const clearCanvasHandler = () => {
    canvasRef.current.clear();
    const data = canvasRef.current.getSaveData();
    setCanvasData(data);
    const storeData = {
      canvasData: data,
      userId: user._id,
    };
    localStorage.setItem("canvas", JSON.stringify(storeData));
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
      <div className={classes["canvas-menu"]}>
        <button className={`${classes["enable-canvas"]}`} onClick={clearCanvasHandler}>
          <AiOutlineDelete />
        </button>
        <button className={`${classes["enable-canvas"]} ${enableDrawing && classes.active}`} onClick={handleCanvasChange}>
          <MdOutlineDraw />
        </button>
      </div>
      <div className={classes.main}>
        <h1 className={classes.welcome}>Welcome, {user.name}!</h1>
        {showCanvas && (
          <CanvasDraw
            ref={canvasRef}
            onChange={canvasDrawHandler}
            // saveData={canvasData}
            // hideInterface={true}
            hideInterface={!enableDrawing}
            disabled={!enableDrawing}
            brushColor={canvas}
            brushRadius={brush}
            className={classes.canvas}
            backgroundColor="transparent"
            hideGrid={true}
            canvasHeight={mainRef.current.clientHeight}
            canvasWidth={window.innerWidth - 20}
          />
        )}
        {
          <div ref={mainRef} className={classes.container}>
            {!loading && !error && classrooms.length === 0 && <h2>You have no classrooms yet!</h2>}
            {!loading && !error && classrooms.length > 0 && (
              <div className={classes.classrooms}>
                {/* <ListManager animate={false} maxItems={4} items={classrooms} direction="horizontal" render={(classroom) => <ClassroomCardStudent key={classroom._id} {...classroom} />} onDragEnd={reorderList} /> */}
                {classrooms.map((classroom, index) => {
                  return <ClassroomCardStudent key={classroom.classroom_id} {...classroom} />;
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
