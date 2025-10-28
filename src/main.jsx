import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/auth/provider";
import App from "./App";
import "./index.css";
import { SnackbarProvider } from "./components/snackbar";
import { BranchProvider } from "./context/branch/BranchProvider";
import { DynamicThemeProvider } from "./context/auth/DynamicThemeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SnackbarProvider>
    <BranchProvider>
      <DynamicThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </DynamicThemeProvider>
    </BranchProvider>
  </SnackbarProvider>
);
