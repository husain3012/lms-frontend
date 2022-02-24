import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./ClassroomCard.module.css";
import axios from "axios";

export const ClassroomCardStudent = (props) => {
  return (
    <div className={classes["container"]}>
      <div className={classes.card}>
        <div className={classes["sub-card"]} style={{ backgroundColor: props.color }}>
          <Link style={{ textDecoration: "none" }} to={`/classroom/${props.classroom_id}`}>
            <p className={classes["sub-card-heading"]}>{props.name}</p>
            <p className={classes["sub-card-tchr"]}>Students Enrolled : {props.students_count}</p>
          </Link>
        </div>
        <div class={classes["rem-card"]}>
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  );
};

export const ClassroomCardTeacher = (props) => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("token");
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const result = await axios(`/api/classroom/students/${props.classroom_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(result);
      setCount(result.data.length);
      setLoading(false);
    };
    fetchData();
  }, [props.classroom_id, token]);

  return (
    <div className={classes["container"]}>
      <div className={classes.card}>
        <div className={classes["sub-card"]} style={{ backgroundColor: props.color }}>
          <Link style={{ textDecoration: "none" }} to={`/classroom/${props.classroom_id}`}>
            <p className={classes["sub-card-heading"]}>{props.name}</p>
            <p className={classes["sub-card-tchr"]}>Students Enrolled : {loading ? "Loading" : count}</p>
          </Link>
        </div>
        <div class={classes["rem-card"]}>
          <p>{props.description}</p>
          <button onClick={() => navigator.clipboard.writeText(props.short_id)}>Copy</button>
        </div>
      </div>
    </div>
  );
};
