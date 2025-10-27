import { Box, Button, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import TypographyComponent from "../../components/custom-typography";

export default function NotFoundPage() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        color: "common.white",
        textAlign: "center",
        p: 3,
      }}
    >
      <TypographyComponent fontSize={64} sx={{ fontWeight: "bold", mb: 2, color: theme.palette.primary[600] }}>
        404
      </TypographyComponent>
      <TypographyComponent fontSize={26} sx={{ mb: 3, color: theme.palette.grey[900] }}>
        Oops! The page you are looking for doesn’t exist.
      </TypographyComponent>
      <Button
        variant="contained"
        component={Link}
        to="/"
        sx={{ textTransform: "none", background: theme.palette.primary[600] }}
      >
        Go Back Home
      </Button>
    </Box>
  );
}
