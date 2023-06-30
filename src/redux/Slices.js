import { createSlice } from "@reduxjs/toolkit";
import Parse from "../service/parseApi";
const isOnline = navigator.onLine;
const currentUser = Parse.User.current();
if (currentUser && isOnline) {
  const servertodos = currentUser.get("todos");
  localStorage.setItem("todos", JSON.stringify(servertodos));
}
const storedItems = JSON.parse(localStorage.getItem("todos"));
const initialValue = storedItems ? storedItems : [];

const todoSlice = createSlice({
  name: "todos",
  initialState: initialValue,
  reducers: {
    fetchTodos(state, action) {
      return action.payload;
    },
    addTodo(state, action) {
      const todos = state;
      const newTodo = {
        date: new Date().getTime(),
        todo: action.payload,
      };
      const tempvar = [...todos, newTodo];

      localStorage.setItem("todos", JSON.stringify(tempvar));
      return tempvar;
    },
    deleteTodo(state, action) {
      state = state.filter((_, index) => index !== action.payload);
      localStorage.setItem("todos", JSON.stringify(state));
      return state;
    },
  },
});

const initialAuthvalue = {
  currentuser: undefined,
  isOnline: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthvalue,
  reducers: {
    checkCurrentUser(state, action) {
      state.currentuser = action.payload;
    },
    checkIsOnline(state, action) {
      state.isOnline = action.payload;
    },
  },
});

export const { addTodo, deleteTodo, fetchTodos } = todoSlice.actions;
export const { checkCurrentUser, checkIsOnline } = authSlice.actions;
export { todoSlice, authSlice };
