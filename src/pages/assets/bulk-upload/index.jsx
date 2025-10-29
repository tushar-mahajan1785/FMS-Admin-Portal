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
import { actionAssetBulkUpload, actionAssetBulkUploadCron, actionAssetUploadList, resetAssetBulkUploadCronResponse, resetAssetBulkUploadResponse, resetAssetUploadListResponse } from "../../../store/asset";
import DownloadIcon from "../../../assets/icons/DownloadIcon";
import TableError from "../../../components/table-error";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { getFormData } from "../../../utils";
import FullScreenLoader from "../../../components/fullscreen-loader";
import ListComponents from "../../../components/list-components";
import EmptyContent from "../../../components/empty_content";
import CustomChip from "../../../components/custom-chip";
import SyncIcon from '@mui/icons-material/Sync';
import AddAsset from "../add";
import DataActionHeader from "../../../components/data-action-header";
import * as XLSX from "xlsx";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import moment from "moment";
import TypographyComponent from "../../../components/custom-typography";
import { useBranch } from "../../../hooks/useBranch";
import { useNavigate } from "react-router-dom";

export default function AssetBulkUpload() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const navigate = useNavigate()

    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))

    // store
    const { assetBulkUpload, assetUploadList, assetBulkUploadCron } = useSelector(state => state.AssetStore)

    const columns = [
        { field: "asset_id", headerName: "Asset Id", flex: 0.1 },
        { field: "asset_description", headerName: "Asset Description", flex: 0.1 },
        { field: "make", headerName: "Asset Make", flex: 0.1 },
        { field: "model", headerName: "Asset Model", flex: 0.1 },
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
            headerName: 'Action',
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        {
                            params?.row?.fail && params?.row?.fail !== null ?
                                <Box sx={{ alignItems: "center" }}>
                                    {/* open add asset */}
                                    <Button size="small" color="primary" variant="contained" sx={{ textTransform: 'capitalize', background: theme.palette.primary[100], color: theme.palette.primary[600], columnGap: 0.5, fontSize: 12, borderRadius: 5 }} onClick={() => {
                                        setOpenAddAssetPopup(true)
                                        setObjAssetData(params?.row)
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
    const [assetData, setAssetData] = useState([])
    const [objAssetData, setObjAssetData] = useState(null)
    const [openAddAssetPopup, setOpenAddAssetPopup] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingRefresh, setLoadingRefresh] = useState(false)
    const [errorAssets, setErrorAssets] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null)

    /**
     * initial render
     */
    useEffect(() => {
        setLoadingRefresh(true)
        dispatch(actionAssetUploadList({
            branch_uuid: branch?.currentBranch?.uuid
        }))
        return () => {
            setLoading(false)
            setLoadingRefresh(false)
            setErrorAssets([])
            setAssetData([])
        }
    }, [])

    /**
     * useEffect
     * @dependency : assetUploadList
     * @type : HANDLE API RESULT
     * @description : Handle the result of asset Upload List API
     */
    useEffect(() => {
        if (assetUploadList && assetUploadList !== null) {
            dispatch(resetAssetUploadListResponse())
            if (assetUploadList?.result === true) {
                setLoadingRefresh(false)
                setAssetData(assetUploadList?.response)
            } else {
                setLoadingRefresh(false)
                setAssetData([])
                switch (assetUploadList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetUploadListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: assetUploadList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetUploadList])

    /**
       * useEffect
       * @dependency : assetBulkUpload
       * @type : HANDLE API RESULT
       * @description : Handle the result of asset Bulk Upload API
       */
    useEffect(() => {
        if (assetBulkUpload && assetBulkUpload !== null) {
            dispatch(resetAssetBulkUploadResponse())
            if (assetBulkUpload?.result === true) {
                reset()
                setLoading(false)
                showSnackbar({ message: 'The upload was successful. Please wait for some time for the data to fully synchronize and appear in the system.', severity: "success" })
                setLoadingRefresh(true)
                dispatch(actionAssetUploadList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
                setErrorAssets([])
            } else {
                setLoading(false)
                switch (assetBulkUpload?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        reset()
                        dispatch(resetAssetBulkUploadResponse())
                        if (assetBulkUpload?.response?.errors && assetBulkUpload?.response?.errors !== null && assetBulkUpload?.response?.errors.length > 0) {
                            setErrorAssets(assetBulkUpload?.response?.errors)
                        } else {
                            showSnackbar({ message: assetBulkUpload?.message, severity: "error" })
                        }

                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: assetBulkUpload?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetBulkUpload])

    /**
      * useEffect
      * @dependency : assetBulkUploadCron
      * @type : HANDLE API RESULT
      * @description : Handle the result of asset Bulk Upload Cron API
      */
    useEffect(() => {
        if (assetBulkUploadCron && assetBulkUploadCron !== null) {
            dispatch(resetAssetBulkUploadCronResponse())
            if (assetBulkUploadCron?.result === true) {
                setLoadingRefresh(true)
                dispatch(actionAssetUploadList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            } else {
                setLoadingRefresh(false)
                switch (assetBulkUploadCron?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAssetBulkUploadCronResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: assetBulkUploadCron?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [assetBulkUploadCron])

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

    // handle file extension function
    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    // handle file upload function
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

    // handle upload excel date to string function
    const excelDateToString = (num) => {
        // Excel date numbers start from 1900-01-01
        const date = new Date((num - 25569) * 86400 * 1000);
        return moment(date).format("DD-MM-YYYY");
    };

    // validate date regex
    const validators = {
        date: (value) => {
            if (value == null || value === "") return false;

            let str;

            if (typeof value === "number") {
                // Excel numeric date
                str = excelDateToString(value);
            } else {
                str = String(value).trim();
            }

            return moment(str, "DD-MM-YYYY", true).isValid();
        }
    };

    // handle validate file data function
    const validateFileData = (rows) => {
        const errors = [];

        rows.forEach((row, rowIndex) => {
            const rowNum = rowIndex + 2; // Header row is 1

            const dateFields = [
                "Manufacturing Date",
                "Installation Date",
                "Commissioning Date",
                "Warranty Start Date",
                "Warranty Expiry Date",
                "Amc Start Date",
                "Amc Expiry Date"
            ];

            dateFields.forEach((field) => {
                if (row[field] && !validators.date(row[field])) {
                    errors.push(`Row ${rowNum}: Invalid ${field} (must be in DD-MM-YYYY format)`);
                }
            });
        });

        return errors;
    };

    // handle submit function
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

            dispatch(actionAssetBulkUpload(objFormData));
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
                        {/* redirect asset list */}
                        <IconButton
                            onClick={() => {
                                navigate('/assets')
                            }}
                        >
                            <KeyboardBackspaceIcon fontSize={isMDDown ? "medium" : "large"} />
                        </IconButton>
                    </Stack>
                    <Stack>
                        <TypographyComponent fontSize={22}>Assets Bulk Upload</TypographyComponent>
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
                                    window.open('/upload-files/sample_asset.xlsx', '_blank')
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
                                                            readOnly: true, // Disable typing
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
                                                            field.onChange(e.target.files[0]) // Update field value with the selected file
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
                                <TypographyComponent fontSize={14} >ASSET ID should be unique</TypographyComponent>
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
                            errorAssets && errorAssets !== null && errorAssets.length > 0 ?
                                <Grid container spacing={2} sx={{ borderRadius: '16px', padding: '16px' }}>
                                    <TypographyComponent fontSize={18} fontWeight={400} sx={{ color: theme.palette.error[500] }}>
                                        Below are the errors for the records in your uploaded file:-
                                    </TypographyComponent>
                                    {<TableError data={errorAssets} maxHeight={500} headers={['Row', 'Asset ID', 'Issues']} />}
                                </Grid>
                                :
                                <></>
                        }
                        <Stack sx={{ px: 2 }}>
                            <DataActionHeader
                                count={assetData?.length && assetData?.length !== null && assetData?.length > 0 ? String(assetData?.length).padStart(2, '0') : 0}
                                countTitle="Pending Records"
                                loadingRefresh={loadingRefresh}
                                onSyncClick={() => {
                                    setLoadingRefresh(true)
                                    dispatch(actionAssetBulkUploadCron())
                                }}
                                onRefreshClick={() => {
                                    setLoadingRefresh(true)
                                    dispatch(actionAssetUploadList({
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
                                            assetData && assetData !== null && assetData.length > 0 ? (
                                                <React.Fragment>
                                                    <ListComponents
                                                        rows={assetData}
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
                openAddAssetPopup &&
                <AddAsset
                    open={openAddAssetPopup}
                    syncData={objAssetData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            dispatch(actionAssetUploadList({
                                branch_uuid: branch?.currentBranch?.uuid
                            }))
                        }
                        setOpenAddAssetPopup(false)
                        setObjAssetData(null)
                    }}
                />
            }
        </React.Fragment>
    );
}
