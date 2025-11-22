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
import * as XLSX from "xlsx-js-style";
import HeaderDays from "./components/header-days";
import PreviewShiftTable from "./components/preview-shift";
import PublishShiftTable from "./components/publish-shift";

export default function CreateShiftDrawer({ open, objData, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))
    const isMDUp = useMediaQuery(theme.breakpoints.up('md'))

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

    // Example code typically found outside your provided JSX:

    // 1. Get the current date object (e.g., from the application state)
    const currentDate = moment();

    // 2. Set currentMonthStart to the first day of that month
    const currentMonthStart = currentDate.clone().startOf('month');

    // 3. Define monthDays based on this start date
    const monthDays = Array.from({ length: currentDate.daysInMonth() }, (_, i) =>
        currentMonthStart.clone().add(i, "days")
    );

    // 💡 Determine which days array to use
    const daysToDisplay = rosterData?.schedule_type === 'WEEKLY' ? weekdays : monthDays;

    // You might need a more compact header for monthly view due to space constraints, e.g., 'Days'
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

    // ✅ Helper to normalize hex (e.g. "#fff" → "FFFFFF")
    const normalizeHex = (color) => {
        if (!color) return "000000";
        let hex = color.replace("#", "").toUpperCase();
        if (hex.length === 3) {
            hex = hex.split("").map(ch => ch + ch).join("");
        }
        return hex;
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
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        flexDirection={{ xs: 'column', md: 'row' }}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        m={2}
                        rowGap={{ xs: 2, sm: 2 }}
                    >
                        <Stack sx={{ flexDirection: 'row', columnGap: 2, px: 2 }}>
                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>Shift Schedule</TypographyComponent>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[500] }}>Define working days and weekly off</TypographyComponent>
                        </Stack>
                        <Stack

                            sx={{
                                flexDirection: { xs: 'column', sm: 'row', md: 'row' },
                                columnGap: 1,
                                rowGap: { xs: 2, sm: 2 },
                                px: 2
                            }}
                        >
                            {
                                activePage === 'Preview' &&
                                (
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color={theme.palette.grey[700]}
                                        sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}
                                        onClick={() => {
                                            setOpenAddNewMemberGroupPopup(true)
                                        }}
                                    >
                                        <UserIcon stroke={theme.palette.grey[700]} size={18} />
                                        {
                                            isMDUp &&
                                            <TypographyComponent fontSize={14} fontWeight={600} sx={{ color: theme.palette.grey[700], ml: 1 }}>
                                                Add new member to this group
                                            </TypographyComponent>
                                        }
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
                                                                // Only trigger if actually switching type
                                                                if (rosterData?.schedule_type !== "WEEKLY" && objData !== null && objData?.formType === 'edit') {
                                                                    // 🔄 Reset all shift selections when switching type
                                                                    const resetShifts = employeeShiftScheduleMasterOption.map(emp => ({
                                                                        ...emp,
                                                                        shift_selection: {},
                                                                    }));
                                                                    setEmployeeShiftScheduleMasterOption(resetShifts);
                                                                    showSnackbar({
                                                                        message: "Roster duration changed to Weekly. Please reselect all shifts.",
                                                                        severity: "info",
                                                                    });
                                                                }
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
                                                                if (rosterData?.schedule_type !== "MONTHLY" && objData !== null && objData?.formType === 'edit') {
                                                                    // 🔄 Reset all shift selections when switching type
                                                                    const resetShifts = employeeShiftScheduleMasterOption.map(emp => ({
                                                                        ...emp,
                                                                        shift_selection: {},
                                                                    }));
                                                                    setEmployeeShiftScheduleMasterOption(resetShifts);
                                                                    showSnackbar({
                                                                        message:
                                                                            "Roster duration changed to Monthly. Please reselect all shifts.",
                                                                        severity: "info",
                                                                    });
                                                                }
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
                                            onClick={() => {
                                                if (!employeeShiftScheduleMasterOption?.length) {
                                                    console.error("No data available to export");
                                                    return;
                                                }

                                                const schedule = employeeShiftScheduleMasterOption;

                                                // ✅ Extract all date keys
                                                const dateKeys = Object.keys(schedule[0].shift_selection);
                                                const dateHeaders = dateKeys.map(date => moment(date).format("DD MMM")); // e.g. ['02 NOV','03 NOV']

                                                // ✅ Header row
                                                const header = ["Employee Name", "Role Type", ...dateHeaders];

                                                // ✅ Build rows
                                                const rows = schedule.map(emp => [
                                                    emp.employee_name.trim(),
                                                    emp.role_type,
                                                    ...dateKeys.map(date => emp.shift_selection[date] || "")
                                                ]);

                                                // ✅ Combine header + rows
                                                const data = [header, ...rows];

                                                // ✅ Create sheet
                                                const ws = XLSX.utils.aoa_to_sheet(data);

                                                // ✅ Header style
                                                const headerStyle = {
                                                    font: { bold: true, color: { rgb: normalizeHex(theme.palette.grey[900]) }, sz: 12 },
                                                    fill: { patternType: "solid", fgColor: { rgb: normalizeHex(theme.palette.grey[100]) } },
                                                    alignment: { horizontal: "center", vertical: "center" },
                                                    border: {
                                                        top: { style: "thin", color: { rgb: "CCCCCC" } },
                                                        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                                                        left: { style: "thin", color: { rgb: "CCCCCC" } },
                                                        right: { style: "thin", color: { rgb: "CCCCCC" } },
                                                    },
                                                };

                                                // ✅ Employee/Role column style
                                                const empColStyle = {
                                                    font: { color: { rgb: normalizeHex(theme.palette.grey[900]) }, sz: 11 },
                                                    fill: { patternType: "solid", fgColor: { rgb: normalizeHex(theme.palette.grey[100]) } },
                                                    alignment: { horizontal: "left", vertical: "center" },
                                                    border: {
                                                        top: { style: "thin", color: { rgb: "CCCCCC" } },
                                                        bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                                                        left: { style: "thin", color: { rgb: "CCCCCC" } },
                                                        right: { style: "thin", color: { rgb: "CCCCCC" } },
                                                    },
                                                };

                                                // ✅ Apply header styles
                                                header.forEach((_, cIndex) => {
                                                    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: cIndex });
                                                    if (ws[cellAddress]) ws[cellAddress].s = headerStyle;
                                                });

                                                // ✅ Apply data cell styles
                                                rows.forEach((row, rIndex) => {
                                                    row.forEach((cellValue, cIndex) => {
                                                        const cellAddress = XLSX.utils.encode_cell({ r: rIndex + 1, c: cIndex });
                                                        if (!ws[cellAddress]) return;

                                                        if (cIndex < 2) {
                                                            // Employee name + role type columns
                                                            ws[cellAddress].s = empColStyle;
                                                        } else {
                                                            // Shift color cells
                                                            const shift = cellValue;
                                                            const colorSet = displayColorMap[shift] || displayColorMap.default;
                                                            ws[cellAddress].s = {
                                                                font: { bold: false, color: { rgb: normalizeHex(colorSet.text) } },
                                                                fill: { patternType: "solid", fgColor: { rgb: normalizeHex(colorSet.dark) } },
                                                                alignment: { horizontal: "center", vertical: "center" },
                                                                border: {
                                                                    top: { style: "thin", color: { rgb: "CCCCCC" } },
                                                                    bottom: { style: "thin", color: { rgb: "CCCCCC" } },
                                                                    left: { style: "thin", color: { rgb: "CCCCCC" } },
                                                                    right: { style: "thin", color: { rgb: "CCCCCC" } },
                                                                },
                                                            };
                                                        }
                                                    });
                                                });

                                                // ✅ Auto column widths
                                                ws["!cols"] = header.map((_, i) => ({
                                                    wch: Math.max(
                                                        header[i].length,
                                                        ...rows.map(r => (r[i] ? r[i].toString().length : 0))
                                                    ) + 2,
                                                }));

                                                // ✅ Detect month & year for filename
                                                const firstDate = moment(dateKeys[0]);
                                                const monthYear = firstDate.format("MMMM YYYY"); // e.g., November 2025

                                                // ✅ Create workbook & add sheet
                                                const wb = XLSX.utils.book_new();
                                                XLSX.utils.book_append_sheet(wb, ws, "Shift Roster");

                                                // ✅ Export file with dynamic name
                                                const fileName = `Shift Roster ${monthYear}.xlsx`;
                                                XLSX.writeFile(wb, fileName);
                                            }}
                                        >
                                            <UploadIcon stroke={theme.palette.grey[700]} size={18} />
                                        </Button>
                                    )
                            }
                        </Stack>
                    </Box>
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
                        {/* Group selection */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            mx={2}
                            flexDirection={{ xs: 'column', md: 'row' }}
                            alignItems={{ xs: 'flex-start', md: 'center' }}
                            rowGap={{ xs: 2, sm: 2 }}
                        >
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
                            <Stack sx={{ minWidth: { xs: "100%", sm: "100%", md: "260px" } }}>
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
                            <HeaderDays
                                rosterData={rosterData}
                                daysToDisplay={activePage === 'Preview' ? weekdays : daysToDisplay}
                                leftHeader="Weekdays"
                                isMDDown={isMDDown}
                                theme={theme}
                                activePage={activePage}
                            />

                            {/* ---- Employee Rows (switch content based on activePage) ---- */}
                            {activePage === "Preview" ? (
                                <PreviewShiftTable
                                    employeeList={employeeShiftScheduleMasterOption}
                                    daysToDisplay={weekdays}
                                    rosterData={rosterData}
                                    theme={theme}
                                    setEmployeeShiftScheduleMasterOption={setEmployeeShiftScheduleMasterOption}
                                    getCurrentColor={getCurrentColor}
                                />
                            ) : (
                                <PublishShiftTable
                                    employeeList={employeeShiftScheduleMasterOption}
                                    daysToDisplay={daysToDisplay}
                                    rosterData={rosterData}
                                    theme={theme}
                                    getDisplayCurrentColor={getDisplayCurrentColor}
                                />
                            )}
                        </Box>
                    </Stack>
                    {/* Footer */}
                    <Divider sx={{ m: 2 }} />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ px: 2, pb: 2 }}
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
