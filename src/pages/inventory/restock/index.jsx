import { useTheme } from '@emotion/react'
import React, { useEffect, useRef, useState } from 'react'
import CloseIcon from '../../../assets/icons/CloseIcon'
import { Button, CircularProgress, Divider, Drawer, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, MenuItem, Stack } from '@mui/material'
import FormHeader from '../../../components/form-header'
import BoxPlusIcon from '../../../assets/icons/BoxPlusIcon'
import { Controller, useForm } from 'react-hook-form'
import SectionHeader from '../../../components/section-header'
import ChevronDownIcon from '../../../assets/icons/ChevronDown'
import CustomTextField from '../../../components/text-field'
import FormLabel from '../../../components/form-label'
import TypographyComponent from '../../../components/custom-typography'
import FieldBox from '../../../components/field-box'
import CustomAutocomplete from '../../../components/custom-autocomplete'
import { useDispatch, useSelector } from 'react-redux'
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants'
import { resetVendorMasterListResponse } from '../../../store/vendor'
import { resetGetUnitMasterResponse } from '../../../store/inventory'
import { useAuth } from '../../../hooks/useAuth'
import { useSnackbar } from '../../../hooks/useSnackbar'
// import { useBranch } from '../../../hooks/useBranch'
import moment from 'moment'
import CalendarIcon from '../../../assets/icons/CalendarIcon'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '../../../components/datapicker-wrapper'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import FileIcon from '../../../assets/icons/FileIcon'
import _ from 'lodash'

export const RestockInventory = ({ open, handleClose }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    // const branch = useBranch()
    const inputRef = useRef();

    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'xlsx', 'csv', 'pdf', 'docx'];
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

    // Trigger file dialog
    const handleTriggerInput = () => {
        inputRef.current.click();
    };

    const { vendorMasterList } = useSelector(state => state.vendorStore)
    const { getUnitMaster } = useSelector(state => state.inventoryStore)

    const [loading, setLoading] = useState(false)

    const [inventoryRestockDetailsData, setInventoryRestockDetailsData] = useState(null)
    const [masterUnitOptions, setMasterUnitOptions] = useState([])
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            item_id: '',
            item_name: '',
            category: '',
            description: '',
            initial_quantity: '',
            minimum_quantity: '',
            critical_quantity: '',
            unit: '',
            storage_location: '',
            contact_country_code: "+91",
            contact: '',
            email: '',
            supplier_name: '',

        }
    });

    console.log('--------inventoryRestockDetailsData-----', inventoryRestockDetailsData)

    useEffect(() => {
        if (open === true) {
            setInventoryRestockDetailsData({
                "uuid": "tyyg7687878787878",
                "item_id": "INV-98989",
                "item_name": "R-22 Refrigerant Gas",
                "category": "Chemicals",
                "description": "cdddddddddddddd",
                "initial_quantity": "100",
                "minimum_quantity": "120",
                "critical_quantity": "101",
                "unit": "Kilograms",
                "storage_location": "Shivaji nagar, Pune",
                "contact_country_code": "+91",
                "contact": "9876543222",
                "email": "vijay+4@mail.com",
                "supplier_name": 27,
                "restocked_quantity": "50",
                "consumed_quantity": "30",
                "status": "Out Of Stock",
                "last_restocked_date": "2025-04-01",
                "image_url": "https://fms-super-admin.interdev.in/fms/client/1/branch/1/ticket/12/12_1763123256318.jpg"
            })
            // dispatch(actionGetInventoryDetails({
            //     uuid: detail?.uuid
            // }))
            //-----development purpose-----
            //for testing purpose only

            setMasterUnitOptions([
                {
                    "id": 1,
                    "name": "Kilograms",
                    "status": "Active"
                },
                {
                    "id": 2,
                    "name": "Grams",
                    "status": "Active"
                },
                {
                    "id": 3,
                    "name": "Liters",
                    "status": "Active"
                }])
            //---------------------------
        }
        return () => {
            reset()
            setInventoryRestockDetailsData(null)
        }
    }, [open])

    //handle delete function
    const handleDelete = (index) => {
        const newFiles = [...arrUploadedFiles];
        newFiles.splice(index, 1);
        setArrUploadedFiles(newFiles);
    };

    /**
     * Check if the selected files extension is valid or not
     * @param {*} fileName 
     * @returns 
     */
    const isValidExtension = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
    };

    //handle file change function
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        let filesToAdd = [];
        for (let file of selectedFiles) {
            if (!isValidExtension(file.name)) {
                showSnackbar({ message: `File "${file.name}" has an invalid file type.`, severity: "error" });
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                showSnackbar({ message: `File "${file.name}" exceeds the 50MB size limit.`, severity: "error" });
                continue;
            }
            // Add is_new anf file name key here
            filesToAdd.push({ file, is_new: 1, name: file?.name });
        }
        if (filesToAdd.length > 0) {
            setArrUploadedFiles((prev) => [...prev, ...filesToAdd]);
        }
        event.target.value = null;
    };

    //handle drag drop function
    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const droppedFiles = Array.from(event.dataTransfer.files);
        let filesToAdd = [];
        for (let file of droppedFiles) {
            if (!isValidExtension(file.name)) {
                showSnackbar({ message: `File "${file.name}" has an invalid file type.`, severity: "error" });
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                showSnackbar({ message: `File "${file.name}" exceeds the 50MB size limit.`, severity: "error" });
                continue;
            }
            filesToAdd.push({ file, is_new: 1 });
        }
        if (filesToAdd.length > 0) {
            setArrUploadedFiles((prev) => [...prev, ...filesToAdd]);
        }
    };

    //handle drag over
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    /**
       * useEffect
       * @dependency : getUnitMaster
       * @type : HANDLE API RESULT
       * @description : Handle the result of unit master API
       */
    useEffect(() => {
        if (getUnitMaster && getUnitMaster !== null) {
            dispatch(resetGetUnitMasterResponse())
            if (getUnitMaster?.result === true) {
                setMasterUnitOptions(getUnitMaster?.response)
            } else {
                // setMasterUnitOptions([])
                switch (getUnitMaster?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetUnitMasterResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getUnitMaster?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getUnitMaster])

    /**
       * useEffect
       * @dependency : vendorMasterList
       * @type : HANDLE API RESULT
       * @description : Handle the result of vendor Master List API
       */
    useEffect(() => {
        if (vendorMasterList && vendorMasterList !== null) {
            dispatch(resetVendorMasterListResponse())
            if (vendorMasterList?.result === true) {
                // setSupervisorMasterOptions(vendorMasterList?.response)
                let data = [
                    {
                        "id": 30,
                        "name": "TSA Technologies",
                        "primary_contact_name": "Vijay Patil",
                        "primary_contact_no": "U2FsdGVkX19vzhb7C71e1kog/pqdsepXrsj1KCkt4eA=",
                        "primary_contact_email": "U2FsdGVkX1//Zj9k1PxUyR09FgCXVOdqs7tpvnnuDfGJmqa0xIRqg61nBK31y39S",
                        "primary_contact_country_code": "+91"
                    },
                    {
                        "id": 29,
                        "name": "Jio India",
                        "primary_contact_name": "Rahul Pawar",
                        "primary_contact_no": "U2FsdGVkX19DwxKeFI7M6YApCEULM+uPMaN0+oMzHGM=",
                        "primary_contact_email": "U2FsdGVkX18oUEDIJg/l99utABZy1zQ79GTUKJurL6k=",
                        "primary_contact_country_code": "+91"
                    },
                    {
                        "id": 28,
                        "name": "VI Private Limited",
                        "primary_contact_name": "Sarthak Chavan",
                        "primary_contact_no": "U2FsdGVkX19vzhb7C71e1kog/pqdsepXrsj1KCkt4eA=",
                        "primary_contact_email": "U2FsdGVkX1//Zj9k1PxUyR09FgCXVOdqs7tpvnnuDfGJmqa0xIRqg61nBK31y39S",
                        "primary_contact_country_code": "+91"
                    },
                    {
                        "id": 27,
                        "name": "Vodafone India Pvt Ltd",
                        "primary_contact_name": "Gauri More",
                        "primary_contact_no": "U2FsdGVkX19vzhb7C71e1kog/pqdsepXrsj1KCkt4eA=",
                        "primary_contact_email": "U2FsdGVkX1//Zj9k1PxUyR09FgCXVOdqs7tpvnnuDfGJmqa0xIRqg61nBK31y39S",
                        "primary_contact_country_code": "+91"
                    },
                    {
                        "id": 1,
                        "name": "Lorem Ips1",
                        "primary_contact_name": "Akash Pawar",
                        "primary_contact_no": "U2FsdGVkX19vzhb7C71e1kog/pqdsepXrsj1KCkt4eA=",
                        "primary_contact_email": "U2FsdGVkX1//Zj9k1PxUyR09FgCXVOdqs7tpvnnuDfGJmqa0xIRqg61nBK31y39S",
                        "primary_contact_country_code": "+91"
                    }
                ]
                setSupervisorMasterOptions(data)
            } else {
                setSupervisorMasterOptions([])
                switch (vendorMasterList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorMasterListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: vendorMasterList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorMasterList])



    const onSubmit = () => {
        setLoading(true)

    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: '86%' } } }}
        >
            <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                <FormHeader
                    color={theme.palette.primary[600]}
                    size={48}
                    icon={<BoxPlusIcon stroke={theme.palette.primary[600]} size={20} />}
                    title={`Restock Inventory`}
                    subtitle={`Add stock to existing inventory item`}
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
                    <form noValidate autoComplete='off'
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <DatePickerWrapper>
                            <Grid container spacing={'24px'}>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8.5, xl: 8.5 }}>
                                    <Stack sx={{
                                        height: 720,
                                        overflowY: "auto",
                                        scrollbarWidth: "thin",
                                        "&::-webkit-scrollbar": {
                                            width: "6px",
                                        },
                                        "&::-webkit-scrollbar-thumb": {
                                            backgroundColor: theme.palette.grey[400],
                                            borderRadius: "3px",
                                        },
                                    }}>
                                        <SectionHeader sx={{ mt: 0, mb: 0, px: 1, pt: 1 }} title={'Basic Information'} show_progress={false} />
                                        <Stack sx={{ border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px', pb: 1.5, marginTop: '-5px' }}>
                                            <Grid container>
                                                {/* Item ID */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Item ID" value={inventoryRestockDetailsData?.item_id && inventoryRestockDetailsData?.item_id !== null ? inventoryRestockDetailsData?.item_id : ''} />
                                                </Grid>
                                                {/* Item Name */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Item Name" value={inventoryRestockDetailsData?.item_name && inventoryRestockDetailsData?.item_name !== null ? inventoryRestockDetailsData?.item_name : ''} />
                                                </Grid>
                                                {/* Category */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Category" value={inventoryRestockDetailsData?.category && inventoryRestockDetailsData?.category !== null ? inventoryRestockDetailsData?.category : ''} />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                    <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}></Stack>
                                                </Grid>
                                                {/* Item ID */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Current Stock" value={inventoryRestockDetailsData?.initial_quantity && inventoryRestockDetailsData?.initial_quantity !== null ? inventoryRestockDetailsData?.initial_quantity : ''} />
                                                </Grid>
                                                {/* Item Name */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Minimum Stock" value={inventoryRestockDetailsData?.minimum_quantity && inventoryRestockDetailsData?.minimum_quantity !== null ? inventoryRestockDetailsData?.minimum_quantity : ''} />
                                                </Grid>
                                                {/* Category */}
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 4 }}>
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Storage Location" value={inventoryRestockDetailsData?.storage_location && inventoryRestockDetailsData?.storage_location !== null ? inventoryRestockDetailsData?.storage_location : ''} />
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                        <SectionHeader title="Stock Information" show_progress={0} sx={{ marginTop: 2.5 }} />
                                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 3, marginTop: '-4px' }}>
                                            <Grid container spacing={'24px'}>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='initial_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Initial Quantity is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Initial Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Initial Quantity' required={true} />}
                                                                onChange={field.onChange}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.initial_quantity)}
                                                                {...(errors.initial_quantity && { helperText: errors.initial_quantity.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='unit'
                                                        control={control}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                select
                                                                fullWidth
                                                                value={field?.value ?? ''}
                                                                label={<FormLabel label='Unit' required={false} />}
                                                                onChange={field?.onChange}
                                                                SelectProps={{
                                                                    displayEmpty: true,
                                                                    IconComponent: ChevronDownIcon,
                                                                    MenuProps: {
                                                                        PaperProps: {
                                                                            style: {
                                                                                maxHeight: 220, // Set your desired max height
                                                                                scrollbarWidth: 'thin'
                                                                            }
                                                                        }
                                                                    }
                                                                }}

                                                                error={Boolean(errors.unit)}
                                                                {...(errors.unit && { helperText: errors.unit.message })}
                                                            >
                                                                <MenuItem value=''>
                                                                    <em>Select Unit</em>
                                                                </MenuItem>
                                                                {masterUnitOptions && masterUnitOptions !== null && masterUnitOptions.length > 0 &&
                                                                    masterUnitOptions.map(option => (
                                                                        <MenuItem
                                                                            key={option?.id}
                                                                            value={option?.name}
                                                                            sx={{
                                                                                whiteSpace: 'normal',        // allow wrapping
                                                                                wordBreak: 'break-word',     // break long words if needed
                                                                                maxWidth: 400,               // control dropdown width
                                                                                display: '-webkit-box',
                                                                                WebkitLineClamp: 2,          // limit to 2 lines
                                                                                WebkitBoxOrient: 'vertical',
                                                                                overflow: 'hidden',
                                                                                textOverflow: 'ellipsis'
                                                                            }}
                                                                        >
                                                                            {option?.name}
                                                                        </MenuItem>
                                                                    ))}
                                                            </CustomTextField>
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='minimum_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Minimum Quantity is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Minimum Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Minimum Quantity' required={true} />}
                                                                onChange={field.onChange}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.minimum_quantity)}
                                                                {...(errors.minimum_quantity && { helperText: errors.minimum_quantity.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3, xl: 3 }}>
                                                    <Controller
                                                        name='critical_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Critical Quantity is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Critical Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Critical Quantity' required={true} />}
                                                                onChange={field.onChange}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.critical_quantity)}
                                                                {...(errors.critical_quantity && { helperText: errors.critical_quantity.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                    <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}></Stack>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                    <Controller
                                                        name='supplier_name'
                                                        control={control}
                                                        rules={{
                                                            required: 'Please select Supplier Name',
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomAutocomplete
                                                                {...field}
                                                                label="Supplier Name"
                                                                is_required={true}
                                                                displayName1="primary_contact_name"
                                                                displayName2="name"
                                                                options={supervisorMasterOptions}
                                                                error={Boolean(errors.supplier_name)}
                                                                helperText={errors.supplier_name?.message}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                    <Controller
                                                        name='invoice_no'
                                                        control={control}
                                                        rules={{
                                                            required: 'Invoice/Reference Number is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Invoice/Reference Number'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Invoice / Reference Number' required={true} />}
                                                                onChange={field.onChange}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.invoice_no)}
                                                                {...(errors.invoice_no && { helperText: errors.invoice_no.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                    <Controller
                                                        name='restock_date'
                                                        control={control}
                                                        rules={{
                                                            required: 'Restock Date is required',
                                                        }}
                                                        render={({ field }) => (
                                                            <DatePicker
                                                                id='restock_date'
                                                                placeholderText='Restock Date'
                                                                customInput={
                                                                    <CustomTextField
                                                                        size='small'
                                                                        label={<FormLabel label='Restock Date' required={true} />}
                                                                        fullWidth
                                                                        InputProps={{
                                                                            startAdornment: (
                                                                                <InputAdornment position='start'>
                                                                                    <IconButton
                                                                                        edge='start'
                                                                                        onMouseDown={e => e.preventDefault()}
                                                                                    >
                                                                                        <CalendarIcon />
                                                                                    </IconButton>
                                                                                </InputAdornment>
                                                                            )
                                                                        }}
                                                                        error={Boolean(errors.restock_date)}
                                                                        {...(errors.restock_date && { helperText: errors.restock_date.message })}
                                                                    />
                                                                }
                                                                value={field.value}
                                                                selected={field?.value ? moment(field.value, 'DD/MM/YYYY').toDate() : null}
                                                                showYearDropdown
                                                                onChange={date => {
                                                                    const formattedDate = moment(date).format('DD/MM/YYYY')
                                                                    field.onChange(formattedDate)
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                    <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}` }}></Stack>
                                                </Grid>
                                                {/* Additional Notes */}
                                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                                    <Controller
                                                        name='additional_notes'
                                                        control={control}
                                                        rules={{
                                                            required: 'Additional Notes is required',
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                multiline
                                                                inputProps={{ maxLength: 255 }}
                                                                minRows={3}
                                                                placeholder={'Any additional information about restock'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Additional Notes' required={true} />}
                                                                onChange={field.onChange}
                                                                error={Boolean(errors.additional_notes)}
                                                                {...(errors.additional_notes && { helperText: errors.additional_notes.message })}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                                                    <FormLabel label='Attachments' required={false} />
                                                    <Stack onClick={handleTriggerInput} onDrop={handleDrop}
                                                        onDragOver={handleDragOver}
                                                        sx={{ mt: 1, cursor: 'pointer', border: `1px dashed ${theme.palette.primary[600]}`, borderRadius: '8px', background: theme.palette.primary[100], p: '16px', flexDirection: 'row', justifyContent: 'center' }}>
                                                        <input
                                                            hidden
                                                            accept=".jpg,.jpeg,.png,.xlsx,.csv,.pdf,.docx"
                                                            type="file"
                                                            multiple
                                                            ref={inputRef}
                                                            onChange={handleFileChange}
                                                        />
                                                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ mr: 1 }}>Drag & Drop file(s) to upload or </TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.primary[600], textDecoration: 'underline' }}>Browse</TypographyComponent>
                                                    </Stack>
                                                    <List>
                                                        {arrUploadedFiles && arrUploadedFiles !== null && arrUploadedFiles.length > 0 ?
                                                            arrUploadedFiles.map((file, idx) => (
                                                                <React.Fragment key={file.name}>
                                                                    <ListItem
                                                                        sx={{ mb: '-8px' }}
                                                                        secondaryAction={
                                                                            <>
                                                                                <IconButton
                                                                                    edge="end"
                                                                                    aria-label="delete"
                                                                                    onClick={() => handleDelete(idx)}
                                                                                >
                                                                                    <DeleteIcon />
                                                                                </IconButton>
                                                                            </>
                                                                        }
                                                                    >
                                                                        <FileIcon sx={{ mr: 1 }} />
                                                                        <ListItemText
                                                                            primary={
                                                                                <TypographyComponent fontSize={14} fontWeight={500} sx={{ textDecoration: 'underline' }}>
                                                                                    {file?.name && file?.name !== null ? _.truncate(file?.name, { length: 25 }) : ''}
                                                                                </TypographyComponent>
                                                                            }
                                                                        />
                                                                    </ListItem>
                                                                </React.Fragment>
                                                            ))
                                                            :
                                                            <></>
                                                        }
                                                    </List>
                                                </Grid>
                                            </Grid>
                                        </Stack>
                                    </Stack>
                                </Grid >
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3.5, xl: 3.5 }}>
                                    <Stack>
                                        <SectionHeader title="Upload Files" show_progress={0} sx={{ marginTop: 2 }} />
                                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px', pb: 0 }}>
                                            <Stack
                                                sx={{
                                                    height: '395px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                    border: `1px solid ${theme.palette.grey[300]}`,
                                                    padding: '16px',
                                                    backgroundImage: inventoryRestockDetailsData?.image_url ? `url(${inventoryRestockDetailsData.image_url})` : undefined,
                                                    backgroundColor: inventoryRestockDetailsData?.image_url ? "transparent" : theme.palette.primary[50],
                                                    borderRadius: '8px',
                                                    backgroundSize: "cover",
                                                    backgroundPosition: "center",
                                                }}
                                            >
                                                {!inventoryRestockDetailsData?.image_url || inventoryRestockDetailsData?.image_url == '' || inventoryRestockDetailsData?.image_url == null ?
                                                    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                                        <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.primary[900] }}>
                                                            No Image Available
                                                        </TypographyComponent>
                                                    </Stack>
                                                    :
                                                    <></>
                                                }
                                            </Stack>
                                            <Stack spacing={1.5} sx={{ width: '100%', my: 2 }}>
                                                <Stack sx={{ padding: '12px', borderRadius: '8px', border: `1px solid ${theme.palette.success[500]}`, background: theme.palette.success[50] }}>
                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Current Stock</TypographyComponent>
                                                    <TypographyComponent fontSize={24} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{inventoryRestockDetailsData?.initial_quantity} {inventoryRestockDetailsData?.unit}</TypographyComponent>
                                                </Stack>
                                                <Stack sx={{ padding: '12px', borderRadius: '8px', border: `1px solid ${theme.palette.grey[500]}` }}>
                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Minimum Stock</TypographyComponent>
                                                    <TypographyComponent fontSize={24} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{inventoryRestockDetailsData?.minimum_quantity} {inventoryRestockDetailsData?.unit}</TypographyComponent>
                                                </Stack>
                                                {/* <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Category -</TypographyComponent>
                                                <TypographyComponent title={watchCategory} fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchCategory && watchCategory !== null ? _.truncate(watchCategory, { length: 30 }) : 'NA'}</TypographyComponent>
                                            </Stack>
                                             */}
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </DatePickerWrapper>
                    </form>
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ px: 2, pb: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            handleClose()
                            // reset()
                        }}
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: (loading ? theme.palette.grey[400] : theme.palette.primary[600]), color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        name='submit'
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Confirm Restock'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    )
}
