import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import classes from "./CreateClassroom.module.css";
import Modal from "../common/Modal";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import { makeToast } from "../common/Toast";
import { hideModal } from "../../app/uiSlice";
import { getClassroomsAction } from "../../app/classroomSlice";
import { GithubPicker, CirclePicker } from "react-color";
import { ClassroomCardStudent } from "../ClassroomCard/ClassroomCard";
import { Navigate } from "react-router-dom";

const colors = ["#B8405E", "#1967d2", "#e52592", "#e8710a", "#129eaf", "#9334e6", "#5f6368", "#205375", "#FF6363"];

const CreateClassroom = (props) => {
  const dispatch = useDispatch();
  const { token, user: teacher } = JSON.parse(localStorage.getItem("user"));
  const [classroomName, setClassroomName] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[Math.floor(Math.random() * colors.length)]);
  useEffect(() => {
    return () => {
      setColor(colors[Math.floor(Math.random() * colors.length)]);
      setClassroomName("");
      setSection("");
      setDescription("");
    };
  }, []);

  const formChangeHandler = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "name":
        setClassroomName(value);
        break;
      case "section":
        setSection(value);
        break;
      case "description":
        setDescription(value);
        break;
      default:
        break;
    }
  };

  return (
    <Modal header="Create Classroom">
      <div className={classes["modal-body"]}>
        <Formik
          initialValues={{
            name: classroomName,
            description: description,
            section: section,
          }}
          onSubmit={async (values, { resetForm }) => {
            const data = {
              name: values.name,
              description: values.description,
              section: values.section,
              color: color,
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
          <Form onChange={formChangeHandler}>
            <div className={classes["top-fields"]}>
              <div className={classes["top-fields-left"]}>
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
                  <Field component="textarea" rows={5} name="description" />
                </div>
              </div>
              <div className={classes["top-fields-right"]}>
              <span style={{textAlign:"center", margin:"auto"}}>Preview</span>
                <ClassroomCardStudent name={classroomName} description={description} section={section} teacher_name={teacher?.name} color={color} draggable={false} />
              </div>
            </div>
            <div style={{ textAlign: "center" }} className={classes["form-group"]}>
              <label style={{ margin: "10px auto" }} htmlFor="description">
                Accent Color
              </label>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CirclePicker onChange={(v) => setColor(v.hex)} color={color} triangle={false} colors={colors} width={42 * colors.length} />
              </div>
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
