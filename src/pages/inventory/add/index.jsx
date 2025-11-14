/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import {
    Drawer,
    Button,
    Stack,
    Divider,
    CircularProgress,
    IconButton,
    Grid,
    useTheme,
    MenuItem, Box, InputAdornment
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    isEmail,
    isMobile,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "../../../components/form-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import CloseIcon from "../../../assets/icons/CloseIcon";
import TypographyComponent from "../../../components/custom-typography";
import SectionHeader from "../../../components/section-header";
import ChevronDownIcon from "../../../assets/icons/ChevronDown";
import { useBranch } from "../../../hooks/useBranch";
import { compressFile, decrypt, getFormData, getObjectById } from "../../../utils";
import { actionMasterCountryCodeList, actionVendorMasterList, resetVendorMasterListResponse } from "../../../store/vendor";
import BoxPlusIcon from "../../../assets/icons/BoxPlusIcon";
import MailIcon from "../../../assets/icons/MailIcon";
import CountryCodeSelect from "../../../components/country-code-component";
import { actionAddInventory, actionGetUnitMaster, actionInventoryCategoryList, resetAddInventoryResponse, resetGetUnitMasterResponse, resetInventoryCategoryListResponse } from "../../../store/inventory";
import CustomAutocomplete from "../../../components/custom-autocomplete";
import { _ } from "lodash";

export default function AddInventory({ open, handleClose, type, details }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const inputRef = useRef();

    //Extensions and File Size
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'];
    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    // Trigger file dialog
    const handleTriggerInput = () => {
        inputRef.current.click();
    };

    //Stores
    const { vendorMasterList } = useSelector(state => state.vendorStore)
    const { addInventory, inventoryCategoryList, getUnitMaster } = useSelector(state => state.inventoryStore)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
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

    //Watchers
    const watchItemName = watch('item_name')
    const watchCategory = watch('category')
    const watchInitialQuantity = watch('initial_quantity')
    const watchMinimumQuantity = watch('minimum_quantity')
    const watchCriticalQuantity = watch('critical_quantity')
    const watchUnit = watch('unit')
    const watchSupplier = watch('supplier_name')

    //States
    const [loading, setLoading] = useState(false)
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    // const [inventoryDetailsData, setInventoryDetailsData] = useState(null)
    const [arrUploadedFile, setArrUploadedFile] = useState(null)

    const [masterCategoryOptions, setMasterCategoryOptions] = useState([])
    const [masterUnitOptions, setMasterUnitOptions] = useState([])

    // console.log('-------inventoryCategoryList----', masterCategoryOptions)
    // console.log('-------arrUploadedFile----', arrUploadedFile)

    /**
     * Initiale Render and masters api call
     */
    useEffect(() => {
        if (open === true) {
            if (type === 'edit' && details !== null) {
                let editFileUrl = "https://fms-super-admin.interdev.in/fms/ticket/8/8_1763011390575.jpg"
                const fileName = editFileUrl.split("/").pop();
                setArrUploadedFile({
                    file: null,
                    is_new: 0,
                    name: fileName,
                    image_url: editFileUrl,
                });
                setValue('item_id', details?.item_id && details?.item_id !== null ? details?.item_id : '')
                setValue('item_name', details?.item_name && details?.item_name !== null ? details?.item_name : '')
                setValue('category', details?.category && details?.category !== null ? details?.category : '')
                setValue('description', details?.description && details?.description !== null ? details?.description : '')
                setValue('initial_quantity', details?.initial_quantity && details?.initial_quantity !== null ? details?.initial_quantity : '')
                setValue('minimum_quantity', details?.minimum_quantity && details?.minimum_quantity !== null ? details?.minimum_quantity : '')
                setValue('critical_quantity', details?.critical_quantity && details?.critical_quantity !== null ? details?.critical_quantity : '')
                setValue('storage_location', details?.storage_location && details?.storage_location !== null ? details?.storage_location : '')
                setValue('unit', details?.unit && details?.unit !== null ? details?.unit : '')
                setValue('supplier_name', details?.supplier_name && details?.supplier_name !== null ? details?.supplier_name : '')
                setValue('contact', details?.contact && details?.contact !== null ? details?.contact : '')
                setValue('email', details?.email && details?.email !== null ? details?.email : '')

            }


            //for testing purpose only
            setMasterCategoryOptions([
                {
                    "id": 1,
                    "name": "Chemicals",
                    "description": "Chemicals details",
                    "status": "Active"
                },
                {
                    "id": 2,
                    "name": "Electrical ",
                    "description": "Electrical items",
                    "status": "Active"
                }])
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
            //---------------------


            dispatch(actionInventoryCategoryList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
            dispatch(actionGetUnitMaster())
            dispatch(actionMasterCountryCodeList())
            dispatch(actionVendorMasterList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }

        return () => {
            reset()
            setMasterCategoryOptions([])
            setMasterUnitOptions([])
            setSupervisorMasterOptions([])
            setArrUploadedFile(null)
        }

    }, [open])

    console.log('----watchSupplier---', watchSupplier)

    /**
     * On selection of Supplier set contact and email fields for supplier_name
     */
    useEffect(() => {
        if (watchSupplier && watchSupplier !== null && watchSupplier !== '' && watchSupplier !== undefined) {
            let currentSupplier = getObjectById(supervisorMasterOptions, watchSupplier)
            if (currentSupplier && currentSupplier !== null) {
                setValue('email', decrypt(currentSupplier?.primary_contact_email) || '')
                setValue('contact', decrypt(currentSupplier?.primary_contact_no) || '')
                setValue('contact_country_code', currentSupplier?.primary_contact_country_code || '')
            }
        }
    }, [watchSupplier])

    /**
     * Check if the selected files extension is valid or not
     * @param {*} fileName 
     * @returns 
     */
    const isValidExtension = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        return ALLOWED_EXTENSIONS.includes(ext);
    };

    /**
     * Set selected file to state after validation
     * @param {*} event 
     * @returns 
     */
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length === 0) return;

        const file = selectedFiles[0]; // take only the first file

        if (!isValidExtension(file.name)) {
            showSnackbar({ message: `File "${file.name}" has an invalid file type.`, severity: "error" });
            event.target.value = null;
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showSnackbar({ message: `File "${file.name}" exceeds the 50MB size limit.`, severity: "error" });
            event.target.value = null;
            return;
        }

        // Replace the old file with the new one
        setArrUploadedFile({ file, is_new: 1, name: file.name });

        event.target.value = null;
    };

    //handle drag drop function
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (!isValidExtension(file.name)) {
                showSnackbar({ message: `File "${file.name}" has an invalid file type.`, severity: "error" });
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                showSnackbar({ message: `File "${file.name}" exceeds the 50MB size limit.`, severity: "error" });
                return;
            }
            setArrUploadedFile({ file, is_new: 1, name: file.name });
        }
    };

    //handle drag over
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    /**
       * useEffect
       * @dependency : inventoryCategoryList
       * @type : HANDLE API RESULT
       * @description : Handle the result of inventory category List API
       */
    useEffect(() => {
        if (inventoryCategoryList && inventoryCategoryList !== null) {
            dispatch(resetInventoryCategoryListResponse())
            if (inventoryCategoryList?.result === true) {
                setMasterCategoryOptions(inventoryCategoryList?.response)
            } else {
                // setMasterCategoryOptions([])
                switch (inventoryCategoryList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetInventoryCategoryListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: inventoryCategoryList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [inventoryCategoryList])

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

    /**
     * useEffect
     * @dependency : addInventory
     * @type : HANDLE API RESULT
     * @description : Handle the result of add inventory API
     */
    useEffect(() => {
        if (addInventory && addInventory !== null) {
            dispatch(resetAddInventoryResponse())
            if (addInventory?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: addInventory?.message, severity: "success" })
            } else {
                setLoading(false)
                switch (addInventory?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddInventoryResponse())
                        showSnackbar({ message: addInventory?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: addInventory?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addInventory])

    /**
     * handle Submit function
     * @param {*} data 
     */
    const onSubmit = async data => {
        console.log('----submit data----', data)
        let currentSupplier = getObjectById(supervisorMasterOptions, watchSupplier)
        let objData = {
            branch_uuid: branch?.currentBranch?.uuid,
            item_name: data?.item_name && data?.item_name !== null ? data?.item_name : null,
            category: data?.category && data?.category !== null ? data?.category : null,
            description: data?.description && data?.description !== null ? data?.description : null,
            initial_quantity: data?.initial_quantity && data?.initial_quantity !== null ? data?.initial_quantity : null,
            minimum_quantity: data?.minimum_quantity && data?.minimum_quantity !== null ? data?.minimum_quantity : null,
            critical_quantity: data?.critical_quantity && data?.critical_quantity !== null ? data?.critical_quantity : null,
            unit: data?.unit && data?.unit !== null ? data?.unit : null,
            storage_location: data?.storage_location && data?.storage_location !== null ? data?.storage_location : null,
            supplier_name: currentSupplier ? currentSupplier?.name : null,
            supplier_contact: data?.contact && data?.contact !== null ? data?.contact : null,
            supplier_country_code: data?.contact_country_code && data?.contact_country_code !== null ? data?.contact_country_code : null,
            supplier_email: data?.email && data?.email !== null ? data?.email : null
        }

        if (type == 'edit') {
            objData.uuid = details?.uuid
        }
        const files = [];
        if (arrUploadedFile && arrUploadedFile !== null) {
            if (arrUploadedFile?.is_new === 1) {

                //Compress the files with type image
                const compressedFile = await compressFile(arrUploadedFile.file);

                files.push({
                    title: `file_upload`,
                    data: compressedFile
                });
            }
        }
        setLoading(true)
        const formData = getFormData(objData, files);
        dispatch(actionAddInventory(formData))
    };

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
                    title={`${type == 'add' ? 'Add New Inventory Item' : 'Edit Inventory Item'}`}
                    subtitle={`${type == 'add' ? 'Enter details for the new inventory item' : 'Edit details for this inventory item'}`}
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
                        <Grid container spacing={'24px'}>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 8, xl: 8 }}>
                                <Stack>
                                    <SectionHeader title="Basic Information" show_progress={0} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 3, marginTop: '-4px' }}>
                                        <Grid container spacing={'24px'}>
                                            {
                                                type === 'edit' ?
                                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                                        <Controller
                                                            name='item_id'
                                                            control={control}
                                                            render={({ field }) => (
                                                                <CustomTextField
                                                                    fullWidth
                                                                    disabled
                                                                    placeholder={'Item ID'}
                                                                    value={field?.value}
                                                                    label={<FormLabel label='Item ID' required={true} />}
                                                                    onChange={field.onChange}
                                                                    inputProps={{ maxLength: 255 }}
                                                                    error={Boolean(errors.item_id)}
                                                                    {...(errors.item_id && { helperText: errors.item_id.message })}
                                                                />
                                                            )}
                                                        />
                                                    </Grid>
                                                    :
                                                    <></>
                                            }

                                            <Grid size={{ xs: 12, sm: 6, md: type == 'edit' ? 4 : 6, lg: type == 'edit' ? 4 : 6, xl: type == 'edit' ? 4 : 6 }}>
                                                <Controller
                                                    name='item_name'
                                                    control={control}
                                                    rules={{
                                                        required: 'Item Name is required',
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Maximum length is 255 characters'
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            fullWidth
                                                            placeholder={'Item Name'}
                                                            value={field?.value}
                                                            label={<FormLabel label='Item Name' required={true} />}
                                                            onChange={field.onChange}
                                                            inputProps={{ maxLength: 255 }}
                                                            error={Boolean(errors.item_name)}
                                                            {...(errors.item_name && { helperText: errors.item_name.message })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6, md: type == 'edit' ? 4 : 6, lg: type == 'edit' ? 4 : 6, xl: type == 'edit' ? 4 : 6 }}>
                                                <Controller
                                                    name='category'
                                                    control={control}
                                                    rules={{
                                                        required: 'Please select Category'
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            select
                                                            fullWidth
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Category' required={true} />}
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
                                                            error={Boolean(errors.category)}
                                                            {...(errors.category && { helperText: errors.category.message })}
                                                        >
                                                            <MenuItem value=''>
                                                                <em>Select Category</em>
                                                            </MenuItem>
                                                            {masterCategoryOptions && masterCategoryOptions !== null && masterCategoryOptions.length > 0 &&
                                                                masterCategoryOptions.map(option => (
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
                                            {/* description */}
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <Controller
                                                    name='description'
                                                    control={control}
                                                    rules={{
                                                        required: 'Description is required',
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
                                                            placeholder={'Detailed description of the item and relevant information'}
                                                            value={field?.value}
                                                            label={<FormLabel label='Description' required={true} />}
                                                            onChange={field.onChange}
                                                            error={Boolean(errors.description)}
                                                            {...(errors.description && { helperText: errors.description.message })}
                                                        />
                                                    )}
                                                />
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
                                                            disabled={type === 'edit' ? true : false}
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
                                            {/* storage location */}
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                                <Controller
                                                    name='storage_location'
                                                    control={control}
                                                    rules={{
                                                        required: 'Storage Location is required',
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
                                                            label={<FormLabel label='Storage Location' required={true} />}
                                                            onChange={field.onChange}
                                                            error={Boolean(errors.storage_location)}
                                                            {...(errors.storage_location && { helperText: errors.storage_location.message })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    <SectionHeader title="Supplier Information" show_progress={0} sx={{ marginTop: 2.5 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 3, marginTop: '-4px' }}>
                                        <Grid container spacing={'24px'}>
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
                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name="contact"
                                                    control={control}
                                                    rules={{
                                                        required: 'Contact is required',
                                                        validate: {
                                                            isMobile: value => !value || isMobile(value) || 'Invalid mobile number'
                                                        }
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            fullWidth
                                                            disabled
                                                            value={field.value ?? ''}
                                                            label={<FormLabel label="Phone" required={true} />}
                                                            onChange={field.onChange}
                                                            inputProps={{ maxLength: 10 }}
                                                            sx={{
                                                                '& .MuiInputBase-root': { paddingLeft: '0 !important' }
                                                            }}
                                                            InputProps={{
                                                                startAdornment: (
                                                                    <InputAdornment
                                                                        position="start"
                                                                        sx={{ p: 0, display: 'flex', m: 0, boxShadow: 'none' }}
                                                                    >
                                                                        <CountryCodeSelect
                                                                            disabled={true}
                                                                            name={'contact_country_code'}
                                                                            control={control}
                                                                        />
                                                                    </InputAdornment>
                                                                )
                                                            }}
                                                            error={Boolean(errors.contact)}
                                                            {...(errors.contact && { helperText: errors.contact.message })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            {/* employee email */}
                                            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name='email'
                                                    control={control}
                                                    rules={{
                                                        // required: 'Email is required',
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
                                                            disabled
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Email' required={false} />}
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
                                                            error={Boolean(errors.email)}
                                                            {...(errors.email && { helperText: errors.email.message })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                </Stack>
                            </Grid >
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }}>
                                <Stack>
                                    <SectionHeader title="Upload Files" show_progress={0} sx={{ marginTop: 2 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px', pb: 0 }}>
                                        <Stack
                                            onClick={handleTriggerInput}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            sx={{
                                                borderRadius: "8px",
                                                p: arrUploadedFile ? 4 : 4,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: arrUploadedFile ? 'flex-start' : 'center',
                                                // backgroundImage: arrUploadedFile?.file && arrUploadedFile?.file.type.startsWith("image/")
                                                //     ? `url(${URL.createObjectURL(arrUploadedFile.file)})`
                                                //     : undefined,
                                                backgroundImage: arrUploadedFile?.file && arrUploadedFile?.file.type.startsWith("image/")
                                                    ? `url(${URL.createObjectURL(arrUploadedFile.file)})`
                                                    : arrUploadedFile?.image_url
                                                        ? `url(${arrUploadedFile.image_url})`
                                                        : undefined,
                                                backgroundColor: arrUploadedFile ? "transparent" : theme.palette.primary[50],
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                cursor: "pointer",
                                                transition: "0.3s ease-in-out",
                                                minHeight: arrUploadedFile ? '354px' : 'auto'
                                            }}
                                        >
                                            {/* This content is only visible when NO file is uploaded (centered by default) */}
                                            {!arrUploadedFile && (
                                                <Stack sx={{ alignItems: "center", height: "100%", mb: 1 }}>
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                            height: 200,
                                                            width: 200,
                                                            overflow: "hidden",
                                                        }}
                                                    >
                                                        <img
                                                            src="/assets/box.png"
                                                            alt=""
                                                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                                        />
                                                    </Box>
                                                </Stack>
                                            )}

                                            {/* *** CRITICAL FIX: Spacer element only when file is uploaded *** */}
                                            {/* This Box uses flexGrow: 1 to consume all empty space, pushing the next element down. */}
                                            {arrUploadedFile && (
                                                <Box sx={{ flexGrow: 1 }} />
                                            )}

                                            {/* This is the drag & drop/browse text that you want at the bottom */}
                                            <Stack
                                                sx={{
                                                    py: "8px",
                                                    px: '10px',
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    background: theme.palette.common.white,
                                                    width: "auto",
                                                    m: 2,
                                                    borderRadius: "4px",
                                                }}
                                            >
                                                <input
                                                    hidden
                                                    accept=".jpg,.jpeg,.png,.xlsx,.csv,.pdf,.docx"
                                                    type="file"
                                                    ref={inputRef}
                                                    onChange={handleFileChange}
                                                />
                                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ mr: 1 }}>
                                                    Drag & Drop file(s) to upload or
                                                </TypographyComponent>
                                                <TypographyComponent
                                                    fontSize={14}
                                                    fontWeight={500}
                                                    sx={{ color: theme.palette.primary[700], textDecoration: "underline" }}
                                                >
                                                    Browse
                                                </TypographyComponent>
                                            </Stack>
                                        </Stack>
                                        <Stack spacing={1.5} sx={{ width: '100%', my: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Item Name -</TypographyComponent>
                                                <TypographyComponent title={watchItemName} fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchItemName && watchItemName !== null ? _.truncate(watchItemName, { length: 30 }) : 'NA'}</TypographyComponent>
                                            </Stack>
                                            <Divider />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Category -</TypographyComponent>
                                                <TypographyComponent title={watchCategory} fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchCategory && watchCategory !== null ? _.truncate(watchCategory, { length: 30 }) : 'NA'}</TypographyComponent>
                                            </Stack>
                                            <Divider />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Quantity -</TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchInitialQuantity && watchInitialQuantity !== null ? watchInitialQuantity : 'NA'}</TypographyComponent>
                                            </Stack>
                                            <Divider />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Unity -</TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchUnit && watchUnit !== null ? watchUnit : 'NA'}</TypographyComponent>
                                            </Stack>
                                            <Divider />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Minimum Quantity -</TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchMinimumQuantity && watchMinimumQuantity !== null ? watchMinimumQuantity : 'NA'}</TypographyComponent>
                                            </Stack>
                                            <Divider />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Critical Quantity -</TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchCriticalQuantity && watchCriticalQuantity !== null ? watchCriticalQuantity : 'NA'}</TypographyComponent>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form >
                </Stack >
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ px: 2, pb: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
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
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: (loading ? theme.palette.grey[400] : theme.palette.primary[600]), color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        name='submit'
                        variant='contained'
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : (type == 'add' ? 'Add Item' : 'Save Changes')}
                    </Button>
                </Stack>
            </Stack >
        </Drawer >
    );
}
