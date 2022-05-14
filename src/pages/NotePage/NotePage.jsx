import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
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
import { Accordion } from "react-bootstrap";
import { Bars } from "react-loader-spinner";
import { setColorTheme } from "../../app/uiSlice";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from "chart.js";
import { Pie, Line } from "react-chartjs-2";
ChartJS.register(ArcElement, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);
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
  const dispatch = useDispatch();
  const { id: note_id } = useParams();
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [submissionFile, setSubmissionFile] = useState("");
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [allowSubmit, setAllowSubmit] = useState(true);
  const [statsData, setStatsData] = useState([]);

  const { themeColor, themeColorDark } = useSelector((state) => state.ui);
  const userType = useSelector((state) => state.auth.type);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/notes/get/${note_id}`);
        console.log(res.data);
        setNote(res.data);
        dispatch(setColorTheme(res.data.classroom_color));

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
        if (res.data[0].url) {
          setAllowSubmit(false);
        }
        setSubmissionHistory(res.data);
      } catch (error) {
        setError(true);
      }
    };
    const fetchAllSubmissions = async () => {
      try {
        const res = await axios.get(`/api/submissions/getAll/${note_id}`);
        console.log(res.data);
        setAllSubmissions(res.data);
        const numberOfSubmissions = res.data.reduce((acc, sub) => (sub.submissions.length > 0 ? acc + 1 : acc), 0);
        const numberOfStudents = res.data.length;
        const submissionsTimeline = {};
        res.data.forEach((student) => {
          if (student.submissions.length > 0) {
            student.submissions.forEach((submission) => {
              const dayOfSubmission = dayjs(submission.created_at).format("MMM DD, YYYY");
              submissionsTimeline[dayOfSubmission] ? submissionsTimeline[dayOfSubmission]++ : (submissionsTimeline[dayOfSubmission] = 1);
            });
          }
        });
        const submissionTimelineArray = Object.keys(submissionsTimeline).map((key) => {
          return {
            date: key,
            count: submissionsTimeline[key],
          };
        });
        const submissionTimeline = submissionTimelineArray.sort((a, b) => {
          return new Date(a.date) - new Date(b.date);
        });

        setStatsData((prevValue) => {
          return {
            ...prevValue,
            percentageSubmissions: (numberOfSubmissions / numberOfStudents) * 100,
            numberOfSubmissions: numberOfSubmissions,
            numberOfStudents: numberOfStudents,
            numberOfMissingSubmissions: numberOfStudents - numberOfSubmissions,
            submissionTimeline: submissionTimeline,
          };
        });
      } catch (error) {
        setError(true);
      }
    };
    fetchData();

    userType === "student" && fetchSubmittedFile();
    userType === "teacher" && fetchAllSubmissions();
  }, [dispatch, note_id, userType]);

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
        setSubmissionHistory(res2.data);
        setAllowSubmit(false);
      } catch (error) {
        makeToast("Submission Failed", "error");
      }
    } else {
      makeToast.warning("Invalid URL");
    }
    
  };

  console.log(allSubmissions);
  return (
    <>
      <Navbar right={<NavUser />} />
      {loading ? (
        <div className={classes.loaderContainer}>
          <Bars color={themeColor} />
        </div>
      ) : (
        <div className={classes.main}>
          <div className={classes.mainContent}>
            <div className={classes.leftPane}>
              <StyledDiv color={themeColor} className={classes.typeIcon}>
                {noteIconType[note.type]}
              </StyledDiv>
              <div className={classes.noteInfo}>
                <div className={classes.noteInfoHeader}>
                  <h1 style={{ color: themeColor }}>{note.title}</h1>
                  <span className={classes.notePostingInfo}>
                    <AiOutlineClockCircle /> {dayjs(note.created_at).format("YYYY-MM-DD, hh:mm A")}
                  </span>
                  <span className={classes.notePostingInfo}>
                    <AiOutlineUser /> {note.teacher_name}, <Link style={{color:themeColor, fontWeight:"bold"}} to={`/classroom/${note.classroom_id}`}>{note.classroom_name}</Link>
                  </span>
                </div>

                <hr />
                <div className={classes.noteContent}>
                  <Interweave content={note.body} />
                </div>

                {note.type === "assignment" && userType === "teacher" && (
            <div className={classes.submissionStats}>
              <h3 className={classes.submissionTitle} style={{ color: themeColor }}>
                Submission Stats
              </h3>
              <div className={classes.submissionStatsItems}>
                <div style={{ width: 220 }}>
                  <Pie
                    options={{
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                    data={{
                      labels: ["Submitted", "Missing"],

                      datasets: [
                        {
                          label: "% of submissions",
                          data: [statsData["numberOfSubmissions"], statsData["numberOfMissingSubmissions"]],
                          backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
                          borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                          borderWidth: 1,
                        },
                      ],
                    }}
                  />
                </div>
                <div style={{ width: 400 }}>
                  <Line
                    options={{
                      scales: {
                        y: {
                          min: 0,
                        },
                      },
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                        autoFit: true,
                      },
                    }}
                    data={{
                      labels: statsData.submissionTimeline?.map((submission) => dayjs(submission.date).format("MMM DD")),
                      datasets: [
                        {
                          label: "Submissions per day",
                          data: statsData.submissionTimeline?.map((submission) => submission.count),
                          borderColor: "rgb(255, 99, 132)",
                          backgroundColor: "rgba(255, 99, 132, 0.5)",
                          tension: 0.1,
                        },
                      ],
                    }}
                  />
                </div>
              </div>
            </div>
          )}
              </div>
              
            </div>
            <div className={classes.rightPane}>
              {note.type === "assignment" && userType === "student" && (
                <>
                  <div className={classes.submission}>
                    <h3 className={classes.submissionTitle} style={{ color: themeColor }}>
                      Your Work
                    </h3>
                    <FileUpload setAllowUpload={setAllowSubmit} setUploadedFile={setSubmissionFile} uploadedFile={submissionFile} />
                    <h3 style={{ fontSize: "0.9rem", textAlign: "center" }}>OR</h3>
                    <input className={classes.submissionInput} placeholder="Enter work URL" value={submissionUrl} onChange={(e) => setSubmissionUrl(e.target.value)} />
                    {allowSubmit && (
                      <StyledButton color={themeColor} onClick={assignmentSubmitHandler}>
                        Submit
                      </StyledButton>
                    )}
                  </div>

                  {submissionHistory.length > 0 && (
                    <div className={classes.submissionHistory}>
                      <h3 className={classes.submissionTitle} style={{ color: themeColor }}>
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
                    <h3 className={classes.submissionTitle} style={{ color: themeColor }}>
                      All submissions
                    </h3>

                    <Accordion   >
                      {allSubmissions
                        .filter((sub) => sub.submissions.length > 0)
                        .map((submission) => (
                          <Accordion.Item  key={submission.student_id}>
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
                      <h3 className={classes.submissionTitle} style={{ color: themeColor }}>
                        Missing submissions
                      </h3>

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
         
        </div>
      )}
    </>
  );
};

export default NotePage;
