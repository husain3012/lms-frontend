import React from "react";
import classes from "./Modal.module.css";
import { useSelector } from "react-redux";
import { RiCloseLine } from "react-icons/ri";
import { hideModal } from "../../app/uiSlice";
import { useDispatch } from "react-redux";

const Modal = (props) => {
  const modal = useSelector((state) => state.ui.modal);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(hideModal());
  };
  return (
    modal && (
      <div className={classes.modal}>
        <div className={classes["modal-header"]}>
          <h2>{props.header}</h2>
          <RiCloseLine onClick={closeModal} className={classes.close} />
        </div>
        <div className={classes["modal-body"]}>{props.children}</div>
      </div>
    )
  );
};

export default Modal;
