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
    Avatar
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    getPriorityArray,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
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
import { compressFile, getFormData } from "../../../utils";

export default function AddTicket({ open, handleClose }) {
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
    const { masterAssetType, getMasterAssetName, getAssetDetailsByName, assetCustodianList } = useSelector(state => state.AssetStore)
    const { addTicket } = useSelector(state => state.ticketsStore)

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            type: '',
            asset_name: '',
            location: '',
            title: '',
            description: '',
            supervisor: '',
            priority: '',
            status: 'Active'
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

    console.log('-----arrUploadedFiles----', arrUploadedFiles)

    //Initial Render
    useEffect(() => {
        if (open === true) {
            dispatch(actionMasterAssetType({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
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
            setAssetDetailData([])
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
                client_uuid: branch?.currentBranch?.client_uuid,
                type: watchAssetType
            }))
        }
    }, [watchAssetType])

    /**
     * actionGetAssetDetailsByName on selection of Asset Name
     */
    useEffect(() => {
        if (watchAssetName && watchAssetName !== null) {
            dispatch(actionGetAssetDetailsByName({
                client_uuid: branch?.currentBranch?.client_uuid,
                asset_name: watchAssetName
            }))
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
                        toast.dismiss()
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
                setMasterAssetNameOptions([{
                    id: 1,
                    name: 'ELectrical Invertor'
                }])
                switch (getMasterAssetName?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetMasterAssetNameResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
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
                setVendorEscalationDetailsData(getAssetDetailsByName?.response?.vendor_escalations)
            } else {
                let objData = {
                    "id": 1,
                    "uuid": "VQyyyvRMgRE6o8iWnvCjN1ko8uTORy2D",
                    "client_id": 1,
                    "branch_id": 1,
                    "client_name": "TATA Steel",
                    "branch_name": "Tata AIA General Insurance",
                    "asset_id": "ASSET101",
                    "asset_description": "electric data",
                    "type": "BMS",
                    "sub_type": "fibre electric",
                    "make": "TATA",
                    "model": "MOTOR",
                    "rating_capacity": "400vh",
                    "serial_no": "23456",
                    "vendor_id": 27,
                    "vendor": "Lorem Iop",
                    "manufacturing_date": "2025-11-12",
                    "installation_date": null,
                    "commissioning_date": null,
                    "warranty_start_date": null,
                    "warranty_expiry_date": null,
                    "amc_start_date": null,
                    "amc_expiry_date": null,
                    "asset_owner": "Avinash",
                    "asset_custodian_id": 1,
                    "asset_custodian": " Mr. Avinash Sangita Vinayak Suryawanshi",
                    "asset_end_life_selection": null,
                    "asset_end_life_period": null,
                    "location": "Pune",
                    "status": "Active"
                }
                setAssetDetailData(objData)
                setValue('location', objData?.location)
                setVendorEscalationDetailsData([
                    {
                        id: 1,
                        name: 'Level - 1 - Sunil Shah',
                        email: 'mumbaiservice@stulzservice.in',
                        is_selected: 1
                    },
                    {
                        id: 2,
                        name: 'Level - 2 - Sunil Shah',
                        email: 'mumbaiservice@stulzservice.in',
                        is_selected: 0
                    },
                    {
                        id: 3,
                        name: 'Level - 3 - Sunil Shah',
                        email: 'mumbaiservice@stulzservice.in',
                        is_selected: 0
                    }
                ])
                switch (getAssetDetailsByName?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetGetAssetDetailsByNameResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
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
                        toast.dismiss()
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
            } else {
                setLoading(false)
                switch (addTicket?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddTicketResponse())
                        toast.dismiss()
                        showSnackbar({ message: addTicket?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
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
    const onSubmit = data => {
        console.log('-------data-----', data)
        let selectedVendors = vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
            vendorEscalationDetailsData?.filter(obj => obj?.is_selected === 1)?.map(obj => obj?.id)?.join(',')
            : [];

        let objData = {
            asset_type_id: data.type,
            asset_id: data.asset_name,
            title: data.title && data.title !== null ? data.title : null,
            supervisor: data.supervisor && data.supervisor !== null ? data.supervisor : null,
            priority: data.priority && data.priority !== null ? data.priority : null,
            description: data.description && data.description !== null ? data.description : null,
            assigned_vendors: selectedVendors
        }

        const files = [];
        let hasNewFiles = arrUploadedFiles.filter(obj => obj?.is_new === 1)
        if (hasNewFiles && hasNewFiles.length > 0 && arrUploadedFiles && arrUploadedFiles.length > 0) {
            arrUploadedFiles.map((objFile, index) => {
                if (objFile?.is_new === 1) {

                    //Compress the files with type image
                    const compressedFile = compressFile(objFile.file);

                    files.push({
                        title: `ticket_upload_${index + 1}`,
                        data: compressedFile
                    });
                }

            })
        }
        setLoading(true)
        const formData = getFormData(objData, files);
        dispatch(actionAddTicket(formData))
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
                    icon={<TicketIcon stroke={theme.palette.primary[600]} size={20} />}
                    title="Create New Ticket"
                    subtitle="Fill below form to add new ticket"
                    actions={[
                        <IconButton
                            onClick={handleClose}
                        >
                            <CloseIcon size={16} />
                        </IconButton>
                    ]}
                    rightSection={<Stack flexDirection={'row'} gap={3} sx={{ mx: 3 }}>
                        <Stack>
                            <TypographyComponent fontSize={14} fontWeight={400}>Date</TypographyComponent>
                            <TypographyComponent fontSize={18} fontWeight={600}>10 Oct 2025</TypographyComponent>
                        </Stack>
                        <Stack sx={{ borderRight: `1px solid ${theme.palette.common.black}` }} />
                        <Stack>
                            <TypographyComponent fontSize={14} fontWeight={400}>Time</TypographyComponent>
                            <TypographyComponent fontSize={18} fontWeight={600}>11:35 AM</TypographyComponent>
                        </Stack>
                    </Stack>}
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
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 9, xl: 9 }}>
                                <Stack>
                                    <SectionHeader title="Create Ticket For" show_progress={0} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 3, marginTop: '-4px' }}>
                                        <Grid container spacing={'24px'}>
                                            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name='type'
                                                    control={control}
                                                    rules={{
                                                        required: 'Please select Asset Type'
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            select
                                                            fullWidth
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Asset Type' required={false} />}
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

                                                            error={Boolean(errors.type)}
                                                            {...(errors.type && { helperText: errors.type.message })}
                                                        >
                                                            <MenuItem value=''>
                                                                <em>Select Asset Type</em>
                                                            </MenuItem>
                                                            {masterAssetTypeOptions && masterAssetTypeOptions !== null && masterAssetTypeOptions.length > 0 &&
                                                                masterAssetTypeOptions.map(option => (
                                                                    <MenuItem
                                                                        key={option?.id}
                                                                        value={option?.name}
                                                                        sx={{
                                                                            whiteSpace: 'normal',        // allow wrapping
                                                                            wordBreak: 'break-word',     // break long words if needed
                                                                            maxWidth: 300,               // control dropdown width
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
                                                    name='asset_name'
                                                    control={control}
                                                    rules={{
                                                        required: 'Please select Asset Name'
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            select
                                                            fullWidth
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Asset Name' required={false} />}
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

                                                            error={Boolean(errors.asset_name)}
                                                            {...(errors.asset_name && { helperText: errors.asset_name.message })}
                                                        >
                                                            <MenuItem value=''>
                                                                <em>Select Asset Name</em>
                                                            </MenuItem>
                                                            {masterAssetNameOptions && masterAssetNameOptions !== null && masterAssetNameOptions.length > 0 &&
                                                                masterAssetNameOptions.map(option => (
                                                                    <MenuItem
                                                                        key={option?.id}
                                                                        value={option?.name}
                                                                        sx={{
                                                                            whiteSpace: 'normal',        // allow wrapping
                                                                            wordBreak: 'break-word',     // break long words if needed
                                                                            maxWidth: 300,               // control dropdown width
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
                                                    name='location'
                                                    control={control}
                                                    rules={{
                                                        // required: 'Location is required',
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Maximum length is 255 characters'
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            fullWidth
                                                            disabled
                                                            placeholder={'Location'}
                                                            value={field?.value}
                                                            label={<FormLabel label='Location' required={false} />}
                                                            onChange={field.onChange}
                                                            inputProps={{ maxLength: 255 }}
                                                            error={Boolean(errors.location)}
                                                            {...(errors.location && { helperText: errors.location.message })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    <SectionHeader title="Asset Details" show_progress={0} sx={{ marginTop: 2.5 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, marginTop: '-4px' }}>
                                        <Grid container >
                                            {/* Asset ID */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Asset ID" value={assetDetailData?.asset_id && assetDetailData?.asset_id !== null ? assetDetailData?.asset_id : ''} />
                                            </Grid>
                                            {/* Asset Name */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Asset Name" value={assetDetailData?.asset_name && assetDetailData?.asset_name !== null ? assetDetailData?.asset_name : ''} />
                                            </Grid>
                                            {/* Asset Make */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Make" value={assetDetailData?.make && assetDetailData?.make !== null ? assetDetailData?.make : ''} />
                                            </Grid>
                                            {/* Asset Model */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Model" value={assetDetailData?.model && assetDetailData?.model !== null ? assetDetailData?.model : ''} />
                                            </Grid>
                                            {/* Asset sr. Number */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Serial Number" value={assetDetailData?.serial_no && assetDetailData?.serial_no !== null ? assetDetailData?.serial_no : ''} />
                                            </Grid>
                                            {/* Asset type */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Type" value={assetDetailData?.type && assetDetailData?.type !== null ? assetDetailData?.type : ''} />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} >
                                                <Stack sx={{ borderBottom: `1px solid ${theme.palette.grey[300]}`, mx: 2 }}>

                                                </Stack>
                                            </Grid>
                                            {/* Asset Rating */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Rating" value={assetDetailData?.rating_capacity && assetDetailData?.rating_capacity !== null ? assetDetailData?.rating_capacity : ''} />
                                            </Grid>
                                            {/* customer */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Customer" value={assetDetailData?.client_name && assetDetailData?.client_name !== null ? assetDetailData?.client_name : ''} />
                                            </Grid>
                                            {/* Asset Owner */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Owner" value={assetDetailData?.asset_owner && assetDetailData?.asset_owner !== null ? assetDetailData?.asset_owner : ''} />
                                            </Grid>
                                            {/* Asset Custodian */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Custodian" value={assetDetailData?.asset_custodian && assetDetailData?.asset_custodian !== null ? assetDetailData?.asset_custodian : ''} />
                                            </Grid>
                                            {/* Status */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Status" value={assetDetailData?.status && assetDetailData?.status !== null ? assetDetailData?.status : ''} />
                                            </Grid>
                                            {/* Location */}
                                            <Grid size={{ xs: 12, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                                <FieldBox textColor={theme.palette.grey[900]} label="Location" value={assetDetailData?.location && assetDetailData?.location !== null ? assetDetailData?.location : ''} />
                                            </Grid>
                                        </Grid>
                                    </Stack>
                                    <SectionHeader title="Issue Details" show_progress={0} sx={{ marginTop: 2.5 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 3, marginTop: '-4px' }}>
                                        <Grid container spacing={'24px'}>
                                            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name='title'
                                                    control={control}
                                                    rules={{
                                                        required: 'Location is required',
                                                        maxLength: {
                                                            value: 255,
                                                            message: 'Maximum length is 255 characters'
                                                        },
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            fullWidth
                                                            placeholder={'Title'}
                                                            value={field?.value}
                                                            label={<FormLabel label='Title' required={true} />}
                                                            onChange={field.onChange}
                                                            inputProps={{ maxLength: 255 }}
                                                            error={Boolean(errors.title)}
                                                            {...(errors.title && { helperText: errors.title.message })}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                                <Controller
                                                    name='supervisor'
                                                    control={control}
                                                    rules={{
                                                        required: 'Please select Supervisor'
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            select
                                                            fullWidth
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Supervisor' required={true} />}
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

                                                            error={Boolean(errors.supervisor)}
                                                            {...(errors.supervisor && { helperText: errors.supervisor.message })}
                                                        >
                                                            <MenuItem value=''>
                                                                <em>Select Supervisor</em>
                                                            </MenuItem>
                                                            {supervisorMasterOptions && supervisorMasterOptions !== null && supervisorMasterOptions.length > 0 &&
                                                                supervisorMasterOptions.map(option => (
                                                                    <MenuItem
                                                                        key={option?.id}
                                                                        value={option?.name}
                                                                        sx={{
                                                                            whiteSpace: 'normal',        // allow wrapping
                                                                            wordBreak: 'break-word',     // break long words if needed
                                                                            maxWidth: 300,               // control dropdown width
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
                                                    name='priority'
                                                    control={control}
                                                    rules={{
                                                        required: 'Please select Priority'
                                                    }}
                                                    render={({ field }) => (
                                                        <CustomTextField
                                                            select
                                                            fullWidth
                                                            value={field?.value ?? ''}
                                                            label={<FormLabel label='Priority' required={true} />}
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

                                                            error={Boolean(errors.priority)}
                                                            {...(errors.priority && { helperText: errors.priority.message })}
                                                        >
                                                            <MenuItem value=''>
                                                                <em>Select Priority</em>
                                                            </MenuItem>
                                                            {getPriorityArray && getPriorityArray !== null && getPriorityArray.length > 0 &&
                                                                getPriorityArray.map(option => (
                                                                    <MenuItem
                                                                        key={option?.id}
                                                                        value={option?.name}
                                                                        sx={{
                                                                            whiteSpace: 'normal',        // allow wrapping
                                                                            wordBreak: 'break-word',     // break long words if needed
                                                                            maxWidth: 250,               // control dropdown width
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
                                                            placeholder={'Detailed description of the issue, symptoms and any relevant information'}
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
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 3, xl: 3 }}>
                                <Stack>
                                    <SectionHeader title="Vendor Details" show_progress={0} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px' }}>
                                        {
                                            vendorEscalationDetailsData && vendorEscalationDetailsData !== null && vendorEscalationDetailsData.length > 0 ?
                                                <>
                                                    <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                        <TypographyComponent fontSize={16} fontWeight={500}>STULZ</TypographyComponent>
                                                        <TypographyComponent fontSize={14} fontWeight={400}>VF-2025-0001672</TypographyComponent>
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
                                                <Stack sx={{ px: 1, py: 5, justifyContent: 'center', width: '100%' }}>
                                                    <Stack sx={{ alignItems: 'center' }}>
                                                        <Avatar alt={""} src={'/assets/person-details.png'} sx={{ justifyContent: 'center', overFlow: 'hidden', borderRadius: 0, height: 232, width: 253 }} />
                                                    </Stack>
                                                    <TypographyComponent fontSize={16} fontWeight={500} sx={{ mt: 3, textAlign: 'center' }}>Select Asset to get vendor details</TypographyComponent>
                                                </Stack>
                                        }
                                    </Stack>
                                    <SectionHeader title="Upload Files" show_progress={0} sx={{ marginTop: 2 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px' }}>
                                        <Box sx={{ mb: 0 }}>
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
                                                                            {file?.name}
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
                                        </Box>
                                    </Stack>
                                </Stack>
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
                        name='submit'
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
