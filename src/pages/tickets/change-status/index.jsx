/* eslint-disable react-hooks/exhaustive-deps */

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { useTheme } from "@emotion/react";
import { Grid, List, ListItem, ListItemText, MenuItem, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import { BootstrapDialog } from '../../../components/common';
import TypographyComponent from '../../../components/custom-typography';
import FieldBox from '../../../components/field-box';
import SectionHeader from '../../../components/section-header';
import { Controller, useForm } from 'react-hook-form';
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import ChevronDownIcon from '../../../assets/icons/ChevronDown';
import FileIcon from '../../../assets/icons/FileIcon';
import DeleteIcon from '../../../assets/icons/DeleteIcon';
import { actionChangeTicketStatus, actionGetTicketDetails, resetChangeTicketStatusResponse } from '../../../store/tickets';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { actionAssetCustodianList, resetAssetCustodianListResponse } from '../../../store/asset';
import { useBranch } from '../../../hooks/useBranch';
import { compressFile, getFormData } from '../../../utils';
import _ from 'lodash';
import CustomAutocomplete from '../../../components/custom-autocomplete';

export default function ChangeTicketStatus({ open, handleClose, details }) {
    const dispatch = useDispatch()
    const theme = useTheme()
    const { showSnackbar } = useSnackbar()
    const { logout } = useAuth()
    const inputRef = useRef();
    const branch = useBranch()

    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'xlsx', 'csv', 'pdf', 'docx'];
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

    // Trigger file dialog
    const handleTriggerInput = () => {
        inputRef.current.click();
    };

    //media query
    const isSMDown = useMediaQuery(theme.breakpoints.down('sm'));
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'));

    //Stores
    const { assetCustodianList } = useSelector(state => state.AssetStore)
    const { changeTicketStatus } = useSelector(state => state.ticketsStore)

    //States
    const [loading, setLoading] = useState(false)
    const [ticketDetailsData, setTicketDetailsData] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState(null)
    const [statusOptions, setStatusOptions] = useState([])
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState([])
    const [statusError, setStatusError] = useState(null)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            supervisor: ''
        }
    });

    /**
     * Function to get valid Ticket Status
     * @param {*} current 
     */
    const getValidStatusOptions = (current) => {

        switch (current) {
            case 'Open':
            case 'Re Open':
                setStatusOptions([{
                    label: 'On Hold',
                    value: 'On Hold'
                },
                {
                    label: 'Closed',
                    value: 'Closed'
                },
                {
                    label: 'Rejected',
                    value: 'Rejected'
                }])
                break;
            case 'On Hold':
                setStatusOptions([{
                    label: 'Open',
                    value: 'Open'
                },
                {
                    label: 'Closed',
                    value: 'Closed'
                },
                {
                    label: 'Rejected',
                    value: 'Rejected'
                }])
                break;
            case 'Closed':
                setStatusOptions([{
                    label: 'Re Open',
                    value: 'Re Open'
                }])
                break;

            default:
                setStatusOptions([{
                    label: 'On Hold',
                    value: 'On Hold'
                },
                {
                    label: 'Closed',
                    value: 'Closed'
                },
                {
                    label: 'Rejected',
                    value: 'Rejected'
                }])
                break;
        }
    }

    /**
     * get Current Status Field
     * @param {*} status 
     * @returns 
     */
    const getFieldTitleObject = (status) => {

        switch (status) {
            case 'On Hold':
                return {
                    title: 'Holding',
                    placeholder: 'holding'
                }
            case 'Rejected':
                return {
                    title: 'Rejecting',
                    placeholder: 'rejecting'
                }
            case 'Re Open':
                return {
                    title: 'Reopening',
                    placeholder: 'reopening'
                }
            case 'Open':
                return {
                    title: 'Opening',
                    placeholder: 'Opening'
                }
            case 'Closed':
                return {
                    title: 'Closing',
                    placeholder: 'closing'
                }
            default:
                return ''
        }
    }

    /**
       * Initial Render and Set permissions array
       */
    useEffect(() => {
        if (open === true) {
            setTicketDetailsData(details)
            getValidStatusOptions(details?.status)
            dispatch(actionAssetCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
        return () => {
            reset()
            setArrUploadedFiles([])
            setSelectedStatus(null)
            setStatusError(null)
        }
    }, [open, details])

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
     * @dependency : changeTicketStatus
     * @type : HANDLE API RESULT
     * @description : Handle the result of change status API
     */
    useEffect(() => {
        if (changeTicketStatus && changeTicketStatus !== null) {
            dispatch(resetChangeTicketStatusResponse())
            if (changeTicketStatus?.result === true) {
                setLoading(false)
                showSnackbar({ message: 'Status Updated Successfully', severity: "success" })
                reset()
                setArrUploadedFiles([])
                dispatch(actionGetTicketDetails({
                    uuid: ticketDetailsData?.ticket_uuid
                }))
                handleClose()
                window.localStorage.setItem('ticket_update', true)
            } else {
                setLoading(false)
                switch (changeTicketStatus?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: changeTicketStatus.message, severity: "error" })
                        dispatch(resetChangeTicketStatusResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: changeTicketStatus.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [changeTicketStatus])

    //handle on SUbmit
    const onSubmit = async data => {
        if (selectedStatus && selectedStatus !== null) {
            setStatusError(null)
            let objData = {
                ticket_id: ticketDetailsData?.ticket_id,
                client_uuid: branch?.currentBranch?.client_uuid,
                branch_uuid: branch?.currentBranch?.uuid,
                priority: ticketDetailsData?.priority,
                changed_status: selectedStatus,
                title: data?.title,
                description: data?.description,
                supervisor_id: data?.supervisor
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
            dispatch(actionChangeTicketStatus(formData))
        } else {
            setStatusError('Please select Status')
        }
    }

    return (
        <BootstrapDialog
            fullWidth
            fullScreen={isMDDown}
            maxWidth={'lg'}
            onClose={() => handleClose()}
            sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
            scroll="paper"
            open={open}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                <Stack
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                        <Stack columnGap={1}>
                            <TypographyComponent fontSize={16} fontWeight={600}>
                                Change Ticket Status
                            </TypographyComponent>
                            <TypographyComponent fontSize={14} fontWeight={400}>
                                Update the current status of this ticket and notify relevant stakeholders.
                            </TypographyComponent>
                        </Stack>
                    </Stack>
                </Stack>
            </DialogTitle>

            <DialogContent sx={{
                borderRadius: 2,
                scrollbarWidth: 'thin',
                backgroundColor: 'white',
                px: '24px',
                whiteSpace: 'nowrap',
                width: '100%',
                marginTop: isSMDown ? 2 : ''
            }}>
                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                    <Grid container>
                        {/* Row 1: Ticket No, Asset Type, Asset Name, Location */}
                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                            <FieldBox
                                textColor={theme.palette.grey[900]}
                                label="Ticket No"
                                value={ticketDetailsData?.ticket_no && ticketDetailsData?.ticket_no !== null ? ticketDetailsData?.ticket_no : '--'}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                            <FieldBox
                                textColor={theme.palette.grey[900]}
                                label="Asset Type"
                                value={ticketDetailsData?.asset_type && ticketDetailsData?.asset_type !== null ? ticketDetailsData?.asset_type : '--'}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                            <FieldBox
                                textColor={theme.palette.grey[900]}
                                label="Asset Name"
                                value={ticketDetailsData?.asset_name && ticketDetailsData?.asset_name !== null ? ticketDetailsData?.asset_name : '--'}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                            <FieldBox
                                textColor={theme.palette.grey[900]}
                                label="Location"
                                value={ticketDetailsData?.location && ticketDetailsData?.location !== null ? ticketDetailsData?.location : '--'}
                            />
                        </Grid>

                    </Grid>
                </Stack>
                <SectionHeader title="Select Status to Change" show_progress={0} sx={{ marginTop: 2.5 }} />
                <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}` }}>
                    <Stack sx={{ flexDirection: 'row', columnGap: 2, paddingY: statusError && statusError !== null ? '10px' : '24px', paddingX: statusError && statusError !== null ? '10px' : '20px', border: statusError && statusError !== null ? `1px solid ${theme.palette.error[600]}` : 'none', borderRadius: statusError && statusError !== null ? '5px' : '', m: statusError && statusError !== null ? '10px' : '' }}>
                        {
                            statusOptions && statusOptions !== null && statusOptions.length > 0 ?
                                statusOptions.map((objStatus) => {
                                    return (<Stack
                                        sx={{ width: '100%', paddingX: '24px', justifyContent: 'center', textAlign: 'center', py: '8px', borderRadius: '8px', border: selectedStatus === objStatus?.label ? `1px solid ${theme.palette.primary[300]}` : `1px solid ${theme.palette.grey[300]}`, background: selectedStatus === objStatus?.label ? theme.palette.primary[600] : theme.palette.common.white, color: selectedStatus === objStatus?.label ? theme.palette.common.white : '' }}
                                        onClick={() => {
                                            setStatusError(null)
                                            setSelectedStatus(objStatus?.label)
                                        }}>
                                        <TypographyComponent>{objStatus?.label}</TypographyComponent>
                                    </Stack>)
                                })
                                :
                                <></>
                        }
                    </Stack>
                    {
                        statusError && statusError !== null ?
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.error[600], paddingX: '10px' }}>
                                {statusError}
                            </TypographyComponent>
                            :
                            <></>
                    }
                    <Stack sx={{ paddingY: '24px', paddingX: '20px' }}>
                        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={'24px'}>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='title'
                                        control={control}
                                        rules={{
                                            required: `${selectedStatus && selectedStatus !== null ? getFieldTitleObject(selectedStatus)?.title : ''} Title is required`,
                                            maxLength: {
                                                value: 255,
                                                message: 'Maximum length is 255 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={`Enter ${selectedStatus && selectedStatus !== null ? `${getFieldTitleObject(selectedStatus)?.placeholder} ` : ''}title`}
                                                value={field?.value}
                                                label={<FormLabel label={`${selectedStatus && selectedStatus !== null ? getFieldTitleObject(selectedStatus)?.title : ''} Title`} required={true} />}
                                                onChange={field.onChange}
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.title)}
                                                {...(errors.title && { helperText: errors.title.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
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
                                {/* description */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Controller
                                        name='description'
                                        control={control}
                                        rules={{
                                            required: `${selectedStatus && selectedStatus !== null ? getFieldTitleObject(selectedStatus)?.title : ''} Description is required`,
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
                                                label={<FormLabel label={`${selectedStatus && selectedStatus !== null ? getFieldTitleObject(selectedStatus)?.title : ''} Description`} required={true} />}
                                                onChange={field.onChange}
                                                error={Boolean(errors.description)}
                                                {...(errors.description && { helperText: errors.description.message })}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </form>
                    </Stack>
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
            </DialogContent>
            <DialogActions sx={{ mx: 1, mb: 1 }}>
                <Button color="secondary" variant="outlined" sx={{ color: theme.palette.grey[800], textTransform: 'capitalize', px: 4 }} onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    sx={{ textTransform: 'capitalize', background: theme.palette.primary[600], color: theme.palette.common.white, px: 5 }}
                    onClick={() => {
                        handleSubmit(onSubmit)()
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Submit'}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    )
}
