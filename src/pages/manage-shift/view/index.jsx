/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Chip, CircularProgress, Divider, Drawer, Grid, IconButton, InputAdornment, Stack, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import FormHeader from "../../../components/form-header";
import UserIcon from "../../../assets/icons/UserIcon";
import { useAuth } from "../../../hooks/useAuth";
import DeleteIcon from "../../../assets/icons/DeleteIcon"
import EditIcon from "../../../assets/icons/EditIcon"
import moment from "moment";
import React, { useEffect, useState } from "react";
import TypographyComponent from "../../../components/custom-typography";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import UploadIcon from "../../../assets/icons/UploadIcon";
import { actionDeleteEmployeeShiftSchedule, resetDeleteEmployeeShiftScheduleResponse, actionEmployeeShiftScheduleDetails, resetEmployeeShiftScheduleDetailsResponse, actionEmployeeShiftScheduleList, resetRosterDataResponse } from "../../../store/roster";
import { useDispatch, useSelector } from "react-redux";
import EmptyContent from "../../../components/empty_content";
import { ERROR, IMAGES_SCREEN_NO_DATA, LIST_LIMIT, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import CreateShiftDrawer from "../add";
import { useBranch } from "../../../hooks/useBranch";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { SearchInput } from "../../../components/common";
import SearchIcon from "../../../assets/icons/SearchIcon";
import _ from "lodash";
import AlertPopup from "../../../components/alert-confirm"
import AlertCircleIcon from "../../../assets/icons/AlertCircleIcon"
import * as XLSX from "xlsx-js-style";
import HeaderDays from "../add/components/header-days";
import PublishShiftTable from "../add/components/publish-shift";

export default function ManageShiftDetails({ open, objData, page, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout, hasPermission } = useAuth()
    const { showSnackbar } = useSnackbar()
    // media query
    const isMDDown = useMediaQuery(theme.breakpoints.down('md'))

    // store
    const { employeeShiftScheduleDetails, deleteEmployeeShiftSchedule } = useSelector(state => state.rosterStore)

    // state
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf("week"));
    // state
    const [openDeleteManageShiftPopup, setOpenDeleteManageShiftPopup] = useState(false)
    const [viewLoadingDelete, setViewLoadingDelete] = useState(false)
    const [openEditManageShiftPopup, setOpenEditManageShiftPopup] = useState(false)
    const [viewManageShiftData, setViewManageShiftData] = useState(null)
    const [manageShiftDetailData, setManageShiftDetailData] = useState(null)
    const [loadingDetail, setLoadingDetail] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    /**
     * initial render
     */
    useEffect(() => {
        if (open === true) {
            setViewLoadingDelete(false)
            if (objData?.uuid && objData?.uuid !== null) {
                setLoadingDetail(true)
                dispatch(actionEmployeeShiftScheduleDetails({ uuid: objData?.uuid }))
            }
        }
    }, [open])

    /**
     * useEffect
     * @dependency : employeeShiftScheduleDetails
     * @type : HANDLE API RESULT
     * @description : Handle the result of employee Shift Schedule Details API
     */
    useEffect(() => {
        if (employeeShiftScheduleDetails && employeeShiftScheduleDetails !== null) {
            dispatch(resetEmployeeShiftScheduleDetailsResponse())
            if (employeeShiftScheduleDetails?.result === true) {
                setLoadingDetail(false)
                setManageShiftDetailData(employeeShiftScheduleDetails?.response)
            } else {
                setLoadingDetail(false)
                setManageShiftDetailData(null)
                switch (employeeShiftScheduleDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetEmployeeShiftScheduleDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: employeeShiftScheduleDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [employeeShiftScheduleDetails])

    /**
     * useEffect
     * @dependency : deleteEmployeeShiftSchedule
     * @type : HANDLE API RESULT
     * @description : Handle the result of delete Employee Shift Schedule API
     */
    useEffect(() => {
        if (deleteEmployeeShiftSchedule && deleteEmployeeShiftSchedule !== null) {
            dispatch(resetDeleteEmployeeShiftScheduleResponse())
            if (deleteEmployeeShiftSchedule?.result === true) {
                setOpenDeleteManageShiftPopup(false)
                setViewLoadingDelete(false)
                showSnackbar({ message: deleteEmployeeShiftSchedule?.message, severity: "success" })
                handleClose('delete')
                dispatch(actionEmployeeShiftScheduleList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    page: page,
                    limit: LIST_LIMIT
                }))
            } else {
                setViewLoadingDelete(false)
                switch (deleteEmployeeShiftSchedule?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetDeleteEmployeeShiftScheduleResponse())
                        showSnackbar({ message: deleteEmployeeShiftSchedule?.message, severity: "error" })
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: deleteEmployeeShiftSchedule?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [deleteEmployeeShiftSchedule])

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

    const weekRangeText = `${currentWeekStart.format("D MMM")} - ${moment(currentWeekStart)
        .endOf("week")
        .format("D MMM")}`;

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
    const daysToDisplay = manageShiftDetailData?.schedule_type === 'WEEKLY' ? weekdays : monthDays;

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
            text: theme.palette.common.white,
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
                        title="View Shift Details"
                        subtitle="View Shift Details"

                        actions={[
                            hasPermission("MANAGE_SHIFT_DELETE") && (
                                // open delete manage shift popup
                                <Tooltip title="Delete" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let details = {
                                                uuid: manageShiftDetailData.uuid,
                                                title: `Delete Manage Shift`,
                                                text: `Are you sure you want to delete this manage shift? This action cannot be undone.`
                                            }
                                            setViewManageShiftData(details)
                                            setOpenDeleteManageShiftPopup(true)
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                            hasPermission("MANAGE_SHIFT_EDIT") && (
                                // open edit manage shift
                                <Tooltip title="Edit" followCursor placement="top">
                                    <IconButton
                                        onClick={() => {
                                            let objData = Object.assign({}, manageShiftDetailData)
                                            objData.formType = 'edit'
                                            setViewManageShiftData(objData)
                                            setOpenEditManageShiftPopup(true)
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                </Tooltip>
                            ),
                        ].filter(Boolean)}
                    />
                    <Divider sx={{ m: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center" m={2} >
                        <Stack sx={{ flexDirection: 'row', columnGap: 2, px: 2 }}>
                            <TypographyComponent fontSize={16} fontWeight={600} sx={{ color: theme.palette.grey[700] }}>Shift Schedule</TypographyComponent>
                        </Stack>
                        <Stack sx={{ flexDirection: 'row', columnGap: 2, px: 2 }}>

                            <Box display="flex" alignItems="center" sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}>
                                <Tooltip title="Previous Week">
                                    <IconButton size="small" onClick={handlePreviousWeek}>
                                        <ChevronLeft fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <TypographyComponent fontWeight={600} fontSize={14} minWidth="100px" textAlign="center">
                                    {weekRangeText}
                                </TypographyComponent>
                                <Tooltip title="Next Week">
                                    <IconButton size="small" onClick={handleNextWeek}>
                                        <ChevronRight fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Tooltip title="Export Shift Roster">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color={theme.palette.grey[700]}
                                    sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}
                                    onClick={() => {
                                        if (!manageShiftDetailData?.shift_schedule?.length) {
                                            console.error("No data available to export");
                                            return;
                                        }

                                        const schedule = manageShiftDetailData?.shift_schedule;

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
                            </Tooltip>
                        </Stack>
                    </Box>
                    {loadingDetail ? (
                        <Stack sx={{ height: '100%', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={30} />
                            <TypographyComponent fontSize={20} fontWeight={600}>Loading...</TypographyComponent>
                        </Stack>

                    ) : manageShiftDetailData && manageShiftDetailData !== null ? (
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
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                mx={2}
                                flexDirection={{ xs: 'column', md: 'row' }}
                                alignItems={{ xs: 'flex-start', md: 'center' }}
                                rowGap={{ xs: 2, sm: 2 }}
                            >
                                <Stack sx={{ flexDirection: 'row' }} columnGap={1}>
                                    <Button
                                        sx={{
                                            textTransform: "capitalize",
                                            px: '16px',
                                            py: '4px',
                                            borderColor: theme.palette.primary[600],
                                            color: theme.palette.common.white,
                                            backgroundColor: theme.palette.primary[600],
                                            borderRadius: '4px',
                                            fontSize: 16,
                                            fontWeight: 500
                                        }}
                                        variant={"contained"}
                                    >
                                        <Stack sx={{ flexDirection: 'row', alignItems: 'center' }} columnGap={1}>
                                            {manageShiftDetailData?.roster_name}
                                            <Stack>
                                                <Chip
                                                    label={manageShiftDetailData?.employees_count}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: theme.palette.common.white,
                                                        color: `${theme.palette.grey[600]}}`,
                                                        fontWeight: 24,
                                                        border: `1px solid ${theme.palette.common.white}`,
                                                    }}
                                                    variant={"contained"}
                                                />
                                            </Stack>

                                        </Stack>
                                    </Button>
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
                                    rosterData={manageShiftDetailData}
                                    daysToDisplay={daysToDisplay}
                                    leftHeader="Weekdays"
                                    isMDDown={isMDDown}
                                    theme={theme}
                                />
                                <PublishShiftTable
                                    employeeList={manageShiftDetailData?.shift_schedule}
                                    daysToDisplay={daysToDisplay}
                                    rosterData={manageShiftDetailData}
                                    theme={theme}
                                    getDisplayCurrentColor={getDisplayCurrentColor}
                                />
                            </Box>
                        </Stack>
                    ) : (
                        <Stack sx={{ height: '100%' }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Details Found'} subTitle={''} />
                        </Stack>
                    )}
                    <Divider sx={{ m: 2 }} />
                    <Stack sx={{ px: 2, pb: 2 }} flexDirection={'row'} justifyContent={'flex-end'} gap={2}>
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
                openEditManageShiftPopup &&
                <CreateShiftDrawer
                    open={openEditManageShiftPopup}
                    objData={viewManageShiftData}
                    handleClose={(data) => {
                        dispatch(resetRosterDataResponse())
                        if (data && data !== null && data === 'save') {
                            if (manageShiftDetailData?.uuid && manageShiftDetailData?.uuid !== null) {
                                dispatch(actionEmployeeShiftScheduleDetails({ uuid: manageShiftDetailData?.uuid }))
                                dispatch(actionEmployeeShiftScheduleList({
                                    branch_uuid: branch?.currentBranch?.uuid,
                                    page: page,
                                    limit: LIST_LIMIT
                                }))
                            }
                        }
                        setOpenEditManageShiftPopup(false)
                        setViewManageShiftData(null)
                    }}
                />
            }
            {
                openDeleteManageShiftPopup &&
                <AlertPopup
                    open={openDeleteManageShiftPopup}
                    icon={<AlertCircleIcon sx={{ color: theme.palette.error[600] }} fontSize="inherit" />}
                    color={theme.palette.error[600]}
                    objData={viewManageShiftData}
                    actionButtons={[
                        <Button key="cancel" color="secondary" variant="outlined" sx={{ width: '100%', color: theme.palette.grey[800], textTransform: 'capitalize' }} onClick={() => {
                            setOpenDeleteManageShiftPopup(false)
                        }}>
                            Cancel
                        </Button >
                        ,
                        <Button key="delete" variant="contained" sx={{ width: '100%', textTransform: 'capitalize', background: theme.palette.error[600], color: theme.palette.common.white }} disabled={viewLoadingDelete} onClick={() => {
                            setViewLoadingDelete(true)
                            if (manageShiftDetailData?.uuid && manageShiftDetailData?.uuid !== null) {
                                dispatch(actionDeleteEmployeeShiftSchedule({
                                    uuid: manageShiftDetailData?.uuid
                                }))
                            }
                        }}>
                            {viewLoadingDelete ? <CircularProgress color="white" size={20} /> : 'Delete'}
                        </Button>
                    ]
                    }
                />
            }
        </React.Fragment>
    )
}