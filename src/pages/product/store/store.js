import { createSlice } from "@reduxjs/toolkit";
import ApiService from "@/store/services/api.service";
import axios from "axios";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    errorsList: null,
    products: null,
    itemsPerPage: 25,
    currentPage: 1,
    globalSearch: '',
    allProducts: []
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setAllProduct: (state, action) => {
      state.allProducts = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setProductsErrors: (state, error) => {
      state.errorsList = error.payload;
    },
    setGlobalSearch: (state, error) => {
      state.globalSearch = error.payload;
    },
    removeProductsError: (state) => {
      state.errorsList = {};
    },
  },
});

export const {
  removeProductsError,
  setProductsErrors,
  setProducts,
  setAllProduct,
  setItemsPerPage,
  setCurrentPage,
  setGlobalSearch,
} = productsSlice.actions;
export default productsSlice.reducer;
