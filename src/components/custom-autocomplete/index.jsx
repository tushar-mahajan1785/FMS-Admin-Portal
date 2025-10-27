import React, { forwardRef } from 'react';
import { Autocomplete, Box, Stack, useTheme } from '@mui/material';
import CustomTextField from '../text-field';
import FormLabel from '../form-label';
import ChevronDownIcon from '../../assets/icons/ChevronDown';
import TypographyComponent from '../custom-typography';

const CustomAutocomplete = forwardRef(({ options, label, error, helperText, value, onChange, ...rest }, ref) => {
    const theme = useTheme();

    // Helper function to get the correct option label based on available keys
    const getOptionLabel = (option) => option.name || option.label || '';

    // Helper function to check if the option is equal to the current value
    const isOptionEqualToValue = (option, val) => option.id === val || option.value === val;

    // Find the correct object from options based on the passed value
    const selectedOption = options.find(option => getOptionLabel(option) === value || option.id === value || option.value === value) || null;

    return (
        <Autocomplete
            ref={ref}
            value={selectedOption}
            onChange={(event, newValue) => {
                // Return the correct value based on the available keys
                onChange(newValue ? newValue.id || newValue.value : '');
            }}
            options={options}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
            disableClearable
            popupIcon={<ChevronDownIcon/>}
            renderInput={(params) => (
                <CustomTextField
                    {...params}
                    label={<FormLabel label={label} required={false} />}
                    error={error}
                    placeholder={`Select ${label}`}
                    helperText={helperText}
                />
            )}
            renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                    <Box key={key} {...rest}>
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={400}>
                                {option?.name || option?.label}
                            </TypographyComponent>
                            {/* Conditionally render role or a secondary text if it exists */}
                            {(option?.role || option?.secondaryText) && (
                                <TypographyComponent fontSize={12} fontWeight={400} color={theme.palette.grey[400]}>
                                    {option?.role || option?.secondaryText}
                                </TypographyComponent>
                            )}
                        </Stack>
                    </Box>
                );
            }}
            {...rest}
        />
    );
});

export default CustomAutocomplete;