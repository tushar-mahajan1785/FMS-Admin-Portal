import { useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

export default function QRScannerComponent({ onScan }) {
    const videoRef = useRef(null);
    const readerRef = useRef(null);

    useEffect(() => {
        readerRef.current = new BrowserQRCodeReader();

        startScanner();

        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        try {
            const devices = await BrowserQRCodeReader.listVideoInputDevices();

            // Prefer back camera
            const backCamera =
                devices.find(d =>
                    d.label.toLowerCase().includes("back")
                ) || devices[0];

            await readerRef.current.decodeFromVideoDevice(
                backCamera.deviceId,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const text = result.getText();
                        onScan?.(text);
                        stopScanner();
                    }
                }
            );
        } catch (error) {
            console.error("Camera start error:", error);
        }
    };

    const stopScanner = () => {
        readerRef.current?.reset();
        const stream = videoRef.current?.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    return (
        <div style={{ width: "100%", height: 350 }}>
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 12,
                    background: "#000"
                }}
            />
            <div style={{ marginTop: 12, textAlign: "center", fontWeight: 600 }}>
                Point camera at QR code
            </div>
        </div>
    );
}
