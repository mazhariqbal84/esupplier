import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import commonReducer from "./index";

const allReducers = combineReducers({
  commonReducer
});

export const makeStore = () =>
  configureStore({
    reducer: allReducers,
  });

export const wrapper = createWrapper(makeStore);
