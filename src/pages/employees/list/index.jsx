/* eslint-disable react-hooks/exhaustive-deps */
import { Stack, Box, Tooltip, IconButton, useTheme, InputAdornment, Button } from "@mui/material";
import SearchIcon from "../../../assets/icons/SearchIcon";
import AddEmployee from "../add";
import React, { useEffect, useState } from "react";
import { actionEmployeeList, resetEmployeeListResponse } from "../../../store/employee";
import { useDispatch, useSelector } from "react-redux";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED, LIST_LIMIT } from "../../../constants";
import toast from "react-hot-toast";
import FullscreenLoader from '../../../components/fullscreen-loader';
import EmptyContent from "../../../components/empty_content";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import EyeIcon from "../../../assets/icons/EyeIcon";
import EmployeeDetails from "../view";
import GetCountComponent from "../../../components/get-count-component";
import { ListHeaderContainer, ListHeaderRightSection, SearchInput } from "../../../components/common";
import { decrypt } from "../../../utils";
import EmployeeWisePermissions from "../employee-permission";
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import AdditionalFieldsPopup from "../../../components/additional-fields";
import { actionAdditionalFieldsDetails, resetAdditionalFieldsDetailsResponse } from "../../../store/common";
import { actionMasterCountryCodeList } from "../../../store/vendor";
import TypographyComponent from "../../../components/custom-typography";
import ServerSideListComponents from "../../../components/server-side-list-component";
import { useNavigate } from "react-router-dom";
import { useBranch } from "../../../hooks/useBranch";
import DownloadIcon from "../../../assets/icons/DownloadIcon";
import * as XLSX from "xlsx";
import EmployeeGuidelinePopup from "../guideline-popup";
import InfoOutlineIcon from '@mui/icons-material/InfoOutline';

export default function EmployeeList() {
    const { showSnackbar } = useSnackbar()
    const theme = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const branch = useBranch()
    const { logout, hasPermission } = useAuth()

    // store
    const { employeeList } = useSelector(state => state.employeeStore)


    // state
    const [employeeOptions, setEmployeeOptions] = useState([])
    const [employeeOriginalData, setEmployeeOriginalData] = useState([])
    const [openAddEmployeePopup, setOpenAddEmployeePopup] = useState(false)
    const [employeeData, setEmployeeData] = useState(null)
    const [loadingList, setLoadingList] = useState(false)
    const [openEmployeeDetailsPopup, setOpenEmployeeDetailsPopup] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [employeeDetailData, setEmployeeDetailData] = useState(null)
    const [openEmployeePermissionPopup, setOpenEmployeePermissionPopup] = useState(false)
    const [openEmployeeAdditionalFieldsPopup, setOpenEmployeeAdditionalFieldsPopup] = useState(false)
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [isDownload, setIsDownload] = useState(false)
    const [openEmployeeGuidelinePopup, setOpenEmployeeGuidelinePopup] = useState(false)

    const columns = [
        { field: "name", headerName: "Employee Name", flex: 0.1 },
        { field: "employee_id", headerName: "Employee Id", flex: 0.1 },
        {
            flex: 0.1,
            field: "email",
            headerName: "Employee Email",
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
                            title={decrypt(params.row.email)}
                        >
                            {decrypt(params.row.email)}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        {
            flex: 0.1,
            field: "contact",
            headerName: "Contact",
            renderCell: (params) => {
                return (
                    <Stack sx={{ height: '100%', justifyContent: 'center' }}>
                        <TypographyComponent color={theme.palette.grey.primary} fontSize={14} fontWeight={400} sx={{ py: '10px' }}>
                            {`${params.row.contact_country_code}${decrypt(params.row.contact)}`}
                        </TypographyComponent>
                    </Stack>
                )
            }
        },
        { field: "role", headerName: "Employee Role", flex: 0.1 },
        {
            flex: 0.04,
            sortable: false,
            field: "",
            headerName: "Action",
            renderCell: (params) => {
                return (
                    <React.Fragment>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            {
                                hasPermission('EMPLOYEE_DETAILS') ?
                                    <Tooltip title="Details" followCursor placement="top">
                                        {/* open employee details */}
                                        <IconButton
                                            onClick={() => {
                                                setEmployeeData(params.row)
                                                setOpenEmployeeDetailsPopup(true)
                                            }}
                                        >
                                            <EyeIcon stroke={'#181D27'} />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <></>
                            }
                            {
                                hasPermission('EMPLOYEE_PERMISSIONS_UPDATE') && params?.row?.type !== "Technician" ?
                                    <Tooltip title="EmployeeWise Permission" followCursor placement="top">
                                        {/* open employee wise permission */}
                                        <IconButton
                                            onClick={() => {
                                                setEmployeeDetailData(params.row)
                                                setOpenEmployeePermissionPopup(true)
                                            }}
                                        >
                                            <HttpsOutlinedIcon fontSize={'small'} sx={{ color: '#535862' }} />
                                        </IconButton>
                                    </Tooltip>
                                    :
                                    <></>
                            }
                        </Box>
                    </React.Fragment>
                );
            },
        },
    ];

    /**
     * initial render
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionMasterCountryCodeList())
            setLoadingList(true)
            dispatch(actionAdditionalFieldsDetails({
                type: 'Employee',
                branch_uuid: branch?.currentBranch?.uuid,
                client_uuid: branch?.currentBranch?.client_uuid,
            }))
        }

        return () => {
            dispatch(resetAdditionalFieldsDetailsResponse())
        }

    }, [branch?.currentBranch?.uuid])

    // employee list API call
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && page && page !== null) {
            dispatch(actionEmployeeList({
                branch_uuid: branch?.currentBranch?.uuid,
                page: page,
                limit: LIST_LIMIT
            }))
        }
    }, [branch?.currentBranch?.uuid, page])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
     * Filter the employee
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (employeeOriginalData && employeeOriginalData !== null && employeeOriginalData.length > 0) {
                var filteredData = employeeOriginalData.filter(
                    item =>
                        (item?.name && item?.name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.employee_id && item?.employee_id.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.type && item?.type.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.email && decrypt(item?.email).toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.contact && decrypt(item?.contact).toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.role && item?.role.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.company_name && item?.company_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.manager_name && item?.manager_name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setEmployeeOptions(filteredData)
                } else {
                    setEmployeeOptions([])
                }
            }
        } else {
            setEmployeeOptions(employeeOriginalData)
        }
    }, [searchQuery])

    /**
    * useEffect
    * @dependency : employeeList
    * @type : HANDLE API RESULT
    * @description : Handle the result of employee List API
    */
    useEffect(() => {
        if (employeeList && employeeList !== null) {
            dispatch(resetEmployeeListResponse())
            if (employeeList?.result === true) {
                setEmployeeOptions(employeeList?.response?.employees)
                setEmployeeOriginalData(employeeList?.response?.employees)
                setLoadingList(false)
                setTotal(employeeList?.response?.total)
                if (isDownload === true) {
                    exportToExcel(employeeList?.response?.employees);
                }
            } else {
                setLoadingList(false)
                setEmployeeOptions([])
                setEmployeeOriginalData[[]]
                switch (employeeList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: employeeList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeList])

    const exportToExcel = (data) => {
        // ?? Prepare simplified data for export
        const exportData = data.map(employee => ({
            "Employee ID": employee?.employee_id,
            "Employee Name": employee?.name,
            "Email": employee?.email && employee?.email !== null ? decrypt(employee?.email) : '',
            "Contact": employee?.contact && employee?.contact !== null && employee?.contact_country_code && employee?.contact_country_code !== null ? `${employee?.contact_country_code}${decrypt(employee?.contact)}` : '',
            "Alternate Contact": employee?.alternate_contact && employee?.alternate_contact !== null && employee?.alternate_contact_country_code && employee?.alternate_contact_country_code !== null ? `${employee?.alternate_contact_country_code}${decrypt(employee?.alternate_contact)}` : '',
            "Employee Type": employee?.type,
            "Role": employee?.role,
            "Age": employee?.age,
            "Address": employee?.address,
            "Company Name": employee?.company_name,
            "Client Name": employee?.client_name,
            "Branch Name": employee?.branch_name,
            "Status": employee?.asset_status,
        }));

        // ?? Create worksheet and workbook
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Employee");

        // ?? Trigger download
        XLSX.writeFile(workbook, "Employee.xlsx");
        setIsDownload(false)
    }

    return <React.Fragment>
        <Stack
            flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            mb={3}>
            <Stack direction={'row'} alignItems={'center'}>
                <TypographyComponent
                    color={theme.palette.grey.primary}
                    fontSize={24}
                    fontWeight={500}
                >
                    Employee
                </TypographyComponent>
                <Tooltip title="Guideline" followCursor placement="top">
                    <IconButton
                        onClick={() => {
                            setOpenEmployeeGuidelinePopup(true)
                        }}
                    >
                        <InfoOutlineIcon />
                    </IconButton>
                </Tooltip>
            </Stack>
            <GetCountComponent
                countData={{ title1: "Total", title2: "Employee", value: total && total !== null ? String(total).padStart(2, '0') : 0 }}
                actionData={{
                    buttonLabel1: "Add New", buttonLabel2: "Employee", onClick: () => {
                        // open add employee
                        setOpenAddEmployeePopup(true)
                    }
                }}
                bulkAction={{
                    bulkButtonLabel1: "Employee", bulkButtonLabel2: "Bulk Upload", onClick: () => {
                        // redirect bulk upload
                        navigate('bulk-upload')

                    }
                }}
                permissionKey={'EMPLOYEE_ADD'}
                bulkPermission={'EMPLOYEE_BULK_UPLOAD'}
                additionalPermission={'EMPLOYEE_ADDITIONAL_FIELDS'}
            />
        </Stack>
        <Box sx={{ borderRadius: '12px', height: '720px', background: theme.palette.common.white }}>
            <ListHeaderContainer>
                <ListHeaderRightSection>
                    <SearchInput
                        id="search-assets"
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        onChange={handleSearchQueryChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ mr: 1 }}>
                                    <SearchIcon stroke={theme.palette.grey[500]} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    {
                        employeeOptions && employeeOptions !== null && employeeOptions.length > 0 && (
                            <Button
                                variant="outlined"
                                color={theme.palette.common.white} // text color
                                sx={{
                                    border: `1px solid ${theme.palette.grey[300]}`,
                                    textTransform: 'capitalize',
                                    px: 4,
                                    width: 150
                                }}
                                startIcon={<DownloadIcon />}
                                onClick={() => {
                                    setIsDownload(true)
                                    dispatch(actionEmployeeList({
                                        branch_uuid: branch?.currentBranch?.uuid,
                                        key: 'All'
                                    }))
                                }}
                            >
                                Export
                            </Button>
                        )
                    }
                </ListHeaderRightSection>
            </ListHeaderContainer>
            {loadingList ? (
                <FullscreenLoader open={true} />
            ) : employeeOptions && employeeOptions !== null && employeeOptions.length > 0 ? (
                <ServerSideListComponents
                    rows={employeeOptions}
                    columns={columns}
                    isCheckbox={false}
                    total={total}
                    page={page}
                    onPageChange={setPage}
                    pageSize={LIST_LIMIT}
                    onChange={(selectedIds) => {
                        console.log("Selected row IDs in EmployeeList:", selectedIds);
                    }}
                />
            ) : (
                <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Employee Found'} subTitle={''} />
            )}

        </Box>
        {
            openAddEmployeePopup &&
            <AddEmployee
                open={openAddEmployeePopup}
                toggle={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionEmployeeList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            page: page,
                            limit: LIST_LIMIT
                        }))
                    }
                    setOpenAddEmployeePopup(false)
                    setEmployeeData(null)
                }}
            />
        }
        {
            openEmployeeDetailsPopup &&
            <EmployeeDetails
                open={openEmployeeDetailsPopup}
                objData={employeeData}
                page={page}
                toggle={() => {
                    setOpenEmployeeDetailsPopup(false)
                    setEmployeeData(null)
                }}
            />
        }
        {
            openEmployeePermissionPopup &&
            <EmployeeWisePermissions
                open={openEmployeePermissionPopup}
                detail={employeeDetailData}
                page={page}
                handleClose={() => {
                    setOpenEmployeePermissionPopup(false)
                }}
            />
        }
        <AdditionalFieldsPopup
            open={openEmployeeAdditionalFieldsPopup}
            objDetail={{ type: "Employee", branch_uuid: branch?.currentBranch?.uuid, client_uuid: branch?.currentBranch?.client_uuid }}
            onClose={() => {
                setOpenEmployeeAdditionalFieldsPopup(false)
            }}
        />
        {
            openEmployeeGuidelinePopup &&
            <EmployeeGuidelinePopup
                open={openEmployeeGuidelinePopup}
                handleClose={() => {
                    setOpenEmployeeGuidelinePopup(false)
                }}
            />
        }
    </React.Fragment>
}
