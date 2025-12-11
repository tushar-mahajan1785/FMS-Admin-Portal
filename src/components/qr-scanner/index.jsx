import { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Stack, useTheme, Button } from "@mui/material";

export default function QRScanner() {
    const theme = useTheme();
    const [result, setResult] = useState("");
    const [start, setStart] = useState(false);

    useEffect(() => {
        if (!start) return;

        const scanner = new Html5Qrcode("qr-reader");

        scanner
            .start(
                { facingMode: "environment" }, // back camera
                {
                    fps: 10,
                    qrbox: { width: 270, height: 350 },
                },
                (decodedText) => {
                    setResult(decodedText);
                    scanner.stop();
                },
                () => { }
            )
            .catch((err) => {
                console.error("Camera start failed:", err);
            });

        return () => {
            scanner.stop().catch(() => { });
        };
    }, [start]);

    return (
        <Stack alignItems="center" sx={{ width: "100%" }}>
            {!start && (
                <Button
                    variant="contained"
                    sx={{
                        mb: 2,
                        background: theme.palette.primary[600],
                        textTransform: "none",
                    }}
                    onClick={() => setStart(true)}
                >
                    Start Camera
                </Button>
            )}

            <Box
                id="qr-reader"
                style={{
                    width: "100%",
                    height: "50vh",
                    background: "#000",
                    borderRadius: 8,
                    overflow: "hidden",
                }}
            ></Box>

            <Box sx={{ mt: 2, fontSize: 16, fontWeight: 500 }}>
                {result ? `Scanned : ${result}` : "Point camera at QR code"}
            </Box>
        </Stack>
    );
}