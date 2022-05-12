import React from "react";
import { Formik, Field, Form } from "formik";
import Modal from "../common/Modal";
import classes from "./JoinClassroom.module.css";
import axios from "axios";
import { makeToast } from "../common/Toast";
import { hideModal } from "../../app/uiSlice";
import { useDispatch } from "react-redux";
import { getClassroomsAction } from "../../app/classroomSlice";
const JoinClassroom = () => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("user")).token;

  return (
    <Modal header="Join Classroom">
      <div className={classes["modal-body"]}>
        <Formik
          initialValues={{
            classroomCode: "",
          }}
          onSubmit={async (values, { resetForm }) => {
            const data = {
              short_classroom_code: values.classroomCode,
            };

            const config = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            };
            try {
              const response = await axios.post(`/api/classroom/join`, data, config);
              console.log(response);
              if (response.status === 200) {
                dispatch(hideModal());
                makeToast.success("Joined classroom successfully", {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
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
              });
              resetForm();
            }
          }}
        >
          <Form>
            <div className={classes["form-group"]}>
              <label htmlFor="classroomCode">Classroom Code</label>
              <Field required type="text" name="classroomCode" id="classroomCode" className={classes.form_control} />
            </div>
            <div className={classes["form-group"]}>
              <button type="submit">Join</button>
            </div>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};

export default JoinClassroom;
