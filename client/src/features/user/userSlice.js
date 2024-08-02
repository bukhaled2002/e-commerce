import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      Cookies.remove("jwt");
      state.user = null;
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addToWishlist: (state, action) => {
      if (!state.user.wishList.includes(action.payload)) {
        state.user.wishList.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.user.wishList = state.user.wishList.filter(
        (item) => item !== action.payload
      );
    },
    setIsLoadingtoTrue: (state) => {
      state.loading = true;
    },
    setIsLoadingtoFalse: (state) => {
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  login,
  logout,
  addToWishlist,
  removeFromWishlist,
  updateProfile,
  setIsLoadingtoFalse,
  setIsLoadingtoTrue,
} = userSlice.actions;

export default userSlice.reducer;
