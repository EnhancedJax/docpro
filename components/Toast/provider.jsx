import React, { createContext, useContext, useRef, useState } from "react";
import { DEFAULT_TOAST_DURATION } from "../../constants";
import Toast from "./index";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "info",
  });
  const timerRef = useRef(null);

  const showToast = ({ message, type = "info" }) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ visible: true, message, type });
    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, DEFAULT_TOAST_DURATION);
  };

  const hideToast = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast {...toast} onPress={hideToast} />
    </ToastContext.Provider>
  );
};
