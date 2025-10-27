import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/provider";
import App from "./App";
import "./index.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./config/theme";
import { SnackbarProvider } from "./components/snackbar";
import { BranchProvider } from "./context/branch/BranchProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SnackbarProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <BranchProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BranchProvider>
      </BrowserRouter>
    </ThemeProvider>
  </SnackbarProvider>
);
