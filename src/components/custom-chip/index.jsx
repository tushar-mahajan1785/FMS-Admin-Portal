import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TypographyComponent from '../custom-typography';
import _ from 'lodash';

export default function CustomChip({ text, colorName, type }) {
    const theme = useTheme();

    // Get the specific shades from the theme palette.
    const mainColor = theme.palette[colorName]?.['600'] || theme.palette.grey[800];
    const backgroundColor = theme.palette[colorName]?.['50'] || theme.palette.grey[200];

    return (
        <Box
            sx={{
                backgroundColor: backgroundColor,
                borderRadius: '16px',
                padding: '4px 12px',
                display: 'inline-flex',
            }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                {/* The colored dot */}
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: mainColor,
                    }}
                />
                {/* The text label */}

                {
                    type === 'branch_dropdown' ?
                        <TypographyComponent title={text} variant="body2" sx={{ color: mainColor, fontWeight: 'medium' }}>
                            {_.truncate(text, { length: 30 })}
                        </TypographyComponent>
                        :
                        <TypographyComponent title={text} variant="body2" sx={{ color: mainColor, fontWeight: 'medium' }}>
                            {text}
                        </TypographyComponent>
                }
            </Stack>
        </Box>
    );
}