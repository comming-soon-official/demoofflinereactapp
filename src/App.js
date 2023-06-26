import axios from "axios";
import React, { useEffect, useState } from "react";

const App = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  // const [mixedTodo, setMixedTodo] = useState([]);
  const [isOnline] = useState(navigator.onLine);
  useEffect(() => {
    const fetch = async () => {
      const localitems = localStorage.getItem("todos");
      setTodoList(() => JSON.parse(localitems));
      try {
        const res = await axios.get("http://localhost:3030/demo");
        const data = res.data[0].todos;
        setTodoList((prev) => {
          let tempVar = [...prev, ...data];
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
      localStorage.setItem("todos", JSON.stringify(todoList));
    }
  }, [todoList]);
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
      </div>
    </>
  );
};
export default App;
