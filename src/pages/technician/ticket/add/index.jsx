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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import {
    ERROR,
    getPriorityArray,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../../constants';
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "../../../../components/form-header";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { useAuth } from "../../../../hooks/useAuth";
import CloseIcon from "../../../../assets/icons/CloseIcon";
import TicketIcon from "../../../../assets/icons/TicketIcon";
import TypographyComponent from "../../../../components/custom-typography";
import ChevronDownIcon from "../../../../assets/icons/ChevronDown";
import FieldBox from "../../../../components/field-box";
import { AntSwitch } from "../../../../components/common";
import DeleteIcon from "../../../../assets/icons/DeleteIcon";
import FileIcon from "../../../../assets/icons/FileIcon";
import { useBranch } from "../../../../hooks/useBranch";
import { compressFile, getFormData, getObjectById, getObjectByUuid } from "../../../../utils";
import _ from "lodash";
import CustomAutocomplete from "../../../../components/custom-autocomplete";
import CustomTextField from "../../../../components/text-field";
import FormLabel from "../../../../components/form-label";
import { actionTechnicianAddTicket, actionTechnicianTicketAssetDetails, actionTechnicianTicketCustodianList, actionTechnicianTicketTypeWiseAsset, resetTechnicianAddTicketResponse, resetTechnicianTicketAssetDetailsResponse, resetTechnicianTicketCustodianListResponse, resetTechnicianTicketTypeWiseAssetResponse } from "../../../../store/technician/tickets";
import { actionTechnicianAssetTypeList, resetTechnicianAssetTypeListResponse } from "../../../../store/technician/assets";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function AddTechnicianTicket({ open, handleClose, abnormality }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, } = useAuth()
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
    const { technicianTicketTypeWiseAsset, technicianTicketAssetDetails, technicianTicketCustodianList, technicianAddTicket } = useSelector(state => state.technicianTicketsStore)
    const { technicianAssetTypeList } = useSelector(state => state.technicianAssetStore)
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
    const [abnormalitiesData, setAbnormalitiesData] = useState(null)

    //Initial Render
    useEffect(() => {
        if (open === true) {
            dispatch(actionTechnicianAssetTypeList({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
            dispatch(actionTechnicianTicketCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
            if (abnormality && abnormality !== null) {
                setAbnormalitiesData(abnormality)
            } else {
                setAbnormalitiesData(null)
            }
        }

        return () => {
            reset()
            setMasterAssetTypeOptions([])
            setMasterAssetNameOptions([])
            setSupervisorMasterOptions([])
            setAssetDetailData(null)
            setVendorEscalationDetailsData([])
            setArrUploadedFiles([])
            setAbnormalitiesData(null)
        }

    }, [open, abnormality])

    /**
     * Set type for selected abnormality
     */
    useEffect(() => {
        if (masterAssetTypeOptions && masterAssetTypeOptions !== null && masterAssetTypeOptions.length > 0) {
            if (abnormalitiesData?.asset_type_id && abnormalitiesData?.asset_type_id !== null) {
                let objData = getObjectById(masterAssetTypeOptions, abnormalitiesData?.asset_type_id)
                setValue('type', objData?.name)
            }
        }
    }, [masterAssetTypeOptions])

    /**
    * Set asset_name for selected abnormality
    */
    useEffect(() => {
        if (masterAssetNameOptions && masterAssetNameOptions !== null && masterAssetNameOptions.length > 0) {
            if (abnormalitiesData?.asset_id && abnormalitiesData?.asset_id !== null) {
                let objData = getObjectById(masterAssetNameOptions, abnormalitiesData?.asset_id)
                setValue('asset_name', objData?.uuid)
            }
        }
    }, [masterAssetNameOptions])

    /**
     * actionGetMasterAssetName on selection of Asset Type
     */
    useEffect(() => {
        if (watchAssetType && watchAssetType !== null) {
            dispatch(actionTechnicianTicketTypeWiseAsset({
                branch_uuid: branch?.currentBranch?.uuid,
                asset_type: watchAssetType
            }))
            setAssetDetailData(null)
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
            dispatch(actionTechnicianTicketAssetDetails({
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
       * @dependency : technicianAssetTypeList
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset Type List API
       */
    useEffect(() => {
        if (technicianAssetTypeList && technicianAssetTypeList !== null) {
            dispatch(resetTechnicianAssetTypeListResponse())
            if (technicianAssetTypeList?.result === true) {
                setMasterAssetTypeOptions(technicianAssetTypeList?.response)
            } else {
                setMasterAssetTypeOptions([])
                switch (technicianAssetTypeList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianAssetTypeListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAssetTypeList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAssetTypeList])

    /**
       * useEffect
       * @dependency : technicianTicketTypeWiseAsset
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset list API
       */
    useEffect(() => {
        if (technicianTicketTypeWiseAsset && technicianTicketTypeWiseAsset !== null) {
            dispatch(resetTechnicianTicketTypeWiseAssetResponse())
            if (technicianTicketTypeWiseAsset?.result === true) {
                setMasterAssetNameOptions(technicianTicketTypeWiseAsset?.response)
            } else {
                setMasterAssetNameOptions([])
                switch (technicianTicketTypeWiseAsset?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianTicketTypeWiseAssetResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianTicketTypeWiseAsset?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianTicketTypeWiseAsset])

    /**
       * useEffect
       * @dependency : technicianTicketAssetDetails
       * @type : HANDLE API RESULT
       * @description : Handle the result of master Asset details by Name API
       */
    useEffect(() => {
        if (technicianTicketAssetDetails && technicianTicketAssetDetails !== null) {
            dispatch(resetTechnicianTicketAssetDetailsResponse())
            if (technicianTicketAssetDetails?.result === true) {
                setAssetDetailData(technicianTicketAssetDetails?.response)
                setValue('location', technicianTicketAssetDetails?.response?.location)
                setValue('supervisor', technicianTicketAssetDetails?.response?.asset_custodian_id)
                if (technicianTicketAssetDetails?.response?.vendor_escalation && technicianTicketAssetDetails?.response?.vendor_escalation !== null && technicianTicketAssetDetails?.response?.vendor_escalation.length > 0) {
                    setVendorEscalationDetailsData(technicianTicketAssetDetails?.response?.vendor_escalation)
                } else {
                    setVendorEscalationDetailsData([])
                }
            } else {
                setAssetDetailData(null)
                setVendorEscalationDetailsData([])
                switch (technicianTicketAssetDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianTicketAssetDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianTicketAssetDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianTicketAssetDetails])

    /**
      * useEffect
      * @dependency : technicianTicketCustodianList
      * @type : HANDLE API RESULT
      * @description : Handle the result of asset Custodian List API
      */
    useEffect(() => {
        if (technicianTicketCustodianList && technicianTicketCustodianList !== null) {
            dispatch(resetTechnicianTicketCustodianListResponse())
            if (technicianTicketCustodianList?.result === true) {
                setSupervisorMasterOptions(technicianTicketCustodianList?.response)
            } else {
                setSupervisorMasterOptions([])
                switch (technicianTicketCustodianList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianTicketCustodianListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianTicketCustodianList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianTicketCustodianList])

    /**
     * useEffect
     * @dependency : technicianAddTicket
     * @type : HANDLE API RESULT
     * @description : Handle the result of add ticket API
     */
    useEffect(() => {
        if (technicianAddTicket && technicianAddTicket !== null) {
            dispatch(resetTechnicianAddTicketResponse())
            if (technicianAddTicket?.result === true) {
                handleClose('save')
                reset()
                setLoading(false)
                showSnackbar({ message: technicianAddTicket?.message, severity: "success" })

                // window.localStorage.setItem('ticket_update', true)
            } else {
                setLoading(false)
                switch (technicianAddTicket?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianAddTicketResponse())
                        showSnackbar({ message: technicianAddTicket?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianAddTicket?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianAddTicket])

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
            dispatch(actionTechnicianAddTicket(formData))
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
                        {/* Create ticket For Section */}
                        <TypographyComponent fontSize={18} fontWeight={500} >Create Ticket For</TypographyComponent>
                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: '16px', mt: 1 }}>
                            <Grid container spacing={'12px'}>
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
                                                            key={option?.uuid}
                                                            value={option?.uuid}
                                                            sx={{
                                                                whiteSpace: 'normal',        // allow wrapping
                                                                wordBreak: 'break-word',     // break long words if needed
                                                                maxWidth: 400,              // control dropdown width
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,          // limit to 2 lines
                                                                WebkitBoxOrient: 'vertical',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis'
                                                            }}
                                                        >
                                                            {option?.asset_description}
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

                        {/* Asset Details Section */}
                        <TypographyComponent fontSize={18} fontWeight={500} sx={{ marginTop: 2.5 }}>Asset Details</TypographyComponent>
                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, mt: 1 }}>
                            <Grid container >
                                {/* Asset ID */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Asset ID" value={assetDetailData?.asset_id && assetDetailData?.asset_id !== null ? assetDetailData?.asset_id : ''} />
                                </Grid>
                                {/* Asset Name */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Asset Name" value={assetDetailData?.asset_name && assetDetailData?.asset_name !== null ? assetDetailData?.asset_name : (watchAssetName && watchAssetName !== null ? getObjectByUuid(masterAssetNameOptions, watchAssetName)?.asset_description : '')} />
                                </Grid>
                                {/* Asset Make */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Make" value={assetDetailData?.make && assetDetailData?.make !== null ? assetDetailData?.make : ''} />
                                </Grid>
                                {/* Asset Model */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Model" value={assetDetailData?.model && assetDetailData?.model !== null ? assetDetailData?.model : ''} />
                                </Grid>
                                {/* Asset sr. Number */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Serial Number" value={assetDetailData?.serial_no && assetDetailData?.serial_no !== null ? assetDetailData?.serial_no : ''} />
                                </Grid>
                                {/* Asset type */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Type" value={assetDetailData?.type && assetDetailData?.type !== null ? assetDetailData?.type : ''} />
                                </Grid>
                                {/* Asset Rating */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Rating" value={assetDetailData?.rating_capacity && assetDetailData?.rating_capacity !== null ? assetDetailData?.rating_capacity : ''} />
                                </Grid>
                                {/* customer */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Customer" value={assetDetailData?.client_name && assetDetailData?.client_name !== null ? assetDetailData?.client_name : ''} />
                                </Grid>
                                {/* Asset Owner */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Owner" value={assetDetailData?.asset_owner && assetDetailData?.asset_owner !== null ? assetDetailData?.asset_owner : ''} />
                                </Grid>
                                {/* Asset Custodian */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Custodian" value={assetDetailData?.asset_custodian && assetDetailData?.asset_custodian !== null ? assetDetailData?.asset_custodian : ''} />
                                </Grid>
                                {/* Status */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Status" value={assetDetailData?.status && assetDetailData?.status !== null ? assetDetailData?.status : ''} />
                                </Grid>
                                {/* Location */}
                                <Grid size={{ xs: 6, sm: 6, md: 2, lg: 2, xl: 2 }}>
                                    <FieldBox textColor={theme.palette.grey[900]} label="Location" value={assetDetailData?.location && assetDetailData?.location !== null ? assetDetailData?.location : ''} />
                                </Grid>
                            </Grid>
                        </Stack>

                        {/* Abnormalities Section */}
                        {
                            abnormality && abnormality !== null ?
                                <React.Fragment>
                                    <TypographyComponent fontSize={18} fontWeight={500} sx={{ marginTop: 2.5 }}>Abnormalities</TypographyComponent>
                                    <Accordion sx={{
                                        boxShadow: 'none', borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, mt: 1, '&::before': {
                                            display: 'none'
                                        },
                                    }}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel2-content"
                                            id="panel2-header"
                                        >
                                            <Stack sx={{ rowGap: 0.2 }}>
                                                <TypographyComponent fontSize={20} fontWeight={400}>{abnormalitiesData?.asset_name}</TypographyComponent>
                                                <TypographyComponent
                                                    fontSize={16}
                                                    fontWeight={400}
                                                    sx={{
                                                        color: theme.palette.grey[500]
                                                    }}
                                                >
                                                    <span style={{ color: theme.palette.grey[900], fontWeight: 400 }}>Time:</span>  {`${abnormalitiesData?.from} -${abnormalitiesData?.to} `}
                                                </TypographyComponent>
                                                <TypographyComponent
                                                    fontSize={16}
                                                    fontWeight={400}
                                                    sx={{
                                                        color: abnormalitiesData?.status == 'Approved' ? theme.palette.success[500] : theme.palette.error[500]
                                                    }}
                                                >
                                                    <span style={{ color: theme.palette.grey[900], fontWeight: 400 }}>Status:</span> {abnormalitiesData?.status && abnormalitiesData?.status !== null ? abnormalitiesData?.status : ''}
                                                </TypographyComponent>
                                            </Stack>

                                        </AccordionSummary>
                                        <AccordionDetails sx={{ py: 0 }}>
                                            {abnormalitiesData?.values && abnormalitiesData?.values !== null && abnormalitiesData?.values.length > 0 ?
                                                abnormalitiesData?.values?.filter(p => p?.parameter_type !== 'Grouping').map((param, index) => {
                                                    // const valueObj = getValue(param.id);
                                                    return (
                                                        <Box
                                                            key={param.id}
                                                            sx={{
                                                                background: theme.palette.common.white,
                                                                padding: "16px 0px",
                                                                borderTopLeftRadius: index == 0 ? '16px' : 'none',
                                                                borderTopRightRadius: index == 0 ? '16px' : 'none',
                                                                borderBottomLeftRadius: index == abnormalitiesData?.values.length - 1 ? '16px' : 'none',
                                                                borderBottomRightRadius: index == abnormalitiesData?.values.length - 1 ? '16px' : 'none',
                                                                borderBottom: index < abnormalitiesData?.values.length - 1 ? "1px solid #E0E0E0" : 'none',
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center"
                                                            }}
                                                        >
                                                            {/* LEFT: Parameter Name */}
                                                            <Stack sx={{ flexDirection: 'row', width: '100%' }}>
                                                                <TypographyComponent sx={{ color: theme.palette.grey[900] }} fontSize={16} fontWeight={400}> {param.name}</TypographyComponent>
                                                            </Stack>
                                                            <Stack sx={{ padding: '12px 18px', width: '100%', alignItems: 'center', background: param?.param_status == 'Abnormal' ? theme.palette.error[100] : theme.palette.grey[100], borderRadius: '8px' }}>
                                                                <TypographyComponent
                                                                    sx={{ color: param?.param_status == 'Abnormal' && param?.priority == 'High' ? theme.palette.error[600] : (param?.param_status == 'Abnormal' && param?.priority == 'Low') ? theme.palette.warning[600] : theme.palette.grey[900] }}
                                                                    fontSize={16} fontWeight={400}
                                                                >{param.value && param.value !== null ? `${param.value} ${param?.input_type == 'Number (with range)' ? (param?.unit && param?.unit !== null ? param?.unit : '') : ''} ` : '--'} </TypographyComponent>
                                                            </Stack>
                                                        </Box>
                                                    );
                                                })
                                                :
                                                <></>
                                            }
                                        </AccordionDetails>
                                    </Accordion>
                                </React.Fragment>
                                :
                                <></>
                        }

                        {/* Issue Section */}
                        <TypographyComponent fontSize={18} fontWeight={500} sx={{ marginTop: 2.5 }}>Issue Details</TypographyComponent>
                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: '16px', mt: 1 }}>
                            <Grid container spacing={'12px'}>
                                <Grid size={{ xs: 12, sm: 4, md: 4, lg: 4, xl: 4 }}>
                                    <Controller
                                        name='title'
                                        control={control}
                                        rules={{
                                            required: 'Title is required',
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
                                            <CustomAutocomplete
                                                {...field}
                                                label="Supervisor"
                                                is_required={true}
                                                displayName1="name"
                                                displayName2="role"
                                                options={supervisorMasterOptions}
                                                error={Boolean(errors.supervisor)}
                                                helperText={errors.supervisor?.message}
                                            />
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

                        {/* Vendor Details Section */}
                        <TypographyComponent fontSize={18} fontWeight={500} sx={{ marginTop: 2.5 }}>Vendor Details</TypographyComponent>
                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: '16px', mt: 1 }}>
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
                                                                // px: 1,
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
                                                <Avatar alt={""} src={'/assets/person-details.png'} sx={{ justifyContent: 'center', overFlow: 'hidden', borderRadius: 0, height: 200, width: 200 }} />
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
                                                            The selected asset has no vendor details assigned. Please contact your administrator to add the vendor details.
                                                        </TypographyComponent>
                                                    </>

                                                    :
                                                    <></>
                                            }

                                        </Stack>
                                    </>
                            }
                        </Stack>

                        {/* Upload Files Section */}
                        <TypographyComponent fontSize={18} fontWeight={500} sx={{ marginTop: 2.5 }}>Upload Files</TypographyComponent>
                        <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, mt: 1, pb: 0 }}>
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
                    </form>
                </Stack>
                <Divider sx={{ m: 2 }} />
                <Stack sx={{ px: 2, pb: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                    <Button
                        fullWidth
                        sx={{ textTransform: "capitalize", borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={() => {
                            handleClose()
                            reset()
                        }}
                        variant='outlined'
                    >
                        Cancel
                    </Button>
                    <Button
                        fullWidth
                        sx={{ textWrap: 'nowrap', textTransform: "capitalize", borderRadius: '8px', backgroundColor: vendorEscalationDetailsData.length === 0 ? theme.palette.grey[400] : (loading ? theme.palette.grey[400] : theme.palette.primary[600]), color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={() => {
                            handleSubmit(onSubmit)()
                        }}
                        name='submit'
                        variant='contained'
                        disabled={(vendorEscalationDetailsData.length === 0 ? true : (loading ? true : false))}
                    >
                        {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Create Ticket'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}
