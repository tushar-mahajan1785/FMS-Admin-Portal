/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Card, Divider, Drawer, Grid, IconButton, Stack, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../../../../hooks/useAuth";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import React, { useEffect, useState } from "react";
import { actionPMActivityViewReport, resetPmActivityViewReportResponse } from "../../../../../store/pm-activity";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../../../constants";
import FormHeader from "../../../../../components/form-header";
import CloseIcon from "../../../../../assets/icons/CloseIcon";
import TypographyComponent from "../../../../../components/custom-typography";
import ReportAnalyticsIcon from "../../../../../assets/icons/ReportAnalyticsIcon";

export default function PMActivityViewReport({ open, objData, handleClose }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { logout } = useAuth();
    const { showSnackbar } = useSnackbar();

    const { pmActivityViewReport } = useSelector(
        (state) => state.pmActivityStore
    );

    const [pmActivityViewReportDetails, setPmActivityViewReportDetails] = useState(null);

    useEffect(() => {
        if (open === true) {
            if (objData && objData !== null && objData?.history_uuid && objData?.history_uuid !== null) {
                dispatch(actionPMActivityViewReport({ uuid: objData?.history_uuid }));
            }
        }
    }, [objData, open]);

    useEffect(() => {
        if (pmActivityViewReport && pmActivityViewReport !== null) {
            dispatch(resetPmActivityViewReportResponse());
            if (pmActivityViewReport?.result === true) {
                setPmActivityViewReportDetails(pmActivityViewReport?.response);
            } else {
                setPmActivityViewReportDetails(null);
                switch (pmActivityViewReport?.status) {
                    case UNAUTHORIZED:
                        logout();
                        break;
                    case ERROR:
                        dispatch(resetPmActivityViewReportResponse());
                        break;
                    case SERVER_ERROR:
                        showSnackbar({
                            message: pmActivityViewReport?.message,
                            severity: "error",
                        });
                        break;
                    default:
                        break;
                }
            }
        }
    }, [pmActivityViewReport]);

    return (
        <React.Fragment>
            <Drawer
                open={open}
                anchor="right"
                variant="temporary"
                onClose={handleClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: { xs: "100%", md: "100%", lg: "100%", xl: 1100 },
                    },
                    overflow: "hidden",
                }}
            >
                <Stack
                    sx={{ height: "100%" }}
                    justifyContent={"flex-start"}
                    flexDirection={"column"}
                >
                    <FormHeader
                        color={theme.palette.primary[600]}
                        size={48}
                        icon={<ReportAnalyticsIcon stroke={theme.palette.primary[600]} size={20} />}
                        title={
                            pmActivityViewReportDetails?.pm_activity?.activity_title &&
                                pmActivityViewReportDetails?.pm_activity?.activity_title !== null
                                ? pmActivityViewReportDetails?.pm_activity?.activity_title
                                : "PM Activity Report"
                        }
                        subtitle={`Activity Number: #${pmActivityViewReportDetails?.id}`}
                        actions={[
                            <IconButton onClick={handleClose}>
                                <CloseIcon size={16} />
                            </IconButton>,
                        ]}
                    />
                    <Divider sx={{ m: 2 }} />

                    <Box sx={{ m: 2 }}>
                        {/* Activity Overview */}
                        <Stack>
                            <TypographyComponent fontSize={16} fontWeight={600} mb={2}>
                                Activity Overview
                            </TypographyComponent>
                        </Stack>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "none", border: `1px solid ${theme.palette.primary[300]}`, background: theme.palette.primary[100] }}>
                            <Grid container spacing={4} sx={{ width: "100%" }}>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        fontSize={14}
                                        fontWeight={500}
                                        variant="body2"
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        PM Activity Title
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.pm_activity?.activity_title || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        variant="body2"
                                        color="text.secondary"
                                        fontSize={14}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        Asset Name
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.asset_name || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        variant="body2"
                                        color="text.secondary"
                                        fontSize={14}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        Asset Type
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.asset_type || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        variant="body2"
                                        color="text.secondary"
                                        fontSize={14}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        Frequency
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.pm_activity?.frequency || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        variant="body2"
                                        color="text.secondary"
                                        fontSize={14}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        Status
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.pm_activity?.status || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        variant="body2"
                                        color="text.secondary"
                                        fontSize={14}
                                        fontWeight={500}
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        Location
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.location || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                            </Grid>
                        </Card>
                    </Box>
                </Stack>
            </Drawer>
        </React.Fragment>
    )
}