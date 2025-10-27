/* eslint-disable react-hooks/exhaustive-deps */
// AdditionalFieldsPopup.js
import React, { useEffect, useState } from "react";
import {
    Button, IconButton,
    useTheme,
    DialogTitle,
    Stack,
    DialogContent,
    Box,
    Grid,
    MenuItem,
    CircularProgress,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import "react-datepicker/dist/react-datepicker.css";
import { BootstrapDialog } from "../common";
import TwoColorIconCircle from "../two-layer-icon";
import { useDispatch, useSelector } from "react-redux";
import DialogActions from '@mui/material/DialogActions';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import CustomTextField from "../text-field";
import FormLabel from "../form-label";
import AddIcon from '@mui/icons-material/Add';
import { actionAdditionalFieldsAdd, actionAdditionalFieldsDetails, resetAdditionalFieldsAddResponse } from "../../store/common";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../constants";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useAuth } from "../../hooks/useAuth";
import AlertPopup from "../alert-confirm";
import AlertCircleIcon from "../../assets/icons/AlertCircleIcon";
import TypographyComponent from "../custom-typography";
import { useBranch } from "../../hooks/useBranch";

export default function AdditionalFieldsPopup({ open, onClose, objDetail }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const branch = useBranch()
    const { showSnackbar } = useSnackbar()
    const { logout } = useAuth()


    const emptyLevel = { key: '', type: '', label: '', is_deleted: 0 };
    const { additionalFieldsDetails, additionalFieldsAdd } = useSelector(state => state.CommonStore)

    //States
    const [loading, setLoading] = useState(false)
    const [fieldsDetails, setFieldsDetails] = useState([])
    const [openRemoveAlertPopup, setOpenRemoveAlertPopup] = useState(false)
    const [removedDetails, setRemovedDetails] = useState(null)

    const { control, handleSubmit, setError, formState: { errors } } = useForm({
        defaultValues: {
            setting_additional_fields: Array(1).fill(emptyLevel)
        }
    });
    const [typeMaster] = useState([{
        id: 'textfield',
        name: 'Textfield'
    },
    {
        id: 'email',
        name: 'Email'
    },
    {
        id: 'date',
        name: 'Date'
    },
    {
        id: 'number',
        name: 'Number'
    }
    ])
    // use field array
    const { fields, append, remove, replace, update } = useFieldArray({
        control,
        name: 'setting_additional_fields'
    });

    useEffect(() => {
        if (open === true) {
            dispatch(actionAdditionalFieldsDetails({
                type: objDetail?.type,
                branch_uuid: branch?.currentBranch?.uuid,
                client_uuid: branch?.currentBranch?.client_uuid,
            }))
        }

    }, [open])

    /**
     * useEffect
     * @dependency : additionalFieldsDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of add additional fields Details API
     */
    useEffect(() => {
        if (additionalFieldsDetails && additionalFieldsDetails !== null) {
            if (additionalFieldsDetails?.result === true) {
                if (additionalFieldsDetails?.response?.fields && additionalFieldsDetails?.response?.fields.length > 0) {
                    setFieldsDetails(additionalFieldsDetails?.response?.fields)
                    replace(additionalFieldsDetails?.response?.fields);
                } else {
                    setFieldsDetails([])
                    replace([emptyLevel]);
                }
            } else {
                setLoading(false)
                switch (additionalFieldsDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        replace([emptyLevel]);
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: additionalFieldsDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [additionalFieldsDetails])

    /**
     * useEffect
     * @dependency : additionalFieldsAdd
     * @type : HANDLE API RESULT
     * @description : Handle the result of add additional fields API
     */
    useEffect(() => {
        if (additionalFieldsAdd && additionalFieldsAdd !== null) {
            dispatch(resetAdditionalFieldsAddResponse())
            if (additionalFieldsAdd?.result === true) {
                setLoading(false)
                showSnackbar({ message: additionalFieldsAdd?.message, severity: "success" })
                dispatch(actionAdditionalFieldsDetails({
                    type: objDetail?.type,
                    branch_uuid: branch?.currentBranch?.uuid,
                    client_uuid: branch?.currentBranch?.client_uuid,
                }))
                onClose('save');
            } else {
                setLoading(false)
                switch (additionalFieldsAdd?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAdditionalFieldsAddResponse())
                        showSnackbar({ message: additionalFieldsAdd?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: additionalFieldsAdd?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [additionalFieldsAdd])

    //function to handle submit
    const onSubmit = (data) => {
        let hasError = false;
        // Set to store unique keys encountered so far (case-insensitive)
        const uniqueKeys = new Set();

        // Reset previous key errors before validation
        // (This is often handled automatically by useForm, but good practice for manual setError)

        data.setting_additional_fields.forEach((row, index) => {
            const key = row.key?.trim();
            const type = row.type?.trim();
            const label = row.label?.trim();
            // Check the deletion status
            const isDeleted = row.is_deleted === 1;

            const isKeyEmpty = !key;
            const isTypeEmpty = !type;
            const isLabelEmpty = !label;

            // Determine if the user has started filling this row at all
            const isRowEmpty = isKeyEmpty && isTypeEmpty && isLabelEmpty;
            const isRowPartiallyFilled = !isRowEmpty;

            // --- Core Validation Logic ---
            if (isRowPartiallyFilled) {
                // Case 1: Key is missing when others are filled or partially filled (Standard required check)
                if (isKeyEmpty) {
                    setError(`setting_additional_fields.${index}.key`, {
                        type: "manual",
                        message: "Key is required"
                    });
                    hasError = true;
                } else {
                    // Case 2: Key Uniqueness Check
                    // ONLY proceed with uniqueness check if the record is NOT deleted
                    if (!isDeleted) {
                        const normalizedKey = key.toLowerCase(); // Check uniqueness case-insensitively
                        if (uniqueKeys.has(normalizedKey)) {
                            setError(`setting_additional_fields.${index}.key`, {
                                type: "manual",
                                message: "Key must be unique"
                            });
                            hasError = true;
                        } else {
                            uniqueKeys.add(normalizedKey);
                        }
                    }
                }

                // Case 3: Type is missing
                if (isTypeEmpty) {
                    setError(`setting_additional_fields.${index}.type`, {
                        type: "manual",
                        message: "Type is required"
                    });
                    hasError = true;
                }

                // Case 4: Label is missing
                if (isLabelEmpty) {
                    setError(`setting_additional_fields.${index}.label`, {
                        type: "manual",
                        message: "Label is required"
                    });
                    hasError = true;
                }

            } else if (data.setting_additional_fields.length === 1 && isRowEmpty) {
                // Case 5: The only row is completely empty (requires all fields)
                setError(`setting_additional_fields.${index}.key`, {
                    type: "manual",
                    message: "Key is required"
                });
                setError(`setting_additional_fields.${index}.type`, {
                    type: "manual",
                    message: "Type is required"
                });
                setError(`setting_additional_fields.${index}.label`, {
                    type: "manual",
                    message: "Label is required"
                });
                hasError = true;
            }

            // Note: Completely empty rows when length > 1 are now ignored for validation, 
            // allowing the user to have a blank placeholder row without error.
        });

        // --- Submission Logic ---

        if (hasError) return;

        // Filter out completely empty rows before submission
        const nonEmptyRows = data.setting_additional_fields.filter(
            // Use the trimmed variables defined earlier for clean filtering
            (row) => row.key?.trim() || row.type?.trim() || row.label?.trim() || row.is_deleted?.trim()
        );

        let objData = {
            type: objDetail?.type,
            branch_uuid: branch?.currentBranch?.uuid,
            client_uuid: branch?.currentBranch?.client_uuid,
            fields: nonEmptyRows && nonEmptyRows.length > 0 ? nonEmptyRows : null
        }
        setLoading(true)
        dispatch(actionAdditionalFieldsAdd(objData))
    };

    return (
        <React.Fragment>
            <BootstrapDialog
                fullWidth
                maxWidth={'lg'}
                onClose={onClose}
                sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
                scroll="paper"
                open={open}
            >
                <DialogTitle sx={{ m: 0, p: 1.5 }} id="customized-dialog-title">
                    <Stack flexDirection="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
                        <Stack flexDirection="row" alignItems="center" gap={1}>
                            <TwoColorIconCircle
                                IconComponent={<AddIcon size={14} sx={{ color: theme.palette.primary[600] }} />}
                                color={theme.palette.primary[600]}
                                size={40}
                            />
                            <Stack sx={{ lineHeight: 0.2 }}>
                                <TypographyComponent fontSize={20} fontWeight={500}>{objDetail?.type && objDetail?.type !== null ? objDetail?.type : ''} Additional Fields</TypographyComponent>
                            </Stack>
                        </Stack>
                        <Stack direction="row" sx={{ justifyContent: 'end', columnGap: 1 }}>
                            <Button variant="contained" size="small" sx={{
                                textTransform: 'capitalize',
                                backgroundColor: theme.palette.primary[600],
                                color: theme.palette.common.white,
                                fontSize: 14,
                                fontWeight: 600,
                                borderColor: theme.palette.primary[600]
                            }} onClick={() =>
                                append(emptyLevel)
                            }>
                                <AddIcon sx={{ color: 'white', fontSize: 18 }} />
                                <TypographyComponent fontSize={14}>Add New field</TypographyComponent>
                            </Button>
                        </Stack>

                    </Stack>
                </DialogTitle>

                <DialogContent dividers>
                    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        {fields.map((item, index) => {
                            // 1. Check the deletion flag
                            if (item.is_deleted == 1) {
                                return null; // Skip rendering
                            } else {
                                // 2. Render only if the field is active (is_deleted !== 1)
                                return (
                                    <Box key={item.id}>
                                        <Grid
                                            container
                                            spacing={2}
                                            rowGap={2}
                                            marginBottom={2}
                                        >
                                            <Grid size={{ xs: 11, sm: 11, md: 11, lg: 11, xl: 11 }} >
                                                <Grid container spacing={2}>
                                                    {/* label */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                        <Controller
                                                            name={`setting_additional_fields.${index}.label`}
                                                            control={control}
                                                            rules={{
                                                                maxLength: {
                                                                    value: 60,
                                                                    message: 'Maximum length is 60 characters'
                                                                },
                                                            }}
                                                            render={({ field }) => (
                                                                <CustomTextField
                                                                    {...field}
                                                                    fullWidth
                                                                    inputProps={{ maxLength: 60 }}
                                                                    label={<FormLabel label="Label" fontWeight={600} fontSize={12} />}
                                                                    error={Boolean(errors.setting_additional_fields?.[index]?.label)}
                                                                    {...(errors.setting_additional_fields?.[index]?.label && { helperText: errors.setting_additional_fields?.[index]?.label.message })}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    {/* type */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                        <Controller
                                                            name={`setting_additional_fields.${index}.type`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <CustomTextField
                                                                    select // <-- 2. Added select prop
                                                                    fullWidth
                                                                    value={field?.value}
                                                                    label={<FormLabel label={`Type`} fontWeight={600} fontSize={12} />}
                                                                    onChange={field?.onChange}
                                                                    SelectProps={{
                                                                        MenuProps: {
                                                                            PaperProps: {
                                                                                style: {
                                                                                    maxHeight: 220, // Set your desired max height
                                                                                    scrollbarWidth: 'thin'
                                                                                }
                                                                            }
                                                                        }
                                                                    }}
                                                                    error={Boolean(errors.setting_additional_fields?.[index]?.type)}
                                                                    {...(errors.setting_additional_fields?.[index]?.type && { helperText: errors.setting_additional_fields?.[index]?.type.message })}
                                                                >
                                                                    <MenuItem value='' disabled>
                                                                        <em>Select Type</em>
                                                                    </MenuItem>
                                                                    {typeMaster && typeMaster.length > 0 ? (
                                                                        typeMaster.map(option => (
                                                                            <MenuItem key={option?.id} value={option?.id}>
                                                                                {option?.name}
                                                                            </MenuItem>
                                                                        ))) : (
                                                                        <MenuItem>Select</MenuItem>
                                                                    )}
                                                                </CustomTextField>
                                                            )}
                                                        />
                                                    </Grid>
                                                    {/* key */}
                                                    <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                        <Controller
                                                            name={`setting_additional_fields.${index}.key`}
                                                            control={control}
                                                            rules={{
                                                                maxLength: {
                                                                    value: 60,
                                                                    message: 'Maximum length is 60 characters'
                                                                },
                                                            }}
                                                            render={({ field }) => (
                                                                <CustomTextField
                                                                    {...field}
                                                                    fullWidth
                                                                    inputProps={{ maxLength: 60 }}
                                                                    label={<FormLabel label={`Key`} fontWeight={600} fontSize={12} />}
                                                                    error={Boolean(errors.setting_additional_fields?.[index]?.key)}
                                                                    {...(errors.setting_additional_fields?.[index]?.key && { helperText: errors.setting_additional_fields?.[index]?.key.message })}
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
                                                    {fields.length > 1 && (
                                                        <IconButton onClick={() => {
                                                            const targetKey = item.key;

                                                            // Use Array.prototype.some() to check if at least one element in the fieldsDetails array satisfies the condition
                                                            const keyAlreadyExists = fieldsDetails.some(field => field.key === targetKey)

                                                            if (keyAlreadyExists === true) {
                                                                setOpenRemoveAlertPopup(true)
                                                                let objData = {
                                                                    index: index,
                                                                    key: item?.key,
                                                                    title: `Delete ${item?.label}`,
                                                                    text: `Are you sure you want to delete this field? Deleting this field can affect your existing ${item?.label} as well. This action cannot be undone.`
                                                                }
                                                                setRemovedDetails(objData)
                                                            } else {
                                                                // remove(index)
                                                                const indexToRemove = fields.findIndex(field => field.key === item?.key);

                                                                if (indexToRemove !== -1) {
                                                                    // Now we call useFieldArray's remove function with the key-matched index
                                                                    remove(indexToRemove);
                                                                }
                                                            }
                                                        }} color="error">
                                                            <RemoveCircleOutlineIcon fontSize="medium" />
                                                        </IconButton>
                                                    )}
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )
                            }


                        })}
                    </form>
                </DialogContent>
                <DialogActions sx={{ m: 1 }}>
                    <Button
                        onClick={() => {
                            onClose()
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
                        Close
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
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
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Submit'}
                    </Button>
                </DialogActions>
            </BootstrapDialog>
            <AlertPopup
                open={openRemoveAlertPopup}
                handleConfirmClose={() => {
                    setOpenRemoveAlertPopup(false)
                }}
                icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={20} />}
                color={theme.palette.error[600]}
                objData={removedDetails}
                actionButtons={[
                    <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                        setOpenRemoveAlertPopup(false)
                    }}>
                        Cancel
                    </Button >
                    ,
                    <Button key="remove" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }}
                        onClick={() => {

                            const indexToUpdate = fields.findIndex(item => (item.key === removedDetails?.key) && item.is_deleted !== 1);
                            if (indexToUpdate !== -1) {
                                // 2. Get the current field object at that index
                                const currentField = fields[indexToUpdate];

                                // 3. Use the 'update' function from useFieldArray to modify the object
                                update(indexToUpdate, {
                                    ...currentField,
                                    is_deleted: 1,
                                });
                                setOpenRemoveAlertPopup(false)
                                setRemovedDetails(null)
                            }

                        }}>
                        Remove
                    </Button>
                ]}
            />
        </React.Fragment>
    );
}