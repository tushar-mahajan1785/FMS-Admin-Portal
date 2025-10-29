/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import {
    Button,
    Stack,
    CircularProgress,
    Grid,
    Tooltip,
    InputAdornment,
    Box,
    IconButton,
    useMediaQuery,
    List,
    ListItem,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from "react";
import CustomTextField from '../../../components/text-field';
import FormLabel from '../../../components/form-label';
import {
    ERROR,
    IMAGES_SCREEN_NO_DATA,
    SERVER_ERROR,
    UNAUTHORIZED,
} from '../../../constants';
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import DownloadIcon from "../../../assets/icons/DownloadIcon";
import TableError from "../../../components/table-error";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getFormData } from "../../../utils";
import FullScreenLoader from "../../../components/fullscreen-loader";
import ListComponents from "../../../components/list-components";
import EmptyContent from "../../../components/empty_content";
import CustomChip from "../../../components/custom-chip";
import SyncIcon from '@mui/icons-material/Sync';
import { actionVendorBulkUpload, actionVendorBulkUploadCron, actionVendorUploadList, resetVendorBulkUploadCronResponse, resetVendorBulkUploadResponse, resetVendorUploadListResponse } from "../../../store/vendor";
import AddVendor from "../add";
import DataActionHeader from "../../../components/data-action-header";
import * as XLSX from "xlsx";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import TypographyComponent from "../../../components/custom-typography";
import { useBranch } from "../../../hooks/useBranch";
import { useNavigate } from "react-router-dom";

export default function VendorBulkUpload() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const navigate = useNavigate()

    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))

    // store
    const { vendorBulkUpload, vendorUploadList, vendorBulkUploadCron } = useSelector(state => state.vendorStore)

    const columns = [
        { field: "name", headerName: "Vendor Name", flex: 0.1 },
        { field: "vendor_id", headerName: "Vendor Id", flex: 0.1 },
        { field: "primary_contact_name", headerName: "Primary Contact Name", flex: 0.1 },
        {
            flex: 0.1,
            field: "primary_contact_email",
            headerName: "Email",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        <TypographyComponent
                            color={theme.palette.grey.primary}
                            fontSize={14}
                            fontWeight={400}
                            sx={{
                                py: '10px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 220,
                            }}
                            title={params.row.primary_contact_email}
                        >
                            {params.row.primary_contact_email}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: "status",
            headerName: "Status",
            renderCell: () => {
                return (
                    <React.Fragment><CustomChip text={'Pending'} colorName={'error'} /></React.Fragment>
                )
            }
        },
        {
            flex: 0.06,
            sortable: false,
            field: "",
            headerName: "Action",
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        {
                            params?.row?.fail && params?.row?.fail !== null ?
                                <Box sx={{ alignItems: "center" }}>
                                    {/* open add vendor */}
                                    <Button size="small" color="primary" variant="contained" sx={{ textTransform: 'capitalize', background: theme.palette.primary[100], color: theme.palette.primary[600], columnGap: 0.5, fontSize: 12, borderRadius: 5 }} onClick={() => {
                                        setOpenAddVendorPopup(true)
                                        setObjVendorData(params?.row)
                                    }}>
                                        <SyncIcon fontSize={"12"} />Sync Manually
                                    </Button>
                                </Box>
                                :
                                <></>
                        }

                    </React.Fragment>
                );
            },
        },
    ];

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // state
    const [vendorData, setVendorData] = useState([])
    const [objVendorData, setObjVendorData] = useState(null)
    const [openAddVendorPopup, setOpenAddVendorPopup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingRefresh, setLoadingRefresh] = useState(false)
    const [errorVendors, setErrorVendors] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null)

    /**
     * initial render
     */
    useEffect(() => {
        setLoadingRefresh(true)
        dispatch(actionVendorUploadList({
            branch_uuid: branch?.currentBranch?.uuid
        }))

        return () => {
            setLoading(false)
            setLoadingRefresh(false)
            setErrorVendors([])
            setVendorData([])
        }
    }, [])

    /**
     * useEffect
     * @dependency : vendorUploadList
     * @type : HANDLE API RESULT
     * @description : Handle the result of vendor Upload List API
     */
    useEffect(() => {
        if (vendorUploadList && vendorUploadList !== null) {
            dispatch(resetVendorUploadListResponse())
            if (vendorUploadList?.result === true) {
                setLoadingRefresh(false)
                setVendorData(vendorUploadList?.response)
            } else {
                setLoadingRefresh(false)
                setVendorData([])
                switch (vendorUploadList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorUploadListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: vendorUploadList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorUploadList])

    /**
    * useEffect
    * @dependency : vendorBulkUpload
    * @type : HANDLE API RESULT
    * @description : Handle the result of vendor Bulk Upload API
    */
    useEffect(() => {
        if (vendorBulkUpload && vendorBulkUpload !== null) {
            dispatch(resetVendorBulkUploadResponse())
            if (vendorBulkUpload?.result === true) {
                reset()
                setLoading(false)
                showSnackbar({ message: 'The upload was successful. Please wait for some time for the data to fully synchronize and appear in the system.', severity: "success" })
                setLoadingRefresh(true)
                dispatch(actionVendorUploadList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
                setErrorVendors([])
            } else {
                setLoading(false)
                switch (vendorBulkUpload?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        reset()
                        dispatch(resetVendorBulkUploadResponse())
                        if (vendorBulkUpload?.response?.errors && vendorBulkUpload?.response?.errors !== null && vendorBulkUpload?.response?.errors.length > 0) {
                            setErrorVendors(vendorBulkUpload?.response?.errors)
                        } else {
                            showSnackbar({ message: vendorBulkUpload?.message, severity: "error" })
                        }

                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: vendorBulkUpload?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorBulkUpload])

    /**
       * useEffect
       * @dependency : vendorBulkUploadCron
       * @type : HANDLE API RESULT
       * @description : Handle the result of vendor Bulk Upload Cron API
       */
    useEffect(() => {
        if (vendorBulkUploadCron && vendorBulkUploadCron !== null) {
            dispatch(resetVendorBulkUploadCronResponse())
            if (vendorBulkUploadCron?.result === true) {
                setLoadingRefresh(true)
                dispatch(actionVendorUploadList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            } else {
                setLoadingRefresh(false)
                switch (vendorBulkUploadCron?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetVendorBulkUploadCronResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: vendorBulkUploadCron?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [vendorBulkUploadCron])

    // handle validate file type function
    const validateFileType = file => {
        if (!file) {
            return true
        }
        const fileName = file.name
        if (!fileName) {// Return true if file name is undefined or null
        }
        const fileExtension = fileName.split('.').pop().toLowerCase()
        const allowedExtensions = ['xlsx', 'csv']
        if (!allowedExtensions.includes(fileExtension)) {
            return 'Only Excel files allowed'
        }

        return true // Check if file extension is allowed
    }

    /**
     * 
     * @param {*} filename handle file extension function
     * @returns 
     */
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    /**
     * 
     * @param {*} file handle file upload function
     * @returns 
     */
    const handleFileUpload = async (file) => {
        const extension = getFileExtension(file.name);
        const data = await file.arrayBuffer();
        let workbook;

        if (extension === "csv") {
            const text = await file.text();
            workbook = XLSX.read(text, { type: "string" });
        } else {
            workbook = XLSX.read(data, { type: "array" });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        return rows;
    };

    // validate regex
    const validators = {
        email: (value) => /^\S+@\S+\.\S+$/.test(value),
        contact: (value) => /^[0-9]{10,15}$/.test(value),
        number: (value) => !isNaN(value) && value !== "",
        string: (value) => typeof value === "string" && value.trim().length > 0,
        countryCode: (value) => /^\+\d{1,3}$/.test(value)
    };

    /**
     * 
     * @param {*} row handle validate escalation level function
     * @param {*} rowIndex 
     * @param {*} level 
     * @param {*} errors 
     */
    const validateEscalationLevel = (row, rowIndex, level, errors) => {
        const countryCode = row[`Escalation Level ${level} Country Code`];
        const contactNo = row[`Escalation Level ${level} Contact No`];
        const email = row[`Escalation Level ${level} Email`];

        // If any field is filled → validate
        if (countryCode || contactNo || email) {
            if (countryCode && !validators.countryCode(countryCode)) {
                errors.push(`Row ${rowIndex + 2}: Escalation Level ${level} Country Code must be entered as '+91 to display +91`);
            }
            if (contactNo && !validators.contact(contactNo)) {
                errors.push(`Row ${rowIndex + 2}: Escalation Level ${level} Invalid Contact No`);
            }
            if (email && !validators.email(email)) {
                errors.push(`Row ${rowIndex + 2}: Escalation Level ${level} Invalid Email`);
            }
        }
    };

    /**
     * 
     * @param {*} rows handle validate file data function
     * @returns 
     */
    const validateFileData = (rows) => {
        const errors = [];

        rows.forEach((row, rowIndex) => {
            // Contact Country Code (required)
            if (!validators.countryCode(row["Contact Country Code"])) {
                errors.push(`Row ${rowIndex + 2}: Contact Country Code field must be entered as '+91 to display +91`);
            }

            // Contact (required)
            if (!validators.contact(row["Contact"])) {
                errors.push(`Row ${rowIndex + 2}: Invalid Contact`);
            }

            // Primary Contact Email (required)
            if (!validators.email(row["Primary Contact Email"])) {
                errors.push(`Row ${rowIndex + 2}: Invalid Primary Contact Email`);
            }

            // Primary Contact Country Code (required)
            if (!validators.countryCode(row["Primary Contact Country Code"])) {
                errors.push(`Row ${rowIndex + 2}: Primary Contact Country Code field must be entered as '+91 to display +91`);
            }

            // Primary Contact No (required)
            if (!validators.contact(row["Primary Contact No"])) {
                errors.push(`Row ${rowIndex + 2}: Invalid Primary Contact No`);
            }

            // ✅ Escalation Levels 1–5
            for (let level = 1; level <= 5; level++) {
                validateEscalationLevel(row, rowIndex, level, errors);
            }
        });

        return errors;
    };

    /**
     * 
     * @param {*} data handle submit function
     * @returns 
     */
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            // Read Excel/CSV
            const rows = await handleFileUpload(data.file);

            // Validate
            const validationErrors = validateFileData(rows);

            if (validationErrors.length > 0) {
                setLoading(false);
                reset()
                setErrorMessage("Validation Failed:\n" + validationErrors.join("\n"))
                return;
            } else {
                setErrorMessage(null)
            }

            // ✅ If valid → continue
            let input = {
                client_id: branch?.currentBranch?.client_id && branch?.currentBranch?.client_id !== null ? branch?.currentBranch?.client_id : null,
                branch_uuid: branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null ? branch?.currentBranch?.uuid : null,
            };
            const images = [{ title: "file", data: data.file }];
            const objFormData = getFormData(input, images);

            dispatch(actionVendorBulkUpload(objFormData));
        } catch (error) {
            setLoading(false);
            console.log("File processing failed", error);
            showSnackbar({ message: 'Invalid file format. Please upload a valid Excel/CSV.', severity: "error" })
        }
    };

    return (
        <React.Fragment>
            <Stack
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                mb={3}>
                <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <Stack>
                        <IconButton
                            onClick={() => {
                                navigate('/vendors')
                            }}
                        >
                            <KeyboardBackspaceIcon fontSize={isMDDown ? "medium" : "large"} />
                        </IconButton>
                    </Stack>
                    <Stack>
                        <TypographyComponent fontSize={22}>Vendor Bulk Upload</TypographyComponent>
                    </Stack>
                </Stack>
                <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
                    <Stack>
                        <Tooltip title="Download Sample Excel" arrow>
                            <Button variant="outlined" aria-label="close" size="small"
                                sx={{
                                    textTransform: 'capitalize',
                                    color: theme.palette.primary[600], // icon color
                                    px: 1.5,
                                    py: 1,
                                    alignItems: 'center',
                                    border: `1px solid ${theme.palette.primary[600]}`,
                                    borderRadius: 1,
                                    '&:hover': {
                                        backgroundColor: theme.palette.primary[100]
                                    },
                                    boxShadow: 'none'
                                }} onClick={() => {
                                    window.open('/upload-files/sample_vendor.xlsx', '_blank')
                                }} >
                                <DownloadIcon size={10} stroke={theme.palette.primary[600]} />
                                <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                                    Sample Excel
                                </TypographyComponent>

                            </Button>
                        </Tooltip>
                    </Stack>
                </Stack>
            </Stack>
            {loading ? (
                <FullScreenLoader open={true} />
            ) :
                <Box sx={{
                    borderRadius: '12px',
                    height: '720px',
                    background: theme.palette.common.white,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '2px'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '2px'
                    }
                }}>
                    < Stack
                        sx={{
                            flexGrow: 1
                        }}
                    >
                        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={2} sx={{ borderRadius: '16px', paddingX: '16px', paddingTop: '16px' }}>
                                {/* file */}
                                <Grid size={{ xs: 12, sm: 12, md: 10, lg: 10, xl: 10 }}>
                                    <Controller
                                        name="file"
                                        control={control}
                                        rules={{
                                            required: 'Upload File is required',
                                            validate: {
                                                fileType: validateFileType
                                            }
                                        }}
                                        render={({ field }) => {
                                            const handleChange = (e) => {
                                                field.onChange(e)
                                            };

                                            return (
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                                    <CustomTextField
                                                        fullWidth
                                                        size="small"
                                                        label={<FormLabel label='Upload File' required={true} />}
                                                        name="file"
                                                        value={field.value ? field.value.name : ''}
                                                        error={Boolean(errors.file)}
                                                        {...(errors.file && { helperText: errors.file.message })}
                                                        InputProps={{
                                                            readOnly: true,
                                                            endAdornment: (
                                                                <InputAdornment position="end">
                                                                    <Button
                                                                        fullWidth
                                                                        size="small"
                                                                        variant="contained"
                                                                        sx={{ borderRadius: 5, textTransform: 'capitalize', width: '100px', background: theme.palette.primary[600], color: theme.palette.common.white }}
                                                                        onClick={() => document.getElementById('file').click()}
                                                                    >
                                                                        Browse
                                                                    </Button>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                    <input
                                                        type="file"
                                                        id="file"
                                                        name={"file"}
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => {
                                                            handleChange(e.target.files[0])
                                                            field.onChange(e.target.files[0])
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <Stack sx={{ my: 3.7 }}>
                                        <Tooltip title="Upload" arrow>
                                            <Button
                                                size="small" sx={{
                                                    textTransform: 'capitalize',
                                                    color: "#fff",
                                                    px: 1.5,
                                                    py: 1,
                                                    alignItems: 'center',
                                                    backgroundColor: theme.palette.primary[600],
                                                    borderRadius: 1,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.primary[600],
                                                    },
                                                    boxShadow: 'none'
                                                }}
                                                type='submit'
                                                variant='contained'
                                                disabled={loading}
                                            >
                                                <AddIcon sx={{ color: 'white', fontSize: { xs: '16x', sm: '16px' } }} />
                                                <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                                                    {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Upload'}
                                                </TypographyComponent>

                                            </Button>
                                        </Tooltip>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                        <List sx={{ listStyleType: "disc", pl: 4, m: 0, py: 0 }}>
                            <ListItem sx={{ display: "list-item", py: 0 }}>
                                <TypographyComponent fontSize={14}>VENDOR ID should be unique</TypographyComponent>
                            </ListItem>
                        </List>
                        {/* render error message */}
                        {
                            errorMessage && errorMessage !== null &&
                            <Stack sx={{ m: 2, alignItems: 'center' }} flexDirection={'row'} columnGap={1}>
                                <AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={16} />
                                <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.error[500] }}>{errorMessage}</TypographyComponent>
                            </Stack>
                        }
                        {/* render error list */}
                        {
                            errorVendors && errorVendors !== null && errorVendors.length > 0 ?
                                <Grid container spacing={2} sx={{ borderRadius: '16px', padding: '16px' }}>
                                    <TypographyComponent fontSize={18} fontWeight={400} sx={{ color: theme.palette.error[500] }}>
                                        Below are the errors for the records in your uploaded file:-
                                    </TypographyComponent>
                                    {<TableError data={errorVendors} maxHeight={500} headers={['Row', 'Vendor ID', 'Issues']} />}
                                </Grid>
                                :
                                <></>
                        }
                        <Stack sx={{ px: 2 }}>
                            <DataActionHeader
                                count={vendorData?.length && vendorData?.length !== null && vendorData?.length > 0 ? String(vendorData?.length).padStart(2, '0') : 0}
                                countTitle="Pending Records"
                                loadingRefresh={loadingRefresh}
                                onSyncClick={() => {
                                    setLoadingRefresh(true)
                                    dispatch(actionVendorBulkUploadCron())
                                }}
                                onRefreshClick={() => {
                                    setLoadingRefresh(true)
                                    dispatch(actionVendorUploadList({
                                        branch_uuid: branch?.currentBranch?.uuid
                                    }))
                                }}
                            />
                            {
                                loadingRefresh ?
                                    <Box
                                        sx={{
                                            height: 400,
                                            justifyContent: 'center',
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                        }}
                                    >
                                        <CircularProgress size={22} sx={{ color: theme.palette.primary[600] }} />
                                        <TypographyComponent
                                            fontSize={18}
                                            fontWeight={500}
                                            sx={{ mt: 2, color: theme.palette.grey[900] }}
                                        >
                                            Loading....
                                        </TypographyComponent>
                                    </Box>
                                    :
                                    <React.Fragment>
                                        {
                                            vendorData && vendorData !== null && vendorData.length > 0 ? (
                                                <React.Fragment>
                                                    <ListComponents
                                                        rows={vendorData}
                                                        columns={columns}
                                                        isCheckbox={false}
                                                    />
                                                </React.Fragment>
                                            ) : (
                                                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} message={'Your All data is Synced'} />
                                            )
                                        }
                                    </React.Fragment>
                            }
                        </Stack>
                    </Stack>
                </Box >
            }
            {
                openAddVendorPopup &&
                <AddVendor
                    open={openAddVendorPopup}
                    syncData={objVendorData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            dispatch(actionVendorUploadList({
                                branch_uuid: branch?.currentBranch?.uuid
                            }))
                        }
                        setOpenAddVendorPopup(false)
                        setObjVendorData(null)
                    }}
                />
            }
        </React.Fragment>
    );
}
