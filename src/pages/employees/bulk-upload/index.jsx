/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
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
import { useEffect, useState } from "react";
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
import { actionEmployeeBulkUpload, resetEmployeeBulkUploadResponse, actionEmployeeBulkUploadList, resetEmployeeBulkUploadListResponse, actionEmployeeBulkUploadCron, resetEmployeeBulkUploadCronResponse } from "../../../store/employee";
import { getFormData } from "../../../utils";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import FullScreenLoader from "../../../components/fullscreen-loader";
import ListComponents from "../../../components/list-components";
import AddEmployee from "../add";
import SyncIcon from '@mui/icons-material/Sync';
import EmptyContent from "../../../components/empty_content";
import CustomChip from "../../../components/custom-chip";
import DataActionHeader from "../../../components/data-action-header";
import * as XLSX from "xlsx";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { actionBranchData } from "../../../store/branch";
import TypographyComponent from "../../../components/custom-typography";

export default function EmployeeBulkUpload() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))

    // store
    const { employeeBulkUpload, employeeBulkUploadList, employeeBulkUploadCron } = useSelector(state => state.employeeStore)
    const { clientBranchDetails, branchData } = useSelector(state => state.branchStore)

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm();

    // state
    const [loading, setLoading] = useState(false)
    const [errorEmployees, setErrorEmployees] = useState([]);
    const [employeeOptions, setEmployeeOptions] = useState([])
    const [employeeData, setEmployeeData] = useState(null)
    const [openAddEmployeePopup, setOpenAddEmployeePopup] = useState(false)
    const [loadingRefresh, setLoadingRefresh] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const columns = [
        { field: "name", headerName: "Employee Name", flex: 0.1 },
        { field: "employee_id", headerName: "Employee Id", flex: 0.1 },
        { field: "contact", headerName: "Contact", flex: 0.1 },
        { field: "role", headerName: "Employee Role", flex: 0.1 },
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
                                    {/* open add employee to sync manually */}
                                    <Button
                                        size="small"
                                        color="primary"
                                        variant="contained"
                                        sx={{
                                            extTransform: 'capitalize',
                                            background: theme.palette.primary[100],
                                            color: theme.palette.primary[600],
                                            columnGap: 0.5, fontSize: 12,
                                            borderRadius: 5
                                        }}
                                        onClick={() => {
                                            setOpenAddEmployeePopup(true)
                                            setEmployeeData(params?.row)
                                        }}
                                    >
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

    /**
       * initial API call
       */
    useEffect(() => {
        setLoadingRefresh(true)
        dispatch(actionEmployeeBulkUploadList({
            branch_uuid: clientBranchDetails?.response?.uuid
        }))
        return () => {
            setLoading(false)
            setLoadingRefresh(false)
            setErrorEmployees([])
            setEmployeeOptions([])
        }
    }, [])

    /**
      * useEffect
      * @dependency : employeeBulkUploadCron
      * @type : HANDLE API RESULT
      * @description : Handle the result of employee Bulk Upload Cron API
      */
    useEffect(() => {
        if (employeeBulkUploadCron && employeeBulkUploadCron !== null) {
            dispatch(resetEmployeeBulkUploadCronResponse())
            if (employeeBulkUploadCron?.result === true) {
                setLoadingRefresh(true)
                dispatch(actionEmployeeBulkUploadList({
                    branch_uuid: clientBranchDetails?.response?.uuid
                }))
            } else {
                setLoadingRefresh(false)
                switch (employeeBulkUploadCron?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeBulkUploadCronResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: employeeBulkUploadCron?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeBulkUploadCron])

    /**
      * useEffect
      * @dependency : employeeBulkUploadList
      * @type : HANDLE API RESULT
      * @description : Handle the result of employee Bulk Upload List API
      */
    useEffect(() => {
        if (employeeBulkUploadList && employeeBulkUploadList !== null) {
            dispatch(resetEmployeeBulkUploadListResponse())
            if (employeeBulkUploadList?.result === true) {
                setLoadingRefresh(false)
                setEmployeeOptions(employeeBulkUploadList?.response)
            } else {
                setLoadingRefresh(false)
                setEmployeeOptions([])
                switch (employeeBulkUploadList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeBulkUploadListResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: employeeBulkUploadList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeBulkUploadList])

    /**
      * useEffect
      * @dependency : employeeBulkUpload
      * @type : HANDLE API RESULT
      * @description : Handle the result of employee Bulk Upload API
      */
    useEffect(() => {
        if (employeeBulkUpload && employeeBulkUpload !== null) {
            dispatch(resetEmployeeBulkUploadResponse())
            if (employeeBulkUpload?.result === true) {
                reset()
                setLoading(false)
                showSnackbar({ message: 'The upload was successful. Please wait for some time for the data to fully synchronize and appear in the system.', severity: "success" })
                setErrorEmployees([])
                setLoadingRefresh(true)
                dispatch(actionEmployeeBulkUploadList({
                    branch_uuid: clientBranchDetails?.response?.uuid
                }))
            } else {
                setLoading(false)
                switch (employeeBulkUpload?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        reset()
                        dispatch(resetEmployeeBulkUploadResponse())
                        if (employeeBulkUpload?.response?.errors && employeeBulkUpload?.response?.errors !== null && employeeBulkUpload?.response?.errors.length > 0) {
                            setErrorEmployees(employeeBulkUpload?.response?.errors)
                        } else {
                            showSnackbar({ message: employeeBulkUpload?.message, severity: "error" })
                        }

                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: employeeBulkUpload?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeBulkUpload])

    // handle validate file function
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

    // fields validation regex
    const validators = {
        email: (value) => /^\S+@\S+\.\S+$/.test(value),
        contact: (value) => /^[0-9]{10,15}$/.test(value),
        number: (value) => !isNaN(value) && value !== "",
        string: (value) => typeof value === "string" && value.trim().length > 0,
        countryCode: (value) => /^\+\d{1,3}$/.test(value)
    };

    // handle validate file data function
    const validateFileData = (rows) => {
        const errors = [];

        rows.forEach((row, rowIndex) => {
            // Email (required)
            if (!validators.email(row["Email"])) {
                errors.push(`Row ${rowIndex + 2}: Invalid Email`);
            }

            // Contact Country Code (required)
            if (!validators.countryCode(row["Contact Country Code"])) {
                errors.push(`Row ${rowIndex + 2}: Contact Country Code field must be entered as '+91 to display +91`);
            }

            // Contact (required)
            if (!validators.contact(row["Contact"])) {
                errors.push(`Row ${rowIndex + 2}: Invalid Contact`);
            }

            // Alternate Contact (optional pair check)
            const altCode = row["Alternate Contact Country Code"];
            const altContact = row["Alternate Contact"];

            if (altCode || altContact) {
                // If user provided one, both must be valid
                if (altCode && !validators.countryCode(altCode)) {
                    errors.push(`Row ${rowIndex + 2}: Contact Country Code field must be entered as '+91 to display +91`);
                }
                if (altContact && !validators.contact(altContact)) {
                    errors.push(`Row ${rowIndex + 2}: Invalid Alternate Contact`);
                }
            }
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
                client_id: clientBranchDetails?.response?.client_id && clientBranchDetails?.response?.client_id !== null ? clientBranchDetails?.response?.client_id : null,
                branch_uuid: clientBranchDetails?.response?.uuid && clientBranchDetails?.response?.uuid !== null ? clientBranchDetails?.response?.uuid : null,
            };
            const images = [{ title: "file", data: data.file }];
            const objFormData = getFormData(input, images);

            dispatch(actionEmployeeBulkUpload(objFormData));
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
                    <Stack >
                        <IconButton
                            onClick={() => {
                                let branchObj = Object.assign({}, branchData)
                                branchObj.selected_menu = "Employee"
                                branchObj.redirect_menu = "Employee"
                                dispatch(actionBranchData(branchObj))
                            }}
                        >
                            <KeyboardBackspaceIcon fontSize={isMDDown ? "medium" : "large"} />
                        </IconButton>
                    </Stack>
                    <Stack>
                        <TypographyComponent fontSize={22}>Employee Bulk Upload</TypographyComponent>
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
                                    window.open('/upload-files/sample_employee.xlsx', '_blank')
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
                <Box sx={{ height: '720px', background: theme.palette.common.white }}>
                    < Stack
                        sx={{
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
                                <TypographyComponent fontSize={14} >Employee ID should be unique</TypographyComponent>
                            </ListItem>
                        </List>
                        {/* Render error message */}
                        {
                            errorMessage && errorMessage !== null &&
                            <Stack sx={{ m: 2, alignItems: 'center' }} flexDirection={'row'} columnGap={1}>
                                <AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" size={16} />
                                <TypographyComponent fontSize={18} fontWeight={400} sx={{ color: theme.palette.error[500] }}>{errorMessage}</TypographyComponent>
                            </Stack>
                        }
                        {/* Render error list */}
                        {
                            errorEmployees && errorEmployees !== null && errorEmployees.length > 0 ?
                                <Grid container spacing={2} sx={{ borderRadius: '16px', padding: '16px' }}>
                                    <TypographyComponent fontSize={18} fontWeight={400} sx={{ color: theme.palette.error[500] }}>
                                        Below are the errors for the records in your uploaded file:-
                                    </TypographyComponent>
                                    {<TableError data={errorEmployees} maxHeight={500} headers={['Row', 'Employee ID', 'Issues']} />}
                                </Grid>
                                :
                                <></>
                        }
                        <Stack sx={{ px: 2 }}>
                            <DataActionHeader
                                count={employeeOptions?.length && employeeOptions?.length !== null && employeeOptions?.length > 0 ? String(employeeOptions?.length).padStart(2, '0') : 0}
                                countTitle="Pending Records"
                                loadingRefresh={loadingRefresh}
                                onSyncClick={() => {
                                    setLoadingRefresh(true)
                                    dispatch(actionEmployeeBulkUploadCron())
                                }}
                                onRefreshClick={() => {
                                    setLoadingRefresh(true)
                                    dispatch(actionEmployeeBulkUploadList({
                                        branch_uuid: clientBranchDetails?.response?.uuid
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
                                            employeeOptions && employeeOptions !== null && employeeOptions.length > 0 ? (
                                                <React.Fragment>
                                                    <ListComponents
                                                        rows={employeeOptions}
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
                </Box>
            }
            {
                openAddEmployeePopup &&
                <AddEmployee
                    open={openAddEmployeePopup}
                    syncData={employeeData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            dispatch(actionEmployeeBulkUploadList({
                                branch_uuid: clientBranchDetails?.response?.uuid
                            }))
                        }
                        setOpenAddEmployeePopup(false)
                        setEmployeeData(null)
                    }}
                />
            }
        </React.Fragment>
    );
}
