import React, { useEffect, useState } from "react";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import { useDispatch } from "react-redux";
import { checkIsOnline } from "../redux/Slices";
const Todos = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      dispatch(checkIsOnline(true));
    };

    const handleOffline = () => {
      setIsOnline(false);
      dispatch(checkIsOnline(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isOnline ? (
          <p>You are currently online</p>
        ) : (
          <p>You are currently offline</p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "70vh",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <TodoInput />
        <TodoList />
      </div>
    </>
  );
};

export default Todos;
