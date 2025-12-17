import React from 'react';
import { Box, Button } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TypographyComponent from '../custom-typography';

export default function SquareBoxButton({
    shadedBgColor,
    bgColor,
    IconComponent,
    displayText,
    isButton = false,
    onClick,
}) {
    // --- Color Definition ---
    const solidBg = bgColor;

    // If it's a display box, the text/icon should be the solid color.
    const finalContentColor = isButton ? '#FFFFFF' : solidBg;

    // --- Responsive Size Definition using Breakpoints ---
    const responsiveSize = {
        xs: 40,
        sm: 60,
        md: 69
    };

    // --- Content Rendering ---
    const content = IconComponent ? (
        // *** FIX: Use React.cloneElement to safely inject NEW styles (size and color) ***
        // This ensures the icon element you pass is styled by the button component logic.
        React.cloneElement(IconComponent, {
            // Merges existing sx prop with new size and color.
            // New styles will typically override conflicting old ones (like a static color).
            sx: {
                ...(IconComponent.props.sx || {}), // Preserve any existing styles you passed
                color: finalContentColor // Override or set the required color (white or solidBg)
            }
        })
    ) : (
        <TypographyComponent
            fontWeight={500}
            fontSize={40}
            sx={{
                color: finalContentColor // Text content uses the same color logic
            }}
        >
            {displayText}
        </TypographyComponent>
    );

    // --- Common Styles for the Square Container ---
    const squareStyles = {
        // width: responsiveSize,
        height: responsiveSize,
        minWidth: responsiveSize,
        minHeight: responsiveSize,
        borderRadius: { xs: 1.5, sm: 2 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexShrink: 0,
        paddingX: 1
    };

    if (isButton) {
        // Solid color button style
        return (
            <Button
                onClick={onClick}
                sx={{
                    ...squareStyles,
                    bgcolor: solidBg,
                    '&:hover': {
                        bgcolor: alpha(solidBg, 0.8),
                    },
                    p: 0,
                }}
            >
                {content}
            </Button>
        );
    } else {
        // Light shaded display box style
        return (
            <Box
                sx={{
                    ...squareStyles,
                    bgcolor: shadedBgColor,
                }}
            >
                {content}
            </Box>
        );
    }
}