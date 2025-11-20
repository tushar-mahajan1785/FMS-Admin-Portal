/* eslint-disable react-hooks/exhaustive-deps */
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
import { actionVendorMasterList, resetVendorMasterListResponse } from '../../../store/vendor'
import { actionGetUnitMaster, actionInventoryRestockSave, resetGetUnitMasterResponse, resetInventoryRestockSaveResponse } from '../../../store/inventory'
import { useAuth } from '../../../hooks/useAuth'
import { useSnackbar } from '../../../hooks/useSnackbar'
import { useBranch } from '../../../hooks/useBranch'
import moment from 'moment'
import CalendarIcon from '../../../assets/icons/CalendarIcon'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from '../../../components/datapicker-wrapper'
import DeleteIcon from '../../../assets/icons/DeleteIcon'
import FileIcon from '../../../assets/icons/FileIcon'
import _ from 'lodash'
import { compressFile, getCurrentStatusColor, getCurrentStockValue, getFormData } from '../../../utils'
import CustomChip from '../../../components/custom-chip'

export const RestockInventory = ({ open, handleClose, restockData }) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const inputRef = useRef();

    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'xlsx', 'csv', 'pdf', 'docx'];
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

    // Trigger file dialog
    const handleTriggerInput = () => {
        inputRef.current.click();
    };

    //Stores
    const { vendorMasterList } = useSelector(state => state.vendorStore)
    const { getUnitMaster, inventoryRestockSave } = useSelector(state => state.inventoryStore)

    //States
    const [loading, setLoading] = useState(false)
    const [inventoryRestockDetailsData, setInventoryRestockDetailsData] = useState(null)
    const [masterUnitOptions, setMasterUnitOptions] = useState([])
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            added_quantity: '',
            minimum_quantity: '',
            critical_quantity: '',
            unit: '',
            supplier_name: '',
            invoice_number: '',
            restock_date: '',
            additional_notes: ''
        }
    });

    //watchers
    const watchAddedQuantity = watch('added_quantity')

    /**
     * Initial Render
     * @dependent restockData
     */
    useEffect(() => {
        if (open === true) {
            reset()

            //set the previously filled inventory data 
            if (restockData && restockData !== null) {
                setInventoryRestockDetailsData(restockData)
            } else {
                setInventoryRestockDetailsData(null)
            }

            //Masters api Call
            dispatch(actionGetUnitMaster())
            dispatch(actionVendorMasterList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
        return () => {
            reset()
            setInventoryRestockDetailsData(null)
            setArrUploadedFiles([])
        }
    }, [open, restockData])

    /**
    * Set supplier_name
    * @dependent supervisorMasterOptions
    */
    useEffect(() => {
        if (supervisorMasterOptions && supervisorMasterOptions !== null && supervisorMasterOptions.length > 0) {
            setValue('supplier_name', inventoryRestockDetailsData?.supplier_id && inventoryRestockDetailsData?.supplier_id !== null ? inventoryRestockDetailsData?.supplier_id : '')
        }
    }, [supervisorMasterOptions])

    useEffect(() => {
        if (inventoryRestockDetailsData && inventoryRestockDetailsData !== null) {
            setValue('minimum_quantity', inventoryRestockDetailsData?.minimum_quantity)
            setValue('unit', inventoryRestockDetailsData?.unit_id)
            setValue('critical_quantity', inventoryRestockDetailsData?.critical_quantity)
            setValue('supplier_name', inventoryRestockDetailsData?.supplier_id)
        }

    }, [inventoryRestockDetailsData])

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
                setMasterUnitOptions([])
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
                setSupervisorMasterOptions(vendorMasterList?.response)
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

    /**
     * useEffect
     * @dependency : inventoryRestockSave
     * @type : HANDLE API RESULT
     * @description : Handle the result of inventory restock save API
     */
    useEffect(() => {
        if (inventoryRestockSave && inventoryRestockSave !== null) {
            dispatch(resetInventoryRestockSaveResponse())
            if (inventoryRestockSave?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: inventoryRestockSave?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (inventoryRestockSave?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetInventoryRestockSaveResponse())
                        showSnackbar({ message: inventoryRestockSave?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: inventoryRestockSave?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [inventoryRestockSave])


    const onSubmit = async (data) => {
        let objData = {
            branch_uuid: branch?.currentBranch?.uuid,
            inventory_uuid: inventoryRestockDetailsData?.uuid && inventoryRestockDetailsData?.uuid !== null ? inventoryRestockDetailsData?.uuid : null,
            added_quantity: data?.added_quantity && data?.added_quantity !== null ? data?.added_quantity : null,
            supplier_id: data?.supplier_name ? data?.supplier_name : null,
            invoice_number: data?.invoice_number && data?.invoice_number !== null ? data?.invoice_number : null,
            restock_date: data?.restock_date && data?.restock_date !== null ? moment(data.restock_date, 'DD MMM YYYY').format('YYYY-MM-DD') : null,
            additional_notes: data?.additional_notes && data?.additional_notes !== null ? data?.additional_notes : null
        }
        const files = [];
        let hasNewFiles = arrUploadedFiles.filter(obj => obj?.is_new === 1)
        if (hasNewFiles && hasNewFiles.length > 0 && arrUploadedFiles && arrUploadedFiles.length > 0) {
            for (const objFile of arrUploadedFiles) {
                if (objFile?.is_new === 1) {

                    //Compress the files with type image
                    const compressedFile = await compressFile(objFile.file);

                    files.push({
                        title: `file_upload`,
                        data: compressedFile
                    });
                }
            }
        }
        const formData = getFormData(objData, files);

        setLoading(true)
        dispatch(actionInventoryRestockSave(formData))
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '100%', lg: '100%', xl: '86%' } } }}
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
                                        <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', mt: 0, mb: 0, px: 1, pt: 1 }}>
                                            <SectionHeader sx={{}} title={'Basic Information'} show_progress={false} />
                                            {
                                                inventoryRestockDetailsData?.stock_status && inventoryRestockDetailsData?.stock_status !== null ?
                                                    <Stack>
                                                        <CustomChip text={inventoryRestockDetailsData?.stock_status} colorName={getCurrentStatusColor(inventoryRestockDetailsData?.stock_status)} />
                                                    </Stack>
                                                    :
                                                    <></>
                                            }

                                        </Stack>
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
                                                    <FieldBox textColor={theme.palette.grey[900]} label="Current Stock" value={inventoryRestockDetailsData?.current_stock && inventoryRestockDetailsData?.current_stock !== null ? inventoryRestockDetailsData?.current_stock : ''} />
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
                                                        name='added_quantity'
                                                        control={control}
                                                        rules={{
                                                            required: 'Added Quantity is required',
                                                            validate: (value) => {
                                                                if (Number(value) < 0 || Number(value) == 0) {
                                                                    return 'Added Quantity should be greater than 0'
                                                                }
                                                            },
                                                            maxLength: {
                                                                value: 255,
                                                                message: 'Maximum length is 255 characters'
                                                            },
                                                        }}
                                                        render={({ field }) => (
                                                            <CustomTextField
                                                                fullWidth
                                                                placeholder={'Added Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Added Quantity' required={true} />}
                                                                onChange={(e) => {
                                                                    const numberOnly = e.target.value.replace(/[^0-9]/g, '')
                                                                    field.onChange(numberOnly)
                                                                }}
                                                                inputProps={{ maxLength: 255 }}
                                                                error={Boolean(errors.added_quantity)}
                                                                {...(errors.added_quantity && { helperText: errors.added_quantity.message })}
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
                                                                disabled
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
                                                                            value={option?.id}
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
                                                                            {option?.title}
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
                                                                disabled
                                                                placeholder={'Minimum Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Minimum Quantity' required={true} />}
                                                                onChange={(e) => {
                                                                    const numberOnly = e.target.value.replace(/[^0-9]/g, '')
                                                                    field.onChange(numberOnly)
                                                                }}
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
                                                                disabled
                                                                placeholder={'Critical Quantity'}
                                                                value={field?.value}
                                                                label={<FormLabel label='Critical Quantity' required={true} />}
                                                                onChange={(e) => {
                                                                    const numberOnly = e.target.value.replace(/[^0-9]/g, '')
                                                                    field.onChange(numberOnly)
                                                                }}
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
                                                        name='invoice_number'
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
                                                                error={Boolean(errors.invoice_number)}
                                                                {...(errors.invoice_number && { helperText: errors.invoice_number.message })}
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
                                                                selected={field?.value ? moment(field.value, 'DD MMM YYYY').toDate() : null}
                                                                showYearDropdown
                                                                onChange={date => {
                                                                    const formattedDate = moment(date).format('DD MMM YYYY')
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
                                        <SectionHeader title="Stock Summary" show_progress={0} sx={{ marginTop: 2 }} />
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
                                                <Stack sx={{ padding: '12px', borderRadius: '8px', border: getCurrentStockValue('Restock', watchAddedQuantity, inventoryRestockDetailsData?.current_stock) < inventoryRestockDetailsData?.minimum_quantity ? `1px solid ${theme.palette.error[500]}` : `1px solid ${theme.palette.success[500]}`, background: getCurrentStockValue('Restock', watchAddedQuantity, inventoryRestockDetailsData?.current_stock) < inventoryRestockDetailsData?.minimum_quantity ? theme.palette.error[50] : theme.palette.success[50] }}>
                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Current Stock</TypographyComponent>
                                                    <TypographyComponent fontSize={24} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{getCurrentStockValue('Restock', watchAddedQuantity, inventoryRestockDetailsData?.current_stock)} {inventoryRestockDetailsData?.unit}</TypographyComponent>
                                                </Stack>
                                                <Stack sx={{ padding: '12px', borderRadius: '8px', border: `1px solid ${theme.palette.grey[500]}` }}>
                                                    <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Minimum Stock</TypographyComponent>
                                                    <TypographyComponent fontSize={24} fontWeight={500} sx={{ color: theme.palette.grey[900] }}>{inventoryRestockDetailsData?.minimum_quantity} {inventoryRestockDetailsData?.unit}</TypographyComponent>
                                                </Stack>
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
        </Drawer >
    )
}
