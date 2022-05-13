import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./ClassroomCard.module.css";
import axios from "axios";
import { RiDeleteBin6Fill } from "react-icons/ri";
import Draggable from "react-draggable";
import { getClassroomsAction } from "../../app/classroomSlice";
import { useDispatch } from "react-redux";
import styledComponents from "styled-components";
import Skeleton from 'react-loading-skeleton'
const StyledButton = styledComponents.button`
  background-color: #fafafa;
  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
  &:hover {
    background-color: ${(props) => props.color};
    color: white;
    transition: all 0.2s ease-in-out;
  }
  `;

export const ClassroomCardStudent = ({ name, classroom_id, section, teacher_name, short_id, description, color, draggable, width }) => {
  const style = {
    backgroundColor: color || "#B8405E",
    backgroundImage: `url("https://www.transparenttextures.com/patterns/diagmonds.png")`,
  };

  const nodeRef = useRef(null);

  return (
    <Draggable disabled={!draggable} bounds="parent" nodeRef={nodeRef} handle={`#move_${classroom_id}`}>
      <div ref={nodeRef} className={classes.card} style={{ width: width, height: width }}>
        <div className={classes["sub-card"]} style={style}>
          <Link to={classroom_id ? `/classroom/${classroom_id}` : "#"} className={classes["sub-card-heading"]}>
            {name}
          </Link>
          <p className={classes["sub-card-footer"]}>Section : {section}</p>
          <p className={classes["sub-card-footer"]}>Taught By : {teacher_name}</p>
        </div>
        <div id={`move_${classroom_id}`} className={classes["rem-card"]}>
          <p>{description}</p>
          <div className={classes["btn-links"]}>
            <StyledButton disabled={!short_id} color={color} onClick={() => navigator.clipboard.writeText(short_id)}>
              Copy Code
            </StyledButton>
          </div>{" "}
        </div>
      </div>
    </Draggable>
  );
};

export const ClassroomCardTeacher = ({ name, classroom_id, section, short_id, description, color, draggable, width }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("token");
  const style = {
    backgroundColor: color || "#B8405E",
    backgroundImage: `url("https://www.transparenttextures.com/patterns/diagmonds.png")`,
  };
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await axios(`/api/classroom/students/${classroom_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result);
      setCount(result.data.length);
      setLoading(false);
    };
    fetchData();
  }, [classroom_id, token]);

  const deleteClassroomHandler = async () => {
    const result = await axios.delete(`/api/classroom/${classroom_id}`, {});
    console.log(result);
    dispatch(getClassroomsAction());
  };

  const nodeRef = useRef(null);

  return (
    <Draggable disabled={!draggable} bounds="parent" nodeRef={nodeRef} handle={`#move_${classroom_id}`}>
      <div ref={nodeRef} className={classes.card}>
        <div className={classes["sub-card"]} style={style}>
          <Link to={`/classroom/${classroom_id}`} className={classes["sub-card-heading"]}>
            {name}
          </Link>
          <p className={classes["sub-card-footer"]}>Students Enrolled : {loading ? "Loading" : count}</p>
          <p className={classes["sub-card-footer"]}>Section : {section}</p>
        </div>
        <div id={`move_${classroom_id}`} className={classes["rem-card"]}>
          <p>{description}</p>
          <div className={classes["btn-links"]}>
            <StyledButton color={color} onClick={() => navigator.clipboard.writeText(short_id)}>
              Copy Code
            </StyledButton>
            <StyledButton style={{ color: "#fff", borderColor: "#B20600", backgroundColor: "#B20600" }} onClick={deleteClassroomHandler}>
              <RiDeleteBin6Fill />
            </StyledButton>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export const ClassroomCardSkeleton = () => {
  return (
    <div className={classes.skeletonCard}>
    <Skeleton  count={2} height={10} width={"10ch"} />
    </div>
  );
};
