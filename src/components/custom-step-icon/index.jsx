import { Box, Typography, useTheme } from '@mui/material';
import CircleCheckOutlineIcon from '../../assets/icons/CircleCheckOutline';

export default function CustomStepIcon({ active, completed, icon }) {
    const theme = useTheme()

    // Custom colors based on your design
    const primary = theme.palette.primary[600]; // For active step outline
    const success = theme.palette.success[600]; // For completed step fill and checkmark

    let background, color, content;

    if (completed) {
        // Completed state: Green fill, white checkmark
        background = success;
        color = 'white';
        content = <CircleCheckOutlineIcon stroke={success} />;
    } else if (active) {
        // Active state: Purple outline, transparent fill, purple number
        background = 'transparent';
        color = primary;
        content = (
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {icon}
            </Typography>
        );
    } else {
        // Pending state: Gray outline, transparent fill, gray number
        background = 'transparent';
        color = 'text.disabled';
        content = (
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                {icon}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                width: 41,
                height: 41,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                backgroundColor: background,
                color: color,
                border: `2px solid ${completed ? success : active ? primary : 'lightgrey'}`,
                gap: '6px'
            }}
        >
            {content}
        </Box>
    );
};