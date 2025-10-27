import { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { TextField, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ChevronDownIcon from '../../assets/icons/ChevronDown';
import { useSelector } from 'react-redux';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../constants';

export default function CountryCodeSelect({ control, name, rules }) {
    const theme = useTheme();

    //Stores
    const { masterCountryCodeList } = useSelector(state => state.vendorStore)

    //States
    const [masterCountryCodeOptions, setMasterCountryCodeOptions] = useState([])

    /**
     * useEffect
     * @dependency : masterCountryCodeList
     * @type : HANDLE API RESULT
     * @description : Handle the result of master Country Code List API
     */
    useEffect(() => {
        if (masterCountryCodeList && masterCountryCodeList !== null) {
            if (masterCountryCodeList?.result === true) {
                setMasterCountryCodeOptions(masterCountryCodeList?.response)
            } else {
                setMasterCountryCodeOptions([])
                switch (masterCountryCodeList?.status) {
                    case UNAUTHORIZED:
                        // logout()
                        break
                    case ERROR:
                        break
                    case SERVER_ERROR:
                        // showSnackbar({ message: masterCountryCodeList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [masterCountryCodeList])

    return (
        <Controller
            name={name} // Retain the field name
            control={control}
            rules={rules}
            // Optionally add rules here, e.g., required: 'Country code is required'
            render={({ field: ccField }) => {
                // Compute a safe value: '' if not present in options (prevents uncontrolled to controlled component error)
                const hasValue = masterCountryCodeOptions?.some(opt => opt.code === ccField.value);
                const safeValue = hasValue ? ccField.value : '';

                return (
                    <TextField
                        select
                        value={safeValue}
                        onChange={e => ccField.onChange(e.target.value)}
                        size="small"
                        variant="standard"
                        SelectProps={{
                            IconComponent: ChevronDownIcon,
                            MenuProps: {
                                PaperProps: {
                                    sx: { maxHeight: 200, mt: 1 }
                                },
                                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                                transformOrigin: { vertical: 'top', horizontal: 'left' }
                            }
                        }}
                        slotProps={{
                            input: {
                                style: {
                                    border: 'none',
                                    boxShadow: 'none',
                                    // Spacing between text (e.g., ROM) and the dropdown arrow
                                    paddingRight: '8px'
                                }
                            }
                        }}
                        sx={{
                            borderColor: theme.palette.grey[50],
                            boxShadow: 'none',
                            border: 0,
                            minWidth: 60, // Ensure enough width
                            maxWidth: 100,
                            p: 0,
                        }}
                    >
                        {masterCountryCodeOptions?.map((opt, idx) => (
                            <MenuItem title={`${opt.short_name}(${opt.code})`} key={`${opt.code}-${idx}`} value={opt.code}>
                                {opt.code}
                            </MenuItem>
                        ))}
                    </TextField>
                );
            }}
        />
    );
};