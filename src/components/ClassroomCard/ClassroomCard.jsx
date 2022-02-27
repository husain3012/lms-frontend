import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./ClassroomCard.module.css";
import axios from "axios";
import { RiDeleteBack2Line, RiDragMoveLine } from "react-icons/ri";
import Draggable from "react-draggable";
import { getClassroomsAction } from "../../app/classroomSlice";
import { useDispatch } from "react-redux";

export const ClassroomCardStudent = React.forwardRef((props, ref) => {
  const style = {
    backgroundColor: props.color || "#B8405E",
    backgroundImage: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='341' height='341' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23404' stroke-width='1.5'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23505'%3E%3Ccircle cx='769' cy='229' r='9'/%3E%3Ccircle cx='539' cy='269' r='9'/%3E%3Ccircle cx='603' cy='493' r='9'/%3E%3Ccircle cx='731' cy='737' r='9'/%3E%3Ccircle cx='520' cy='660' r='9'/%3E%3Ccircle cx='309' cy='538' r='9'/%3E%3Ccircle cx='295' cy='764' r='9'/%3E%3Ccircle cx='40' cy='599' r='9'/%3E%3Ccircle cx='102' cy='382' r='9'/%3E%3Ccircle cx='127' cy='80' r='9'/%3E%3Ccircle cx='370' cy='105' r='9'/%3E%3Ccircle cx='578' cy='42' r='9'/%3E%3Ccircle cx='237' cy='261' r='9'/%3E%3Ccircle cx='390' cy='382' r='9'/%3E%3C/g%3E%3C/svg%3E`,
  };

  const nodeRef = useRef(null);

  return (
    <Draggable bounds="parent" nodeRef={nodeRef} handle={`#move_${props.classroom_id}`}>
      <div ref={nodeRef} className={classes.card}>
        <div className={classes["sub-card"]} style={style}>
          <Link to={`/classroom/${props.classroom_id}`} className={classes["sub-card-heading"]}>
            {props.name}
          </Link>
          <p className={classes["sub-card-footer"]}>Taught By : {props.teacher_name}</p>
        </div>
        <div id={`move_${props.classroom_id}`} className={classes["rem-card"]}>
          <p>{props.description}</p>
          <button onClick={() => navigator.clipboard.writeText(props.short_id)}>Copy</button>
        </div>
      </div>
    </Draggable>
  );
});

export const ClassroomCardTeacher = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const token = localStorage.getItem("token");
  const style = {
    backgroundColor: props.color || "#B8405E",
    backgroundImage: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='341' height='341' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23404' stroke-width='1.5'%3E%3Cpath d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3Cg fill='%23505'%3E%3Ccircle cx='769' cy='229' r='9'/%3E%3Ccircle cx='539' cy='269' r='9'/%3E%3Ccircle cx='603' cy='493' r='9'/%3E%3Ccircle cx='731' cy='737' r='9'/%3E%3Ccircle cx='520' cy='660' r='9'/%3E%3Ccircle cx='309' cy='538' r='9'/%3E%3Ccircle cx='295' cy='764' r='9'/%3E%3Ccircle cx='40' cy='599' r='9'/%3E%3Ccircle cx='102' cy='382' r='9'/%3E%3Ccircle cx='127' cy='80' r='9'/%3E%3Ccircle cx='370' cy='105' r='9'/%3E%3Ccircle cx='578' cy='42' r='9'/%3E%3Ccircle cx='237' cy='261' r='9'/%3E%3Ccircle cx='390' cy='382' r='9'/%3E%3C/g%3E%3C/svg%3E`,
  };
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

  const deleteClassroomHandler = async () => {
    const result = await axios.delete(`/api/classroom/${props.classroom_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(result);
    dispatch(getClassroomsAction());
  };

  const nodeRef = useRef(null);

  return (
    <Draggable bounds="parent" nodeRef={nodeRef} handle={`#move_${props.classroom_id}`}>
      <div ref={nodeRef} className={classes.card}>
        <div className={classes["sub-card"]} style={style}>
          <Link to={`/classroom/${props.classroom_id}`} className={classes["sub-card-heading"]}>
            {props.name}
          </Link>
          <p className={classes["sub-card-footer"]}>Students Enrolled : {loading ? "Loading" : count}</p>
        </div>
        <div id={`move_${props.classroom_id}`} className={classes["rem-card"]}>
          <p>{props.description}</p>
          <button onClick={() => navigator.clipboard.writeText(props.short_id)}>Copy</button>
          <button onClick={deleteClassroomHandler}>
            <RiDeleteBack2Line />
          </button>
        </div>
      </div>
    </Draggable>
  );
};
