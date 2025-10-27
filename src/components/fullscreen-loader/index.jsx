import { Backdrop, Box, CircularProgress, useTheme } from "@mui/material";
import TypographyComponent from "../custom-typography";

export default function FullScreenLoader({ open = false }) {
    const theme = useTheme()

    return (
        <Backdrop
            sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 9999,
            }}
            open={open}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <CircularProgress sx={{ color: theme.palette.grey[900] }} />
                <TypographyComponent
                    fontSize={22}
                    fontWeight={500}
                    sx={{ mt: 2, color: theme.palette.grey[900] }}
                >
                    Loading....
                </TypographyComponent>
            </Box>
        </Backdrop>
    );
}
