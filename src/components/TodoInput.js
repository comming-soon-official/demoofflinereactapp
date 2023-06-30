import React, { useState } from "react";
import { addTodo } from "../redux/Slices";
import { useDispatch, useSelector } from "react-redux";

const TodoInput = () => {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const handleAddTodo = () => {
    if (input !== "") dispatch(addTodo(input));
  };
  return (
    <div>
      <input onChange={(e) => handleInputChange(e)} type="text" />
      <button onClick={handleAddTodo}>add</button>
    </div>
  );
};

export default TodoInput;
