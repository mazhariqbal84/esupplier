import { createSlice } from "@reduxjs/toolkit";
import ApiService from "@/store/services/api.service";
import axios from "axios";
import CryptoJS from "crypto-js";
// save invoices in local storage

export const ecnryptionSlice = createSlice({
  name: "encryption",
  initialState: {
    errorsList: null,
    encryptedData: null,
  },
  reducers: {
    setEncryption: (state, data) => {
      console.log("Data from ENcryption", data.payload);
    //   const encrypted = CryptoJS.AES.encrypt(
    //     JSON.stringify(data.payload.keyValue),
    //     "secretKey"
    //   ).toString();

    //   localStorage.setItem(data.payload.keyName, encrypted);
    //   state.encryptedData = encrypted;
    },
    setDecryption: (state, data) => {
      console.log("Data from ENcryption", data.payload);
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(data.payload.keyValue),
        "secretKey"
      ).toString();

      localStorage.setItem(data.payload.keyName, encrypted);
      state.encryptedData = encrypted;
    },
    removeInvoicesError: (state) => {
      state.errorsList = {};
    },
  },
});

export const {
  removeInvoicesError,
  setPaymentStatus,
  setEncryption,
  setDecryption,
} = ecnryptionSlice.actions;
export default ecnryptionSlice.reducer;
