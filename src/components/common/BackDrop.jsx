import React from "react";
import classes from "./BackDrop.module.css";
import { hideModal } from "../../app/uiSlice";
import { useSelector, useDispatch } from "react-redux";
import { useTransition, animated } from "react-spring";

const BackDrop = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.ui.backDrop);
  const transitions = useTransition(show, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    reverse: show,
    delay: 100,

    // config: config.molasses,
  });
  const closeBackDrop = () => {
    dispatch(hideModal());
  };

  return transitions((styles, item) => item && <animated.div onClick={closeBackDrop} className={classes.backdrop} style={styles}></animated.div>);
};

export default BackDrop;
