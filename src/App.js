import React, { useEffect } from "react";

import Parse from "./service/parseApi";
import { useSelector } from "react-redux";
import Todos from "./components/Todos";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
const currentUser = Parse.User.current();
const App = () => {
  const todos = useSelector((state) => state.todos);
  const isOnline = useSelector((state) => state.auth.isOnline);
  //   useEffect(() => {
  //     if (currentUser && isOnline) {
  //       const servertodos = currentUser.get("todos");
  //       localStorage.setItem("todos", JSON.stringify(servertodos));
  //     }
  //   }, []);
  //   useEffect(() => {
  //     const fetch = async () => {
  //       const newUser = await Parse.User.current().fetch();
  //       if (currentUser && isOnline) {
  //         const servertodos = currentUser.get("todos");
  //         const localvalue = JSON.parse(localStorage.getItem("todos"));
  //         if (servertodos[servertodos.length - 1]?.date != undefined) {
  //           if (
  //             servertodos[servertodos.length - 1]?.date < new Date().getTime()
  //           ) {
  //             localStorage.setItem("todos", JSON.stringify(servertodos));
  //           }
  //         }
  //         console.log(servertodos[servertodos.length - 1]?.date);
  //       }
  //     };
  //     fetch();
  //   }, []);
  useEffect(() => {
    if (currentUser && isOnline) {
      currentUser.set("todos", todos);
      currentUser.save();
    }
  }, [todos, isOnline]);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
