// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/redux/userReducer";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
