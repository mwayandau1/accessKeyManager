// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
// import Cookies from "js-cookie";

// const token = Cookies.get("accessToken") || null;

// const storedUser = localStorage.getItem("user");

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
