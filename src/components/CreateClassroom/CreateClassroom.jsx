import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import classes from "./CreateClassroom.module.css";
import Modal from "../common/Modal";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import { makeToast } from "../common/Toast";
import { hideModal } from "../../app/uiSlice";
import { getClassroomsAction } from "../../app/classroomSlice";

import { Navigate } from "react-router-dom";
const ClassroomPreview = () => {
  return (
    <div className={classes.preview}>
      <div className={classes.preview_card}>
        <div className={classes.preview_card_sub}>
          <p className={classes.preview_card_sub_heading}>
            <b>Subject</b>
          </p>
          <p className={classes.preview_card_sub_tchr}>
            <b>Taught By</b>
          </p>
        </div>
        <div className={classes.preview_card_rem}>
          <p className={classes.preview_card_rem_heading}>
            <b>Description</b>
          </p>
        </div>
      </div>
    </div>
  );
};

const CreateClassroom = (props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("user")).token;
  return (
    <Modal header="Create Classroom">
      <div className={classes["modal-body"]}>
        <Formik
          initialValues={{
            name: "",
            description: "",
            section: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            const data = {
              name: values.name,
              description: values.description,
              section: values.section,
            };

            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            try {
              let backend_host;
              if (process.env.NODE_ENV === "development") {
                backend_host = "";
              } else {
                backend_host = "https://lms-backend-jmi.herokuapp.com/";
              }

              const response = await axios.post(`${backend_host}/api/classroom/create`, data, config);
              console.log(response);
              if (response.status === 200) {
                makeToast("success", "Classroom Created!");
                resetForm();
                dispatch(hideModal());
                dispatch(getClassroomsAction());
              }
            } catch (error) {
              console.log("Error", error.response.data.message);
              makeToast.error(error.response.data.message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              resetForm();
            }
          }}
        >
          <Form>
            <div className={classes["form-group"]}>
              <label htmlFor="name">Name</label>
              <Field autoComplete="off" name="name" type="text" />
            </div>
            <div className={classes["form-group"]}>
              <label htmlFor="description">Section</label>
              <Field autoComplete="off" name="section" type="text" />
            </div>

            <div className={classes["form-group"]}>
              <label htmlFor="description">Description</label>
              <Field component="textarea" name="description" />
            </div>
            <div className={classes["form-group"]}>
              <button type="submit">Create</button>
            </div>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};

export default CreateClassroom;
