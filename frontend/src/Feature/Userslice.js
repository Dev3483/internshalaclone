
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  image: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    updateProfilePic: (state, action) => {
      if (state.user) {
        state.user.photo = action.payload;
      }
    },
  },
});

export const { setUser, login, logout, updateProfilePic } = userSlice.actions;
export const selectUser = (state) => state.user.user;
export default userSlice.reducer;
