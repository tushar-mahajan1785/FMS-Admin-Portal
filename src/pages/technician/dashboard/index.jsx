/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useTheme } from "@emotion/react";
import { Box, Button, Chip, Divider, Grid, Stack } from "@mui/material";
import { TechnicianNavbarHeader } from "../../../components/technician/navbar-header";
import TypographyComponent from "../../../components/custom-typography";
import { getInitials } from "../../../utils";

export default function TechnicianDashboard() {
    const theme = useTheme()
    //   const dispatch = useDispatch()

    const [overviewChecklists, setOverviewChecklists] = useState([])
    const [teamMembersShift, setTeamMembersShift] = useState([])
    const [abnormalSuggestionData, setAbnormalSuggestionData] = useState([])

    /**
     * Initial Render
     */
    useEffect(() => {
        setOverviewChecklists([
            {
                title: "Pending",
                count: 0
            },
            {
                title: "Missed",
                count: 0
            },
            {
                title: "Completed",
                count: 0
            }
        ])
        setTeamMembersShift([
            {
                name: "Ramesh Jadhav",
                group: 'Tower B1',
                status: 'Present'
            },
            {
                name: "Amit Shinde",
                group: 'Tower A1',
                status: 'Absent'
            },
            {
                name: "Avinash Borhade",
                group: 'Tower A2',
                status: 'Present'
            },
        ])
        setAbnormalSuggestionData([
            {
                title: 'Abnormal Pattern Detected',
                description: 'Temperature readings in HVAC-A01 have been consistently high. Consider creating a ticket.'
            },
            {
                title: 'Abnormal Pattern Detected',
                description: 'Temperature readings in HVAC-A01 have been consistently high. Consider creating a ticket.'
            },
        ])
    }, [])

    return (
        <Stack rowGap={2} sx={{ overflowY: 'scroll', paddingBottom: 10 }}>
            <TechnicianNavbarHeader />
            <Box
                sx={{
                    background: theme.palette.primary[600],
                    color: "white",
                    p: 2,
                    borderRadius: "8px",
                    width: "100%",
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
                }}
            >
                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    columnGap: 2,
                    rowGap: 1
                }}>
                    {/* LEFT TOP */}
                    <Stack sx={{ rowGap: 0.5 }}>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                            04 Dec 2025
                        </TypographyComponent>

                        <TypographyComponent fontSize={18} fontWeight={500}>
                            1st Shift
                        </TypographyComponent>
                    </Stack>

                    {/* RIGHT TOP */}
                    <Stack sx={{ rowGap: 0.5, alignItems: "flex-start" }}>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                            Technician
                        </TypographyComponent>

                        <TypographyComponent fontSize={18} fontWeight={500}>
                            Rahul Patil
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
                            DG Set Floor 1
                        </TypographyComponent>
                    </Stack>

                    {/* RIGHT BOTTOM */}
                    <Stack sx={{ rowGap: 0.3, alignItems: "flex-start" }}>
                        <TypographyComponent fontSize={14} fontWeight={400} sx={{ color: theme.palette.grey[200] }}>
                            Shift Supervisor
                        </TypographyComponent>

                        <TypographyComponent fontSize={18} fontWeight={400}>
                            Rajesh Sharma
                        </TypographyComponent>
                    </Stack>
                </Box>
            </Box>
            <Stack sx={{ rowGap: 1 }}>
                <TypographyComponent fontSize={18} fontWeight={500}>Today’s Checklist Overview</TypographyComponent>
                <Grid container spacing={1} sx={{ maxWidth: '100%' }}>
                    {
                        overviewChecklists && overviewChecklists !== null && overviewChecklists.length > 0 ?
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
                        teamMembersShift && teamMembersShift !== null && teamMembersShift.length > 0 ?
                            teamMembersShift.map((objChecklist, index) => {
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
                                            {objChecklist?.image_url ?
                                                <img
                                                    src={objChecklist.image_url}
                                                    alt={objChecklist.name}
                                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                                />
                                                :
                                                getInitials(objChecklist?.name)
                                            }
                                        </Box>
                                        <Stack sx={{ textAlign: 'left' }}>
                                            <TypographyComponent fontSize={18} fontWeight={400}>{objChecklist?.name !== null ? objChecklist?.name : ''}</TypographyComponent>
                                            <TypographyComponent fontSize={14} fontWeight={500} sx={{ color: theme.palette.grey[500] }}>{objChecklist?.group && objChecklist?.group !== null ? objChecklist?.group : ''}</TypographyComponent>
                                        </Stack>
                                    </Stack>
                                    <Stack>
                                        <Chip size="small" sx={{ bgcolor: objChecklist.status == 'Present' ? theme.palette.success[600] : theme.palette.error[600], color: theme.palette.common.white }} label={objChecklist.status} />
                                    </Stack>
                                </Stack>
                                )
                            })
                            :
                            <></>
                    }
                </Stack>
            </Stack>
            <Stack sx={{ rowGap: 1 }}>
                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TypographyComponent fontSize={18} fontWeight={500}>Smart Suggestions</TypographyComponent>
                    <TypographyComponent fontSize={14} fontWeight={400}>View All</TypographyComponent>
                </Stack>
                {
                    abnormalSuggestionData && abnormalSuggestionData !== null && abnormalSuggestionData.length > 0 ?
                        abnormalSuggestionData.map((obj, index) => {
                            return (<Stack key={index} sx={{ mb: 1, background: theme.palette.warning[50], padding: '16px', border: `1px solid ${theme.palette.warning[200]}`, borderRadius: '8px', lineHeight: '20px', gap: 0.8 }}>
                                <TypographyComponent fontSize={16} fontWeight={500}>{obj?.title}</TypographyComponent>
                                <TypographyComponent fontSize={14} fontWeight={400}>{obj?.description}</TypographyComponent>
                                <Button sx={{ color: theme.palette.common.white, background: theme.palette.common.black, textTransform: 'capitalize' }}>Create Ticket</Button>
                            </Stack>)
                        })
                        :
                        <></>
                }
            </Stack>
        </Stack >
    );
}
