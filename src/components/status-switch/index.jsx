// src/components/StatusSwitch.jsx
import { Box, FormGroup, FormControlLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { AntSwitch } from '../common';
import TypographyComponent from '../custom-typography';

export default function StatusSwitch({ value, onChange, label = 'Status' }) {
    const theme = useTheme();

    return (
        <Box>
            <TypographyComponent
                fontSize={14}
                fontWeight={500}
                sx={{
                    mb: 1,
                    color: theme.palette.grey[800],
                }}
            >
                {label}
            </TypographyComponent>

            <FormGroup row sx={{ gap: 4 }}>
                <FormControlLabel
                    labelPlacement="end"
                    sx={{
                        m: 0,
                        gap: 1,
                        '.MuiTypography-root': { fontWeight: 500, fontSize: 14 },
                    }}
                    control={
                        <AntSwitch
                            checked={value === 'Active'}
                            onChange={() => onChange('Active')}
                        />
                    }
                    label="Active"
                />

                <FormControlLabel
                    labelPlacement="end"
                    sx={{
                        m: 0,
                        gap: 1,
                        '.MuiTypography-root': { fontWeight: 500, fontSize: 14 },
                    }}
                    control={
                        <AntSwitch
                            checked={value === 'Inactive'}
                            onChange={() => onChange('Inactive')}
                        />
                    }
                    label="Inactive"
                />
            </FormGroup>
        </Box>
    );
}
