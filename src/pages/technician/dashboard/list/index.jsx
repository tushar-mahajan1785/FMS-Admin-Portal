/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box, Button, Divider, Grid, IconButton, Stack } from "@mui/material";
import { TechnicianNavbarHeader } from "../../../../components/technician/navbar-header";
import TypographyComponent from "../../../../components/custom-typography";
import { getInitials } from "../../../../utils";
import { actionTechnicianDashboardDetails, resetTechnicianDashboardDetailsResponse } from "../../../../store/technician/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../hooks/useAuth";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { useBranch } from "../../../../hooks/useBranch";
import { ERROR, IMAGES_SCREEN_NO_DATA, SERVER_ERROR, UNAUTHORIZED } from "../../../../constants";
import moment from "moment";
import EmptyContent from "../../../../components/empty_content";
import { useNavigate } from "react-router-dom";

export default function TechnicianDashboardList() {
    const theme = useTheme()
    const dispatch = useDispatch()
    const { logout } = useAuth()
    const { showSnackbar } = useSnackbar()
    const branch = useBranch()
    const navigate = useNavigate();

    // store
    const { technicianDashboardDetails } = useSelector(state => state.technicianDashboardStore)

    const [overviewChecklists, setOverviewChecklists] = useState([
        {
            title: "Pending",
            count: 3,
            key: 'pending'
        },
        {
            title: "Missed",
            count: 0,
            key: 'missing'
        },
        {
            title: "Completed",
            count: 12,
            key: 'completed'
        }
    ])
    const [teamMembersShift, setTeamMembersShift] = useState([])
    const [abnormalSuggestionData, setAbnormalSuggestionData] = useState([])
    const [activeIndex, setActiveIndex] = useState(0);
    // Touch tracking
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    /**
     * Initial Render
     */
    useEffect(() => {
        if (branch?.currentBranch?.uuid && branch?.currentBranch?.uuid !== null) {
            dispatch(actionTechnicianDashboardDetails({ branch_uuid: branch?.currentBranch?.uuid }))
        }
        return (() => {
            dispatch(resetTechnicianDashboardDetailsResponse())
        })
    }, [branch?.currentBranch])

    /**
      * useEffect
      * @dependency : technicianDashboardDetails
      * @type : HANDLE API RESULT
      * @description : Handle the result of technician Dashboard Details API
     */
    useEffect(() => {
        if (technicianDashboardDetails && technicianDashboardDetails !== null) {
            if (technicianDashboardDetails?.result === true) {
                let objData = technicianDashboardDetails?.response?.checklist_overall_counts
                setOverviewChecklists(prevArr =>
                    prevArr?.map(item => ({
                        ...item,
                        count: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                setTeamMembersShift(technicianDashboardDetails?.response?.groupWiseShifts)
                setAbnormalSuggestionData(technicianDashboardDetails?.response?.abnormal_checklists)
            } else {
                let objData = {
                    pending: 0,
                    missing: 0,
                    completed: 0
                }
                setOverviewChecklists(prevArr =>
                    prevArr?.map(item => ({
                        ...item,
                        count: objData[item.key] !== undefined ? objData[item.key] : 0
                    }))
                );
                setTeamMembersShift([])
                setAbnormalSuggestionData([])
                switch (technicianDashboardDetails?.status) {
                    case UNAUTHORIZED:
                        logout()
                        break
                    case ERROR:
                        dispatch(resetTechnicianDashboardDetailsResponse())
                        break
                    case SERVER_ERROR:
                        showSnackbar({ message: technicianDashboardDetails?.message, severity: "error" })
                        break
                    default:
                        break
                }
            }
        }
    }, [technicianDashboardDetails])

    const activeShift = useMemo(() => {
        if (
            teamMembersShift &&
            teamMembersShift.length > 0 &&
            activeIndex >= 0 &&
            activeIndex < teamMembersShift.length
        ) {
            return teamMembersShift[activeIndex];
        }
        return null;
    }, [teamMembersShift, activeIndex]);

    const handleNext = () => {
        setActiveIndex((prev) =>
            prev === teamMembersShift?.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrev = () => {
        setActiveIndex((prev) =>
            prev === 0 ? teamMembersShift?.length - 1 : prev - 1
        );
    };

    // 👉 SWIPE LOGIC
    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeDistance = touchStartX.current - touchEndX.current;

        // Minimum swipe distance (px)
        if (Math.abs(swipeDistance) < 50) return;

        if (swipeDistance > 0) {
            // Swipe left
            handleNext();
        } else {
            // Swipe right
            handlePrev();
        }
    };

    const getShiftName = (shortname) => {
        switch (shortname) {
            case "G":
                return "General Shift";
            case "1":
                return "First Shift";
            case "2":
                return "Second Shift";
            case "3":
                return "Third Shift";
            case "W":
                return "Weekend Off";
            default:
                break;
        }
    }

    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader />
            {activeShift ? (
                <Box
                    key={activeIndex}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    sx={{
                        background: theme.palette.primary[600],
                        color: "white",
                        p: 2,
                        borderRadius: "8px",
                        width: "100%",
                        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                        animation: "fade 0.3s ease-in-out",
                        touchAction: "pan-y",
                        "@keyframes fade": {
                            from: { opacity: 0.6 },
                            to: { opacity: 1 },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            columnGap: 2,
                            rowGap: 1,
                        }}
                    >
                        {/* LEFT TOP */}
                        <Stack sx={{ rowGap: 0.5 }}>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                {moment(activeShift?.current_date).format("DD MMM YYYY")}
                            </TypographyComponent>

                            <TypographyComponent fontSize={18} fontWeight={500}>
                                {getShiftName(activeShift?.shift_name)}
                                {console.log("activeShift?.shift_name", activeShift?.shift_name)}
                                {console.log("activeShift", activeShift)}

                            </TypographyComponent>
                        </Stack>

                        {/* RIGHT TOP */}
                        <Stack sx={{ rowGap: 0.5, alignItems: "flex-start" }}>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                Technician
                            </TypographyComponent>

                            <TypographyComponent fontSize={18} fontWeight={500}>
                                {activeShift?.employee_name}
                            </TypographyComponent>
                        </Stack>
                    </Box>

                    <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.4)" }} />

                    <Box sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        columnGap: 2,
                        rowGap: 1
                    }}>
                        {/* LEFT BOTTOM */}
                        <Stack sx={{ rowGap: 0.3 }}>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                Shift Details
                            </TypographyComponent>

                            <TypographyComponent fontSize={18} fontWeight={400}>
                                {activeShift?.roster_group_name}
                            </TypographyComponent>
                        </Stack>

                        {/* RIGHT BOTTOM */}
                        <Stack sx={{ rowGap: 0.3, alignItems: "flex-start" }}>
                            <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                Shift Supervisor
                            </TypographyComponent>

                            <TypographyComponent fontSize={18} fontWeight={400}>
                                {activeShift?.shift_supervisor}
                            </TypographyComponent>
                        </Stack>
                    </Box>

                </Box>
            )
                :
                (
                    <Box
                        sx={{
                            background: theme.palette.primary[600],
                            color: "white",
                            p: 2,
                            borderRadius: "8px",
                            width: "100%",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                            animation: "fade 0.3s ease-in-out",
                            touchAction: "pan-y",
                            "@keyframes fade": {
                                from: { opacity: 0.6 },
                                to: { opacity: 1 },
                            },
                        }}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                columnGap: 2,
                                rowGap: 1,
                            }}
                        >
                            {/* LEFT TOP */}
                            <Stack sx={{ rowGap: 0.5 }}>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                    Shift Date
                                </TypographyComponent>

                                <TypographyComponent fontSize={18} fontWeight={500}>
                                    --
                                </TypographyComponent>
                            </Stack>

                            {/* RIGHT TOP */}
                            <Stack sx={{ rowGap: 0.5, alignItems: "flex-start" }}>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                    Technician
                                </TypographyComponent>

                                <TypographyComponent fontSize={18} fontWeight={500}>
                                    --
                                </TypographyComponent>
                            </Stack>
                        </Box>

                        <Divider sx={{ my: 1.5, borderColor: "rgba(255,255,255,0.4)" }} />

                        <Box sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            columnGap: 2,
                            rowGap: 1
                        }}>
                            {/* LEFT BOTTOM */}
                            <Stack sx={{ rowGap: 0.3 }}>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                    Shift Details
                                </TypographyComponent>

                                <TypographyComponent fontSize={18} fontWeight={400}>
                                    --
                                </TypographyComponent>
                            </Stack>

                            {/* RIGHT BOTTOM */}
                            <Stack sx={{ rowGap: 0.3, alignItems: "flex-start" }}>
                                <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                                    Shift Supervisor
                                </TypographyComponent>

                                <TypographyComponent fontSize={18} fontWeight={400}>
                                    --
                                </TypographyComponent>
                            </Stack>
                        </Box>

                    </Box>
                )
            }
            {teamMembersShift?.length > 1 && (
                <Stack
                    direction="row"
                    justifyContent="center"
                    spacing={1}
                >
                    {teamMembersShift.map((_, index) => (
                        <Box
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                backgroundColor:
                                    index === activeIndex
                                        ? theme.palette.primary.main
                                        : theme.palette.grey[400],
                                transform:
                                    index === activeIndex ? "scale(1.3)" : "scale(1)",
                            }}
                        />
                    ))}
                </Stack>
            )}
            <Stack sx={{ rowGap: 1 }}>
                <TypographyComponent fontSize={18} fontWeight={500}>Today’s Checklist Overview</TypographyComponent>
                <Grid container spacing={1} sx={{ maxWidth: '100%' }}>
                    {
                        overviewChecklists && overviewChecklists !== null && overviewChecklists?.length > 0 ?
                            overviewChecklists.map((objChecklist, index) => {
                                return (<Grid size={{ xs: 4, sm: 4 }} sx={{ background: theme.palette.common.white, justifyContent: 'center', alignItems: 'center', p: 2.5, textAlign: 'center', borderRadius: '8px' }} key={index}>
                                    <TypographyComponent fontSize={24} fontWeight={600}>{objChecklist?.count !== null ? objChecklist?.count?.toString().padStart(2, "0") : '00'}</TypographyComponent>
                                    <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{objChecklist?.title}</TypographyComponent>
                                </Grid>
                                )
                            })
                            :
                            <></>
                    }
                </Grid>
            </Stack>
            <Stack sx={{ rowGap: 1 }}>
                <TypographyComponent fontSize={18} fontWeight={500}>Team Members in Shift</TypographyComponent>
                <Stack sx={{ maxWidth: '100%', background: theme.palette.common.white, borderRadius: '8px' }}>
                    {
                        activeShift?.team_members && activeShift?.team_members !== null && activeShift?.team_members?.length > 0 ?
                            activeShift?.team_members.map((member, index) => {
                                return (<Stack
                                    sx={{ flexDirection: 'row', justifyContent: 'space-between', borderBottom: `1px solid ${theme.palette.grey[100]}`, alignItems: 'flex-start', p: '16px', textAlign: 'center' }}
                                    key={index}
                                >
                                    <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
                                        <Box
                                            sx={{
                                                height: 37,
                                                width: 37,
                                                borderRadius: '50%',
                                                flexShrink: 0,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 14,
                                                fontWeight: 400,
                                                backgroundColor: theme.palette.primary[600], // Updated to use main primary color as in the screenshot
                                                color: theme.palette.common.white, // White text for initials
                                            }}
                                        >
                                            {getInitials(member.employee_name)}
                                        </Box>
                                        <Stack sx={{ textAlign: 'left' }}>
                                            <TypographyComponent fontSize={18} fontWeight={400}>{member?.employee_name !== null ? member?.employee_name : ''}</TypographyComponent>
                                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{member?.role_type && member?.role_type !== null ? member?.role_type : ''}</TypographyComponent>
                                        </Stack>
                                    </Stack>

                                </Stack>
                                )
                            })
                            :
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Team Members in Shift Found'} subTitle={''} />
                    }
                </Stack>
            </Stack>
            <Stack sx={{ rowGap: 1 }}>
                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TypographyComponent fontSize={18} fontWeight={500}>Smart Suggestions</TypographyComponent>
                    {abnormalSuggestionData?.length > 2 && (
                        <TypographyComponent
                            fontSize={14}
                            fontWeight={400}
                            onClick={() => {
                                navigate('view')
                            }}
                        >View All
                        </TypographyComponent>
                    )}
                </Stack>
                {
                    abnormalSuggestionData && abnormalSuggestionData !== null && abnormalSuggestionData.length > 0 ?
                        abnormalSuggestionData.slice(0, 2).map((obj, index) => {
                            return (<Stack key={index} sx={{ mb: 1, background: theme.palette.warning[50], padding: '16px', border: `1px solid ${theme.palette.warning[200]}`, borderRadius: '8px', lineHeight: '20px', gap: 0.8 }}>
                                <TypographyComponent fontSize={16} fontWeight={500}>{obj?.asset_name}</TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={400}>{obj?.reason}</TypographyComponent>
                                <Button sx={{ color: theme.palette.common.white, background: theme.palette.common.black, textTransform: 'capitalize' }}>Create Ticket</Button>
                            </Stack>)
                        })
                        :
                        <Stack sx={{ maxWidth: '100%', background: theme.palette.common.white, borderRadius: '8px' }}>
                            <EmptyContent imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND} title={'No Smart Suggestions Found'} subTitle={''} />
                        </Stack>
                }
            </Stack>
        </Stack >
    );
}
