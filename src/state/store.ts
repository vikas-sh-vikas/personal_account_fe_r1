"use client";

import { configureStore } from "@reduxjs/toolkit";
import modalReducer from "./modal/slice";

// Configure the Redux store
const store = configureStore({
  // Combine multiple reducers into a single store
  reducer: {
    modal: modalReducer,
  },
  // Disable the default serializable check for better performance
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { counter: CounterState, drawer: DrawerState, modal: ModalState, toast: ToastState }
export type AppDispatch = typeof store.dispatch;
