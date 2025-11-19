import React, { forwardRef } from 'react';
import { Autocomplete, Box, Stack, useTheme } from '@mui/material';
import CustomTextField from '../text-field';
import FormLabel from '../form-label';
import ChevronDownIcon from '../../assets/icons/ChevronDown';
import TypographyComponent from '../custom-typography';

const CustomAutocomplete = forwardRef(({ options, is_required = false, label, error, helperText, value, onChange, displayName1, displayName2, ...rest }, ref) => {
    const theme = useTheme();

    // Helper function to get the correct option label based on available keys
    const getOptionLabel = (option) => option?.[displayName1] || '';

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
            popupIcon={<ChevronDownIcon />}
            ListboxProps={{
                style: {
                    maxHeight: '250px',
                    overflowY: 'auto'
                }
            }}
            renderInput={(params) => (
                <CustomTextField
                    {...params}
                    label={<FormLabel label={label} required={is_required} />}
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
                                {option?.[displayName1]}
                            </TypographyComponent>
                            {option?.[displayName2] && (
                                <TypographyComponent fontSize={12} fontWeight={400} color={theme.palette.grey[400]}>
                                    {option?.[displayName2]}
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