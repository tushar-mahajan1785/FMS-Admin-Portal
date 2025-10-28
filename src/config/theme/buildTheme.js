// buildTheme.js
import { createTheme } from "@mui/material/styles";
import tinycolor from "tinycolor2";

/**
 * Generates consistent light/dark shades for a given base color.
 * Produces a balanced palette without being too washed out.
 */
function generateShades(baseColor) {
    const color = tinycolor(baseColor);
    const shades = {};
    const keys = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

    keys.forEach((key) => {
        let shade;
        if (key <= 100) {
            // lighter tones
            shade = color.clone().lighten(54 - key / 5).toHexString();
        } else if (key <= 400) {
            shade = color.clone().lighten(20 - key / 50).toHexString();
        } else if (key === 500) {
            shade = color.toHexString(); // main color
        } else if (key >= 600 && key <= 800) {
            shade = color.clone().darken((key - 500) / 19).toHexString();
        } else {
            shade = color.clone().darken(20).toHexString();
        }
        shades[key] = shade;
    });

    return shades;
}

/**
 * Build the theme json 
 * @param {*} config 
 * @returns 
 */
export const buildTheme = (config = {}) => {
    const primaryBase = config.primaryColor || "#7F56D9";

    const primary = generateShades(primaryBase);

    return createTheme({
        palette: {
            primary: {
                main: primary[600],
                ...primary,
            },
        },
    });
};
