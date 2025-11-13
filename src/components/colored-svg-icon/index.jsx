import { useEffect, useState } from "react";
import { Box } from "@mui/material";

const ColoredSvgIcon = ({ svgUrl, fillColor }) => {
    const [svgMarkup, setSvgMarkup] = useState("");

    useEffect(() => {
        fetch(svgUrl)
            .then((res) => res.text())
            .then((data) => setSvgMarkup(data))
            .catch(() => setSvgMarkup(""));
    }, [svgUrl]);

    if (!svgMarkup) return null;

    return (
        <Box
            sx={{
                "& svg": {
                    width: 48,
                    height: 48,
                    display: "block",
                },
                // only recolor the *outer triangle* path
                "& svg path:first-of-type": {
                    fill: fillColor,
                },
            }}
            dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
    );
};

export default ColoredSvgIcon;
