import { createSlice } from "@reduxjs/toolkit";
import ApiService from "@/store/services/api.service";
import axios from "axios";

export const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    errorsList: null,
    brands: null,
    itemsPerPage: 25,
    currentPage: 1,
    globalSearch: '',
    allBrands: []
  },
  reducers: {
    setBrands: (state, action) => {
      state.brands = action.payload;
    },
    setAllBrand: (state, action) => {
      state.allBrands = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setBrandsErrors: (state, error) => {
      state.errorsList = error.payload;
    },
    setGlobalSearch: (state, error) => {
      state.globalSearch = error.payload;
    },
    removeBrandsError: (state) => {
      state.errorsList = {};
    },
  },
});

export const {
  removeBrandsError,
  setBrandsErrors,
  setBrands,
  setAllBrand,
  setItemsPerPage,
  setCurrentPage,
  setGlobalSearch,
} = brandsSlice.actions;
export default brandsSlice.reducer;
