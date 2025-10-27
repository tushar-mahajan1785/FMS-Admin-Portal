/* eslint-disable react-hooks/exhaustive-deps */

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useCallback, useState } from "react";
import { SnackbarContext } from "../../hooks/useSnackbar";

export function SnackbarProvider({ children }) {
    let toast_duration = 3000

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
        duration: toast_duration,
    });

    const showSnackbar = useCallback(({ message, severity = "info" }) => {
        switch (snackbar?.severity) {
            case 'warning':
                setSnackbar({ open: true, message, severity, duration: 3500 });
                return
            case 'success':
                setSnackbar({ open: true, message, severity, duration: toast_duration });
                return
            case 'error':
                setSnackbar({ open: true, message, severity, duration: 3500 });
                return
            default:
                setSnackbar({ open: true, message, severity, duration: toast_duration });
                return
        }

    }, []);

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}

            <Snackbar
                open={snackbar.open}
                autoHideDuration={snackbar.duration}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}
