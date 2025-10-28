/* eslint-disable react-hooks/exhaustive-deps */
import {
    Drawer,
    Button,
    Stack,
    Divider,
    Grid,
    IconButton,
    CircularProgress,
    useTheme,
    Tooltip,
} from "@mui/material";
import FormHeader from "../../../components/form-header";
import SectionHeader from "../../../components/section-header";
import IdBadgeIcon from "../../../assets/icons/IdBadgeIcon";
import CalenderTimeIcon from "../../../assets/icons/CalenderTimeIcon";
import PhoneCallIcon from "../../../assets/icons/PhoneCallIcon";
import AddressIcon from "../../../assets/icons/AddressIcon";
import DeleteIcon from "../../../assets/icons/DeleteIcon";
import React, { useEffect, useMemo, useState } from "react";
import { actionDeleteEmployee, actionEmployeeList, resetDeleteEmployeeResponse } from "../../../store/employee";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "../../../assets/icons/EditIcon";
import EditEmployee from "../edit";
import AlertPopup from "../../../components/alert-confirm";
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon";
import { actionEmployeeDetails, resetEmployeeDetailsResponse } from "../../../store/employee";
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import FieldBox from "../../../components/field-box";
import { decrypt } from "../../../utils";
import EmptyContent from "../../../components/empty_content";
import TypographyComponent from "../../../components/custom-typography";
import ClientsIcon from "../../../assets/icons/ClientsIcon";

export default function EmployeeDetails({ open, objData, toggle, page }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()

    // store
    const { employeeDetails, deleteEmployee } = useSelector(state => state.employeeStore)
    const { clientBranchDetails } = useSelector(state => state.branchStore)
    const { additionalFieldsDetails } = useSelector(state => state.CommonStore)

    // state
    const [openViewDeleteEmployeePopup, setOpenViewDeleteEmployeePopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [openViewEditEmployeePopup, setOpenViewEditEmployeePopup] = useState(false)
    const [viewEmployeeData, setViewEmployeeData] = useState(null)
    const [employeeDetailData, setEmployeeDetailData] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            setLoadingDetail(true)
            setViewLoadingDelete(false)
            if (objData?.id && objData?.id !== null) {
                dispatch(actionEmployeeDetails({ id: objData?.id }))
            }
        }
    }, [open])

    // Prepare merged additional fields
    const mergedAdditionalFields = useMemo(() => {
        const fields = additionalFieldsDetails?.response?.fields || []
        const values = employeeDetailData?.additional_fields || []

        // Merge by `key`
        const merged = fields.map(field => {
            const matchedValue = values.find(v => v.key === field.key)
            return {
                ...field,
                value: matchedValue?.value || "", // get value from vendor data
            }
        })

        // Also include any vendor fields not present in fields array
        values.forEach(v => {
            if (!merged.find(f => f.key === v.key)) {
                merged.push(v)
            }
        })

        // Filter out deleted
        return merged.filter(f => f.is_deleted !== 1)
    }, [additionalFieldsDetails, employeeDetailData])

    /**
    * useEffect
    * @dependency : employeeDetails
    * @type : HANDLE API RESULT
    * @description : Handle the result of employee Details API
    */
    useEffect(() => {
        if (employeeDetails && employeeDetails !== null) {
            dispatch(resetEmployeeDetailsResponse())
            if (employeeDetails?.result === true) {
                setEmployeeDetailData(employeeDetails?.response)
                setLoadingDetail(false)
            } else {
                setLoadingDetail(false)
                setEmployeeDetailData(null)
                switch (employeeDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeDetailsResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: employeeDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeDetails])

    /**
    * useEffect
    * @dependency : deleteEmployee
    * @type : HANDLE API RESULT
    * @description : Handle the result of delete Employee API
    */
    useEffect(() => {
        if (deleteEmployee && deleteEmployee !== null) {
            dispatch(resetDeleteEmployeeResponse())
            if (deleteEmployee?.result === true) {
                setOpenViewDeleteEmployeePopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteEmployee?.message, severity: "success" })

                handleClose()
                dispatch(actionEmployeeList({
                    branch_uuid: clientBranchDetails?.response?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
            } else {
                setViewLoadingDelete(false)
                switch (deleteEmployee?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteEmployeeResponse())
                        toast.dismiss()
                        showSnackbar({ message: deleteEmployee?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: deleteEmployee?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteEmployee])

    // handle close function
    const handleClose = () => {
        toggle()
    }

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: 1100 } } }}
            >
                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<ClientsIcon stroke={theme.palette.primary[600]} size={18} />}
                        title="View Employee Details"
                        subtitle="View and manage employee information"
                        actions={[
                            hasPermission("EMPLOYEE_DELETE") && (
                                // open delete employee popup
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                id: employeeDetailData.id,
                                                title: `Delete Employee`,
                                                text: `Are you sure you want to delete this employee? This action cannot be undone.`
                                            }
                                            setViewEmployeeData(details)
                                            setOpenViewDeleteEmployeePopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                            hasPermission("EMPLOYEE_EDIT") && (
                                // open edit employee
                                <Tooltip title="Edit" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            setViewEmployeeData(employeeDetailData)
                                            setOpenViewEditEmployeePopup(true)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    {loadingDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : employeeDetailData && employeeDetailData !== null ? (
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

                            <SectionHeader title="Personal Information" progress={100} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* employee id */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Employee ID" value={employeeDetailData?.employee_id} icon={<IdBadgeIcon stroke1={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* employee name */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Employee Name" value={employeeDetailData?.name} />
                                </Grid>
                                {/* age */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Age" value={employeeDetailData?.age} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Employment Details" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* employee type */}
                                {
                                    clientBranchDetails?.response?.role_type_flag == 1 ?
                                        <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                                            <FieldBox label="Employee Type" value={employeeDetailData?.type} />
                                        </Grid>
                                        :
                                        <></>
                                }
                                {/* employee role */}
                                <Grid size={{ xs: 12, sm: 6, md: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4, lg: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4, xl: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4 }}>
                                    <FieldBox label="Employee Role" value={employeeDetailData?.role} />
                                </Grid>
                                {/* employee company */}
                                <Grid size={{ xs: 12, sm: 6, md: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4, lg: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4, xl: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4 }}>
                                    <FieldBox label="Employee Company" value={employeeDetailData?.company_name} />
                                </Grid>
                                {/* manager name */}
                                <Grid size={{ xs: 12, sm: 6, md: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4, lg: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4, xl: clientBranchDetails?.response?.role_type_flag == 1 ? 3 : 4 }}>
                                    <FieldBox label="Manager Name" value={employeeDetailData?.manager_name} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Personal Information" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* employee email */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox label="Employee Email" value={employeeDetailData?.email && employeeDetailData?.email !== null ? decrypt(employeeDetailData?.email) : ''} icon={<CalenderTimeIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* employee contact */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox
                                        label="Employee Contact"
                                        value={
                                            employeeDetailData?.contact_country_code && employeeDetailData?.contact_country_code !== null &&
                                                employeeDetailData?.contact && employeeDetailData?.contact !== null ?
                                                `${employeeDetailData?.contact_country_code}${decrypt(employeeDetailData?.contact)}` : ''
                                        }
                                        icon={<PhoneCallIcon stroke1={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* employee alternate contact */}
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                    <FieldBox
                                        label="Alternate Contact"
                                        value={
                                            employeeDetailData?.alternate_contact_country_code && employeeDetailData?.alternate_contact_country_code !== null &&
                                                employeeDetailData?.alternate_contact && employeeDetailData?.alternate_contact !== null ?
                                                `${employeeDetailData?.alternate_contact_country_code}${decrypt(employeeDetailData?.alternate_contact)}` : ''
                                        }
                                        icon={<PhoneCallIcon />} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Address & Status" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {/* Address */}
                                <Grid size={{ xs: 12, sm: 7, md: 7, lg: 7, xl: 7 }}>
                                    <FieldBox label="Address" value={employeeDetailData?.address} icon={<AddressIcon stroke={theme.palette.primary[600]} />} />
                                </Grid>
                                {/* asset status */}
                                <Grid size={{ xs: 12, sm: 5, md: 5, lg: 5, xl: 5 }}>
                                    <FieldBox label="Asset Status" value={employeeDetailData?.asset_status} />
                                </Grid>
                            </Grid>
                            <SectionHeader title="Additional Fields" progress={100} sx={{ marginTop: 2 }} />
                            <Grid container spacing={'2px'} sx={{ backgroundColor: theme.palette.primary[25], borderRadius: '16px', padding: '10px', marginBottom: 2 }}>
                                {
                                    mergedAdditionalFields && mergedAdditionalFields.length > 0 ? (
                                        mergedAdditionalFields.map((obj, idx) => (
                                            <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 4, xl: 4 }}>
                                                <FieldBox label={obj?.label} value={obj?.value} />
                                            </Grid>
                                        ))
                                    ) : (
                                        <Stack sx={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <TypographyComponent sx={{ fontSize: 16, fontWeight: 400, color: theme.palette.grey[600], py: 2, textAlign: 'center' }}>
                                                No Additional Fields
                                            </TypographyComponent>
                                        </Stack>
                                    )
                                }
                            </Grid>
                        </Stack>

                    ) : (
                        <Stack sx={{ height: '100%' }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Details Found'} subTitle={''} />
                        </Stack>
                    )}

                    <Divider sx={{ m: 2 }} />
                    <Stack sx={{ p: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
                        <Button
                            sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                            onClick={handleClose}
                            variant='contained'
                        >
                            Close
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            {
                openViewEditEmployeePopup &&
                <EditEmployee
                    open={openViewEditEmployeePopup}
                    objData={viewEmployeeData}
                    toggle={(data) => {
                        if (data && data !== null && data === 'save') {
                            if (employeeDetailData?.id && employeeDetailData?.id !== null) {
                                dispatch(actionEmployeeDetails({ id: employeeDetailData?.id }))
                                dispatch(actionEmployeeList({
                                    branch_uuid: clientBranchDetails?.response?.uuid,
                                    page: page,
                                    limit: LIST_LIMIT
                                }))
                            }
                        }
                        setOpenViewEditEmployeePopup(false)
                        setViewEmployeeData(null)
                    }}
                />
            }
            {
                openViewDeleteEmployeePopup &&
                <AlertPopup
                    open={openViewDeleteEmployeePopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewEmployeeData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenViewDeleteEmployeePopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (employeeDetailData?.id && employeeDetailData?.id !== null) {
                                dispatch(actionDeleteEmployee({
                                    id: employeeDetailData?.id
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress size={20} color="white" /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment>
    );
}
