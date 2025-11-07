/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Divider,
    Chip,
    Button,
    InputAdornment,
    useTheme,
    Stack,
    FormGroup,
    FormControlLabel,
    Tooltip,
    Grid,
    useMediaQuery,
    CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FormHeader from "../../../components/form-header";
import UserIcon from "../../../assets/icons/UserIcon";
import CloseIcon from "../../../assets/icons/CloseIcon";
import TypographyComponent from "../../../components/custom-typography";
import { AntSwitch, SearchInput } from "../../../components/common";
import { useDispatch, useSelector } from "react-redux";
import {
    actionAddEmployeeShiftSchedule,
    resetAddEmployeeShiftScheduleResponse,
    actionEmployeeShiftScheduleMasterList,
    resetEmployeeShiftScheduleMasterListResponse,
    actionRosterGroupMasterList,
    resetRosterGroupMasterListResponse,
    actionRosterData
} from "../../../store/roster";
import { useBranch } from "../../../hooks/useBranch";
import toast from "react-hot-toast";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import moment from "moment";
import SearchIcon from "../../../assets/icons/SearchIcon";
import _ from "lodash";
import UploadIcon from "../../../assets/icons/UploadIcon";
import AddNewMemberGroup from "./components/add-new-members";

export default function CreateShiftDrawer({ open, objData, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))

    // store
    const { rosterData, addEmployeeShiftSchedule, employeeShiftScheduleMasterList, rosterGroupMasterList } = useSelector(state => state.rosterStore)

    const [loading, setLoading] = useState(false)
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf("week"));
    const [searchQuery, setSearchQuery] = useState('')
    const [employeeShiftScheduleMasterOption, setEmployeeShiftScheduleMasterOption] = useState([])
    const [employeeShiftScheduleMasterOriginalData, setEmployeeShiftScheduleMasterOriginalData] = useState([])
    const [groupMasterOption, setGroupMasterOption] = useState([])
    const [activePage, setActivePage] = useState('Preview')
    const [openAddNewMemberGroupPopup, setOpenAddNewMemberGroupPopup] = useState(false)

    // initial render
    useEffect(() => {
        if (open === true) {
            setActivePage('Preview')
            setCurrentWeekStart(moment().startOf("week"))
            if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
                dispatch(actionRosterGroupMasterList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            }
        }
    }, [branch?.currentBranch, open])

    useEffect(() => {
        if (open === true) {
            if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData !== null && rosterData?.roster_group_uuid && rosterData?.roster_group_uuid !== null) {
                dispatch(actionEmployeeShiftScheduleMasterList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    roster_group_uuid: rosterData?.roster_group_uuid
                }))
            } else if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData !== null && rosterData?.roster_group_uuid === null) {
                dispatch(actionEmployeeShiftScheduleMasterList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            }
        }
    }, [branch?.currentBranch, rosterData?.roster_group_uuid, open])

    /**
     * useEffect
     * @dependency : employeeShiftScheduleMasterList
     * @type : HANDLE API RESULT
     * @description : Handle the result of employee Shift Schedule Master List API
     */
    useEffect(() => {
        if (employeeShiftScheduleMasterList && employeeShiftScheduleMasterList !== null) {
            dispatch(resetEmployeeShiftScheduleMasterListResponse())
            if (employeeShiftScheduleMasterList?.result === true) {
                if (objData?.shift_schedule && objData?.shift_schedule !== null && objData?.shift_schedule?.length > 0) {
                    setEmployeeShiftScheduleMasterOption(objData?.shift_schedule)
                    setEmployeeShiftScheduleMasterOriginalData(objData?.shift_schedule)
                } else {
                    setEmployeeShiftScheduleMasterOption(employeeShiftScheduleMasterList?.response)
                    setEmployeeShiftScheduleMasterOriginalData(employeeShiftScheduleMasterList?.response)
                }
            } else {
                setEmployeeShiftScheduleMasterOption([])
                setEmployeeShiftScheduleMasterOriginalData([])
                switch (employeeShiftScheduleMasterList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeShiftScheduleMasterListResponse())
                        toast.dismiss()
                        showSnackbar({ message: employeeShiftScheduleMasterList?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: employeeShiftScheduleMasterList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeShiftScheduleMasterList])

    /**
     * useEffect
     * @dependency : rosterGroupMasterList
     * @type : HANDLE API RESULT
     * @description : Handle the result of roster Group Master List API
     */
    useEffect(() => {
        if (rosterGroupMasterList && rosterGroupMasterList !== null) {
            dispatch(resetRosterGroupMasterListResponse())
            if (rosterGroupMasterList?.result === true) {
                setGroupMasterOption(rosterGroupMasterList?.response)
            } else {
                setGroupMasterOption([])
                switch (rosterGroupMasterList?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetRosterGroupMasterListResponse())
                        toast.dismiss()
                        showSnackbar({ message: rosterGroupMasterList?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: rosterGroupMasterList?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [rosterGroupMasterList])

    useEffect(() => {
        if (groupMasterOption && groupMasterOption?.length > 0) {
            if (objData && objData !== null && objData?.formType === 'edit') {
                let shiftData = Object.assign({}, rosterData)
                shiftData.schedule_type = objData?.schedule_type
                shiftData.roster_group_uuid = objData?.uuid
                shiftData.roster_group_id = objData?.id
                shiftData.roster_group_name = objData?.roster_name
                dispatch(actionRosterData(shiftData))
            } else {
                if (rosterData === null || rosterData?.roster_group_id === null || rosterData?.roster_group_id === '') {
                    let objData = Object.assign({}, rosterData)
                    objData.roster_group_id = groupMasterOption[1]?.id
                    objData.roster_group_uuid = groupMasterOption[1]?.uuid
                    objData.roster_group_name = groupMasterOption[1]?.roster_group_name
                    dispatch(actionRosterData(objData))
                }
            }
        }
    }, [groupMasterOption])

    /**
     * useEffect
     * @dependency : addEmployeeShiftSchedule
     * @type : HANDLE API RESULT
     * @description : Handle the result of add Employee Shift Schedule API
     */
    useEffect(() => {
        if (addEmployeeShiftSchedule && addEmployeeShiftSchedule !== null) {
            dispatch(resetAddEmployeeShiftScheduleResponse())
            if (addEmployeeShiftSchedule?.result === true) {
                handleClose('save')
                toast.dismiss()
                showSnackbar({ message: addEmployeeShiftSchedule?.message, severity: "success" })
                setLoading(false)
            } else {
                handleClose()
                setLoading(false)
                switch (addEmployeeShiftSchedule?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetAddEmployeeShiftScheduleResponse())
                        toast.dismiss()
                        showSnackbar({ message: addEmployeeShiftSchedule?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        toast.dismiss()
                        showSnackbar({ message: addEmployeeShiftSchedule?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [addEmployeeShiftSchedule])

    /**
     * Filter the vendor
     */
    useEffect(() => {
        if (searchQuery && searchQuery.trim().length > 0) {
            if (employeeShiftScheduleMasterOriginalData && employeeShiftScheduleMasterOriginalData !== null && employeeShiftScheduleMasterOriginalData.length > 0) {
                var filteredData = employeeShiftScheduleMasterOriginalData.filter(
                    item =>
                        (item?.employee_name && item?.employee_name.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
                        (item?.role_type && item?.role_type.toLowerCase().includes(searchQuery.trim().toLowerCase()))
                )

                if (filteredData && filteredData.length > 0) {
                    setEmployeeShiftScheduleMasterOption(filteredData)
                } else {
                    setEmployeeShiftScheduleMasterOption([])
                }
            }
        } else {
            setEmployeeShiftScheduleMasterOption(employeeShiftScheduleMasterOriginalData)
        }
    }, [searchQuery])

    // handle search function
    const handleSearchQueryChange = event => {
        const value = event.target.value
        setSearchQuery(value)
    }

    const handlePreviousWeek = () => {
        setCurrentWeekStart((prev) => moment(prev).subtract(1, "week"));
    };

    const handleNextWeek = () => {
        setCurrentWeekStart((prev) => moment(prev).add(1, "week"));
    };

    // Calculate full week days based on currentWeekStart
    const weekdays = Array.from({ length: 7 }, (_, i) =>
        moment(currentWeekStart).add(i, "days")
    );

    const weekRangeText = `${currentWeekStart.format("D MMM")} - ${moment(currentWeekStart)
        .endOf("week")
        .format("D MMM")}`;


    // Define light/dark variants for supported colors
    const colorMap = {
        primary: {
            light: theme.palette.primary[300],
            dark: theme.palette.primary[700],
            text: theme.palette.common.white,
        },
        error: {
            light: theme.palette.error[300],
            dark: theme.palette.error[700],
            text: theme.palette.common.white,
        },
        grey: {
            light: theme.palette.grey[100],
            dark: theme.palette.grey[300],
            text: theme.palette.grey[600],
        },
    };

    const getCurrentColor = (shortName, isSelected) => {
        if (!isSelected) return colorMap.grey;
        if (shortName === "W") return colorMap.error;
        return colorMap.primary;
    };

    // 🎨 Define your color map
    const displayColorMap = {
        W: {
            light: theme.palette.error[300],
            dark: theme.palette.error[500],
            text: theme.palette.common.white,
        },
        G: {
            light: theme.palette.primary[50],
            dark: theme.palette.primary[100],
            text: theme.palette.common.black,
        },
        1: {
            light: theme.palette.primary[100],
            dark: theme.palette.primary[200],
            text: theme.palette.common.black,
        },
        2: {
            light: theme.palette.primary[300],
            dark: theme.palette.primary[400],
            text: theme.palette.common.black,
        },
        3: {
            light: theme.palette.primary[500],
            dark: theme.palette.primary[700],
            text: theme.palette.common.black,
        },
        default: {
            light: theme.palette.grey[100],
            dark: theme.palette.grey[300],
            text: theme.palette.grey[700],
        },
    };

    // 🧠 Get the correct color for the short name
    const getDisplayCurrentColor = (shortName) => {
        return displayColorMap[shortName] || displayColorMap.default;
    };

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor='right'
                variant='temporary'
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '86%' } } }}
            >
                <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<UserIcon stroke={theme.palette.primary[600]} size={18} />}
                        title={`${objData && objData !== null && objData?.formType === 'edit' ? 'Update Shift' : 'Create New Shift'}`}
                        subtitle={`Fill below form to ${objData && objData !== null && objData?.formType === 'edit' ? 'update Shift' : 'add new asset'}`}

                        actions={[
                            <IconButton
                                onClick={handleClose}
                            >
                                <CloseIcon size={16} />
                            </IconButton>
                        ]}
                    />
                    <Divider sx={{ m: 2 }} />

                    {/* Toolbar */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2} >
                        <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>Shift Schedule</TypographyComponent>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Define working days and weekly off</TypographyComponent>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', columnGap: 2 }}>
                            {
                                activePage === 'Preview' &&
                                (
                                    <Button
                                        startIcon={<UserIcon stroke={theme.palette.grey[700]} size={18} />}
                                        variant="outlined"
                                        size="small"
                                        color={theme.palette.grey[700]}
                                        sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}
                                        onClick={() => {
                                            setOpenAddNewMemberGroupPopup(true)
                                        }}
                                    >
                                        Add new member to this group
                                    </Button>
                                )}
                            <Box display="flex" alignItems="center" sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}>
                                <Tooltip title="Previous Week">
                                    <IconButton size="small" onClick={handlePreviousWeek}>
                                        <ChevronLeft fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Typography fontWeight={600} fontSize={14} minWidth="100px" textAlign="center">
                                    {weekRangeText}
                                </Typography>
                                <Tooltip title="Next Week">
                                    <IconButton size="small" onClick={handleNextWeek}>
                                        <ChevronRight fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            {
                                activePage === 'Preview' ?
                                    (
                                        <Box display="flex" alignItems="center" gap={2} sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}>
                                            <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>Roster Duration:</TypographyComponent>
                                            <FormGroup row sx={{ gap: 4 }}>
                                                <FormControlLabel
                                                    labelPlacement="end"
                                                    sx={{
                                                        m: 0,
                                                        gap: 1,
                                                        '.MuiTypography-root': { fontWeight: rosterData?.schedule_type === 'WEEKLY' ? 600 : 400, fontSize: 14 },
                                                        color: rosterData?.schedule_type === 'WEEKLY' ? theme.palette.grey[700] : theme.palette.grey[600]
                                                    }}
                                                    control={
                                                        <AntSwitch
                                                            checked={rosterData?.schedule_type === 'WEEKLY'}
                                                            onChange={() => {
                                                                let objData = Object.assign({}, rosterData)
                                                                objData.schedule_type = 'WEEKLY'
                                                                dispatch(actionRosterData(objData))
                                                            }}
                                                        />
                                                    }
                                                    label="Weekly"
                                                />
                                                <FormControlLabel
                                                    labelPlacement="end"
                                                    sx={{
                                                        m: 0,
                                                        gap: 1,
                                                        '.MuiTypography-root': { fontWeight: rosterData?.schedule_type === 'MONTHLY' ? 600 : 400, fontSize: 14 },
                                                        color: rosterData?.schedule_type === 'MONTHLY' ? theme.palette.grey[700] : theme.palette.grey[600]
                                                    }}
                                                    control={
                                                        <AntSwitch
                                                            checked={rosterData?.schedule_type === 'MONTHLY'}
                                                            onChange={() => {
                                                                let objData = Object.assign({}, rosterData)
                                                                objData.schedule_type = 'MONTHLY'
                                                                dispatch(actionRosterData(objData))
                                                            }}
                                                        />
                                                    }
                                                    label="Monthly"
                                                />
                                            </FormGroup>
                                        </Box>
                                    )
                                    :
                                    (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color={theme.palette.grey[700]}
                                            sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}
                                        >
                                            <UploadIcon stroke={theme.palette.grey[700]} size={18} />
                                        </Button>
                                    )
                            }
                        </Stack>
                    </Box>

                    {/* Group selection */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mx={2} >
                        <Stack sx={{ flexDirection: 'row' }} columnGap={1}>
                            {groupMasterOption && groupMasterOption !== null && groupMasterOption?.length > 0 &&
                                groupMasterOption.map((g, index) => (
                                    <Button
                                        key={index}
                                        sx={{
                                            textTransform: "capitalize",
                                            px: '16px',
                                            py: '4px',
                                            borderColor: g?.id === rosterData?.roster_group_id ? theme.palette.primary[600] : theme.palette.grey[300],
                                            color: g?.id === rosterData?.roster_group_id ? theme.palette.common.white : theme.palette.grey[600],
                                            backgroundColor: g?.id === rosterData?.roster_group_id ? theme.palette.primary[600] : '',
                                            borderRadius: '4px',
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}
                                        variant={g?.id === rosterData?.roster_group_id ? "contained" : "outlined"}
                                        onClick={() => {
                                            let objData = Object.assign({}, rosterData)
                                            objData.roster_group_id = g?.id
                                            objData.roster_group_uuid = g?.uuid
                                            objData.roster_group_name = g?.roster_group_name
                                            dispatch(actionRosterData(objData))
                                        }}
                                    >
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }} columnGap={1}>
                                            {g?.roster_group_name}
                                            <Stack>
                                                <Chip
                                                    label={g.employee_count}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: g?.id === rosterData?.roster_group_id ? theme.palette.common.white : '',
                                                        color: `${theme.palette.grey[600]}}`,
                                                        fontWeight: 24,
                                                        border: g?.id === rosterData?.roster_group_id ? `1px solid ${theme.palette.common.white}` : `1px solid ${theme.palette.grey[600]}`,
                                                    }}
                                                    variant={g?.id === rosterData?.roster_group_id ? "contained" : "outlined"}
                                                />
                                            </Stack>

                                        </Stack>
                                    </Button>
                                ))}
                        </Stack>
                        <Stack>
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
                    </Box>
                    <Box
                        sx={{
                            borderRadius: "16px",
                            padding: "16px",
                            gap: "24px",
                            bgcolor: theme.palette.grey[100],
                            m: 2,
                            overflowX: "auto",
                        }}
                    >
                        {/* ---- Weekday Header (common for both) ---- */}
                        <Grid
                            container
                            sx={{
                                px: 2,
                                py: 1,
                                borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                fontWeight: 600,
                                minWidth: isMDDown ? "1600px" : "",
                            }}
                        >
                            <Grid
                                size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
                                display="flex"
                                alignItems="center"
                            >
                                <Typography fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>
                                    Weekdays
                                </Typography>
                            </Grid>

                            <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} container>
                                {weekdays.map((day, index) => (
                                    <Grid
                                        key={index}
                                        size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }}
                                        textAlign="center"
                                    >
                                        <Typography fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>
                                            {day.format("ddd").toUpperCase()}
                                        </Typography>
                                        <Typography fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                            {day.format("D MMM")}
                                        </Typography>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* ---- Employee Rows (switch content based on activePage) ---- */}
                        <Stack sx={{ gap: 2, mt: 2 }}>
                            {
                                employeeShiftScheduleMasterOption && employeeShiftScheduleMasterOption?.length > 0 &&
                                employeeShiftScheduleMasterOption.map((emp, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            overflowX: "auto",
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                            borderRadius: "8px",
                                            bgcolor: theme.palette.common.white,
                                            minWidth: isMDDown ? "1600px" : "",
                                        }}
                                    >
                                        <Grid container alignItems="center" sx={{ p: 2, minWidth: isMDDown ? "1600px" : "" }}>
                                            {/* ---- Employee Name ---- */}
                                            <Grid
                                                size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }}
                                                display="flex"
                                                alignItems="center"
                                                gap={1.5}
                                            >
                                                {activePage === "Preview" && (
                                                    <FormControlLabel
                                                        sx={{
                                                            m: 0,
                                                            gap: 1,
                                                            ".MuiTypography-root": {
                                                                fontWeight: emp.status === "Active" ? 600 : 400,
                                                                fontSize: 14,
                                                            },
                                                            color:
                                                                emp.status === "Active"
                                                                    ? theme.palette.grey[700]
                                                                    : theme.palette.grey[600],
                                                        }}
                                                        control={
                                                            <AntSwitch
                                                                checked={emp.status === "Active"}
                                                                onChange={() => {
                                                                    const updated = employeeShiftScheduleMasterOption.map((item, i) =>
                                                                        i === index
                                                                            ? {
                                                                                ...item,
                                                                                status:
                                                                                    item.status === "Active" ? "Inactive" : "Active",
                                                                            }
                                                                            : item
                                                                    );
                                                                    setEmployeeShiftScheduleMasterOption(updated);
                                                                }}
                                                            />
                                                        }
                                                    />
                                                )}

                                                <Box>
                                                    <Typography fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>
                                                        {_.truncate(emp?.employee_name, { length: 20 })}
                                                    </Typography>
                                                    {emp?.is_manager === 1 && (
                                                        <Typography fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>
                                                            {emp?.role_type}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            </Grid>

                                            {/* ---- Shift Cells ---- */}
                                            <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} container>
                                                {weekdays.map((day, dayIndex) => {
                                                    const dateKey = moment(day).format("YYYY-MM-DD");

                                                    // ✅ PREVIEW MODE — Select shifts
                                                    if (activePage === "Preview" && emp.status === "Active") {
                                                        return (
                                                            <Grid
                                                                key={dayIndex}
                                                                size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }}
                                                                display="flex"
                                                                justifyContent="center"
                                                                alignItems="center"
                                                                gap={0.5}
                                                            >
                                                                {emp?.shifts?.map((s, shiftIndex) => {
                                                                    const isSelected = emp.shift_selection?.[dateKey] === s.short_name;
                                                                    const currentColor = getCurrentColor(s.short_name, isSelected);

                                                                    return (
                                                                        <Button
                                                                            key={`${dateKey}-${shiftIndex}`}
                                                                            size="small"
                                                                            variant="outlined"
                                                                            sx={{
                                                                                minWidth: 32,
                                                                                height: 32,
                                                                                borderRadius: 1,
                                                                                fontSize: 12,
                                                                                textTransform: "none",
                                                                                borderColor: isSelected
                                                                                    ? currentColor.dark
                                                                                    : theme.palette.grey[300],
                                                                                color: isSelected
                                                                                    ? currentColor.text
                                                                                    : theme.palette.grey[700],
                                                                                background: isSelected
                                                                                    ? `linear-gradient(180deg, ${currentColor.light} 0%, ${currentColor.dark} 100%)`
                                                                                    : "transparent",
                                                                                transition: "all 0.2s ease",
                                                                                "&:hover": {
                                                                                    background: isSelected
                                                                                        ? `linear-gradient(180deg, ${currentColor.dark} 0%, ${currentColor.dark} 100%)`
                                                                                        : theme.palette.action.hover,
                                                                                },
                                                                            }}
                                                                            onClick={() => {
                                                                                setEmployeeShiftScheduleMasterOption(prev =>
                                                                                    prev.map((empItem, empIndex) => {
                                                                                        if (empIndex !== index) return empItem;
                                                                                        const newSelection = { ...empItem.shift_selection };
                                                                                        if (newSelection[dateKey] === s.short_name) {
                                                                                            delete newSelection[dateKey];
                                                                                        } else {
                                                                                            newSelection[dateKey] = s.short_name;
                                                                                        }
                                                                                        return { ...empItem, shift_selection: newSelection };
                                                                                    })
                                                                                );
                                                                            }}
                                                                        >
                                                                            {s.short_name}
                                                                        </Button>
                                                                    );
                                                                })}
                                                            </Grid>
                                                        );
                                                    }

                                                    // ✅ PUBLISH MODE — Show only selected short_name
                                                    const selectedShortName = emp.shift_selection?.[dateKey];
                                                    const color = getDisplayCurrentColor(selectedShortName);
                                                    return (
                                                        <Grid
                                                            key={dayIndex}
                                                            size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }}
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                        >
                                                            {selectedShortName && (
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        minWidth: 168,
                                                                        height: 32,
                                                                        borderRadius: 1,
                                                                        fontSize: 12,
                                                                        textTransform: "none",
                                                                        borderColor: color.dark,
                                                                        color: color.text,
                                                                        background: `linear-gradient(180deg, ${color.light} 0%, ${color.dark} 100%)`,
                                                                        "&:hover": {
                                                                            background: `linear-gradient(180deg, ${color.dark} 0%, ${color.dark} 100%)`,
                                                                        },
                                                                    }}
                                                                >
                                                                    {selectedShortName}
                                                                </Button>
                                                            )}
                                                        </Grid>
                                                    );
                                                })}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                        </Stack>
                    </Box>
                    {/* Footer */}
                    <Divider sx={{ mt: 2 }} />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ p: 4 }}
                    >
                        {/* Left Button (Reset / Previous) */}
                        <Button
                            sx={{
                                textTransform: "capitalize",
                                px: 6,
                                borderColor: theme.palette.grey[300],
                                color: theme.palette.grey[700],
                                borderRadius: "8px",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                            variant="outlined"
                            disabled={activePage === "Preview"} // disabled in Preview, active in Publish
                            onClick={() => {
                                if (activePage === "Preview") return; // no action
                                setActivePage("Preview");
                            }}
                        >
                            {activePage === "Preview" ? "Reset" : "Previous"}
                        </Button>

                        {/* Right Button (Preview / Publish) */}
                        <Button
                            sx={{
                                textTransform: "capitalize",
                                px: 6,
                                borderRadius: "8px",
                                backgroundColor: theme.palette.primary[600],
                                color: theme.palette.common.white,
                                fontSize: 16,
                                fontWeight: 600,
                                borderColor: theme.palette.primary[600],
                                "&:disabled": {
                                    backgroundColor: theme.palette.grey[300],
                                    color: theme.palette.grey[600],
                                },
                            }}
                            variant="contained"
                            disabled={activePage === "Publish" && loading}
                            onClick={() => {
                                if (activePage === "Preview") {
                                    // ✅ Determine days to check (Weekdays or Month days)
                                    const daysToCheck =
                                        rosterData?.schedule_type === "MONTHLY"
                                            ? Array.from(
                                                { length: moment().daysInMonth() },
                                                (_, i) => moment().startOf("month").add(i, "days")
                                            )
                                            : weekdays;

                                    // ✅ Validate all shifts
                                    const allValid = employeeShiftScheduleMasterOption.every(emp => {
                                        if (emp.status !== "Active") return true;

                                        return daysToCheck.every(day => {
                                            const dateKey = moment(day).format("YYYY-MM-DD");
                                            return emp.shift_selection?.[dateKey];
                                        });
                                    });

                                    if (!allValid) {
                                        const msg =
                                            rosterData?.schedule_type === "MONTHLY"
                                                ? "Please select shift for all month days before publishing."
                                                : "Please select shift for all weekdays before publishing.";

                                        showSnackbar({ message: msg, severity: "error" });
                                        return;
                                    }

                                    if (!rosterData?.schedule_type) {
                                        showSnackbar({
                                            message: "Please select Roster Duration before publishing.",
                                            severity: "error",
                                        });
                                        return;
                                    }

                                    // ✅ Proceed to Publish
                                    setActivePage("Publish");
                                } else {
                                    // ✅ Final Publish Action
                                    let dateRange =
                                        rosterData?.schedule_type === "MONTHLY"
                                            ? `${moment().startOf("month").format("D MMM")} - ${moment()
                                                .endOf("month")
                                                .format("D MMM")}`
                                            : `${moment(weekdays[0]).format("D MMM")} - ${moment(
                                                weekdays[weekdays.length - 1]
                                            ).format("D MMM")}`;
                                    let input = {
                                        branch_uuid: branch?.currentBranch?.uuid,
                                        shift_schedule: employeeShiftScheduleMasterOption,
                                        roster_group_id: rosterData?.roster_group_id,
                                        schedule_type: rosterData?.schedule_type,
                                        schedule_date_range: dateRange
                                    };

                                    let updated = { ...input };
                                    if (objData?.formType === "edit" && objData?.uuid) {
                                        updated.uuid = objData?.uuid;
                                    }

                                    dispatch(actionAddEmployeeShiftSchedule(updated));
                                }
                            }}
                        >
                            {activePage === "Preview" ? "Preview" : loading ? (
                                <CircularProgress size={18} sx={{ color: "white" }} />
                            ) : (
                                "Publish"
                            )}
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            <AddNewMemberGroup
                open={openAddNewMemberGroupPopup}
                handleClose={(data) => {
                    if (data && data !== null && data === 'save') {
                        dispatch(actionRosterGroupMasterList({
                            branch_uuid: branch?.currentBranch?.uuid
                        }))
                        dispatch(actionEmployeeShiftScheduleMasterList({
                            branch_uuid: branch?.currentBranch?.uuid,
                            roster_group_uuid: rosterData?.roster_group_uuid
                        }))
                    }
                    setOpenAddNewMemberGroupPopup(false)
                }}
            />
        </React.Fragment>

    );
}
