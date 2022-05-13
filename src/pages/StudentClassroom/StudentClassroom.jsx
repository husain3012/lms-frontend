import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NavUser from "../../components/NavUser/NavUser";
import { useParams } from "react-router-dom";
import classes from "./StudentClassroom.module.css";
import axios from "axios";

import { Form, Button } from "react-bootstrap";
import { makeToast } from "../../components/common/Toast";
import NoteListCard from "../../components/NoteListCatd/NoteListCard";
import styledComponents from "styled-components";
import { getDarkerColor } from "../../utils/colors";
import { useSelector, useDispatch } from "react-redux";
import { setColorTheme } from "../../app/uiSlice";
import { Bars } from "react-loader-spinner";
const StyledButton = styledComponents.button`
background-color: ${(props) => props.color};
color: white;
&:hover {
  background-color: white; 
  color: ${(props) => props.color};
  border-color: ${(props) => props.color};
}
`;

const StyledDivSecondary = styledComponents.div`
border-color: ${(props) => props.color};

`;

const StudentClassroom = () => {
  const [classroom, setClassroom] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingStream, setLoadingStream] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const dispatch = useDispatch();
  const { themeColor, themeColorDark } = useSelector((state) => state.ui);
  const { id: classroom_id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/classroom/${classroom_id}`);
        setClassroom(res.data);
        dispatch(setColorTheme(res.data.color));
        console.log(res.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchStreamData = async () => {
      try {
        const res = await axios.get(`/api/notes/get_notes/${classroom_id}`);
        console.log(res.data);
        setNotes(res.data);
        setLoadingStream(false);
      } catch (error) {
        setError(true);
        setLoadingStream(false);
      }
    };

    fetchStreamData();
    fetchData();
  }, [classroom_id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(classroom.short_id);
  };

  const headerStyle = {
    backgroundColor: classroom.color || "#B8405E",
    backgroundImage: `url("https://www.transparenttextures.com/patterns/diagmonds.png")`,
    backgroundPosition: "center",
  };

  return (
    <>
      <Navbar right={<NavUser />} />
      {loading ? (
        <div className={classes.loadingContainer}>
          <Bars color={themeColor} />
        </div>
      ) : (
        <div className={classes.main}>
          <div className={classes.headerCard} style={headerStyle}>
            <div className={classes.headerCardContent}>
              <h1 className={classes.headerCardTitle}>{classroom.name}</h1>
              <p className={classes.headerCardSubtitle}>Section: {classroom.section}</p>
              <p className={classes.headerCardSubtitle}>{classroom.description}</p>
            </div>
          </div>

          <div className={classes.streamContainer}>
            {loadingStream ? (
              <h1>Loading</h1>
            ) : (
              <>
                {notes.map((note) => (
                  <NoteListCard color={classroom.color} key={note.note_id} note={note} />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentClassroom;
