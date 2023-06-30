import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo } from "../redux/Slices";

const TodoList = () => {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const handleDeleteTodo = (i) => {
    dispatch(deleteTodo(i));
  };
  return (
    <div>
      {todos &&
        todos.map((items, i) => {
          return (
            <div key={i} style={{ display: "flex" }}>
              <li>{items.todo}</li>
              <button
                onClick={() => handleDeleteTodo(i)}
                style={{ marginLeft: 5 }}
              >
                delete
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default TodoList;
