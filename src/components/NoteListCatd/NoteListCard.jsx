import React from "react";
import dayjs from "dayjs";
import classes from "./NoteListCard.module.css";
import { AiOutlineClockCircle, AiFillNotification, AiFillBook, AiFillQuestionCircle } from "react-icons/ai";
import { MdAssignment } from "react-icons/md";
import { Link } from "react-router-dom";
import { getDarkerColor } from "../../utils/colors";
const noteIconType = {
  studyMaterial: <AiFillBook />,
  assignment: <MdAssignment />,
  announcement: <AiFillNotification />,
  quiz: <AiFillQuestionCircle />,
};
const NoteListCard = ({ note, color }) => {
  // extract text from note html


  const noteType = note.type;
  const noteDate = dayjs(note.created_at).format("YYYY-MM-DD, hh:mm A");
  return (
    <div className={classes.main}>
      <div className={classes.noteTypeIcon}>
        <div className={classes.noteIcon} style={{ backgroundColor: color }}>
          {noteIconType[noteType]}
        </div>
      </div>
      <div className={classes.noteInfo}>
        <Link to={`/note/${note.note_id}`}>
          <p>
            <strong style={{ color: getDarkerColor(color) }}>New {noteType} added:</strong> {note.title}
          </p>
        </Link>
        <span className={classes.noteDate}>
          <AiOutlineClockCircle /> {noteDate}
        </span>
      </div>
    </div>
  );
};

export default NoteListCard;
