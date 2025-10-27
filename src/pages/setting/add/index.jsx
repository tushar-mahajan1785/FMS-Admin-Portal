/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
    Drawer,
    Button,
    Stack,
    Divider,
    CircularProgress,
    IconButton,
    Grid,
    useTheme,
    Box,
    capitalize,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormHeader from "../../../components/form-header";
import SectionHeader from "../../../components/section-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import StatusSwitch from "../../../components/status-switch";
import CloseIcon from "../../../assets/icons/CloseIcon";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { actionAddSetting, resetAddSettingResponse } from "../../../store/setting";
import SettingsIcon from "../../../assets/icons/SettingsIcon";
import TypographyComponent from "../../../components/custom-typography";
import { useBranch } from "../../../hooks/useBranch";

export default function AddSetting({ open, dataObj, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    // store
    const { addSetting } = useSelector(state => state.settingStore)

    const emptyLevel = { key: '', value: '' };

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        setError,
        formState: { errors }
    } = useForm({
        defaultValues: {
            setting_key: "",
            setting_value: Array(1).fill(emptyLevel),
            status: 'Active'
        }
    });

    // use field array
    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'setting_value'
    });

    // state
    const [loading, setLoading] = useState(false)
    const [settingStatus, setSettingStatus] = useState("Active");

    //Initial Render
    useEffect(() => {
        if (open === true) {
            reset()
            if (dataObj && dataObj !== null && dataObj.formType && dataObj.formType === 'edit') {
                setValue('setting_key', dataObj.setting_key && dataObj.setting_key !== null ? dataObj.setting_key : '')
                setValue('status', dataObj.status && dataObj.status !== null ? dataObj.status : 'Active')
                setSettingStatus(dataObj.status && dataObj.status !== null ? dataObj.status : 'Active')
                // ✅ replace setting_value array with existing rows
                if (dataObj.setting_value && dataObj.setting_value.length > 0) {
                    replace(dataObj.setting_value);
                } else {
                    replace([emptyLevel]); // fallback: at least 1 row
                }
            } else {
                reset()
                replace([emptyLevel]);
                setSettingStatus("Active")
            }

        }
    }, [open, dataObj])

    /**
     * 
     * @param {*} watch 
     * @param {*} errors 
     * @param {*} fields 
     * @returns 
     */
    const useSectionProgress = (watch, errors, fields) => {
        const values = watch(fields);

        const filled = fields.filter((f, i) => {
            const value = values[i];
            const hasError = !!errors[f];
            return value && value.toString().trim() !== "" && !hasError;
        }).length;

        return Math.round((filled / fields.length) * 100);
    };

    // section progress
    const settingProgress = useSectionProgress(watch, errors, ["setting_key", "setting_value", "status"]);

    /**
     * useEffect
     * @dependency : addSetting
     * @type : HANDLE API RESULT
     * @description : Handle the result of add setting API
     */
    useEffect(() => {
        if (addSetting && addSetting !== null) {
            dispatch(resetAddSettingResponse())
            if (addSetting?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                toast.dismiss()
                showSnackbar({ message: addSetting?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (addSetting?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddSettingResponse())
                        toast.dismiss()
                        showSnackbar({ message: addSetting?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: addSetting?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addSetting])

    // handle submit function
    const onSubmit = (data) => {
        let hasError = false;

        data.setting_value.forEach((row, index) => {
            // case 1: both empty
            if (!row.key?.trim() && !row.value?.trim()) {
                setError(`setting_value.${index}.key`, {
                    type: "manual",
                    message: "Key is required"
                });
                setError(`setting_value.${index}.value`, {
                    type: "manual",
                    message: "Value is required"
                });
                hasError = true;
            }
            // case 2: key empty but value filled
            else if (!row.key?.trim() && row.value?.trim()) {
                setError(`setting_value.${index}.key`, {
                    type: "manual",
                    message: "Key is required"
                });
                hasError = true;
            }
            // case 3: value empty but key filled
            else if (row.key?.trim() && !row.value?.trim()) {
                setError(`setting_value.${index}.value`, {
                    type: "manual",
                    message: "Value is required"
                });
                hasError = true;
            }
        });

        if (hasError) return;

        const nonEmptyRows = data.setting_value.filter(
            (row) => row.key?.trim() || row.value?.trim()
        );

        let objData = {
            status: settingStatus && settingStatus !== null && settingStatus !== '' ? settingStatus : null,
            setting_value: nonEmptyRows && nonEmptyRows !== null && nonEmptyRows.length > 0 ? nonEmptyRows : null,
            setting_key: data.setting_key && data.setting_key !== null && data.setting_key !== '' ? data.setting_key : null,
            entity_type: dataObj.entity_type && dataObj.entity_type !== null && dataObj.entity_type !== '' ? dataObj.entity_type : null
        }
        let updated = Object.assign({}, objData)
        if (dataObj && dataObj !== null && dataObj.formType && dataObj.formType === 'edit' && dataObj.id && dataObj.id !== null) {
            updated.id = dataObj.id
        }
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            updated.branch_uuid = branch?.currentBranch?.uuid
        }
        if (dataObj?.client_uuid && dataObj?.client_uuid !== null) {
            updated.client_uuid = dataObj?.client_uuid
        }
        setLoading(true)
        dispatch(actionAddSetting(updated))
    };


    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: 1100 } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<SettingsIcon stroke={theme.palette.primary[600]} size={18} />}
                    title={`${dataObj && dataObj?.formType && dataObj.formType === 'edit' ? 'Edit' : 'Add New'} ${capitalize(dataObj?.entity_type)} Setting`}
                    subtitle={`Fill below form to ${dataObj && dataObj?.formType && dataObj.formType === 'edit' ? 'update' : 'add new'} ${dataObj?.entity_type} setting`}
                    actions={[
                        <IconButton
                            onClick={() => {
                                handleClose()
                                reset()
                            }}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                />
                <Divider sx={{ m: 2 }} />
                <Stack
                    sx={{
                        px: 2,
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
                        <SectionHeader title="Setting Details" progress={settingProgress} />
                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                            {/* setting key */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Controller
                                    name='setting_key'
                                    control={control}
                                    rules={{
                                        required: "Setting Key is required",
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            inputProps={{ maxLength: 255 }}
                                            label={<FormLabel label='Setting Key' required={true} />}
                                            onChange={field.onChange}
                                            error={Boolean(errors.setting_key)}
                                            {...(errors.setting_key && { helperText: errors.setting_key.message })}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* setting value */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>

                                <TypographyComponent fontWeight={500} fontSize={14} color={theme.palette.grey[700]} marginBottom={1}>Setting Value</TypographyComponent>
                                <Divider sx={{ mb: 2 }} />
                                {fields.map((item, index) => (
                                    <Box key={item.id}>
                                        <Grid
                                            container
                                            spacing={2}
                                            rowGap={2}
                                            marginBottom={2}

                                        >
                                            <Grid size={{ xs: 11, sm: 11, md: 11, lg: 11, xl: 11 }} >
                                                <Grid container spacing={2}>
                                                    {/* key */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                        <Controller
                                                            name={`setting_value.${index}.key`}
                                                            control={control}
                                                            rules={{
                                                                maxLength: {
                                                                    value: 255,
                                                                    message: 'Maximum length is 255 characters'
                                                                },
                                                            }}
                                                            render={({ field }) => (
                                                                <CustomTextField
                                                                    {...field}
                                                                    fullWidth
                                                                    inputProps={{ maxLength: 255 }}
                                                                    label={<FormLabel label={`Key`} fontWeight={600} fontSize={12} />}
                                                                    error={Boolean(errors.setting_value?.[index]?.key)}
                                                                    {...(errors.setting_value?.[index]?.key && { helperText: errors.setting_value?.[index]?.key.message })}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    {/* value */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                                        <Controller
                                                            name={`setting_value.${index}.value`}
                                                            control={control}
                                                            rules={{
                                                                maxLength: {
                                                                    value: 255,
                                                                    message: 'Maximum length is 255 characters'
                                                                },
                                                            }}
                                                            render={({ field }) => (
                                                                <CustomTextField
                                                                    {...field}
                                                                    fullWidth
                                                                    inputProps={{ maxLength: 255 }}
                                                                    label={<FormLabel label="Value" fontWeight={600} fontSize={12} />}
                                                                    error={Boolean(errors.setting_value?.[index]?.value)}
                                                                    {...(errors.setting_value?.[index]?.value && { helperText: errors.setting_value?.[index]?.value.message })}
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
                                                    <IconButton
                                                        onClick={() =>
                                                            append({ key: '', value: '' })
                                                        }
                                                        color="primary"
                                                    >
                                                        <AddCircleOutlineIcon fontSize="medium" />
                                                    </IconButton>

                                                    {fields.length > 1 && hasPermission('SETTING_EDIT') && (
                                                        <IconButton onClick={() => remove(index)} color="error">
                                                            <RemoveCircleOutlineIcon fontSize="medium" />
                                                        </IconButton>
                                                    )}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Grid>
                            {/* status */}
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <StatusSwitch value={settingStatus} onChange={setSettingStatus} label="Status" />
                            </Grid>
                        </Grid>
                    </form>
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            handleClose()
                            reset()
                        }}
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        type='submit'
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Confirm'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}
