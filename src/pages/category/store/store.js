import { createSlice } from "@reduxjs/toolkit";
import ApiService from "@/store/services/api.service";
import axios from "axios";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    errorsList: null,
    categories: null,
    itemsPerPage: 25,
    currentPage: 1,
    globalSearch: '',
    allCategories: []
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setAllCategory: (state, action) => {
      state.allCategories = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setCategoriesErrors: (state, error) => {
      state.errorsList = error.payload;
    },
    setGlobalSearch: (state, error) => {
      state.globalSearch = error.payload;
    },
    removeCategoriesError: (state) => {
      state.errorsList = {};
    },
  },
});

export const {
  removeCategoriesError,
  setCategoriesErrors,
  setCategories,
  setAllCategory,
  setItemsPerPage,
  setCurrentPage,
  setGlobalSearch,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
