import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: {
  },
  reducers: {
    setsnacksuccess: (state, action) => {
      toast.success('Helllooooooooooooooooooo', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      document.body.classList.add('dsadsad');

    },
    SET_SNACK: (state, action) => {
      toast.success('Successfully', {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    MUT_SNACK: (context, payload) => {
      document.body.classList.remove(className);
    },
  },
});
export const { setsnacksuccess, MUT_SNACK } = snackbarSlice.actions;
export default snackbarSlice.reducer;
