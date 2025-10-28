import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useTheme } from "../../config/theme";

export const DynamicThemeProvider = ({ children }) => {
    const theme = useTheme();

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
};
