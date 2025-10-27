/* eslint-disable react-hooks/exhaustive-deps */
// FilterModal.js
import { useEffect, useRef, useState } from "react";
import {
    Box,
    Button,
    MenuItem,
    InputAdornment,
    IconButton,
    useTheme,
    DialogTitle,
    Stack,
    DialogContent,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import DatePickerWrapper from "../datapicker-wrapper";
import CustomTextField from "../text-field";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import FormLabel from "../form-label";
import { BootstrapDialog } from "../common";
import TwoColorIconCircle from "../two-layer-icon";
import CloseIcon from "../../assets/icons/CloseIcon";
import { useDispatch } from "react-redux";
import DialogActions from '@mui/material/DialogActions';
import FilterListIcon from '@mui/icons-material/FilterList';
import TypographyComponent from "../custom-typography";

export default function FilterModal({ open, onClose, fieldsArray, onApply, apiAction, filteredData }) {
    const theme = useTheme();
    const dispatch = useDispatch();

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const allValues = useWatch({ control });

    //States
    const [dynamicOptions, setDynamicOptions] = useState({});
    const [fields] = useState(fieldsArray);

    const prevValuesRef = useRef({}); // to prevent infinite API calls

    /**
     * Initial Render
     */
    useEffect(() => {
        if (open && !prevValuesRef.current && !filteredData) {
            // ✅ reset only when modal just opened
            const defaultValues = {};
            fields.forEach(f => {
                defaultValues[f.name] = f.value || "";
            });

            reset(defaultValues);
            setDynamicOptions({}); // ✅ also clear dependent dropdowns

        }
        prevValuesRef.current = open;
    }, [open, fields, reset, filteredData]);

    useEffect(() => {
        if (!open) return;

        const fetchOptions = async (field, parentValue = null) => {
            try {
                const action = apiAction[field.apiAction];
                if (!action) return;

                let params = {};
                if (field.apiParams) {
                    Object.keys(field.apiParams).forEach(key => {
                        const sourceField = field.apiParams[key];

                        if (sourceField === field.dependsOn) {
                            params[key] = parentValue;
                        } else if (allValues?.[sourceField] !== undefined) {
                            params[key] = allValues[sourceField];
                        } else {
                            params[key] = sourceField;
                        }
                    });
                }

                const result = await dispatch(action(params)).unwrap();
                setDynamicOptions(prev => ({ ...prev, [field.name]: result?.response || [] }));
            } catch (err) {
                console.error(err);
                setDynamicOptions(prev => ({ ...prev, [field.name]: [] }));
            }
        };

        fields.forEach(field => {
            if (!field.apiAction) return;

            // independent dropdown → load once
            if (!field.dependsOn && dynamicOptions[field.name] === undefined) {
                fetchOptions(field);
            }

            // dependent dropdown → reload only when parent changes
            if (field.dependsOn) {
                const parentValue = allValues?.[field.dependsOn];
                if (parentValue) {
                    fetchOptions(field, parentValue);
                } else {
                    setDynamicOptions(prev => ({ ...prev, [field.name]: [] }));
                }
            }
        });
    }, [open, allValues, fields, dispatch, apiAction]);

    //function to handle submit
    const onSubmit = (data) => {
        const trimmedData = Object.entries(data).reduce((acc, [key, value]) => {
            // Check if the value is a string and not null
            if (typeof value === 'string' && value !== null) {
                const trimmedValue = value.trim();
                // If the trimmed string is empty, set the value to null; otherwise, use the trimmed string
                acc[key] = trimmedValue === '' ? null : trimmedValue;
            } else {
                // Keep non-string values as they are (including numbers, booleans, etc.)
                acc[key] = value && value !== null ? value : null;
            }
            return acc;
        }, {});

        onApply(trimmedData);
        onClose('save');
    };

    return (
        <BootstrapDialog
            fullWidth
            maxWidth={'sm'}
            onClose={onClose}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            scroll="paper"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 1.5 }} id="customized-dialog-title">
                <Stack flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                        <TwoColorIconCircle
                            IconComponent={<FilterListIcon size={14} sx={{ color: theme.palette.primary[600] }} />}
                            color={theme.palette.primary[600]}
                            size={40}
                        />
                        <Stack sx={{ lineHeight: 0.2 }}>
                            <TypographyComponent fontSize={20} fontWeight={500}>Filters</TypographyComponent>
                        </Stack>

                    </Stack>
                    <IconButton aria-label="close" onClick={onClose} sx={{ color: theme.palette.grey[500] }}>
                        <CloseIcon size={16} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers>
                <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                    <DatePickerWrapper>
                        {fields.map((field) => {
                            const dependsOnValue = field.dependsOn ? allValues?.[field.dependsOn] : null;
                            return (
                                <Box key={field.name} sx={{ mb: 2 }}>
                                    <Controller
                                        name={field.name}
                                        control={control}
                                        render={({ field: controllerField }) => {
                                            switch (field.type) {
                                                case "textfield":
                                                    return (
                                                        <CustomTextField
                                                            {...controllerField}
                                                            fullWidth
                                                            label={field.label}
                                                            variant="outlined"
                                                            size="small"
                                                        />
                                                    );

                                                case "select": {
                                                    // dynamic options: apiAction or static data
                                                    const options = field.apiAction
                                                        ? dynamicOptions[field.name] || []
                                                        : field.data || [];

                                                    return (
                                                        <CustomTextField
                                                            {...controllerField}
                                                            select
                                                            fullWidth
                                                            label={field.label}
                                                            variant="outlined"
                                                            size="small"
                                                            disabled={field.dependsOn && !dependsOnValue}
                                                        >
                                                            {options && options !== null && options.length > 0 && options.map((opt) => (
                                                                <MenuItem key={opt[field.valueKey]} value={opt[field.valueKey || "id"]}>
                                                                    {opt[field.labelKey] ?? opt.name ?? opt.label ?? opt.type ?? ""}
                                                                </MenuItem>
                                                            ))}
                                                        </CustomTextField>
                                                    );
                                                }

                                                case "date":
                                                    return (
                                                        <DatePicker
                                                            id={field.name}
                                                            customInput={
                                                                <CustomTextField
                                                                    size="small"
                                                                    label={<FormLabel label={field.label} />}
                                                                    fullWidth
                                                                    InputProps={{
                                                                        startAdornment: (
                                                                            <InputAdornment position="start">
                                                                                <IconButton
                                                                                    edge="start"
                                                                                    onMouseDown={(e) => e.preventDefault()}
                                                                                >
                                                                                    <CalendarIcon />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        ),
                                                                    }}
                                                                    error={Boolean(errors[field.name])}
                                                                    {...(errors[field.name] && {
                                                                        helperText: errors[field.name].message,
                                                                    })}
                                                                />
                                                            }
                                                            value={controllerField.value}
                                                            selected={
                                                                controllerField?.value
                                                                    ? moment(controllerField.value, "DD/MM/YYYY").toDate()
                                                                    : null
                                                            }
                                                            showYearDropdown
                                                            dateFormat="dd/MM/yyyy"
                                                            minDate={dependsOnValue ? moment(dependsOnValue, "DD/MM/YYYY").toDate() : null}
                                                            onChange={(date) => {
                                                                const formattedDate = moment(date).format("DD/MM/YYYY");
                                                                controllerField.onChange(formattedDate);

                                                                if (
                                                                    field.dependsOn &&
                                                                    date &&
                                                                    moment(date).isBefore(moment(dependsOnValue, "DD/MM/YYYY"))
                                                                ) {
                                                                    setValue(field.name, "");
                                                                }
                                                            }}
                                                        />
                                                    );

                                                default:
                                                    return null;
                                            }
                                        }}
                                    />
                                </Box>
                            );
                        })}
                    </DatePickerWrapper>
                </form>
            </DialogContent>
            <DialogActions sx={{ m: 1 }}>
                <Button
                    onClick={() => {
                        onClose('reset')
                    }}
                    variant='outlined'
                    sx={{
                        textTransform: "capitalize",
                        px: 6,
                        borderColor: `${theme.palette.grey[300]}`,
                        color: `${theme.palette.grey[700]}`,
                        borderRadius: '8px',
                        fontSize: 16,
                        fontWeight: 600,
                        mr: 1
                    }}
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    onClick={() => {
                        handleSubmit(onSubmit)()
                    }}
                    sx={{
                        textTransform: "capitalize",
                        px: 6,
                        borderRadius: '8px',
                        backgroundColor: theme.palette.primary[600],
                        color: theme.palette.common.white,
                        fontSize: 16,
                        fontWeight: 600,
                        borderColor: theme.palette.primary[600]
                    }}
                >
                    Apply
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
