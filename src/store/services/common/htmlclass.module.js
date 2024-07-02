
import { createSlice } from "@reduxjs/toolkit";
export const SET_CLASSNAME_BY_POSITION = "setClassNameByPosition";
export const htmlclassModuleSlice = createSlice({
  name: "htmlclass",
  initialState: {

  },
  reducers: {
    ADD_BODY_CLASSNAME: (context, className) => {
      document.body.classList.add(className);
    },
    REMOVE_BODY_CLASSNAME: (context, className) => {
      document.body.classList.remove(className);
    },
  },
});
export const { ADD_BODY_CLASSNAME, REMOVE_BODY_CLASSNAME } = htmlclassModuleSlice.actions;
export default htmlclassModuleSlice.reducer;
