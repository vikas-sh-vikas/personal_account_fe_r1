"use client";

import { Provider } from "react-redux";
import store from "@/state/store";
import { ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import ModalContainer from "@/components/ui/modal-container/modal-container";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <ModalContainer />
        {children}
      </SessionProvider>
    </Provider>
  );
}
