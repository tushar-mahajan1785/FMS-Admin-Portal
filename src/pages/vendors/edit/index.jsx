/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
    Drawer,
    Button,
    Stack,
    Divider,
    CircularProgress,
    IconButton,
    Grid, InputAdornment, useTheme,
    Box,
    useMediaQuery
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    isAlphaNumeric,
    isEmail,
    isMobile,
    isWebsite,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { actionEditVendor, resetEditVendorResponse } from "../../../store/vendor";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormHeader from "../../../components/form-header";
import MailIcon from "../../../assets/icons/MailIcon";
import AddressIcon from "../../../assets/icons/AddressIcon";
import SectionHeader from "../../../components/section-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import StatusSwitch from "../../../components/status-switch";
import CloseIcon from "../../../assets/icons/CloseIcon";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { decrypt, encrypt } from "../../../utils";
import CountryCodeSelect from "../../../components/country-code-component";
import { CommonDynamicFields } from "../../../components/common-dynamic-fields";
import DatePickerWrapper from "../../../components/datapicker-wrapper";
import VendorIcon from "../../../assets/icons/VendorIcon";
import { useBranch } from "../../../hooks/useBranch";

export default function EditVendor({ open, objData, toggle }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'))

    // store
    const { editVendor, masterCountryCodeList } = useSelector(state => state.vendorStore)
    const { additionalFieldsDetails } = useSelector(state => state.CommonStore)

    const emptyLevel = { name: '', designation: '', email: '', contact_no: '', country_code: '+91' };

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            vendor_id: "",
            name: "",
            contact: "",
            contact_country_code: '+91',
            address: "",
            website: "",
            primary_contact_name: "",
            primary_contact_designation: "",
            primary_contact_no: "",
            primary_contact_country_code: '+91',
            primary_contact_email: "",
            vendor_escalation: Array(5).fill(emptyLevel),
            asset_status: 'Active'
        }
    });

    //field array
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'vendor_escalation'
    });

    // state
    const [loading, setLoading] = useState(false)
    const [assetStatus, setAssetStatus] = useState("Active");
    const [masterCountryCodeOptions, setMasterCountryCodeOptions] = useState([])
    const [additionalFieldsArray, setAdditionalFieldsArray] = useState([])

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            if (objData && objData !== null) {
                // Decrypt existing escalation data
                const decryptedEscalation = objData.vendor_escalation?.map((row) => ({
                    ...row,
                    contact_no: row.contact_no ? decrypt(row.contact_no) : "",
                    email: row.email ? decrypt(row.email) : "",
                })) ?? [];

                // Calculate how many empty rows are needed (up to a total of 5)
                const emptyRowsNeeded = 5 - decryptedEscalation.length;
                const finalEscalation = [...decryptedEscalation];

                // Append the required number of empty rows
                for (let i = 0; i < emptyRowsNeeded; i++) {
                    finalEscalation.push(emptyLevel);
                }

                // Set the form data using the reset function
                reset({
                    vendor_id: objData.vendor_id,
                    name: objData.name,
                    contact: decrypt(objData.contact),
                    contact_country_code: objData.contact_country_code ?? "+91",
                    address: objData.address,
                    website: objData.website,
                    primary_contact_name: objData.primary_contact_name,
                    primary_contact_designation: objData.primary_contact_designation,
                    primary_contact_country_code: objData.primary_contact_country_code,
                    primary_contact_no: decrypt(objData.primary_contact_no),
                    primary_contact_email: decrypt(objData.primary_contact_email),
                    vendor_escalation: finalEscalation,
                    asset_status: objData.asset_status,
                });

                setAssetStatus(objData.asset_status)
            }
        }
    }, [open, objData, reset]);

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
    const identificationProgress = useSectionProgress(watch, errors, ["vendor_id", "name", "asset_status"]);
    const vendorDetailProgress = useSectionProgress(watch, errors, ["contact", "address", "website"]);
    const primaryContactProgress = useSectionProgress(watch, errors, ["primary_contact_name", "primary_contact_designation", "primary_contact_no", "primary_contact_email"]);
    const escalationProgress = useSectionProgress(watch, errors, ["vendor_escalation"]);

    // handle close function
    const handleClose = () => {
        toggle()
        reset()
    }

    /**
     * initial render
     */
    useEffect(() => {

        return () => {
            reset()
        }
    }, [open])

    /**
  * Function to set the value for Additional fields as per Configured Additional Fields for Vendor
  */
    useEffect(() => {
        const fields = additionalFieldsDetails?.response?.fields;
        let arrDetails = objData?.additional_fields && objData?.additional_fields !== null && objData?.additional_fields.length > 0 ? objData?.additional_fields : []

        if (fields && fields.length > 0) {
            const updatedArray = fields
                .filter((element) => element.is_deleted !== 1)
                .map((element) => {
                    // find matching value from objData.additional_fields
                    const matched = arrDetails?.find(
                        (f) => f.key === element.key
                    ) ?? {};

                    return {
                        key: element?.key,
                        type: element?.type,
                        label: element?.label,
                        value: matched?.value ?? "", // use objData value if available
                    };
                });

            // set values in react-hook-form for each dynamic field
            updatedArray.forEach((field) => {
                setValue(field.key, field.value ?? "");
            });
            // finally update local state
            setAdditionalFieldsArray(updatedArray);
        }
    }, [additionalFieldsDetails?.response?.fields, objData?.additional_fields]);

    /**
     * useEffect
     * @dependency : masterCountryCodeList
     * @type : HANDLE API RESULT
     * @description : Handle the result of master Country Code List API
     */
    useEffect(() => {
        if (masterCountryCodeList && masterCountryCodeList !== null) {
            if (masterCountryCodeList?.response && masterCountryCodeList?.response !== null && masterCountryCodeList?.response.length > 0) {
                setMasterCountryCodeOptions(masterCountryCodeList?.response)
            } else {
                setMasterCountryCodeOptions([])
            }

        }
    }, [masterCountryCodeList])

    // set country code field
    useEffect(() => {
        if (objData && objData !== null) {
            setValue('contact_country_code', objData.contact_country_code)
        }

    }, [masterCountryCodeOptions])

    /**
     * useEffect
     * @dependency : editVendor
     * @type : HANDLE API RESULT
     * @description : Handle the result of edit Vendor API
     */
    useEffect(() => {
        if (editVendor && editVendor !== null) {
            dispatch(resetEditVendorResponse())
            if (editVendor?.result === true) {
                toggle('save')
                reset()
                setLoading(false)
                toast.dismiss()
                showSnackbar({ message: editVendor?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (editVendor?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEditVendorResponse())
                        toast.dismiss()
                        showSnackbar({ message: editVendor?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: editVendor?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [editVendor])

    // handle submit function
    const onSubmit = data => {
        // Filter out completely empty rows first
        const nonEmptyRows = data.vendor_escalation.filter(
            (row) =>
                row.name?.trim() ||
                row.designation?.trim() ||
                row.email?.trim() ||
                row.contact_no?.trim()
        );

        // Validate filtered rows to ensure name and contact info are paired.
        for (const row of nonEmptyRows) {
            const name = (row.name ?? "").trim();
            const designation = (row.designation ?? "").trim();
            const contact = (row.contact_no ?? "").trim();
            const email = (row.email ?? "").trim();

            const hasName = !!name;
            const hasDesignation = !!designation;
            const hasContact = !!contact;
            const hasEmail = !!email;

            // Rule 1️⃣: Contact number without name
            if (hasContact && !hasName) {
                setLoading(false);
                showSnackbar({
                    message: "Contact Name is required in Escalation Matrix",
                    severity: "error",
                });
                return;
            }

            // Rule 2️⃣: Name without contact number
            if (hasName && !hasContact) {
                setLoading(false);
                showSnackbar({
                    message: "Contact Number is required in Escalation Matrix",
                    severity: "error",
                });
                return;
            }

            // Rule 3️⃣: Designation or Email present → must have both name & contact
            if ((hasDesignation || hasEmail) && (!hasName || !hasContact)) {
                setLoading(false);
                showSnackbar({
                    message:
                        "Both Contact Name and Contact Number are required in Escalation Matrix",
                    severity: "error",
                });
                return;
            }
        }

        // Map and encrypt the validated, non-empty rows.
        const contactsWithLevel = nonEmptyRows.map((c, idx) => ({
            ...c,
            level_id: idx + 1,
            contact_no: c.contact_no ? encrypt(c.contact_no) : null,
            email: c.email ? encrypt(c.email.toLowerCase()) : null,
            country_code: c.contact_no && c.contact_no.trim() !== '' ? c.country_code : null,
        }));

        if (branch?.currentBranch && branch?.currentBranch !== null) {
            data.branch_uuid = branch?.currentBranch?.uuid
            data.client_id = branch?.currentBranch?.client_id
        }

        data.additional_fields = additionalFieldsArray && additionalFieldsArray !== null && additionalFieldsArray.length > 0 ? additionalFieldsArray : []

        const additionalKeys = additionalFieldsArray.map(f => f.key);

        // Build the final payload.
        const payload = {
            ...data,
            uuid: objData.uuid,
            vendor_escalation: contactsWithLevel,
            asset_status: assetStatus,
            contact: data.contact && data.contact.trim() !== '' ? encrypt(data.contact) : null,
            primary_contact_no: data.primary_contact_no && data.primary_contact_no.trim() !== '' ? encrypt(data.primary_contact_no) : null,
            primary_contact_email: data.primary_contact_email && data.primary_contact_email.trim() !== '' ? encrypt(data.primary_contact_email.toLowerCase()) : null,
            contact_country_code: data.contact && data.contact.trim() !== '' ? data.contact_country_code : null,
        };

        // remove them from payload
        const cleanedData = Object.fromEntries(
            Object.entries(payload).filter(([key]) => !additionalKeys.includes(key))
        );
        setLoading(true);
        dispatch(actionEditVendor(cleanedData));
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
                    icon={<VendorIcon stroke={theme.palette.primary[600]} size={18} />}
                    title="Edit Vendor"
                    subtitle="Fill below form to update vendor"
                    actions={[
                        <IconButton
                            onClick={handleClose}
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
                        <SectionHeader title="Vendor Identification" progress={identificationProgress} />
                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                            {/* vendor id */}
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                <Controller
                                    name='vendor_id'
                                    control={control}
                                    rules={{
                                        required: "Vendor ID is required",
                                        validate: {
                                            isAlphaNumeric: value => !value || isAlphaNumeric(value) || 'Invalid Vendor ID'
                                        },
                                        maxLength: {
                                            value: 45,
                                            message: 'Maximum length is 45 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Vendor ID' required={true} />}
                                            onChange={field.onChange}
                                            inputProps={{ maxLength: 45 }}
                                            error={Boolean(errors.vendor_id)}
                                            {...(errors.vendor_id && { helperText: errors.vendor_id.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* vendor name */}
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                <Controller
                                    name='name'
                                    control={control}
                                    rules={{
                                        required: "Vendor Name is required",
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Vendor Name' required={true} />}
                                            onChange={field.onChange}
                                            inputProps={{ maxLength: 255 }}
                                            error={Boolean(errors.name)}
                                            {...(errors.name && { helperText: errors.name.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* asset status */}
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                <StatusSwitch value={assetStatus} onChange={setAssetStatus} label="Asset Status" />
                            </Grid>
                        </Grid>
                        <SectionHeader title="Vendor Details" progress={vendorDetailProgress} sx={{ marginTop: 2 }} />
                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                            {/* employee contact */}
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                <Controller
                                    name="contact"
                                    control={control}
                                    rules={{
                                        validate: {
                                            isMobile: (value) =>
                                                !value || isMobile(value) || "Invalid mobile number",
                                        },
                                    }}
                                    render={({ field }) => {

                                        return (
                                            <CustomTextField
                                                fullWidth
                                                value={field.value || ""}
                                                label={<FormLabel label="Employee Contact" required={false} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 10 }}
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        paddingLeft: '0 !important'
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            sx={{ p: 0, display: "flex", m: 0, boxShadow: 'none' }}
                                                        >
                                                            <CountryCodeSelect
                                                                name={'contact_country_code'}
                                                                control={control}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={Boolean(errors.contact)}
                                                {...(errors.contact && { helperText: errors.contact.message })}
                                            />
                                        );
                                    }}
                                />
                            </Grid>
                            {/* Address */}
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                <Controller
                                    name='address'
                                    control={control}
                                    rules={{
                                        required: "Address is required",
                                        maxLength: {
                                            value: 500,
                                            message: 'Maximum length is 500 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Address' required={true} />}
                                            onChange={field?.onChange}
                                            inputProps={{ maxLength: 500 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <IconButton
                                                            edge='start'
                                                            onMouseDown={e => e.preventDefault()}
                                                        >
                                                            <AddressIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={Boolean(errors.address)}
                                            {...(errors.address && { helperText: errors.address.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* website */}
                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                <Controller
                                    name='website'
                                    control={control}
                                    rules={{
                                        validate: {
                                            isWebsite: (value) =>
                                                !value || isWebsite(value) || "Invalid website",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message: 'Maximum length is 255 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Website URL' required={false} />}
                                            onChange={field?.onChange}
                                            inputProps={{ maxLength: 255 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Box
                                                            sx={{
                                                                borderRight: "1px solid",
                                                                borderColor: "divider",
                                                                color: "text.secondary",
                                                                fontSize: 14,
                                                                textAlign: "center",
                                                                paddingRight: 1
                                                            }}
                                                        >
                                                            http://
                                                        </Box>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: "8px",
                                                },
                                            }}
                                            error={Boolean(errors.website)}
                                            {...(errors.website && { helperText: errors.website.message })}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <SectionHeader title="Primary Contact Information" progress={primaryContactProgress} sx={{ marginTop: 2 }} />
                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                            {/* primary name */}
                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                <Controller
                                    name='primary_contact_name'
                                    control={control}
                                    rules={{
                                        required: 'Name is required',
                                        maxLength: {
                                            value: 150,
                                            message: 'Maximum length is 150 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Name' required={true} />}
                                            onChange={field.onChange}
                                            inputProps={{ maxLength: 150 }}
                                            error={Boolean(errors.primary_contact_name)}
                                            {...(errors.primary_contact_name && { helperText: errors.primary_contact_name.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* primary designation */}
                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                <Controller
                                    name='primary_contact_designation'
                                    control={control}
                                    rules={{
                                        required: 'Designation is required',
                                        maxLength: {
                                            value: 150,
                                            message: 'Maximum length is 150 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Designation' required={true} />}
                                            onChange={field.onChange}
                                            inputProps={{ maxLength: 150 }}
                                            error={Boolean(errors.primary_contact_designation)}
                                            {...(errors.primary_contact_designation && { helperText: errors.primary_contact_designation.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* primary email */}
                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                <Controller
                                    name='primary_contact_email'
                                    control={control}
                                    rules={{
                                        required: 'Email is required',
                                        validate: {
                                            isEmail: value => !value || isEmail(value) || 'Invalid email address'
                                        },
                                        maxLength: {
                                            value: 150,
                                            message: 'Maximum length is 150 characters'
                                        },
                                    }}
                                    render={({ field }) => (
                                        <CustomTextField
                                            fullWidth
                                            value={field?.value}
                                            label={<FormLabel label='Email' required={true} />}
                                            onChange={field?.onChange}
                                            inputProps={{ maxLength: 150 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position='start'>
                                                        <IconButton
                                                            edge='start'
                                                            onMouseDown={e => e.preventDefault()}
                                                        >
                                                            <MailIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            error={Boolean(errors.primary_contact_email)}
                                            {...(errors.primary_contact_email && { helperText: errors.primary_contact_email.message })}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* primary contact no */}
                            <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                <Controller
                                    name="primary_contact_no"
                                    control={control}
                                    rules={{
                                        required: 'Contact Number is required',
                                        validate: {
                                            isMobile: (value) =>
                                                !value || isMobile(value) || "Invalid mobile number",
                                        },
                                    }}
                                    render={({ field }) => {

                                        return (
                                            <CustomTextField
                                                fullWidth
                                                value={field.value || ""}
                                                label={<FormLabel label="Contact" required={true} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 10 }}
                                                sx={{
                                                    '& .MuiInputBase-root': {
                                                        paddingLeft: '0 !important'
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            sx={{ p: 0, display: "flex", m: 0, boxShadow: 'none' }}
                                                        >
                                                            <CountryCodeSelect
                                                                name={'primary_contact_country_code'}
                                                                control={control}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={Boolean(errors.primary_contact_no)}
                                                {...(errors.primary_contact_no && { helperText: errors.primary_contact_no.message })}
                                            />
                                        );
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <SectionHeader title="Escalation Matrix" progress={escalationProgress} sx={{ marginTop: 2 }} />
                        <Stack sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: "16px", padding: '16px', marginBottom: 2 }}>
                            {fields.map((item, index) => (
                                <Box key={item.id}>
                                    <Grid
                                        container
                                        spacing={2}

                                    >
                                        <Grid size={{ xs: 11, sm: 11, md: 11, lg: 11, xl: 11 }}>
                                            <Grid container spacing={'24px'}>
                                                {/* Person Name */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`vendor_escalation.${index}.name`}
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
                                                                label={<FormLabel label={`Level ${index + 1} Contact Name`} />}
                                                                error={!!errors.vendor_escalation?.[index]?.name}
                                                                inputProps={{ maxLength: 255 }}
                                                                helperText={errors.vendor_escalation?.[index]?.name?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {/* Designation */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`vendor_escalation.${index}.designation`}
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
                                                                label={<FormLabel label="Designation" />}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={!!errors.vendor_escalation?.[index]?.designation}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {/* Email */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`vendor_escalation.${index}.email`}
                                                        control={control}
                                                        rules={{
                                                            validate: value =>
                                                                !value || isEmail(value) || 'Invalid email address',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                {...field}
                                                                fullWidth
                                                                label={<FormLabel label="Email" />}
                                                                inputProps={{ maxLength: 255 }}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <MailIcon />
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                                error={!!errors.vendor_escalation?.[index]?.email}
                                                                helperText={errors.vendor_escalation?.[index]?.email?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                {/* Contact Number */}
                                                <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name={`vendor_escalation.${index}.contact_no`}
                                                        control={control}
                                                        rules={{
                                                            validate: value =>
                                                                !value || isMobile(value) || 'Invalid mobile number'
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                {...field}
                                                                fullWidth
                                                                inputProps={{ maxLength: 10 }}
                                                                sx={{
                                                                    '& .MuiInputBase-root': {
                                                                        paddingLeft: '0 !important'
                                                                    }
                                                                }}
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment
                                                                            position="start"
                                                                            sx={{ p: 0, display: "flex", m: 0, boxShadow: 'none' }}
                                                                        >
                                                                            <CountryCodeSelect
                                                                                name={`vendor_escalation.${index}.country_code`}
                                                                                control={control}
                                                                            />
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                label={<FormLabel label="Contact" />}
                                                                error={!!errors.vendor_escalation?.[index]?.contact_no}
                                                                helperText={errors.vendor_escalation?.[index]?.contact_no?.message}
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
                                                        append({ name: '', designation: '', email: '', contact_no: '' })
                                                    }
                                                    color="primary"
                                                >
                                                    <AddCircleOutlineIcon fontSize="medium" />
                                                </IconButton>

                                                {fields.length > 1 && (
                                                    <IconButton onClick={() => remove(index)} color="error">
                                                        <RemoveCircleOutlineIcon fontSize="medium" />
                                                    </IconButton>
                                                )}
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{ my: isSMDown ? 4 : 2 }} />
                                </Box>
                            ))}
                        </Stack >
                        {
                            additionalFieldsArray && additionalFieldsArray !== null && additionalFieldsArray.length > 0 ?
                                <React.Fragment>
                                    <SectionHeader title="Additional Fields" sx={{ marginTop: 2 }} show_progress={0} />
                                    <DatePickerWrapper>
                                        <Grid container spacing={'24px'} marginTop={2} marginBottom={3} sx={{ backgroundColor: `${theme.palette.grey[50]}`, borderRadius: '16px', padding: '16px' }}>
                                            <CommonDynamicFields
                                                control={control}
                                                errors={errors}
                                                xs={12}
                                                sm={6}
                                                md={4}
                                                lg={4}
                                                xl={4}
                                                additionalFields={additionalFieldsArray}
                                                setAdditionalFields={setAdditionalFieldsArray}
                                            />
                                        </Grid>
                                    </DatePickerWrapper>
                                </React.Fragment>
                                :
                                <></>
                        }
                    </form>
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            toggle()
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
