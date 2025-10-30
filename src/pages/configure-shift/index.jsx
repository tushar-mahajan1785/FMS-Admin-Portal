/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, CircularProgress, Divider, FormControlLabel, Grid, IconButton, InputAdornment, Stack, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import MyBreadcrumbs from "../../components/breadcrumb";
import TypographyComponent from "../../components/custom-typography";
import AddIcon from '@mui/icons-material/Add';
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import CustomTextField from "../../components/text-field";
import FormLabel from "../../components/form-label";
import { AntSwitch } from "../../components/common";
import moment from "moment";
import DatePicker from "react-datepicker";
import DatePickerWrapper from "../../components/datapicker-wrapper";
import ClockIcon from "../../assets/icons/ClockIcon";
import { actionConfigureShift, resetConfigureShiftResponse } from "../../store/roster";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "../../hooks/useSnackbar";

export default function ConfigureShiftList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))

    const emptyShift = { shift_description: '', short_name: '', start_time: '', end_time: '', status: true };

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isDirty }
    } = useForm({
        defaultValues: {
            shift_configure: Array(4).fill(emptyShift)
        }
    });

    const { configureShift } = useSelector(state => state.rosterStore)

    // use field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'shift_configure'
    });

    const [loading, setLoading] = useState(false)

    // useEffect(() => {
    //     // Convert 'Active'/'Inactive' to boolean for switch control
    //     const mappedData = existingShiftData.map((shift) => ({
    //         ...shift,
    //         status: shift.status === "Active"
    //     }));
    //     reset({ shift_configure: mappedData });
    // }, [reset]);

    /**
       * useEffect
       * @dependency : configureShift
       * @type : HANDLE API RESULT
       * @description : Handle the result of add Asset API
       */
    useEffect(() => {
        if (configureShift && configureShift !== null) {
            dispatch(resetConfigureShiftResponse())
            if (configureShift?.result === true) {
                reset()
                setLoading(false)
                showSnackbar({ message: configureShift?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (configureShift?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetConfigureShiftResponse())
                        toast.dismiss()
                        showSnackbar({ message: configureShift?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: configureShift?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [configureShift])

    const onSubmit = (data) => {
        const formattedData = data.shift_configure.map((shift) => ({
            ...shift,
            status: shift.status ? 'Active' : 'Inactive'
        }));
        dispatch(actionConfigureShift(formattedData))
    }

    return (
        <React.Fragment>
            <Stack
                flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                mb={3}>
                <MyBreadcrumbs />
                <Button
                    size="small" sx={{
                        textTransform: 'capitalize',
                        color: "#fff",
                        px: 1.5,
                        py: 1,
                        alignItems: 'center',
                        backgroundColor: theme.palette.primary[600],
                        borderRadius: 1,
                        '&:hover': {
                            backgroundColor: theme.palette.primary[600],
                        },
                        boxShadow: 'none'
                    }}
                    variant='contained'
                    onClick={() => {
                        append({ shift_description: '', short_name: '', start_time: '', end_time: '', status: true })
                    }}
                >
                    <AddIcon sx={{ color: 'white', fontSize: { xs: '16x', sm: '16px' } }} />
                    <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                        Add New Shift
                    </TypographyComponent>
                </Button>
            </Stack>
            <Box
                sx={{
                    height: '620px',
                    background: theme.palette.common.white,
                    borderRadius: '12px',
                    border: `1px solid ${theme.palette.grey[300]}`,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '2px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '2px'
                    }
                }}>
                <Stack flexDirection={'row'} gap={1} padding={4}>
                    <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>
                        Configure Shift Details
                    </TypographyComponent>
                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                        Configure the shift name and timings
                    </TypographyComponent>

                </Stack>
                <Divider sx={{ mx: 4 }} />
                <Stack
                    sx={{
                        px: 2,
                        mt: 4,
                        flexGrow: 1,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                            width: '2px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#ccc',
                            borderRadius: '2px'
                        }
                    }}
                >
                    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <DatePickerWrapper>
                            {fields.map((item, index) => (
                                <Box key={item.id}>
                                    <Grid
                                        container
                                        spacing={2}

                                    >
                                        <Grid
                                            size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4, marginBottom: 1, paddingRight: 1 }}
                                        >
                                            <TypographyComponent fontSize={18} fontWeight={watch(`shift_configure.${index}.status`) ? 600 : 400} sx={{ color: watch(`shift_configure.${index}.status`) ? theme.palette.grey[700] : theme.palette.grey[400] }}>
                                                {`Shift # ${index + 1}`}
                                            </TypographyComponent>
                                        </Grid>
                                        <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }}>
                                            <Grid container spacing={'24px'}>
                                                {/* shift description */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`shift_configure.${index}.shift_description`}
                                                        control={control}
                                                        rules={{
                                                            required: watch(`shift_configure.${index}.status`) ? 'Shift Description is required' : false,
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                {...field}
                                                                fullWidth
                                                                label={<FormLabel label={`Shift Description`} required={true} />}
                                                                error={!!errors.shift_configure?.[index]?.shift_description}
                                                                inputProps={{ maxLength: 255 }}
                                                                disabled={!watch(`shift_configure.${index}.status`)}
                                                                helperText={errors.shift_configure?.[index]?.shift_description?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {/* short name */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`shift_configure.${index}.short_name`}
                                                        control={control}
                                                        rules={{
                                                            required: watch(`shift_configure.${index}.status`) ? 'Short Name is required' : false,
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                {...field}
                                                                fullWidth
                                                                label={<FormLabel label={`Short Name`} required={true} />}
                                                                error={!!errors.shift_configure?.[index]?.short_name}
                                                                inputProps={{ maxLength: 255 }}
                                                                disabled={!watch(`shift_configure.${index}.status`)}
                                                                helperText={errors.shift_configure?.[index]?.short_name?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {/* start time */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`shift_configure.${index}.start_time`}
                                                        control={control}
                                                        rules={{
                                                            required: watch(`shift_configure.${index}.status`) ? "Please select Start Time" : false
                                                        }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                id={`start_time_${index}`}
                                                                showTimeSelect
                                                                showTimeSelectOnly
                                                                timeIntervals={15}
                                                                timeCaption="Start Time"
                                                                dateFormat="HH:mm"
                                                                value={field.value}
                                                                selected={field?.value ? moment(field.value, 'HH:mm').toDate() : null}
                                                                onChange={(date) => {
                                                                    const formattedTime = moment(date).format('HH:mm');
                                                                    field.onChange(formattedTime);
                                                                }}
                                                                disabled={!watch(`shift_configure.${index}.status`)}
                                                                customInput={
                                                                    <CustomTextField
                                                                        size="small"
                                                                        fullWidth
                                                                        label={<FormLabel label="Start Time" required={true} />}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <IconButton edge="start" onMouseDown={(e) => e.preventDefault()}>
                                                                                        <ClockIcon />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        error={Boolean(errors.shift_configure?.[index]?.start_time)}
                                                                        {...(errors.shift_configure?.[index]?.start_time && {
                                                                            helperText: errors.shift_configure[index].start_time.message,
                                                                        })}
                                                                    />
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>

                                                {/* end time */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`shift_configure.${index}.end_time`}
                                                        control={control}
                                                        rules={{
                                                            required: watch(`shift_configure.${index}.status`) ? "Please select End Time" : false
                                                        }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                id={`end_time_${index}`}
                                                                showTimeSelect
                                                                showTimeSelectOnly
                                                                timeIntervals={15}
                                                                timeCaption="End Time"
                                                                dateFormat="HH:mm"
                                                                value={field.value}
                                                                selected={field?.value ? moment(field.value, 'HH:mm').toDate() : null}
                                                                onChange={(date) => {
                                                                    const formattedTime = moment(date).format('HH:mm');
                                                                    field.onChange(formattedTime);
                                                                }}
                                                                disabled={!watch(`shift_configure.${index}.status`)}
                                                                customInput={
                                                                    <CustomTextField
                                                                        size="small"
                                                                        fullWidth
                                                                        label={<FormLabel label="End Time" required={true} />}
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position="start">
                                                                                    <IconButton edge="start" onMouseDown={(e) => e.preventDefault()}>
                                                                                        <ClockIcon />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            ),
                                                                        }}
                                                                        error={Boolean(errors.shift_configure?.[index]?.end_time)}
                                                                        {...(errors.shift_configure?.[index]?.end_time && {
                                                                            helperText: errors.shift_configure[index].end_time.message,
                                                                        })}
                                                                    />
                                                                }
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid
                                            size={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 1 }}
                                            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 4, marginBottom: 1, paddingRight: 1 }}
                                        >
                                            <Stack direction="row">
                                                <Controller
                                                    name={`shift_configure.${index}.status`}
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <FormControlLabel
                                                            labelPlacement="end"
                                                            sx={{
                                                                m: 0,
                                                                gap: 1,
                                                                '.MuiTypography-root': { fontWeight: 500, fontSize: 14 },
                                                            }}
                                                            control={
                                                                <AntSwitch
                                                                    checked={value}
                                                                    onChange={(e) => onChange(e.target.checked)}
                                                                />
                                                            }
                                                        />
                                                    )}
                                                />
                                                {fields.length > 1 && (
                                                    <IconButton
                                                        onClick={() => {
                                                            remove(index)
                                                        }}
                                                        color="error">
                                                        <DeleteIcon fontSize="medium" />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: isSMDown ? 4 : 2, mx: 2 }} />
                                </Box>
                            ))}
                        </DatePickerWrapper>
                    </form>
                </Stack>
            </Box>
            <Divider sx={{ my: 3 }} />
            <Stack flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                <Button
                    sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, backgroundColor: theme.palette.common.white, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                    onClick={() => {
                        reset()
                    }}
                    variant='outlined'
                >
                    Reset
                </Button>
                <Button
                    sx={{
                        textTransform: "capitalize",
                        px: 6,
                        borderRadius: '8px',
                        backgroundColor: isDirty ? theme.palette.primary[600] : theme.palette.grey[300],
                        color: theme.palette.common.white,
                        fontSize: 16,
                        fontWeight: 600,
                        borderColor: isDirty ? theme.palette.primary[600] : theme.palette.grey[300],
                        '&:disabled': {
                            backgroundColor: theme.palette.grey[300],
                            color: theme.palette.grey[500],
                        },
                    }}
                    onClick={() => {
                        handleSubmit(onSubmit)()
                    }}
                    type='submit'
                    variant='contained'
                    disabled={loading || !isDirty}
                >
                    {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Save'}
                </Button>
            </Stack>
        </React.Fragment>
    )
}