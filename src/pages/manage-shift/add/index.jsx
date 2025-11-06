/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
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

    // initial render
    useEffect(() => {
        if (open === true) {
            setActivePage('Preview')
            if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
                dispatch(actionRosterGroupMasterList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            }
        }
    }, [branch?.currentBranch, open])

    useEffect(() => {
        if (open === true) {
            if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData?.roster_group_uuid && rosterData?.roster_group_uuid !== null) {
                dispatch(actionEmployeeShiftScheduleMasterList({
                    branch_uuid: branch?.currentBranch?.uuid,
                    roster_group_uuid: rosterData?.roster_group_uuid
                }))
            } else if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData?.roster_group_uuid === null) {
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
                setEmployeeShiftScheduleMasterOption(employeeShiftScheduleMasterList?.response)
                setEmployeeShiftScheduleMasterOriginalData(employeeShiftScheduleMasterList?.response)
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
                let objData = Object.assign({}, rosterData)
                objData.roster_group_id = rosterGroupMasterList?.response[1]?.id
                objData.roster_group_uuid = rosterGroupMasterList?.response[1]?.uuid
                dispatch(actionRosterData(objData))
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
                    title="Create New Shift"
                    subtitle="Fill below form to add new asset"

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
                                                    '.MuiTypography-root': { fontWeight: rosterData?.schedule_type === 'Weekly' ? 600 : 400, fontSize: 14 },
                                                    color: rosterData?.schedule_type === 'Weekly' ? theme.palette.grey[700] : theme.palette.grey[600]
                                                }}
                                                control={
                                                    <AntSwitch
                                                        checked={rosterData?.schedule_type === 'Weekly'}
                                                        onChange={() => {
                                                            let objData = Object.assign({}, rosterData)
                                                            objData.schedule_type = 'Weekly'
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
                                                    '.MuiTypography-root': { fontWeight: rosterData?.schedule_type === 'Monthly' ? 600 : 400, fontSize: 14 },
                                                    color: rosterData?.schedule_type === 'Monthly' ? theme.palette.grey[700] : theme.palette.grey[600]
                                                }}
                                                control={
                                                    <AntSwitch
                                                        checked={rosterData?.schedule_type === 'Monthly'}
                                                        onChange={() => {
                                                            let objData = Object.assign({}, rosterData)
                                                            objData.schedule_type = 'Monthly'
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
                {
                    activePage === 'Preview' ?
                        <Box
                            sx={{
                                borderRadius: '16px',
                                padding: "16px",
                                gap: '24px',
                                bgcolor: theme.palette.grey[100],
                                m: 2,
                                overflowX: "auto"
                            }}>
                            <Grid
                                container
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                    fontWeight: 600,
                                    minWidth: isMDDown ? "1600px" : '',
                                }}
                            >
                                <Grid size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }} display="flex" alignItems="center">
                                    <Typography fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>
                                        Weekdays
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} container>
                                    {weekdays && weekdays.length > 0 && weekdays.map((day, index) => (
                                        <Grid size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }} key={index} textAlign="center">
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

                            <Stack sx={{ gap: 2, mt: 2 }}>
                                {employeeShiftScheduleMasterOption && employeeShiftScheduleMasterOption.length > 0 && employeeShiftScheduleMasterOption?.map((emp, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            overflowX: "auto",
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                            borderRadius: "8px",
                                            bgcolor: theme.palette.common.white,
                                            minWidth: isMDDown ? "1600px" : '',
                                        }}
                                    >
                                        <Grid
                                            container
                                            alignItems="center"
                                            sx={{
                                                p: 2,
                                                minWidth: isMDDown ? "1600px" : '', // important for scrollable area
                                            }}
                                        >
                                            <Grid size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }} display="flex" alignItems="center" gap={1.5}>
                                                <FormControlLabel
                                                    sx={{
                                                        m: 0,
                                                        gap: 1,
                                                        ".MuiTypography-root": {
                                                            fontWeight: emp.status === 'Active' ? 600 : 400,
                                                            fontSize: 14,
                                                        },
                                                        color:
                                                            emp.status === 'Active'
                                                                ? theme.palette.grey[700]
                                                                : theme.palette.grey[600],
                                                    }}
                                                    control={
                                                        <AntSwitch
                                                            checked={emp.status === 'Active'}
                                                            onChange={() => {
                                                                let objData = Object.assign([], employeeShiftScheduleMasterOption)
                                                                const updated = objData.map((item, i) =>
                                                                    i === index
                                                                        ? {
                                                                            ...item,
                                                                            status: item.status === "Active" ? "Inactive" : "Active",
                                                                        }
                                                                        : item
                                                                );

                                                                setEmployeeShiftScheduleMasterOption(updated)
                                                            }}
                                                        />
                                                    }
                                                />
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
                                            <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} container>
                                                {weekdays && weekdays?.length > 0 && emp.status === 'Active' &&
                                                    weekdays.map((day, dayIndex) => (
                                                        <Grid
                                                            size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }}
                                                            key={dayIndex}
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                            gap={0.5}
                                                        >
                                                            {emp?.shifts?.map((s, shiftIndex) => {
                                                                const selectedDate = moment(day).format("YYYY-MM-DD");
                                                                const isSelected = emp.shift_selection?.[selectedDate] === s.short_name;
                                                                const currentColor = getCurrentColor(s.short_name, isSelected);
                                                                return (
                                                                    <Button
                                                                        key={`${moment(day).format('YYYY-MM-DD')}-${dayIndex}-${shiftIndex}`}
                                                                        size="small"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            minWidth: 32,
                                                                            height: 32,
                                                                            borderRadius: 1,
                                                                            fontSize: 12,
                                                                            textTransform: "none",
                                                                            p: 0,
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
                                                                            const selectedDate = moment(day).format("YYYY-MM-DD");
                                                                            setEmployeeShiftScheduleMasterOption(prev =>
                                                                                prev.map((empItem, empIndex) => {
                                                                                    if (empIndex !== index) return empItem;

                                                                                    const currentShift = empItem.shift_selection?.[selectedDate];
                                                                                    const newSelection = { ...empItem.shift_selection };

                                                                                    if (currentShift === s.short_name) {
                                                                                        // Deselect if same shift clicked again
                                                                                        delete newSelection[selectedDate];
                                                                                    } else {
                                                                                        // Select new shift for that date
                                                                                        newSelection[selectedDate] = s.short_name;
                                                                                    }

                                                                                    return {
                                                                                        ...empItem,
                                                                                        shift_selection: newSelection,
                                                                                    };
                                                                                })
                                                                            );
                                                                        }}
                                                                    >
                                                                        {s?.short_name}
                                                                    </Button>
                                                                );
                                                            })}
                                                        </Grid>
                                                    ))}
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                        :
                        <Box
                            sx={{
                                borderRadius: '16px',
                                padding: "16px",
                                gap: '24px',
                                bgcolor: theme.palette.grey[100],
                                m: 2,
                                overflowX: "auto"
                            }}>
                            <Grid
                                container
                                sx={{
                                    px: 2,
                                    py: 1,
                                    borderBottom: `1px solid ${theme.palette.grey[300]}`,
                                    fontWeight: 600,
                                    minWidth: isMDDown ? "1600px" : '',
                                }}
                            >
                                <Grid size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }} display="flex" alignItems="center">
                                    <Typography fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>
                                        Weekdays
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} container>
                                    {weekdays && weekdays.length > 0 && weekdays.map((day, index) => (
                                        <Grid size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }} key={index} textAlign="center">
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

                            <Stack sx={{ gap: 2, mt: 2 }}>
                                {employeeShiftScheduleMasterOption && employeeShiftScheduleMasterOption.length > 0 && employeeShiftScheduleMasterOption?.map((emp, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            overflowX: "auto",
                                            border: `1px solid ${theme.palette.grey[300]}`,
                                            borderRadius: "8px",
                                            bgcolor: theme.palette.common.white,
                                            minWidth: isMDDown ? "1600px" : '',
                                        }}
                                    >
                                        <Grid
                                            container
                                            alignItems="center"
                                            sx={{
                                                p: 2,
                                                minWidth: isMDDown ? "1600px" : '', // important for scrollable area
                                            }}
                                        >
                                            <Grid size={{ xs: 2, sm: 2, md: 2, lg: 2, xl: 2 }} display="flex" alignItems="center" gap={1.5}>
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
                                            <Grid size={{ xs: 10, sm: 10, md: 10, lg: 10, xl: 10 }} container>
                                                {weekdays.map((day, dayIndex) => {
                                                    const selectedDate = moment(day).format("YYYY-MM-DD");
                                                    const selectedShortName = emp.shift_selection?.[selectedDate]; // ← the selected shift for that date
                                                    const currentColor = getDisplayCurrentColor(selectedShortName);

                                                    return (
                                                        <Grid
                                                            size={{ xs: 1.7, sm: 1.7, md: 1.7, lg: 1.7, xl: 1.7 }}
                                                            key={dayIndex}
                                                            display="flex"
                                                            justifyContent="center"
                                                            alignItems="center"
                                                        >
                                                            {selectedShortName && (
                                                                // ✅ Show only the selected shift button
                                                                <Button
                                                                    size="small"
                                                                    variant="outlined"
                                                                    sx={{
                                                                        minWidth: '168px',
                                                                        height: 32,
                                                                        borderRadius: 1,
                                                                        fontSize: 12,
                                                                        textTransform: "none",
                                                                        borderColor: currentColor.dark,
                                                                        color: currentColor.text,
                                                                        background: `linear-gradient(180deg, ${currentColor.light} 0%, ${currentColor.dark} 100%)`,
                                                                        transition: "all 0.2s ease",
                                                                        "&:hover": {
                                                                            background: `linear-gradient(180deg, ${currentColor.dark} 0%, ${currentColor.dark} 100%)`,
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
                }
                {/* Footer */}
                <Divider sx={{ mt: 2 }} />
                {
                    activePage === 'Preview' ?
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ p: 4 }}
                        >
                            <Button
                                sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                                disabled
                                variant="outlined"
                            >
                                Reset
                            </Button>
                            <Button
                                sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                                onClick={() => {
                                    const allValid = employeeShiftScheduleMasterOption.every(emp => {
                                        // Skip inactive employees
                                        if (emp.status !== "Active") return true;

                                        // For active employees, ensure all weekdays have selection
                                        return weekdays.every(day => {
                                            const dateKey = moment(day).format("YYYY-MM-DD");
                                            return emp.shift_selection?.[dateKey]; // must exist and not be undefined
                                        });
                                    });

                                    if (!allValid) {
                                        showSnackbar({ message: "Please select shift for all weekdays before publishing.", severity: "error" })
                                        return;
                                    }

                                    if (!rosterData?.schedule_type) {
                                        showSnackbar({ message: "Please select Roster Duration before publishing.", severity: "error" })
                                        return;
                                    }

                                    // ✅ proceed
                                    setActivePage("Publish");
                                }}
                                variant="contained"
                            >
                                Preview
                            </Button>
                        </Stack>
                        :
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{ p: 4 }}
                        >
                            <Button
                                sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                                onClick={() => {
                                    setActivePage('Preview')
                                }}
                                variant="outlined"
                            >
                                Previous
                            </Button>
                            <Button
                                sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                                onClick={() => {
                                    let input = {
                                        branch_uuid: branch?.currentBranch?.uuid,
                                        shift_schedule: employeeShiftScheduleMasterOption,
                                        roster_group_id: rosterData?.roster_group_id,
                                        schedule_type: rosterData?.schedule_type,
                                    }
                                    let updated = Object.assign({}, input)
                                    if (objData && objData !== null && objData.formType && objData.formType === 'edit' && objData.uuid && objData.uuid !== null) {
                                        updated.id = objData.uuid
                                    }
                                    dispatch(actionAddEmployeeShiftSchedule(updated))
                                }}
                                disabled={loading}
                                variant="contained"
                            >

                                {loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Publish'}
                            </Button>
                        </Stack>

                }

            </Stack>
        </Drawer>
    );
}
