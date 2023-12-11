import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import appRoute from "./router/Router.tsx";
import { store } from "./store/store.ts";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme({
  typography: {
    fontFamily: "Rubik, sans-serif",
    h1: {
      fontSize: 28,
    },
    
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <RouterProvider router={appRoute} />
        <ToastContainer />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
