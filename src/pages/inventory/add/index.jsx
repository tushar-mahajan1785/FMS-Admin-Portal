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
    MenuItem, Box, List,
    ListItem, ListItemText,
    Avatar,
    InputAdornment
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    getPriorityArray,
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
import TicketIcon from "../../../assets/icons/TicketIcon";
import TypographyComponent from "../../../components/custom-typography";
import SectionHeader from "../../../components/section-header";
import ChevronDownIcon from "../../../assets/icons/ChevronDown";
import FieldBox from "../../../components/field-box";
import { AntSwitch } from "../../../components/common";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import FileIcon from "../../../assets/icons/FileIcon";
import { actionAssetCustodianList, actionGetAssetDetailsByName, actionGetMasterAssetName, actionMasterAssetType, resetAssetCustodianListResponse, resetGetAssetDetailsByNameResponse, resetGetMasterAssetNameResponse, resetMasterAssetTypeResponse } from "../../../store/asset";
import { useBranch } from "../../../hooks/useBranch";
import { actionAddTicket, resetAddTicketResponse } from "../../../store/tickets";
import { compressFile, getFormData, getObjectByUuid } from "../../../utils";
import moment from "moment";
// import EditVendor from "../../vendors/edit";
import { actionMasterCountryCodeList, actionVendorDetails, resetVendorDetailsResponse } from "../../../store/vendor";
import _ from "lodash";
import BoxPlusIcon from "../../../assets/icons/BoxPlusIcon";
import MailIcon from "../../../assets/icons/MailIcon";
import CountryCodeSelect from "../../../components/country-code-component";

export default function AddInventory({ open, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
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
    const { masterAssetType, getMasterAssetName, getAssetDetailsByName, assetCustodianList } = useSelector(state => state.AssetStore)
    const { addTicket } = useSelector(state => state.ticketsStore)
    const { vendorDetails } = useSelector(state => state.vendorStore)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            item_name: '',
            category: '',
            description: '',
            initial_quantity: '',
            maximum_quantity: '',
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
    const watchAssetType = watch('type')
    const watchAssetName = watch('asset_name')

    //States
    const [loading, setLoading] = useState(false)
    const [masterAssetTypeOptions, setMasterAssetTypeOptions] = useState([])
    const [masterAssetNameOptions, setMasterAssetNameOptions] = useState([])
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    const [assetDetailData, setAssetDetailData] = useState(null)
    const [vendorEscalationDetailsData, setVendorEscalationDetailsData] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState([])
    const [openViewEditVendorPopup, setOpenViewEditVendorPopup] = useState(false)
    const [vendorDetailData, setVendorDetailData] = useState(null)

    //Initial Render
    useEffect(() => {
        if (open === true) {
            // dispatch(actionMasterCountryCodeList())

            dispatch(actionAssetCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }

        return () => {
            reset()
            setMasterAssetTypeOptions([])
            setMasterAssetNameOptions([])
            setSupervisorMasterOptions([])
            setAssetDetailData(null)
            setVendorEscalationDetailsData([])
            setArrUploadedFiles([])
        }

    }, [open])

    /**
     * actionGetMasterAssetName on selection of Asset Type
     */
    useEffect(() => {
        if (watchAssetType && watchAssetType !== null) {
            dispatch(actionGetMasterAssetName({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type: watchAssetType
            }))
        } else {
            setValue('asset_name', '')
            setMasterAssetNameOptions([])
            setVendorEscalationDetailsData([])
            setAssetDetailData(null)
        }
    }, [watchAssetType])


    /**
     * actionGetAssetDetailsByName on selection of Asset Name
     */
    useEffect(() => {
        if (watchAssetName && watchAssetName !== null) {
            dispatch(actionGetAssetDetailsByName({
                uuid: watchAssetName
            }))
        } else {
            setMasterAssetNameOptions([])
            setAssetDetailData(null)
            setVendorEscalationDetailsData([])
        }
    }, [watchAssetName])

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
       * @dependency : masterAssetType
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset Type List API
       */
    useEffect(() => {
        if (masterAssetType && masterAssetType !== null) {
            dispatch(resetMasterAssetTypeResponse())
            if (masterAssetType?.result === true) {
                setMasterAssetTypeOptions(masterAssetType?.response)
            } else {
                setMasterAssetTypeOptions([])
                switch (masterAssetType?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetMasterAssetTypeResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: masterAssetType?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [masterAssetType])

    /**
       * useEffect
       * @dependency : getMasterAssetName
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset Name API
       */
    useEffect(() => {
        if (getMasterAssetName && getMasterAssetName !== null) {
            dispatch(resetGetMasterAssetNameResponse())
            if (getMasterAssetName?.result === true) {
                setMasterAssetNameOptions(getMasterAssetName?.response)
            } else {
                setMasterAssetNameOptions([])
                switch (getMasterAssetName?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetMasterAssetNameResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getMasterAssetName?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getMasterAssetName])

    /**
       * useEffect
       * @dependency : getAssetDetailsByName
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset Name API
       */
    useEffect(() => {
        if (getAssetDetailsByName && getAssetDetailsByName !== null) {
            dispatch(resetGetAssetDetailsByNameResponse())
            if (getAssetDetailsByName?.result === true) {
                setAssetDetailData(getAssetDetailsByName?.response)
                setValue('location', getAssetDetailsByName?.response?.location)
                setValue('supervisor', getAssetDetailsByName?.response?.asset_custodian_id)
                if (getAssetDetailsByName?.response?.vendor_escalation && getAssetDetailsByName?.response?.vendor_escalation !== null && getAssetDetailsByName?.response?.vendor_escalation.length > 0) {
                    setVendorEscalationDetailsData(getAssetDetailsByName?.response?.vendor_escalation)
                } else {
                    setVendorEscalationDetailsData([])
                }
                if (Object.hasOwn(getAssetDetailsByName?.response, 'vendor_escalation') === false || getAssetDetailsByName?.response?.vendor_escalation.length === 0) {
                    dispatch(actionVendorDetails({ uuid: getAssetDetailsByName?.response?.vendor_uuid }))
                }
            } else {
                setAssetDetailData(null)
                setVendorEscalationDetailsData([])
                switch (getAssetDetailsByName?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetAssetDetailsByNameResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: getAssetDetailsByName?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [getAssetDetailsByName])

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
     * @dependency : vendorDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of vendor Details API
     */
    useEffect(() => {
        if (vendorDetails && vendorDetails !== null) {
            dispatch(resetVendorDetailsResponse())
            if (vendorDetails?.result === true) {

                setVendorDetailData(vendorDetails?.response)
            } else {
                setVendorDetailData(null)
                switch (vendorDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: vendorDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorDetails])

    /**
     * useEffect
     * @dependency : addTicket
     * @type : HANDLE API RESULT
     * @description : Handle the result of add ticket API
     */
    useEffect(() => {
        if (addTicket && addTicket !== null) {
            dispatch(resetAddTicketResponse())
            if (addTicket?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: addTicket?.message, severity: "success" })

                window.localStorage.setItem('ticket_update', true)
            } else {
                setLoading(false)
                switch (addTicket?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddTicketResponse())
                        showSnackbar({ message: addTicket?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: addTicket?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addTicket])

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
            let hasNewFiles = arrUploadedFiles.filter(obj => obj?.is_new === 1)
            if (hasNewFiles && hasNewFiles.length > 0 && arrUploadedFiles && arrUploadedFiles.length > 0) {
                for (const objFile of arrUploadedFiles) {
                    if (objFile?.is_new === 1) {

                        //Compress the files with type image
                        const compressedFile = await compressFile(objFile.file);

                        files.push({
                            title: `ticket_upload`,
                            data: compressedFile
                        });
                    }
                }
            }
            setLoading(true)
            const formData = getFormData(objData, files);
            dispatch(actionAddTicket(formData))
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
                                                            {masterAssetTypeOptions && masterAssetTypeOptions !== null && masterAssetTypeOptions.length > 0 &&
                                                                masterAssetTypeOptions.map(option => (
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
                                            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
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
                                            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name='unit'
                                                    control={control}
                                                    rules={{
                                                        required: 'Please select Unit'
                                                    }}
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
                                                            {masterAssetTypeOptions && masterAssetTypeOptions !== null && masterAssetTypeOptions.length > 0 &&
                                                                masterAssetTypeOptions.map(option => (
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
                                            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name='maximum_quantity'
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
                                                            error={Boolean(errors.maximum_quantity)}
                                                            {...(errors.maximum_quantity && { helperText: errors.maximum_quantity.message })}
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
                                                            value={field?.value ?? ''}
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
                                    <SectionHeader title="Stock Summary" show_progress={0} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px' }}>
                                        {
                                            vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                                <>
                                                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <TypographyComponent fontSize={16} fontWeight={500}>{assetDetailData?.vendor && assetDetailData?.vendor !== null ? assetDetailData?.vendor : ''}</TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400}>{assetDetailData?.vendor_id && assetDetailData?.vendor_id !== null ? assetDetailData?.vendor_id : ''}</TypographyComponent>
                                                    </Stack>
                                                    <Stack sx={{
                                                        marginTop: 2,
                                                        height: 320,
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
                                                        {
                                                            vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                                                vendorEscalationDetailsData.map((objDetail, index) => {
                                                                    return (<Stack
                                                                        disablePadding
                                                                        sx={{
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'space-between',
                                                                            alignItems: 'center',
                                                                            py: 1.5,
                                                                            px: 1,
                                                                            borderBottom: index + 1 < vendorEscalationDetailsData.length ? '1px solid #eee' : 'none',
                                                                        }}
                                                                    >
                                                                        <Box>
                                                                            <TypographyComponent fontSize={16} fontWeight={400} sx={{ color: theme.palette.grey[900] }}>{objDetail.name}</TypographyComponent>
                                                                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[600] }}>{objDetail.email}</TypographyComponent>
                                                                        </Box>
                                                                        <AntSwitch
                                                                            checked={objDetail.is_selected === 1 ? true : false}
                                                                            onChange={() => {
                                                                                let escalationsArray = Object.assign([], vendorEscalationDetailsData)
                                                                                let currentIndex = vendorEscalationDetailsData?.findIndex(obj => obj?.name === objDetail?.name)
                                                                                let currentObj = Object.assign({}, vendorEscalationDetailsData[currentIndex])
                                                                                currentObj.is_selected = objDetail.is_selected === 1 ? 0 : 1
                                                                                escalationsArray[currentIndex] = currentObj
                                                                                setVendorEscalationDetailsData(escalationsArray)
                                                                            }}
                                                                        />
                                                                    </Stack>)
                                                                })
                                                                :
                                                                <></>
                                                        }</Stack>
                                                </>
                                                :
                                                <>
                                                    {
                                                        assetDetailData && assetDetailData !== null && (Object.hasOwn(assetDetailData, 'vendor_escalation') === false || assetDetailData?.vendor_escalation.length === 0) ?
                                                            <>
                                                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                    <TypographyComponent fontSize={16} fontWeight={500}>{assetDetailData?.vendor && assetDetailData?.vendor !== null ? assetDetailData?.vendor : ''}</TypographyComponent>
                                                                    <TypographyComponent fontSize={14} fontWeight={400}>{assetDetailData?.vendor_id && assetDetailData?.vendor_id !== null ? assetDetailData?.vendor_id : ''}</TypographyComponent>
                                                                </Stack>
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                    <Stack sx={{ px: 1, py: 5, justifyContent: 'center', width: '100%' }}>

                                                        <Stack sx={{ alignItems: 'center' }}>
                                                            <Avatar alt={""} src={'/assets/person-details.png'} sx={{ justifyContent: 'center', overFlow: 'hidden', borderRadius: 0, height: 232, width: 253 }} />
                                                        </Stack>
                                                        {
                                                            assetDetailData === null ?
                                                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ mt: 3, textAlign: 'center' }}>Select Asset to get vendor details</TypographyComponent>
                                                                :
                                                                <></>
                                                        }

                                                        {
                                                            assetDetailData && assetDetailData !== null && (Object.hasOwn(assetDetailData, 'vendor_escalation') === false || assetDetailData?.vendor_escalation.length === 0) ?
                                                                <>
                                                                    {
                                                                        hasPermission('VENDOR_EDIT') ?
                                                                            <TypographyComponent
                                                                                fontSize={16}
                                                                                fontWeight={400}
                                                                                sx={{
                                                                                    mt: 3,
                                                                                    textAlign: 'center',
                                                                                    // color: theme.palette.grey[600],
                                                                                    wordWrap: 'break-word',
                                                                                    display: 'inline', // ensures inline text flow
                                                                                }}
                                                                            >
                                                                                The selected asset has no vendor details assigned. Click to{' '}
                                                                                <TypographyComponent
                                                                                    fontSize={16}
                                                                                    fontWeight={500}
                                                                                    sx={{
                                                                                        color: theme.palette.primary[600],
                                                                                        textDecoration: 'underline',
                                                                                        cursor: 'pointer',
                                                                                        display: 'inline', // keeps inline
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        setOpenViewEditVendorPopup(true)
                                                                                        dispatch(actionMasterCountryCodeList())
                                                                                    }}
                                                                                >
                                                                                    add
                                                                                </TypographyComponent>{' '}
                                                                                vendor details.
                                                                            </TypographyComponent>
                                                                            :
                                                                            <><TypographyComponent
                                                                                fontSize={16}
                                                                                fontWeight={400}
                                                                                sx={{
                                                                                    mt: 3,
                                                                                    textAlign: 'center',
                                                                                    // color: theme.palette.grey[600],
                                                                                    wordWrap: 'break-word',
                                                                                    display: 'inline', // ensures inline text flow
                                                                                }}
                                                                            >
                                                                                The selected asset has no vendor details assigned. Please contact your administrator to add the vendor details.
                                                                            </TypographyComponent></>
                                                                    }

                                                                </>

                                                                :
                                                                <></>
                                                        }

                                                    </Stack>
                                                </>
                                        }
                                    </Stack>
                                    <SectionHeader title="Upload Files" show_progress={0} sx={{ marginTop: 2 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px', pb: 0 }}>
                                        <Stack onClick={handleTriggerInput} onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            sx={{ cursor: 'pointer', border: `1px dashed ${theme.palette.primary[600]}`, borderRadius: '8px', background: theme.palette.primary[100], p: '16px', flexDirection: 'row', justifyContent: 'center' }}>
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
