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

export default function CreateShiftDrawer({ open, handleClose }) {
    const theme = useTheme()
    const dispatch = useDispatch()
    const branch = useBranch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()

    // store
    const { rosterData, addEmployeeShiftSchedule, employeeShiftScheduleMasterList, rosterGroupMasterList } = useSelector(state => state.rosterStore)

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false)
    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf("week"));
    const [searchQuery, setSearchQuery] = useState('')
    const [employeeShiftScheduleMasterOption, setEmployeeShiftScheduleMasterOption] = useState([])
    const [employeeShiftScheduleMasterOriginalData, setEmployeeShiftScheduleMasterOriginalData] = useState([])
    const [groupMasterOption, setGroupMasterOption] = useState([])
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    // const weekdays = Array.from({ length: 30 }, (_, i) => (i + 1).toString());

    // initial render
    useEffect(() => {
        if (open === true) {
            if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
                dispatch(actionRosterGroupMasterList({
                    branch_uuid: branch?.currentBranch?.uuid
                }))
            }
        }
    }, [branch?.currentBranch, open])

    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null && rosterData?.roster_group_uuid && rosterData?.roster_group_uuid !== null) {
            dispatch(actionEmployeeShiftScheduleMasterList({
                branch_uuid: branch?.currentBranch?.uuid,
                roster_group_uuid: rosterData?.roster_group_uuid
            }))
        }else{
            dispatch(actionEmployeeShiftScheduleMasterList({
                branch_uuid: branch?.currentBranch?.uuid
            }))
        }
    }, [branch?.currentBranch, rosterData?.roster_group_uuid])

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
                objData.status = 1
                objData.schedule_type = 'Weekly'
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
                setActiveStep(0);
                toast.dismiss()
                showSnackbar({ message: addEmployeeShiftSchedule?.message, severity: "success" })
                setLoading(false)
            } else {
                handleClose()
                setActiveStep(0);
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

    const weekRangeText = `${currentWeekStart.format("D MMM")} - ${moment(currentWeekStart)
        .endOf("week")
        .format("D MMM")}`;

    const handleNext = () => {
        if (!isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        } else {
            setLoading(true)
            dispatch(actionAddEmployeeShiftSchedule({
                branch_uuid: branch?.currentBranch?.uuid,
                schedules: rosterData?.schedules,
                roster_group_id: rosterData?.roster_group_id,
                uuid: rosterData?.uuid,
                status: rosterData?.status,
                schedule_type: rosterData?.schedule_type
            }))
        }
    };

    const handleBack = () => {
        if (isLastStep) {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        } else {
            setActiveStep(0);
        }
    };

    const isLastStep = activeStep === activeStep - 1;

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
                        <Button
                            startIcon={<UserIcon stroke={theme.palette.grey[700]} size={18} />}
                            variant="outlined"
                            size="small"
                            color={theme.palette.grey[700]}
                            sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}
                        >
                            Add new member to this group
                        </Button>
                        <Box display="flex" alignItems="center" sx={{ paddingY: '10px', paddingX: '16px', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: '8px' }}>
                            {
                                rosterData?.schedule_type && rosterData?.schedule_type !== null && rosterData?.schedule_type === 'Monthly' &&
                                (
                                    <Tooltip title="Previous Week">
                                        <IconButton size="small" onClick={handlePreviousWeek}>
                                            <ChevronLeft fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                            <Typography fontWeight={600} fontSize={14} minWidth="100px" textAlign="center">
                                {weekRangeText}
                            </Typography>
                            {
                                rosterData?.schedule_type && rosterData?.schedule_type !== null && rosterData?.schedule_type === 'Monthly' &&
                                (
                                    <Tooltip title="Next Week">
                                        <IconButton size="small" onClick={handleNextWeek}>
                                            <ChevronRight fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                        </Box>
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
                <Box
                    sx={{
                        borderRadius: '16px',
                        padding: "16px",
                        gap: '24px',
                        bgcolor: theme.palette.grey[100],
                        m: 2
                    }}>
                    {/* Table header */}
                    <Box display="flex" px={2} py={1} fontWeight={600}>
                        <Stack flex={1.2}>
                            <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>Weekdays</TypographyComponent>
                        </Stack>
                        {weekdays.map((d) => (
                            <Stack key={d} flex={1} textAlign="center" >
                                <TypographyComponent fontSize={16} fontWeight={500} sx={{ color: theme.palette.grey[600] }}>
                                    {d}
                                </TypographyComponent>
                            </Stack>

                        ))}
                    </Box>
                    <Stack sx={{ gap: 2 }}>
                        {/* Employee rows */}
                        {
                            employeeShiftScheduleMasterOption && employeeShiftScheduleMasterOption !== null && employeeShiftScheduleMasterOption.length > 0 &&
                            employeeShiftScheduleMasterOption.map((emp, index) => (
                                <Box
                                    key={index}
                                    display="flex"
                                    alignItems="center"
                                    padding={'16px'}
                                    bgcolor={theme.palette.common.white}
                                    border={`1px solid ${theme.palette.grey[300]}`}
                                    borderRadius={'8px'}
                                >
                                    <Box flex={1.2} display="flex" alignItems="center" gap={1.5}>
                                        <FormControlLabel
                                            sx={{
                                                m: 0,
                                                gap: 1,
                                                '.MuiTypography-root': { fontWeight: rosterData?.status === 1 ? 600 : 400, fontSize: 14 },
                                                color: rosterData?.status === 1 ? theme.palette.grey[700] : theme.palette.grey[600]
                                            }}
                                            control={
                                                <AntSwitch
                                                    checked={rosterData?.status === 1}
                                                    onChange={() => {
                                                        let objData = Object.assign({}, rosterData)
                                                        objData.status = 1
                                                        objData.employee_id = emp?.employee_id
                                                        dispatch(actionRosterData(objData))
                                                    }}
                                                />
                                            }
                                        />
                                        <Box>
                                            <TypographyComponent
                                                fontSize={16}
                                                fontWeight={500}
                                                sx={{ color: theme.palette.grey[600] }}
                                                title={emp?.employee_name}
                                            >
                                                {_.truncate(emp?.employee_name, { length: 20 })}
                                            </TypographyComponent>
                                            {
                                                emp?.is_manager === 1 &&
                                                (
                                                    <TypographyComponent
                                                        fontSize={14}
                                                        fontWeight={400}
                                                        sx={{ color: theme.palette.grey[500] }}
                                                        title={emp?.employee_name}
                                                    >
                                                        {emp?.role_type}
                                                    </TypographyComponent>
                                                )
                                            }
                                        </Box>
                                    </Box>
                                    {weekdays &&
                                        rosterData?.status === 1 &&
                                        weekdays.map((day) => (
                                            <Box
                                                key={day}
                                                flex={1}
                                                display="flex"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={0.5}
                                            >
                                                {emp?.shifts &&
                                                    emp?.shifts.length > 0 &&
                                                    emp?.shifts.map((s, shiftIndex) => {
                                                        // Get currently selected short_name for this employee + day
                                                        const selectedShortName =
                                                            rosterData?.shiftSelections?.[emp.employee_id]?.[day] || null;

                                                        // Check if this shift button is selected
                                                        const isSelected = selectedShortName === s?.short_name;

                                                        // Determine colors
                                                        const currentColor = getCurrentColor(s?.short_name, isSelected);

                                                        return (
                                                            <Button
                                                                key={shiftIndex}
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
                                                                    const objData = { ...rosterData };

                                                                    // Ensure nested structures exist
                                                                    if (!objData.shiftSelections) objData.shiftSelections = {};
                                                                    if (!objData.shiftSelections[emp.employee_id])
                                                                        objData.shiftSelections[emp.employee_id] = {};

                                                                    // Toggle logic (select/deselect)
                                                                    const currentVal =
                                                                        objData.shiftSelections[emp.employee_id][day];
                                                                    objData.shiftSelections[emp.employee_id][day] =
                                                                        currentVal === s?.short_name ? null : s?.short_name;

                                                                    // Force new object reference for re-render
                                                                    objData.shiftSelections = {
                                                                        ...objData.shiftSelections,
                                                                        [emp.employee_id]: {
                                                                            ...objData.shiftSelections[emp.employee_id],
                                                                        },
                                                                    };

                                                                    dispatch(actionRosterData(objData));
                                                                }}
                                                            >
                                                                {s?.short_name}
                                                            </Button>
                                                        );
                                                    })}
                                            </Box>
                                        ))}

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
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderColor: `${theme.palette.grey[300]}`, color: `${theme.palette.grey[700]}`, borderRadius: '8px', fontSize: 16, fontWeight: 600 }}
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        variant="outlined"
                    >
                        {isLastStep ? 'Previous' : 'Reset'}
                    </Button>
                    <Button
                        sx={{ textTransform: "capitalize", px: 6, borderRadius: '8px', backgroundColor: theme.palette.primary[600], color: theme.palette.common.white, fontSize: 16, fontWeight: 600, borderColor: theme.palette.primary[600] }}
                        onClick={handleNext}
                        variant="contained"
                        disabled={loading}
                    >
                        {isLastStep ? 'Publish' : loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : 'Preview'}
                    </Button>
                </Stack>
            </Stack>
        </Drawer>
    );
}
