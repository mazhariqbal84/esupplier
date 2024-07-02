import { createSlice } from "@reduxjs/toolkit";
export const confirmationSlice = createSlice({
  name: "confirmation",
  initialState: {
    activeModal: false,
    deleteConfrim: false,
    deleteAll: false,
  },
  reducers: {
    setactiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setdeleteConfrim: (state, action) => {
      state.deleteConfrim = action.payload;
    },
    setDeleteAll: (state, action) => {
      state.deleteAll = action.payload;
    },
  },
});
export const { setactiveModal, setdeleteConfrim, setDeleteAll } = confirmationSlice.actions;
export default confirmationSlice.reducer;
