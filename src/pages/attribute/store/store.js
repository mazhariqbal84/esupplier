import { createSlice } from "@reduxjs/toolkit";
import ApiService from "@/store/services/api.service";
import axios from "axios";

export const attributesSlice = createSlice({
  name: "attributes",
  initialState: {
    errorsList: null,
    attributes: null,
    itemsPerPage: 25,
    currentPage: 1,
    globalSearch: '',
    allAttributes: []
  },
  reducers: {
    setAttributes: (state, action) => {
      state.attributes = action.payload;
    },
    setAllAttribute: (state, action) => {
      state.allAttributes = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setAttributesErrors: (state, error) => {
      state.errorsList = error.payload;
    },
    setGlobalSearch: (state, error) => {
      state.globalSearch = error.payload;
    },
    removeAttributesError: (state) => {
      state.errorsList = {};
    },
  },
});

export const {
  removeAttributesError,
  setAttributesErrors,
  setAttributes,
  setAllAttribute,
  setItemsPerPage,
  setCurrentPage,
  setGlobalSearch,
} = attributesSlice.actions;
export default attributesSlice.reducer;
