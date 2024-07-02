import { createSlice } from "@reduxjs/toolkit";
import ApiService from "@/store/services/api.service";
import axios from "axios";
// save invoices in local storage

export const invoicesSlice = createSlice({
  name: "invoices",
  initialState: {
    errorsList: null,
    invoices: null,
    itemsPerPage: 25,
    currentPage: 1,
    globalSearch: '',
  },
  reducers: {
    setInvoices: (state, action) => {
      state.invoices = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setInvoicesErrors: (state, error) => {
      state.errorsList = error.payload;
    },
    setGlobalSearch: (state, error) => {
      state.globalSearch = error.payload;
    },
    removeInvoicesError: (state) => {
      state.errorsList = {};
    },
  },
});

export const {
  updateInvoice,
  removeInvoicesError,
  setInvoicesErrors,
  setInvoices,
  setItemsPerPage,
  setCurrentPage,
  getInvoices,
  setGlobalSearch,
} = invoicesSlice.actions;
export default invoicesSlice.reducer;
