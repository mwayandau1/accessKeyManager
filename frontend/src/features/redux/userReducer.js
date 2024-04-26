// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
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
