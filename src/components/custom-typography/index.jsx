// ResponsiveTypography.js
import React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const fontSizeMap = {
    "64": {
        "default": "54px",
        "sm": "58px",
        "md": "62px",
        "lg": "64px",
        "xl": "64px"
    },
    "50": {
        "default": "48px",
        "sm": "48px",
        "md": "43px",
        "lg": "38px",
        "xl": "38px"
    },
    "40": {
        "default": "28px",
        "sm": "32px",
        "md": "38px",
        "lg": "40px",
        "xl": "40px"
    },
    "36": {
        "default": "30px",
        "sm": "30px",
        "md": "32px",
        "lg": "36px",
        "xl": "36px"
    },
    "32": {
        "default": "26px",
        "sm": "26px",
        "md": "28px",
        "lg": "32px",
        "xl": "32px"
    },
    "30": {
        "default": "24px",
        "sm": "26px",
        "md": "28px",
        "lg": "30px",
        "xl": "30px"
    },
    "28": {
        "default": "22px",
        "sm": "24px",
        "md": "26px",
        "lg": "28px",
        "xl": "28px"
    },
    "26": {
        "default": "20px",
        "sm": "22px",
        "md": "24px",
        "lg": "26px",
        "xl": "26px"
    },
    "24": {
        "default": "18px",
        "sm": "20px",
        "md": "22px",
        "lg": "24px",
        "xl": "24px"
    },
    "22": {
        "default": "16px",
        "sm": "18px",
        "md": "20px",
        "lg": "22px",
        "xl": "22px"
    },
    "20": {
        "default": "14px",
        "sm": "16px",
        "md": "18px",
        "lg": "20px",
        "xl": "20px"
    },
    "18": {
        "default": "14px",
        "sm": "14px",
        "md": "16px",
        "lg": "18px",
        "xl": "18px"
    },
    "16": {
        "default": "12px",
        "sm": "12px",
        "md": "16px",
        "lg": "16px",
        "xl": "16px"
    },
    "14": {
        "default": "10px",
        "sm": "14px",
        "md": "12px",
        "lg": "14px",
        "xl": "14px"
    },
    "12": {
        "default": "10px",
        "sm": "12px",
        "md": "10px",
        "lg": "12px",
        "xl": "12px"
    },
    "10": {
        "default": "10px",
        "sm": "10px",
        "md": "10px",
        "lg": "10px",
        "xl": "10px"
    }
};

const getResponsiveStyles = (size, theme) => {
    const sizes = size > 0 ? fontSizeMap[size] : fontSizeMap[14];

    return {
        fontSize: sizes.default,
        [theme.breakpoints.up('sm')]: {
            fontSize: sizes.sm,
        },
        [theme.breakpoints.up('md')]: {
            fontSize: sizes.md,
        },
        [theme.breakpoints.up('lg')]: {
            fontSize: sizes.lg,
        },
        [theme.breakpoints.up('xl')]: {
            fontSize: sizes.xl,
        },
    };
};

const ResponsiveTypography = styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'fontSize',
})(({ theme, fontSize }) => getResponsiveStyles(fontSize, theme));

const TypographyComponent = ({ fontSize = 0, title = '', children, ...props }) => {
    return (
        <ResponsiveTypography fontSize={fontSize} title={title} {...props}>
            {children}
        </ResponsiveTypography>
    );
};

export default TypographyComponent;
