import { combineReducers, configureStore } from "@reduxjs/toolkit";

import { todoSlice, authSlice } from "./Slices";

const store = combineReducers({
  todos: todoSlice.reducer,
  auth: authSlice.reducer,
});

export default store;
