import axios from "axios";
import React, { useEffect, useState } from "react";
import Parse from "./service/parseApi";
const OldApp = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  // const [mixedTodo, setMixedTodo] = useState([]);
  const [isOnline] = useState(navigator.onLine);
  const User = Parse.User.current();
  useEffect(() => {
    const fetch = async () => {
      const localitems = localStorage.getItem("todos");
      setTodoList(() => JSON.parse(localitems));
      try {
        setTodoList((prev) => {
          let tempVar = [...prev, ...User.get("todos")];
          return [...new Set(tempVar)];
        });
        localStorage.setItem("todos", JSON.stringify(todoList));
      } catch (err) {
        console.log(err);
      }
    };
    fetch();
  }, [isOnline]);
  const handleAddTodo = () => {
    setTodoList((prev) => [...prev, todo]);
  };
  useEffect(() => {
    if (todoList.length !== 0) {
      User.set("todos", todoList);
      User.save();
      localStorage.setItem("todos", JSON.stringify(todoList));
    }
  }, [todoList]);
  const handleAddData = () => {};
  return (
    <>
      <p>{isOnline ? "imonline" : "imoffline"}</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 60,
        }}
      >
        <div>
          <div style={{ display: "flex" }}>
            <input type="text" onChange={(e) => setTodo(e.target.value)} />
            <button onClick={handleAddTodo}>add</button>
          </div>
          {todoList &&
            todoList.map((items, i) => {
              return <li key={i}>{items}</li>;
            })}
        </div>
        <button onClick={handleAddData}>submit</button>
      </div>
    </>
  );
};
export default OldApp;
