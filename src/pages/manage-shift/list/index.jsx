/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Chip, FormLabel, IconButton, InputAdornment, MenuItem, Stack, Tooltip, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react'
import MyBreadcrumbs from '../../../components/breadcrumb'
import AddIcon from '@mui/icons-material/Add';
import TypographyComponent from '../../../components/custom-typography';
import DownloadIcon from '../../../assets/icons/DownloadIcon';
import { actionEmployeeShiftScheduleList, resetEmployeeShiftScheduleListResponse, resetRosterDataResponse } from '../../../store/roster';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from '../../../constants';
import { useAuth } from '../../../hooks/useAuth';
import { useSnackbar } from '../../../hooks/useSnackbar';
import FullScreenLoader from '../../../components/fullscreen-loader';
import EmptyContent from '../../../components/empty_content';
import { SearchInput } from '../../../components/common';
import SearchIcon from '../../../assets/icons/SearchIcon';
import ChevronDownIcon from "../../../assets/icons/ChevronDown"
import CustomTextField from "../../../components/text-field"
import { actionMasterAssetType, resetMasterAssetTypeResponse } from '../../../store/asset';
import { useBranch } from '../../../hooks/useBranch';
import * as XLSX from "xlsx";
import AddManageShift from '../add';
import ManageShiftDetails from '../view';
import ServerSideListComponents from '../../../components/server-side-list-component';
import EyeIcon from '../../../assets/icons/EyeIcon';

export default function ManageShiftList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()

    // state
    const [searchQuery, setSearchQuery] = useState('')
    const [manageShiftOriginalData, setManageShiftOriginalData] = useState([])
    const [manageShiftOptions, setManageShiftOptions] = useState([])
    const [loadingList, setLoadingList] = useState(false)
    const [total, setTotal] = useState(0)
    const [assetType, setAssetType] = useState('')
    const [page, setPage] = useState(1);
    const [assetTypeMasterOption, setAssetTypeMasterOption] = useState([])
    const [openAddManageShiftPopup, setOpenAddManageShiftPopup] = useState(false)
    const [openManageShiftDetailsPopup, setOpenManageShiftDetailsPopup] = useState(false)
    const [manageShiftData, setManageShiftData] = useState(null)

    const columns = [
        { field: "roster_name", headerName: "Roster Name", flex: 0.1 },
        { field: "asset_type", headerName: "Asset Type", flex: 0.1 },
        { field: "schedule", headerName: "Schedule", flex: 0.1 },
        { field: "technician_count", headerName: "Technician", flex: 0.1 },
        { field: "shift_manager", headerName: "Shift Manager", flex: 0.1 },
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
                                hasPermission('MANAGE_SHIFT_DETAILS') ?
                                    <Tooltip title="Details" followCursor placement="top">
                                        {/* open manager shift */}
                                        <IconButton
                                            onClick={() => {
                                                setManageShiftData(params.row)
                                                setOpenManageShiftDetailsPopup(true)
                                            }}
                                        >
                                            <EyeIcon stroke={'#181D27'} />
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

    // store
    const { employeeShiftScheduleList } = useSelector(state => state.rosterStore)
    const { masterAssetType } = useSelector(state => state.AssetStore)

    /**
       * initial render
       */
    useEffect(() => {
        setLoadingList(true)
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionEmployeeShiftScheduleList({
                branch_uuid: branch?.currentBranch?.uuid,
                search: searchQuery,
                asset_type: assetType,
                page: page,
                limit: LIST_LIMIT
            }))
        }
        if (branch?.currentBranch?.client_uuid && branch?.currentBranch?.client_uuid !== null) {
            dispatch(actionMasterAssetType({
                client_uuid: branch?.currentBranch?.client_uuid
            }))
        }
    }, [branch?.currentBranch])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    /**
         * Filter the vendor
         */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (manageShiftOriginalData && manageShiftOriginalData !== null && manageShiftOriginalData.length > 0) {
                var filteredData = manageShiftOriginalData.filter(
                    item =>
                        (item?.roster_name && item?.roster_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.asset_type && item?.asset_type.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.schedule && item?.schedule.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.technician && item?.technician.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.shift_manager && item?.shift_manager.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setManageShiftOptions(filteredData)
                } else {
                    setManageShiftOptions([])
                }
            }
        } else {
            setManageShiftOptions(manageShiftOriginalData)
        }
    }, [searchQuery])

    /**
     * useEffect
     * @dependency : masterAssetType
     * @type : HANDLE API RESULT
     * @description : Handle the result of master Asset Type API
     */
    useEffect(() => {
        if (masterAssetType && masterAssetType !== null) {
            dispatch(resetMasterAssetTypeResponse())
            if (masterAssetType?.result === true) {
                setAssetTypeMasterOption(masterAssetType?.response)
            } else {
                setAssetTypeMasterOption([])
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
     * @dependency : employeeShiftScheduleList
     * @type : HANDLE API RESULT
     * @description : Handle the result of manage shift List API
     */
    useEffect(() => {
        if (employeeShiftScheduleList && employeeShiftScheduleList !== null) {
            dispatch(resetEmployeeShiftScheduleListResponse())
            if (employeeShiftScheduleList?.result === true) {
                setManageShiftOptions(employeeShiftScheduleList?.response?.data)
                setManageShiftOriginalData(employeeShiftScheduleList?.response?.data)
                setLoadingList(false)
                setTotal(employeeShiftScheduleList?.response?.totalRecords)
                dispatch(resetRosterDataResponse())
            } else {
                setLoadingList(false)
                setManageShiftOptions([])
                setManageShiftOriginalData([])
                switch (employeeShiftScheduleList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeShiftScheduleListResponse())
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: employeeShiftScheduleList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeShiftScheduleList])

    return (
        <React.Fragment>
            <Stack
                flexDirection={{ xs: 'column', sm: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                mb={3}>
                <MyBreadcrumbs />
                {
                    hasPermission('MANAGE_SHIFT_ADD') &&
                    <Button
                        size="small" sx={{
                            textTransform: 'capitalize',
                            color: theme.palette.common.white,
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
                        variant='contained'
                        onClick={() => {
                            setOpenAddManageShiftPopup(true)
                        }}
                    >
                        <AddIcon sx={{ color: 'white', fontSize: { xs: '16x', sm: '16px' } }} />
                        <TypographyComponent fontSize={14} fontWeight={600} sx={{ ml: 0.3 }}>
                            Create New Roster
                        </TypographyComponent>
                    </Button>
                }

            </Stack>
            <Box sx={{
                height: '740px',
                background: theme.palette.common.white,
                borderRadius: '12px',
                border: `1px solid ${theme.palette.grey[300]}`,
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '2px'
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: theme.palette.grey[100],
                    borderRadius: '2px'
                }
            }}>
                <Stack
                    flexDirection={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    m={2}>
                    <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                        <Stack>
                            <TypographyComponent fontSize={18} fontWeight={500}>Shift List</TypographyComponent>
                        </Stack>
                        <Chip
                            label={`${total} shifts`}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary[50], color: theme.palette.primary[600], fontWeight: 500 }}
                        />
                    </Stack>
                    <Stack sx={{ flexDirection: 'row', columnGap: 1, alignItems: 'center' }}>
                        <Stack sx={{ width: '100%' }}>
                            <SearchInput
                                id="search-manage-shift"
                                placeholder="Search"
                                variant="outlined"
                                size="small"
                                value={searchQuery}
                                onChange={handleSearchQueryChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start" sx={{ mr: 1 }}>
                                            <SearchIcon stroke={theme.palette.grey[500]} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Stack>
                        <CustomTextField
                            select
                            fullWidth
                            sx={{ marginBottom: 1 }}
                            value={assetType}
                            label={<FormLabel label='All Asset Types' required={false} />}
                            onChange={(event) => {
                                setAssetType(event.target.value)
                            }}
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
                        >
                            <MenuItem value=''>
                                <em>All Asset Types</em>
                            </MenuItem>
                            {assetTypeMasterOption &&
                                assetTypeMasterOption.map(option => (
                                    <MenuItem
                                        key={option?.id}
                                        value={option?.id}
                                        sx={{
                                            whiteSpace: 'normal',        // allow wrapping
                                            wordBreak: 'break-word',     // break long words if needed
                                            maxWidth: 500,               // control dropdown width
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
                        {
                            manageShiftOptions && manageShiftOptions.length > 0 && (
                                <Button
                                    variant="outlined"
                                    color={theme.palette.common.white} // text color
                                    sx={{
                                        border: `1px solid ${theme.palette.grey[300]}`,
                                        px: 4,
                                    }}
                                    startIcon={<DownloadIcon />}
                                    onClick={() => {
                                        // 🔹 Prepare simplified data for export
                                        const exportData = manageShiftOptions.map(group => ({
                                            "Roster Name": group.roster_name,
                                            "Asset Type": group.asset_type,
                                            "Schedule": group.schedule,
                                            "No of Technicians": group.technician_count,
                                            "Shift Manager": group.shift_manager,
                                        }));

                                        // 🔹 Create worksheet and workbook
                                        const worksheet = XLSX.utils.json_to_sheet(exportData);
                                        const workbook = XLSX.utils.book_new();
                                        XLSX.utils.book_append_sheet(workbook, worksheet, "Manage Shift");

                                        // 🔹 Trigger download
                                        XLSX.writeFile(workbook, "Manage Shift.xlsx");
                                    }}
                                >
                                    Export
                                </Button>
                            )
                        }
                    </Stack>
                </Stack>
                {loadingList ? (
                    <FullScreenLoader open={true} />
                ) : manageShiftOptions && manageShiftOptions !== null && manageShiftOptions.length > 0 ? (
                    <ServerSideListComponents
                        rows={manageShiftOptions}
                        columns={columns}
                        isCheckbox={false}
                        total={total}
                        page={page}
                        onPageChange={setPage}
                        pageSize={LIST_LIMIT}
                        onChange={(selectedIds) => {
                            console.log("Selected row IDs in manageShift:", selectedIds);
                        }}
                    />
                ) : (
                    <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Manage Shift Found'} subTitle={''} />
                )}

            </Box>
            <AddManageShift
                open={openAddManageShiftPopup}
                handleClose={(data) => {
                    dispatch(resetRosterDataResponse())
                    if (data && data !== null && data === 'save') {
                        dispatch(actionEmployeeShiftScheduleList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            search: searchQuery,
                            asset_type: assetType,
                            page: page,
                            limit: LIST_LIMIT
                        }))
                    }
                    setOpenAddManageShiftPopup(false)
                }}
            />
            <ManageShiftDetails
                open={openManageShiftDetailsPopup}
                page={page}
                objData={manageShiftData}
                handleClose={() => {
                    setOpenManageShiftDetailsPopup(false)
                }}
            />
        </React.Fragment>
    )
}
