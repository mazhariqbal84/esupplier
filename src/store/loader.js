import { createSlice } from "@reduxjs/toolkit";
export const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
    isModal: false,
  },
  reducers: {
    ON_LOADING: (state, action) => {
      state.isLoading = action.payload;
    },
    SET_MODAL: (state, action) => {
      state.isModal = action.payload;
    },
  },
});
export const {
  ON_LOADING,
  SET_MODAL,
} = loaderSlice.actions;

export default loaderSlice.reducer;
