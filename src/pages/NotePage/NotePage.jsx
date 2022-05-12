import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar/Navbar";
import NavUser from "../../components/NavUser/NavUser";
import axios from "axios";
import classes from "./NotePage.module.css";
import { AiOutlineMail, AiOutlineClockCircle, AiOutlineDownload, AiOutlineHistory, AiFillNotification, AiFillBook, AiFillQuestionCircle, AiOutlineUser } from "react-icons/ai";
import { FiRepeat } from "react-icons/fi";
import { MdAssignment } from "react-icons/md";
import { Interweave } from "interweave";
import dayjs from "dayjs";
import styledComponents from "styled-components";
import FileUpload from "../../components/FileUpload/FileUpload";
import { getDarkerColor } from "../../utils/colors";
import { makeToast } from "../../components/common/Toast";
import { Accordion, SplitButton } from "react-bootstrap";

const StyledDiv = styledComponents.div`
    background-color: ${(props) => props.color};
`;

const StyledButton = styledComponents.button`
    background-color: ${(props) => props.color};
    color: white;
    border: 1px solid transparent;
    transition: all 0.3s ease;
    padding: 5px 20px;
    border-radius: 5px;
    width: 100%;
    &:hover {
        transition: all 0.3s ease;
        background-color: white;
        color: ${(props) => props.color};
        border-color: ${(props) => props.color};
    }
`;

const noteIconType = {
  studyMaterial: <AiFillBook />,
  assignment: <MdAssignment />,
  announcement: <AiFillNotification />,
  quiz: <AiFillQuestionCircle />,
};

const NotePage = () => {
  const { id: note_id } = useParams();
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionFile, setSubmissionFile] = useState("");
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const userType = useSelector((state) => state.auth.type);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/notes/get/${note_id}`);
        console.log(res.data);
        setNote(res.data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    const fetchSubmittedFile = async () => {
      try {
        const res = await axios.get(`/api/submissions/get_my_submissions/${note_id}`);
        console.log(res.data);
        setSubmissionUrl(res.data[0].url);
        setSubmissionFile(res.data[0].url);
        setSubmissionHistory(res.data.slice(1, res.data.length));
      } catch (error) {
        setError(true);
      }
    };
    const fetchAllSubmissions = async () => {
      try {
        const res = await axios.get(`/api/submissions/getAll/${note_id}`);
        console.log(res.data);
        setAllSubmissions(res.data);
      } catch (error) {
        setError(true);
      }
    };
    fetchData();

    userType === "student" && fetchSubmittedFile();
    userType === "teacher" && fetchAllSubmissions();
  }, [note_id, userType]);

  const assignmentSubmitHandler = async (e) => {
    e.preventDefault();
    const url = submissionFile || submissionUrl;
    // check if valid url
    if (url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/)) {
      try {
        const res1 = await axios.post(`/api/submissions/submit/${note_id}`, { url });
        makeToast("Submission Successful", "success");
        const res2 = await axios.get(`/api/submissions/get_my_submissions/${note_id}`);
        console.log(res1.data);
        setSubmissionUrl(res2.data[0].url);
        setSubmissionFile(res2.data[0].url);
        setSubmissionHistory(res2.data.slice(1, res2.data.length));
      } catch (error) {
        makeToast("Submission Failed", "error");
      }
    } else {
      makeToast("Invalid URL", "error");
    }
  };

  return loading ? (
    <h1>Loading</h1>
  ) : (
    <>
      <Navbar right={<NavUser />} />
      <div className={classes.main}>
        <div className={classes.leftPane}>
          <StyledDiv color={note.classroom_color} className={classes.typeIcon}>
            {noteIconType[note.type]}
          </StyledDiv>
          <div className={classes.noteInfo}>
            <div className={classes.noteInfoHeader}>
              <h1 style={{ color: note.classroom_color }}>{note.title}</h1>
              <span className={classes.notePostingInfo}>
                <AiOutlineClockCircle /> {dayjs(note.created_at).format("YYYY-MM-DD, hh:mm A")}
              </span>
              <span className={classes.notePostingInfo}>
                <AiOutlineUser /> {note.teacher_name}, <Link to={`/classroom/${note.classroom_id}`}>{note.classroom_name}</Link>
              </span>
            </div>

            <hr />
            <div className={classes.noteContent}>
              <Interweave content={note.body} />
            </div>
          </div>
        </div>
        <div className={classes.rightPane}>
          {note.type === "assignment" && userType === "student" && (
            <>
              <div className={classes.submission}>
                <h3 className={classes.submissionTitle} style={{ color: note.classroom_color }}>
                  Your Work
                </h3>
                <FileUpload setUploadedFile={setSubmissionFile} uploadedFile={submissionFile} />
                <h3 style={{ fontSize: "0.9rem", textAlign: "center" }}>OR</h3>
                <input className={classes.submissionInput} placeholder="Enter work URL" value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} />
                <StyledButton color={note.classroom_color} onClick={assignmentSubmitHandler}>
                  Submit
                </StyledButton>
              </div>

              {submissionHistory.length > 0 && (
                <div className={classes.submissionHistory}>
                  <h3 className={classes.submissionTitle} style={{ color: note.classroom_color }}>
                    Submission History
                  </h3>
                  <div className={classes.submissionHistoryList}>
                    {submissionHistory.map((submission) => (
                      <div className={classes.submissionHistoryItem}>
                        <p>
                          <AiOutlineHistory /> {dayjs(submission.created_at).format("YYYY-MM-DD, hh:mm A")}{" "}
                        </p>
                        <div className={classes.historyItemButtons}>
                          <a href={submission.url} target="_blank" rel="noopener noreferrer" download="file">
                            <AiOutlineDownload />
                          </a>
                          <button>
                            <FiRepeat />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          {note.type === "assignment" && userType === "teacher" && (
            <>
              <div className={classes.allSubmissions}>
                <h3 className={classes.submissionTitle} style={{ color: note.classroom_color }}>
                  All submissions
                </h3>
                <hr />

                <Accordion>
                  {allSubmissions
                    .filter((sub) => sub.submissions.length > 0)
                    .map((submission) => (
                      <Accordion.Item key={submission.student_id}>
                        <Accordion.Header className={classes.accordionHeader}>{submission.student_name}</Accordion.Header>
                        <Accordion.Body>
                          {submission.submissions.map((sub) => (
                            <div className={classes.allSubmissionItem}>
                              <span>
                                <AiOutlineHistory /> {dayjs(sub.created_at).format("YYYY-MM-DD, hh:mm A")}
                              </span>
                              <div className={classes.submissionItemButtons}>
                                <a href={sub.url} target="_blank" rel="noopener noreferrer" download="file">
                                  <AiOutlineDownload />
                                </a>
                              </div>
                            </div>
                          ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                </Accordion>
              </div>
              {allSubmissions.some((sub) => sub.submissions.length === 0) && (
                <div className={classes.allSubmissions}>
                  <h3 className={classes.submissionTitle} style={{ color: note.classroom_color }}>
                    Missing submissions
                  </h3>
                  <hr />

                  {allSubmissions
                    .filter((sub) => sub.submissions.length === 0)
                    .map((submission) => (
                      <div key={submission.student_id} className={classes.missingSubmissionItem}>
                        <span>{submission.student_name}</span>
                        <a href={`mailto:${submission.student_email}`}>
                          <AiOutlineMail />
                        </a>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NotePage;
