import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bars } from "react-loader-spinner";
import { useSelector } from "react-redux";
import classes from "./StudentList.module.css";
import dayjs from "dayjs";
import { AiOutlineUser } from "react-icons/ai";
const StudentsList = ({ classroom_id }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { themeColor, themeColorDark } = useSelector((state) => state.ui);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/classroom/students/${classroom_id}`);
        setStudents(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, [classroom_id]);
  return (
    <>
      {loading ? (
        <div className={classes.loadingContainer}>
          <Bars color={themeColor} />
        </div>
      ) : (
        <div className={classes.container}>
          <h1 style={{color:themeColorDark}}>Enrolled Students</h1>
          <div className={classes.studentsList}>
            {students.map((student) => (
              <div className={classes.student}>
                <h3 style={{color:themeColor}} className={classes.studentAvatar}>
                  <AiOutlineUser />
                </h3>
                <div className={classes.studentInfo}>
                  <h3 style={{color:themeColor}} >{student.student_name}</h3>
                  <p>
                    <a href={`mailto:${student.student_email}`}>{student.student_email}</a>, joined on {dayjs(student.joined_on).format("DD MMM YYYY")}{" "}
                  </p>
                </div>
                <div className={classes.studentActions}>
                  <button className={classes.studentActionBtn}>Kick</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsList;
