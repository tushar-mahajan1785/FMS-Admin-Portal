import { Box, Typography, useTheme } from '@mui/material';
import CircleCheckOutlineIcon from '../../assets/icons/CircleCheckOutline';

export default function CustomStepIcon({ active, completed, icon }) {
    const theme = useTheme();
    const primary = theme.palette.primary[600];
    const success = theme.palette.success[600];
    const grey = theme.palette.grey[400];

    let background, borderColor, content;

    if (completed) {
        // ✅ Completed step: solid green with white checkmark
        background = success;
        borderColor = success;
        content = <CircleCheckOutlineIcon stroke={success} />;
    } else if (active) {
        // ✅ Active step: purple outline and number inside
        background = 'transparent';
        borderColor = primary;
        content = (
            <Typography variant="caption" sx={{ fontWeight: 600, color: primary }}>
                {icon}
            </Typography>
        );
    } else {
        // ✅ Pending step: gray outline with gray number
        background = 'transparent';
        borderColor = grey;
        content = (
            <Typography variant="caption" sx={{ fontWeight: 600, color: grey }}>
                {icon}
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                width: 41,
                height: 41,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: background,
                border: `2px solid ${borderColor}`,
                transition: 'all 0.3s ease',
            }}
        >
            {content}
        </Box>
    );
}
