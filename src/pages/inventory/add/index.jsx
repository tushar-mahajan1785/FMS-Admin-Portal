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
import { actionAssetCustodianList, resetAssetCustodianListResponse } from "../../../store/asset";
import { useBranch } from "../../../hooks/useBranch";
import { compressFile, getFormData } from "../../../utils";
// import EditVendor from "../../vendors/edit";
import { actionMasterCountryCodeList } from "../../../store/vendor";
import BoxPlusIcon from "../../../assets/icons/BoxPlusIcon";
import MailIcon from "../../../assets/icons/MailIcon";
import CountryCodeSelect from "../../../components/country-code-component";
import { actionAddInventory, resetAddInventoryResponse, resetInventoryCategoryListResponse } from "../../../store/inventory";

export default function AddInventory({ open, handleClose, type }) {
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
    const { assetCustodianList } = useSelector(state => state.AssetStore)
    const { addInventory, inventoryCategoryList } = useSelector(state => state.inventoryStore)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            item_name: '',
            category: '',
            description: '',
            initial_quantity: '',
            minimum_quantity: '',
            critical_quantity: '',
            unit: '',
            storage_location: '',
            asset_name: '',
            contact_country_code: "+91",
            contact: '',
            email: '',
            supplier: '',

        }
    });

    //Watchers
    const watchItemName = watch('item_name')
    const watchCategory = watch('category')
    const watchInitialQuantity = watch('initial_quantity')
    const watchMinimumQuantity = watch('minimum_quantity')
    const watchCriticalQuantity = watch('critical_quantity')
    const watchUnit = watch('unit')

    //States
    const [loading, setLoading] = useState(false)
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    // const [assetDetailData, setAssetDetailData] = useState(null)
    const [vendorEscalationDetailsData, setVendorEscalationDetailsData] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState(null)
    // const [openViewEditVendorPopup, setOpenViewEditVendorPopup] = useState(false)
    // const [vendorDetailData, setVendorDetailData] = useState(null)

    const [masterCategoryOptions, setMasterCategoryOptions] = useState([])
    const [masterUnitOptions, setMasterUnitOptions] = useState([])

    console.log('-------inventoryCategoryList----', masterCategoryOptions)

    //Initial Render
    useEffect(() => {
        if (open === true) {
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
            dispatch(actionMasterCountryCodeList())
            dispatch(actionAssetCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }

        return () => {
            reset()
            setMasterCategoryOptions([])
            setMasterUnitOptions([])
            setSupervisorMasterOptions([])
            // setAssetDetailData(null)
            setVendorEscalationDetailsData([])
            setArrUploadedFiles([])
        }

    }, [open])

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
        // let filesToAdd = [];
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
            // filesToAdd.push({ file, is_new: 1, name: file?.name });
            setArrUploadedFiles({ file, is_new: 1, name: file?.name })
        }
        // if (filesToAdd.length > 0) {
        // setArrUploadedFiles((prev) => [...prev, ...filesToAdd]);
        // }
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
      * @dependency : assetCustodianList
      * @type : HANDLE API RESULT
      * @description : Handle the result of asset Custodian List API
      */
    useEffect(() => {
        if (assetCustodianList && assetCustodianList !== null) {
            dispatch(resetAssetCustodianListResponse())
            if (assetCustodianList?.result === true) {
                setSupervisorMasterOptions(assetCustodianList?.response)
            } else {
                setSupervisorMasterOptions([])
                switch (assetCustodianList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetCustodianListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: assetCustodianList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetCustodianList])

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
        let selectedVendors = vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
            vendorEscalationDetailsData?.filter(obj => obj?.is_selected === 1)
            : [];
        if (selectedVendors && selectedVendors !== null && selectedVendors?.length > 0) {
            let objData = {
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type: data.type,
                asset_uuid: data.asset_name,
                title: data.title && data.title !== null ? data.title : null,
                supervisor_id: data.supervisor && data.supervisor !== null ? data.supervisor : null,
                priority: data.priority && data.priority !== null ? data.priority : null,
                description: data.description && data.description !== null ? data.description : null,
                assigned_vendors: selectedVendors
            }
            const files = [];

            if (arrUploadedFiles && arrUploadedFiles !== null) {
                // for (const objFile of arrUploadedFiles) {
                if (arrUploadedFiles?.is_new === 1) {

                    //Compress the files with type image
                    const compressedFile = await compressFile(arrUploadedFiles.file);

                    files.push({
                        title: `file_upload`,
                        data: compressedFile
                    });
                }
                // }
            }
            setLoading(true)
            const formData = getFormData(objData, files);
            dispatch(actionAddInventory(formData))
        } else {
            showSnackbar({ message: 'Atleast one vendor selection is required', severity: "error" })
        }

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
                    title="Add New Inventory Item"
                    subtitle="Enter details for the new inventory item"
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
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
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
                                            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
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
                                                        required: 'Maximum Quantity is required',
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Maximum length is 255 characters'
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            fullWidth
                                                            placeholder={'Maximum Quantity'}
                                                            value={field?.value}
                                                            label={<FormLabel label='Maximum Quantity' required={true} />}
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
                                                        required: 'Please select Supplier Name'
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            select
                                                            fullWidth
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Supplier Name' required={true} />}
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
                                                            error={Boolean(errors.supplier_name)}
                                                            {...(errors.supplier_name && { helperText: errors.supplier_name.message })}
                                                        >
                                                            <MenuItem value=''>
                                                                <em>Select Supplier Name</em>
                                                            </MenuItem>
                                                            {supervisorMasterOptions && supervisorMasterOptions !== null && supervisorMasterOptions.length > 0 &&
                                                                supervisorMasterOptions.map(option => (
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
                                                                            textOverflow: 'ellipsis',
                                                                        }}
                                                                    >
                                                                        {option?.name}
                                                                    </MenuItem>
                                                                ))}
                                                        </CustomTextField>
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
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 4, xl: 4 }}>
                                <Stack>
                                    <SectionHeader title="Upload Files" show_progress={0} sx={{ marginTop: 2 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px', pb: 0 }}>
                                        <Stack onClick={handleTriggerInput} onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            sx={{ borderRadius: '8px', background: theme.palette.primary[100], p: 4 }}
                                        >
                                            <Stack sx={{ alignItems: 'center', height: '100%', mb: 1 }}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        height: 200,
                                                        width: 200,
                                                        borderRadius: 0,
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    <img
                                                        src="/assets/box.png"
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                </Box>
                                            </Stack>
                                            <Stack sx={{ cursor: 'pointer', py: '8px', flexDirection: 'row', justifyContent: 'center', background: theme.palette.common.white, width: 'auto', m: 2 }}>
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

                                        </Stack>
                                        <Stack spacing={1.5} sx={{ width: '100%', my: 2 }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Item Name -</TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchItemName && watchItemName !== null ? watchItemName : 'NA'}</TypographyComponent>
                                            </Stack>
                                            <Divider />
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>Category -</TypographyComponent>
                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{watchCategory && watchCategory !== null ? watchCategory : 'NA'}</TypographyComponent>
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
                    </form>
                </Stack>
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
                    // disabled={(vendorEscalationDetailsData.length === 0 ? true : (loading ? true : false))}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Add Item'}
                    </Button>
                </Stack>
            </Stack>
            {/* {
                openViewEditVendorPopup &&
                <EditVendor
                    open={openViewEditVendorPopup}
                    objData={vendorDetailData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            dispatch(actionGetAssetDetailsByName({
                                uuid: watchAssetName
                            }))
                        }
                        setOpenViewEditVendorPopup(false)
                    }}
                />
            } */}
        </Drawer>
    );
}
