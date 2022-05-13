import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NavUser from "../../components/NavUser/NavUser";
import { useParams } from "react-router-dom";
import classes from "./TeacherClassroom.module.css";
import axios from "axios";
import ReactQuill from "react-quill";
import hljs from "highlight.js";
import QRCode from "react-qr-code";
import { Form, Button } from "react-bootstrap";
import { makeToast } from "../../components/common/Toast";
import NoteListCard from "../../components/NoteListCatd/NoteListCard";
import styledComponents from "styled-components";
import { getDarkerColor } from "../../utils/colors";
import { useDispatch, useSelector } from "react-redux";
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

const { Select } = Form;
// const modules = {
//   toolbar: [[{ header: [1, 2, false] }], ["bold", "italic", "underline", "strike", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image"], ["clean"], ["code-block"], ["video"]],
// };
const modules = {
  syntax: {
    highlight: (text) => hljs.highlightAuto(text).value,
  },
  toolbar: [["bold", "italic", "underline", "blockquote"], [{ list: "ordered" }, { list: "bullet" }], ["link", "image", "video"], ["clean"], ["code-block"]],
  clipboard: {
    matchVisual: false,
  },
};

const formats = ["header", "font", "size", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "indent", "link", "image", "video", "code-block"];
const TeacherClassroom = () => {
  const { themeColor, themeColorDark } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [classroom, setClassroom] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loadingStream, setLoadingStream] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [noteType, setNoteType] = useState("");
  const [noteTitle, setNoteTitle] = useState("");

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
  }, [classroom_id, dispatch]);

  const postNoteHandler = async (e) => {
    e.preventDefault();
    console.log(noteBody, noteType);
    const data = {
      title: noteTitle,
      body: noteBody,
      type: noteType,
    };
    try {
      const res = await axios.post(`/api/notes/post_notes/${classroom_id}`, data);
      console.log(res.status);
      if (res.status === 200) {
        makeToast.success("Posted Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        const resp2 = await axios.get(`/api/notes/get_notes/${classroom_id}`);
        setNotes(resp2.data);
        setNoteBody("");
        setNoteType("");
      }
    } catch (error) {
      makeToast.error(error.response.data?.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setError(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(classroom.short_id);
    makeToast.success("Copied to clipboard!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
    });
  };

  const headerStyle = {
    backgroundColor: themeColor || "#B8405E",
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
          <Form onSubmit={postNoteHandler} className={classes.postFormContainer}>
            <div className={classes.leftInfoPane}>
              <StyledDivSecondary color={themeColor} className={classes.classCodeBox}>
                <h2 className={classes.classCodeTitle}>Class Code</h2>
                <QRCode value={classroom.short_id} size={100} fgColor={themeColorDark} />
                <span data-tip data-for="copy-class-code" id="copy-class-code" onClick={copyToClipboard} style={{ cursor: "copy" }}>
                  {classroom.short_id.slice(10) + "..."}
                </span>
              </StyledDivSecondary>
            </div>

            <div className={classes.editor}>
              <input className={classes.titleInput} required type="text" placeholder="Title" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} />
              <ReactQuill className={classes.quill} theme="snow" value={noteBody} onChange={setNoteBody} modules={modules} formats={formats} />
            </div>
            <div className={classes.rightInfoPane}>
              <Select required onChange={(e) => setNoteType(e.target.value)} value={noteType} className={classes.select}>
                <option value={""}>Select type</option>
                <option value={"announcement"}>Announcement</option>
                <option value={"assignment"}>Assignment</option>
                <option value={"quiz"}>Quiz</option>
                <option value={"studyMaterial"}>Study Material</option>
              </Select>

              <StyledButton variant="primary" className={classes.postButton} type="submit" color={themeColor}>
                Post
              </StyledButton>
            </div>
          </Form>
          <div className={classes.streamContainer}>
            {loadingStream ? (
              <h1>Loading</h1>
            ) : (
              <>
                {notes.map((note) => (
                  <NoteListCard color={themeColor} key={note.note_id} note={note} />
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default TeacherClassroom;
