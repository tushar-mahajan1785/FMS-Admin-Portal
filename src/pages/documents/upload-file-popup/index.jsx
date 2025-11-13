/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Grid,
    Stack,
    TextField,
    Button,
    Divider,
    useTheme,
    Typography,
    Avatar,
    IconButton,
    MenuItem,
    Tabs,
    Tab,
} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TypographyComponent from "../../../components/custom-typography";
import { BootstrapDialog } from "../../../components/common"
import CloseIcon from "../../../assets/icons/CloseIcon";
import { Controller, useForm } from "react-hook-form";
import ChevronDownIcon from "../../../assets/icons/ChevronDown";
import CustomTextField from "../../../components/text-field";
import FormLabel from "../../../components/form-label";
import { useSnackbar } from "../../../hooks/useSnackbar";
import SectionHeader from "../../../components/section-header";
import { actionUploadDocumentCategories, resetUploadDocumentCategoriesResponse } from "../../../store/documents";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../hooks/useAuth";
import { useBranch } from "../../../hooks/useBranch";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { getFormData } from "../../../utils";

export default function UploadFilePopup({ open, objData, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            existing_file_name: '',
            new_file_name: '',
            existing_file_notes: '',
            new_file_notes: '',
            existing_upload_file: '',
            new_upload_file: ''
        }
    });

    const inputRef = useRef();

    // store
    const { uploadDocumentCategories } = useSelector(state => state.AssetStore)

    const existingFileOption = [
        { image_url: '/assets/person1.png' },
        { image_url: '/assets/person2.png' },
    ]
    const [loading, setLoading] = useState(false)
    const [selectedTab, setSelectedTab] = useState("new");
    const [uploadedFiles, setUploadedFiles] = useState(null)

    const handleTabChange = (_, newValue) => setSelectedTab(newValue);
    //Extensions and File Size
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'xlsx', 'csv', 'pdf', 'docx'];
    const MAX_FILE_SIZE = 50 * 1024 * 1024;

    // Trigger file dialog
    const handleTriggerInput = () => {
        inputRef.current.click();
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
        setUploadedFiles({ file, is_new: 1, name: file.name });

        event.target.value = null;
    };

    //handle drag drop function
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (!isValidExtension(file.name)) {
                showSnackbar({ message: ` File "${file.name}" has an invalid file type.`, severity: "error" });
                return;
            }
            if (file.size > MAX_FILE_SIZE) {
                showSnackbar({ message: `File "${file.name}" exceeds the 50MB size limit.`, severity: "error" });
                return;
            }
            setUploadedFiles({ file, is_new: 1, name: file.name });
        }
    };

    //handle drag over
    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    /**
     * useEffect
     * @dependency : uploadDocumentCategories
     * @type : HANDLE API RESULT
     * @description : Handle the result of upload Document Categories API
     */
    useEffect(() => {
        if (uploadDocumentCategories && uploadDocumentCategories !== null) {
            dispatch(resetUploadDocumentCategoriesResponse())
            if (uploadDocumentCategories?.result === true) {
                handleClose('save')
                showSnackbar({ message: uploadDocumentCategories?.message, severity: "success" })
                setLoading(false)
                reset()
            } else {
                handleClose()
                setLoading(false)
                switch (uploadDocumentCategories?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetUploadDocumentCategoriesResponse())
                        showSnackbar({ message: uploadDocumentCategories?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: uploadDocumentCategories?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [uploadDocumentCategories])

    // handle submit function
    const onSubmit = data => {
        let updated = Object.assign({}, data)
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            updated.branch_uuid = branch?.currentBranch?.uuid
        }
        if(objData?.document_category_uuid && objData?.document_category_uuid !== null && objData?.document_group_uuid && objData?.document_group_uuid !== null){
            updated.document_category_uuid = objData?.document_category_uuid
            updated.document_group_uuid = objData?.document_group_uuid
        }
        const files = [];
        if (uploadedFiles && uploadedFiles instanceof File) {
            files.push({
                title: 'upload_file',
                data: uploadedFiles
            });
        }
        setLoading(true)
        const formData = getFormData(updated, files);
        dispatch(actionUploadDocumentCategories(formData))
    }

    return (
        <BootstrapDialog
            fullWidth
            maxWidth="md"
            open={open}
            scroll="paper"
            onClose={handleClose}
            sx={{
                "& .MuiDialog-paper": {
                    overflow: "visible",
                    borderRadius: "16px",
                    padding: theme.spacing(3),
                },
            }}
        >
            {/* Header */}
            <Stack flexDirection={'row'} justifyContent={'space-between'}>
                <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
                    <img alt={""} src={'/assets/pdf-file.png'} />
                    <Stack>
                        <TypographyComponent
                            fontSize={16}
                            fontWeight={500}
                            sx={{ color: theme.palette.grey[900] }}
                        >
                            Add New Document
                        </TypographyComponent>
                        <TypographyComponent
                            fontSize={14}
                            fontWeight={400}
                            sx={{ color: theme.palette.grey[700] }}
                        >
                            Upload a file for selected document category
                        </TypographyComponent>
                    </Stack>
                </Stack>
                <IconButton
                    onClick={() => {
                        handleClose()
                    }}
                >
                    <CloseIcon size={16} />
                </IconButton>
            </Stack>
            <Divider sx={{ mt: 2 }} />
            {/* Content */}
            <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    {/* --- Tabs --- */}
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        textColor="primary"
                        indicatorColor="primary"
                        sx={{
                            mb: 3,
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: 16,
                                color: theme.palette.grey[700],
                            },
                            "& .Mui-selected": {
                                color: theme.palette.primary.main,
                            },
                        }}
                    >
                        <Tab label="New File" value="new" />
                        <Tab label="Existing File" value="existing" />
                    </Tabs>

                    {/* --- Content Area --- */}
                    <Grid container spacing={3}>
                        {selectedTab === "new" ? (
                            // =========================
                            // TAB 1: Upload New File
                            // =========================
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Stack spacing={2}>
                                    <TypographyComponent
                                        fontSize={18}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[900] }}
                                    >
                                        Upload New File
                                    </TypographyComponent>

                                    {/* File Name */}
                                    <Controller
                                        name="new_file_name"
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 255,
                                                message: "Maximum length is 255 characters",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                value={field?.value}
                                                label={<FormLabel label="File Name" required={false} />}
                                                onChange={(e) => field.onChange(e)}
                                                placeholder="Enter file name"
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.new_file_name)}
                                                {...(errors.new_file_name && {
                                                    helperText: errors.new_file_name.message,
                                                })}
                                            />
                                        )}
                                    />

                                    {/* Notes */}
                                    <Controller
                                        name="new_file_notes"
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 255,
                                                message: "Maximum length is 255 characters",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                value={field?.value}
                                                label={<FormLabel label="Notes" required={false} />}
                                                onChange={(e) => field.onChange(e)}
                                                placeholder="Describe your changes"
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.new_file_notes)}
                                                {...(errors.new_file_notes && {
                                                    helperText: errors.new_file_notes.message,
                                                })}
                                            />
                                        )}
                                    />

                                    {/* Drag & Drop */}
                                    <SectionHeader title="Upload Files" show_progress={0} sx={{ marginTop: 2 }} />
                                    <Stack sx={{ borderRadius: '8px', border: `1px solid ${theme.palette.grey[300]}`, p: 2, marginTop: '-4px', pb: 2 }}>
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

                                    </Stack>
                                </Stack>
                            </Grid>
                        ) : (
                            // =========================
                            // TAB 2: Upload Existing File
                            // =========================
                            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                <Stack spacing={2}>
                                    <TypographyComponent
                                        fontSize={18}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[900] }}
                                    >
                                        Upload New Version of Existing File
                                    </TypographyComponent>

                                    {/* Existing File Dropdown */}
                                    <Controller
                                        name="existing_file_name"
                                        control={control}
                                        render={({ field }) => (
                                            <CustomTextField
                                                select
                                                fullWidth
                                                value={field?.value ?? ""}
                                                label={
                                                    <FormLabel label="Existing File Name" required={false} />
                                                }
                                                onChange={(event) => field.onChange(event)}
                                                SelectProps={{
                                                    displayEmpty: true,
                                                    IconComponent: ChevronDownIcon,
                                                    MenuProps: {
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 220,
                                                                scrollbarWidth: "thin",
                                                            },
                                                        },
                                                    },
                                                }}
                                                error={Boolean(errors.existing_file_name)}
                                                {...(errors.existing_file_name && {
                                                    helperText: errors.existing_file_name.message,
                                                })}
                                            >
                                                <MenuItem value="" disabled>
                                                    <em>Select existing file</em>
                                                </MenuItem>
                                                {existingFileOption &&
                                                    existingFileOption.map((option) => (
                                                        <MenuItem
                                                            key={option?.name}
                                                            value={option?.name}
                                                            sx={{
                                                                whiteSpace: "normal",
                                                                wordBreak: "break-word",
                                                                maxWidth: 550,
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {option?.image_url}
                                                        </MenuItem>
                                                    ))}
                                            </CustomTextField>
                                        )}
                                    />

                                    {/* Notes */}
                                    <Controller
                                        name="existing_file_notes"
                                        control={control}
                                        rules={{
                                            maxLength: {
                                                value: 255,
                                                message: "Maximum length is 255 characters",
                                            },
                                        }}
                                        render={({ field }) => (
                                            <CustomTextField
                                                fullWidth
                                                value={field?.value}
                                                label={<FormLabel label="Notes" required={false} />}
                                                onChange={(e) => field.onChange(e)}
                                                placeholder="Describe your changes"
                                                inputProps={{ maxLength: 255 }}
                                                error={Boolean(errors.existing_file_notes)}
                                                {...(errors.existing_file_notes && {
                                                    helperText: errors.existing_file_notes.message,
                                                })}
                                            />
                                        )}
                                    />

                                    {/* Drag & Drop */}
                                    <Box
                                        sx={{
                                            border: `1px dashed ${theme.palette.primary.main}`,
                                            borderRadius: "12px",
                                            p: 2,
                                            textAlign: "center",
                                            color: theme.palette.primary.main,
                                            cursor: "pointer",
                                            bgcolor: theme.palette.primary[100],
                                        }}
                                    >
                                        Drag & Drop file(s) to upload or{" "}
                                        <Typography
                                            component="span"
                                            sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
                                        >
                                            Browse
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Grid>
                        )}
                    </Grid>
                </DialogContent>
            </form>
            <Divider sx={{ my: 2 }} />
            {/* Footer */}
            <DialogActions sx={{ justifyContent: "flex-end" }}>
                <Button
                    sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                    onClick={() => {
                        handleClose()
                    }}
                    variant="outlined"
                >
                    Close
                </Button>
                <Button
                    sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                    onClick={() => {
                        handleSubmit(onSubmit)()
                    }}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Add File'}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}
