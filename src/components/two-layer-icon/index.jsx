import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function TwoColorIconCircle({ IconComponent, color, size = 60 }) {

    // Increased alpha values for better visibility and contrast
    const outerCircleColor = alpha(color, 0.1);
    const innerCircleColor = alpha(color, 0.15);

    const innerCircleSize = size * 0.7;
    const iconSize = size * 0.4;

    return (
        // Outer circle container
        <Box
            sx={{
                // *** FIX 1: Prevent shrinking in flex containers ***
                flexShrink: 0,
                // *** FIX 2: Ensure minimum size is maintained ***
                minWidth: size,
                minHeight: size,

                width: size,
                height: size,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: outerCircleColor,
            }}
        >
            {/* Inner circle (darker alpha color) */}
            <Box
                sx={{
                    width: innerCircleSize,
                    height: innerCircleSize,
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: innerCircleColor,
                }}
            >
                {/* Wrap the IconComponent in a Box to apply styling */}
                <Box
                    sx={{
                        color: color, // The SOLID color for the icon
                        fontSize: iconSize, // The desired size
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {IconComponent}
                </Box>
            </Box>
        </Box>
    );
}