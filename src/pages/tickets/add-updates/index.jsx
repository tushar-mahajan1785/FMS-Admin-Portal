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
import SectionHeader from '../../../components/section-header';
import { Controller, useForm } from 'react-hook-form';
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import ChevronDownIcon from '../../../assets/icons/ChevronDown';
import FileIcon from '../../../assets/icons/FileIcon';
import DeleteIcon from '../../../assets/icons/DeleteIcon';
import { actionGetTicketDetails, actionTicketAddUpdate, actionTicketUpdateFileDelete, resetTicketAddUpdateResponse, resetTicketUpdateFileDeleteResponse } from '../../../store/tickets';
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { actionAssetCustodianList, resetAssetCustodianListResponse } from '../../../store/asset';
import { useBranch } from '../../../hooks/useBranch';
import { compressFile, getFormData } from '../../../utils';
import CircleCheckIcon from '../../../assets/icons/CircleCheck';
import AlertPopup from '../../../components/alert-confirm';
import AlertCircleIcon from '../../../assets/icons/AlertCircleIcon';

export default function AddUpdateTicket({ open, handleClose, entryDetails, type, ticketDetails }) {
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
    const { ticketAddUpdate, ticketUpdateFileDelete } = useSelector(state => state.ticketsStore)

    //States
    const [loading, setLoading] = useState(false)
    const [selectedEntryDetailsData, setSelectedEntryDetailsData] = useState(null)
    const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([])
    const [arrUploadedFiles, setArrUploadedFiles] = useState([])
    const [openTicketUpdateFileDeletePopup, setOpenTicketUpdateFileDeletePopup] = useState(false)
    const [viewLoadingFileDelete, setViewLoadingFileDelete] = useState(false)
    const [viewTicketData, setViewTicketData] = useState(null)

    console.log('---------arrUploadedFiles-------', arrUploadedFiles)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            supervisor: ''
        }
    });

    /**
       * Initial Render and Set permissions array
       */
    useEffect(() => {
        if (open === true) {
            setSelectedEntryDetailsData(entryDetails)
            dispatch(actionAssetCustodianList({
                client_id: branch?.currentBranch?.client_id,
                branch_uuid: branch?.currentBranch?.uuid
            }))

        }
        return () => {
            reset()
            setArrUploadedFiles([])
            setSelectedEntryDetailsData(null)
        }
    }, [open, entryDetails])
    console.log('--------selectedEntryDetailsData--------', selectedEntryDetailsData)
    useEffect(() => {
        if (selectedEntryDetailsData && selectedEntryDetailsData !== null) {
            if (type == 'Edit') {
                setValue('title', selectedEntryDetailsData?.title)
                setValue('description', selectedEntryDetailsData?.description)
                setValue('supervisor', selectedEntryDetailsData?.user_id)
                console.log('--------selectedEntryDetailsData?.files--------', selectedEntryDetailsData?.files)
                if (selectedEntryDetailsData?.files && selectedEntryDetailsData?.files !== null && selectedEntryDetailsData?.files.length > 0) {
                    setArrUploadedFiles(selectedEntryDetailsData?.files)
                } else {
                    setArrUploadedFiles([])
                }

            }
        }

    }, [selectedEntryDetailsData])

    //handle delete function
    const handleDelete = (index, file) => {
        if (file?.is_new === 1) {
            const newFiles = [...arrUploadedFiles];
            newFiles.splice(index, 1);
            setArrUploadedFiles(newFiles);
        } else {
            console.log('----file-----', file)
            let objData = {
                id: file?.id,
                title: `Delete File`,
                text: `Are you sure you want to delete this file? This action cannot be undone.`
            }
            setViewTicketData(objData)
            setOpenTicketUpdateFileDeletePopup(true)
        }

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
     * @dependency : ticketAddUpdate
     * @type : HANDLE API RESULT
     * @description : Handle the result of ticket add update API
     */
    useEffect(() => {
        if (ticketAddUpdate && ticketAddUpdate !== null) {
            dispatch(resetTicketAddUpdateResponse())
            if (ticketAddUpdate?.result === true) {
                setLoading(false)
                showSnackbar({ message: `Ticket ${type == 'Add' ? 'Update Added' : 'Updated'} Successfully`, severity: "success" })
                reset()
                setArrUploadedFiles([])
                dispatch(actionGetTicketDetails({
                    uuid: selectedEntryDetailsData?.uuid
                }))
                handleClose()
            } else {
                setLoading(false)
                switch (ticketAddUpdate?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        showSnackbar({ message: ticketAddUpdate.message, severity: "error" })
                        dispatch(resetTicketAddUpdateResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: ticketAddUpdate.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [ticketAddUpdate])

    /**
     * useEffect
     * @dependency : ticketUpdateFileDelete
     * @type : HANDLE API RESULT
     * @description : Handle the result of delete ticket API
     */
    useEffect(() => {
        if (ticketUpdateFileDelete && ticketUpdateFileDelete !== null) {
            dispatch(resetTicketUpdateFileDeleteResponse())
            if (ticketUpdateFileDelete?.result === true) {
                setOpenTicketUpdateFileDeletePopup(false)
                setViewLoadingFileDelete(false)
                setViewTicketData(null)
                showSnackbar({ message: ticketUpdateFileDelete?.message, severity: "success" })
                handleClose('delete')
            } else {
                setViewLoadingFileDelete(false)
                switch (ticketUpdateFileDelete?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTicketUpdateFileDeleteResponse())
                        showSnackbar({ message: ticketUpdateFileDelete?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: ticketUpdateFileDelete?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [ticketUpdateFileDelete])

    const onSubmit = async data => {
        let objData = {
            ticket_id: selectedEntryDetailsData?.ticket_id,
            client_uuid: branch?.currentBranch?.client_uuid,
            branch_uuid: branch?.currentBranch?.uuid,
            current_status: ticketDetails?.status,
            title: data?.title,
            description: data?.description,
            supervisor_id: data?.supervisor
        }
        if (type == 'Edit') {
            objData.update_id = selectedEntryDetailsData?.id
        }
        const files = [];
        let hasNewFiles = arrUploadedFiles?.filter(obj => obj?.is_new === 1)
        if (hasNewFiles && hasNewFiles.length > 0 && arrUploadedFiles && arrUploadedFiles !== null && arrUploadedFiles.length > 0) {
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
        dispatch(actionTicketAddUpdate(formData))
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
                    <Stack flexDirection="row" alignItems="center">
                        <Stack columnGap={1}>
                            <TypographyComponent fontSize={16} fontWeight={600}>
                                {`${type && type !== null && type == 'Add' ? 'Add New' : 'Edit'} Update`}
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
                    <Stack sx={{ paddingY: '24px', paddingX: '20px' }}>
                        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={'24px'}>
                                <Grid size={{ xs: 12, sm: 6, md: 6, lg: 6, xl: 6 }}>
                                    <Controller
                                        name='title'
                                        control={control}
                                        rules={{
                                            required: `Title is required`,
                                            maxLength: {
                                                value: 255,
                                                message: 'Maximum length is 255 characters'
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                placeholder={`Enter title`}
                                                value={field?.value}
                                                label={<FormLabel label={`Title`} required={true} />}
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
                                                            value={option?.id}
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
                                {/* description */}
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <Controller
                                        name='description'
                                        control={control}
                                        rules={{
                                            required: `Description is required`,
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
                                                label={<FormLabel label={`Description`} required={true} />}
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
                                <React.Fragment key={file.file_name}>
                                    <ListItem
                                        sx={{ mb: '-8px' }}
                                        secondaryAction={
                                            <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
                                                {
                                                    file?.is_new == 1 ?
                                                        <></>
                                                        :
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="check"
                                                        >
                                                            <CircleCheckIcon size={20} stroke={theme.palette.success[600]} />
                                                        </IconButton>
                                                }

                                                <IconButton
                                                    edge="end"
                                                    aria-label="delete"
                                                    onClick={() => handleDelete(idx, file)}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Stack>
                                        }
                                    >
                                        <FileIcon sx={{ mr: 1 }} />
                                        <ListItemText
                                            primary={
                                                <TypographyComponent fontSize={14} fontWeight={500} sx={{ textDecoration: 'underline' }}>
                                                    {file?.is_new == 1 ? file?.file?.name : file?.file_name}
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
                <Button color="secondary" variant="outlined" sx={{ color: theme.palette.grey[800], textTransform: 'capitalize', px: 2 }} onClick={handleClose}>
                    Close
                </Button>
                <Button
                    variant="contained"
                    sx={{ textTransform: 'capitalize', background: theme.palette.primary[600], color: theme.palette.common.white, px: 5 }}
                    // disabled={loading ? false : true}
                    onClick={() => {
                        handleSubmit(onSubmit)()
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" sx={{ color: 'white' }} /> : 'Submit'}
                </Button>
            </DialogActions>
            {
                openTicketUpdateFileDeletePopup &&
                <AlertPopup
                    open={openTicketUpdateFileDeletePopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewTicketData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenTicketUpdateFileDeletePopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingFileDelete} onClick={() => {
                            setViewLoadingFileDelete(true)
                            if (viewTicketData?.id && viewTicketData?.id !== null) {
                                dispatch(actionTicketUpdateFileDelete({
                                    id: viewTicketData?.id
                                }))
                            }
                        }}>
                            {viewLoadingFileDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </BootstrapDialog>
    )
}
