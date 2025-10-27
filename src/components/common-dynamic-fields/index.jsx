// CommonDynamicFields.jsx
import React from "react";
import { Grid, IconButton, InputAdornment } from "@mui/material";
import { Controller } from "react-hook-form";
import moment from "moment";

// your custom imports
import DatePicker from "react-datepicker";
import CustomTextField from "../text-field";
import FormLabel from "../form-label";
import CalendarIcon from "../../assets/icons/CalendarIcon";
import { isEmail, isNumber } from "../../constants";

export function CommonDynamicFields({
    control,
    errors,
    xs,
    sm,
    md,
    lg,
    xl,
    additionalFields = [],
    setAdditionalFields, // ⬅️ new setter from parent
}) {
    // helper to update value back into additionalFields
    const handleValueChange = (key, newValue) => {
        setAdditionalFields((prev) =>
            prev.map((f) => (f.key === key ? { ...f, value: newValue } : f))
        );
    };

    return (
        <>
            {additionalFields.map((fieldConfig) => {
                const { key, type, value, label } = fieldConfig;

                switch (type) {
                    case "textfield":
                        return (
                            <Grid
                                key={key}
                                size={{ xs: xs, sm: sm, md: md, lg: lg, xl: xl }}
                            >
                                <Controller
                                    name={key}
                                    control={control}
                                    defaultValue={value || ""}
                                    rules={{
                                        maxLength: {
                                            value: 250,
                                            message: 'Maximum length is 250 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value ?? ""}
                                            inputProps={{ maxLength: 250 }}
                                            label={<FormLabel label={label} required={false} />}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleValueChange(key, e.target.value); // sync back
                                            }}
                                            error={Boolean(errors[key])}
                                            {...(errors[key] && { helperText: errors[key].message })}
                                        />
                                    )}
                                />
                            </Grid>
                        );
                    case "email":
                        return (
                            <Grid
                                key={key}
                                size={{ xs: xs, sm: sm, md: md, lg: lg, xl: xl }}
                            >
                                <Controller
                                    name={key}
                                    control={control}
                                    defaultValue={value || ""}
                                    rules={{
                                        validate: {
                                            isEmail: value => !value || isEmail(value) || 'Invalid email'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value ?? ""}
                                            inputProps={{ maxLength: 250 }}
                                            label={<FormLabel label={label} required={false} />}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleValueChange(key, e.target.value); // sync back
                                            }}
                                            error={Boolean(errors[key])}
                                            {...(errors[key] && { helperText: errors[key].message })}
                                        />
                                    )}
                                />
                            </Grid>
                        );

                    case "number":
                        return (
                            <Grid
                                key={key}
                                size={{ xs: xs, sm: sm, md: md, lg: lg, xl: xl }}
                            >
                                <Controller
                                    name={key}
                                    control={control}
                                    defaultValue={value || ""}
                                    rules={{
                                        maxLength: {
                                            value: 20,
                                            message: 'Maximum length 20 allowed'
                                        },
                                        validate: {
                                            isNumber: (val) =>
                                                !val || isNumber(val) || `Invalid ${label}`,
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value ?? ""}
                                            label={<FormLabel label={label} required={false} />}
                                            inputProps={{ maxLength: 20 }}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                handleValueChange(key, e.target.value); // sync back
                                            }}
                                            error={Boolean(errors[key])}
                                            {...(errors[key] && { helperText: errors[key].message })}
                                        />
                                    )}
                                />
                            </Grid>
                        );

                    case "date":
                        return (
                            <Grid
                                key={key}
                                size={{ xs: xs, sm: sm, md: md, lg: lg, xl: xl }}
                            >
                                <Controller
                                    name={key}
                                    control={control}
                                    defaultValue={value || ""}
                                    render={({ field }) => (
                                        <DatePicker
                                            id={key}
                                            customInput={
                                                <CustomTextField
                                                    size="small"
                                                    label={<FormLabel label={label} required={false} />}
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
                                                    error={Boolean(errors[key])}
                                                    {...(errors[key] && {
                                                        helperText: errors[key].message,
                                                    })}
                                                />
                                            }
                                            value={field.value}
                                            selected={
                                                field?.value
                                                    ? moment(field.value, "DD/MM/YYYY").toDate()
                                                    : null
                                            }
                                            showYearDropdown
                                            onChange={(date) => {
                                                const formattedDate = moment(date).format("DD/MM/YYYY");
                                                field.onChange(formattedDate);
                                                handleValueChange(key, formattedDate); // sync back
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                        );

                    default:
                        return null;
                }
            })}
        </>
    );
}
