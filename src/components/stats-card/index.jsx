import React from 'react';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { convertCount } from '../../utils';
import TypographyComponent from '../custom-typography';

const StyledIconBox = styled(Box)(({ iconbgcolor }) => ({
    maxWidth: 48,
    minWidth: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    backgroundColor: iconbgcolor,
}));

// Main reusable component
export default function StatCard({
    icon,
    iconColor,
    backgroundColor,
    title,
    description,
    size,
    onClick,
}) {

    const theme = useTheme()

    return (
        <Grid
            size={size}
            sx={{
                p: { xs: 2, sm: 3, md: 3, lg: 3, xl: 3 },
                textAlign: 'left',
                // boxShadow: 2,
                backgroundColor: backgroundColor,
                borderRadius: '16px',
                color: 'text.primary'
            }}
            onClick={onClick}
        >
            <StyledIconBox iconbgcolor={iconColor}>
                {React.cloneElement(icon, { sx: { color: 'white' } })}
            </StyledIconBox>

            <TypographyComponent fontSize={36} fontWeight={600} sx={{ mt: { xs: 1, sm: 2, md: 2, lg: 2, xl: 2 } }}>
                {title && title !== null ? convertCount(title) : '0'}
            </TypographyComponent>

            <TypographyComponent fontSize={18} fontWeight={400} sx={{ mt: { xs: 0.1, sm: 1, md: 1, lg: 1, xl: 1 }, color: theme.palette.grey[700] }}>
                {description}
            </TypographyComponent>
        </Grid>
    );
}