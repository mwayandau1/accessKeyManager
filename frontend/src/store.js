// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/redux/userSlice";

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
