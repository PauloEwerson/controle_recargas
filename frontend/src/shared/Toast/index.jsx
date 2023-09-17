import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "../../../node_modules/react-toastify/dist/ReactToastify.css";

const Toast = ({ message, status }) => {
  if (message) {
    if (status === "success") {
      toast.success(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error(message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }
  return <ToastContainer autoClose={3000} />;
};

export default Toast;
