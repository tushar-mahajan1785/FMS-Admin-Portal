/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, Dialog, Divider, Drawer, Grid, IconButton, Stack, useTheme } from "@mui/material";
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
import FileAnalyticsIcon from "../../../../../assets/icons/FileAnalyticsIcon";
import PmActivityMarkAsDone from "../../../../../assets/icons/PMActivityMarkAsDone";
import moment from "moment";
import FileTextIcon from "../../../../../assets/icons/FileTextIcon";
import DownloadIcon from "../../../../../assets/icons/DownloadIcon";
import FilesIcon from "../../../../../assets/icons/FilesIcon"
import EyeIcon from "../../../../../assets/icons/EyeIcon"
import { useBranch } from "../../../../../hooks/useBranch";

export default function PMActivityViewReport({ open, objData, handleClose }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { logout } = useAuth();
    const { showSnackbar } = useSnackbar();
    const branch = useBranch();

    // store
    const { pmActivityViewReport } = useSelector((state) => state.pmActivityStore);

    // state
    const [pmActivityViewReportDetails, setPmActivityViewReportDetails] = useState(null);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");

    // initial render
    useEffect(() => {
        if (open === true) {
            if (objData && objData !== null && objData?.history_uuid && objData?.history_uuid !== null) {
                dispatch(actionPMActivityViewReport({ uuid: objData?.history_uuid }));
            }
        }
    }, [objData, open]);

    /**
      * useEffect
      * @dependency : pmActivityViewReport
      * @type : HANDLE API RESULT
      * @description : Handle the result of pm Activity View Report API
      */
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

    // handle preview function
    const handlePreview = (url) => {
        setPreviewUrl(url);
        setPreviewOpen(true);
    };

    // handle download function
    const handleDownload = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = url.split("/").pop();
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
    };

    /**
      * html content to download pdf
      */
    const htmlContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>PM Activity Report</title>

        <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 0;
            width: 210mm;
            box-sizing: border-box;
        }

        /* ---------------- FIXED HEADER ---------------- */
        .top-header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background: #ffffff;
            border-bottom: 1px solid #ccc;
            padding: 10px 20px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 20px;
            z-index: 999;
        }

        .top-header img {
            width: 30px;
            height: 30px;
        }

        .top-header .info-line {
            gap: 20px;
            font-size: 12px;
        }

        /* Add margin so content starts below fixed header */
        .content-wrapper {
            padding: 20px;
            padding-top: 100px;
        }

        /* ---------------- EXISTING STYLES ---------------- */
        .heading-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 15px;
        }
        .title-main {
            font-size: 22px;
            font-weight: 700;
            color: #2b3a50;
        }
        .sub {
            font-size: 14px;
            color: #6b7280;
        }
        .section-title {
            font-size: 17px;
            font-weight: 700;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        .box {
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            padding: 15px;
        }
        .box-1 {
            background: #fcfaff;
            border-color: #cbb3f9;
        }
        .box-2 {
            background: #f6fef9;
            border-color: #8de3c4;
        }
        .grid-6 {
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 10px;
        }
        .label {
            color: #818997;
            font-size: 12px;
        }
        .value {
            font-size: 14px;
            font-weight: 600;
            margin-top: 3px;
        }
        .note-box {
            border: 1px solid #e5e7eb;
            padding: 15px;
            border-radius: 8px;
            color: #4b5563;
        }
        .files-section {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .file-thumb {
            width: 130px;
            height: 160px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            background: #fff;
            position: relative;
        }
        .file-thumb iframe {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        </style>
    </head>

    <body>
        <!-- ---------------- FIXED TOP HEADER ---------------- -->
        <div class="top-header">
        <img 
        src="${branch?.currentBranch?.logo_url ?? ''}"
        alt="Company Logo"
         />

        <div class="info-line">
            <span><strong>Branch:</strong> ${branch?.currentBranch?.name && branch?.currentBranch?.name !== null ? branch?.currentBranch?.name : ''}</span>
            <span><strong>Location:</strong>${branch?.currentBranch?.address && branch?.currentBranch?.address !== null ? branch?.currentBranch?.address : ''}</span>
            <span><strong>Mobile:</strong>${branch?.currentBranch?.contact_no && branch?.currentBranch?.contact_no !== null ? branch?.currentBranch?.country_code + ' ' + branch?.currentBranch?.contact_no: ''}</span>
        </div>
        </div>

        <!-- ------------ MAIN CONTENT BELOW FIXED HEADER ------------ -->
        <div class="content-wrapper">
        <div class="report-container">
            <div class="heading-section">
            <div>
                <div class="title-main">${pmActivityViewReportDetails?.pm_activity?.activity_title &&
            pmActivityViewReportDetails?.pm_activity?.activity_title !== null
            ? pmActivityViewReportDetails?.pm_activity?.activity_title
            : "PM Activity Report"}</div>
                <div class="sub">${`Activity Number: #${pmActivityViewReportDetails?.id}`}</div>
            </div>
            </div>

            <div class="section-title">Activity Overview</div>
            <div class="box box-1">
            <div class="grid-6">
                <div>
                <div class="label">PM Activity Title</div>
                <div class="value">${pmActivityViewReportDetails?.pm_activity?.activity_title || "N/A"}</div>
                </div>
                <div>
                <div class="label">Asset Name</div>
                <div class="value">${pmActivityViewReportDetails?.asset_name || "N/A"}</div>
                </div>
                <div>
                <div class="label">Asset Type</div>
                <div class="value">${pmActivityViewReportDetails?.asset_type || "N/A"}</div>
                </div>
                <div>
                <div class="label">Frequency</div>
                <div class="value">${pmActivityViewReportDetails?.pm_activity?.frequency || "N/A"}</div>
                </div>
                <div>
                <div class="label">Status</div>
                <div class="value">${pmActivityViewReportDetails?.pm_activity?.status || "N/A"}</div>
                </div>
                <div>
                <div class="label">Location</div>
                <div class="value">${pmActivityViewReportDetails?.location || "N/A"}</div>
                </div>
            </div>
            </div>

            <div class="section-title">Completion Details</div>
            <div class="box box-2">
            <div class="grid-6">
                <div>
                <div class="label">Scheduled Date</div>
                <div class="value">${moment(pmActivityViewReportDetails?.pm_activity?.schedule_start_date, "YYYY-MM-DD").format("DD MMM YYYY") || "N/A"}</div>
                </div>
                <div>
                <div class="label">Completed Date</div>
                <div class="value">${moment(pmActivityViewReportDetails?.completion_date, "YYYY-MM-DD").format("DD MMM YYYY") || "N/A"}</div>
                </div>
                <div>
                <div class="label">Completed By</div>
                <div class="value">${pmActivityViewReportDetails?.completed_by?.name || "N/A"}</div>
                </div>
                <div>
                <div class="label">Supervisor By</div>
                <div class="value">${pmActivityViewReportDetails?.supervised_by?.name || "N/A"}</div>
                </div>
                <div>
                <div class="label">Time</div>
                <div class="value">${pmActivityViewReportDetails?.duration && pmActivityViewReportDetails?.duration !== null ? `${pmActivityViewReportDetails.duration} hrs` : "N/A"}</div>
                </div>
                <div>
                <div class="label">Next Schedule</div>
                <div class="value">${moment(pmActivityViewReportDetails?.activity_date, "YYYY-MM-DD").format("DD MMM YYYY") || "N/A"}</div>
                </div>
            </div>
            </div>

            <div class="section-title">Completion Note</div>
            <div class="note-box">
            ${pmActivityViewReportDetails?.remark || "N/A"}
            </div>

            <div class="section-title">Files</div>
            <div class="box">
                <div class="files-section">
                ${pmActivityViewReportDetails?.images?.length
            ? pmActivityViewReportDetails.images
                .map(
                    (f, idx) => `
                    <div class="file-thumb">
                        <iframe
                        src="${f.image_url ?? ''}"
                        title="file-preview-${idx}">
                        </iframe>
                    </div>
                    `
                )
                .join('')
            : ''
        }
                </div>
            </div>
        </div>
        </div>
    </body>
    </html>`;

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
                        width: { xs: "100%", md: "100%", lg: "86%" },
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

                    <Box sx={{ m: 2, height: '920px' }}>
                        {/* Activity Overview */}
                        <Stack sx={{ flexDirection: 'row', columnGap: 1 }}>
                            <FileAnalyticsIcon />
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
                        {/* Completion Details */}
                        <Stack sx={{ flexDirection: 'row', columnGap: 1, mt: 4 }}>
                            <PmActivityMarkAsDone stroke={"#2F2B3DE5"} />
                            <TypographyComponent fontSize={16} fontWeight={600} mb={2}>
                                Completion Details
                            </TypographyComponent>
                        </Stack>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "none", border: `1px solid ${theme.palette.success[300]}`, background: theme.palette.success[100] }}>
                            <Grid container spacing={4} sx={{ width: "100%" }}>
                                <Grid size={{ xs: 12, sm: 12, md: 2, lg: 2, xl: 2 }}>
                                    <TypographyComponent
                                        fontSize={14}
                                        fontWeight={500}
                                        variant="body2"
                                        sx={{ color: theme.palette.grey[500] }}
                                    >
                                        Scheduled Date
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {moment(pmActivityViewReportDetails?.pm_activity?.schedule_start_date, "YYYY-MM-DD").format("DD MMM YYYY") || "N/A"}
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
                                        Completed Date
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {moment(pmActivityViewReportDetails?.completion_date, "YYYY-MM-DD").format("DD MMM YYYY") || "N/A"}
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
                                        Completed By
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.completed_by?.name || "N/A"}
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
                                        Supervisor By
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.supervised_by?.name || "N/A"}
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
                                        Time
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.duration && pmActivityViewReportDetails?.duration !== null ? `${pmActivityViewReportDetails.duration} hrs` : "N/A"}
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
                                        Next Schedule
                                    </TypographyComponent>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {moment(pmActivityViewReportDetails?.activity_date, "YYYY-MM-DD").format("DD MMM YYYY") || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                            </Grid>
                        </Card>
                        {/* Completion Note */}
                        <Stack sx={{ flexDirection: 'row', columnGap: 1, mt: 4 }}>
                            <FileTextIcon stroke={"#2F2B3DE5"} />
                            <TypographyComponent fontSize={16} fontWeight={600} mb={2}>
                                Completion Note
                            </TypographyComponent>
                        </Stack>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "none", border: `1px solid ${theme.palette.grey[300]}` }}>
                            <Grid container spacing={4} sx={{ width: "100%" }}>
                                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                                    <TypographyComponent fontSize={16} fontWeight={500}>
                                        {pmActivityViewReportDetails?.remark || "N/A"}
                                    </TypographyComponent>
                                </Grid>
                            </Grid>
                        </Card>
                        {/* Files */}
                        <Stack sx={{ flexDirection: 'row', columnGap: 1, mt: 4 }}>
                            <FilesIcon stroke={"#2F2B3DE5"} />
                            <TypographyComponent fontSize={16} fontWeight={600} mb={2}>
                                Files
                            </TypographyComponent>
                        </Stack>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "none", border: `1px solid ${theme.palette.grey[300]}` }}>
                            <Grid container spacing={2}>
                                {pmActivityViewReportDetails?.images !== null && pmActivityViewReportDetails?.images?.length > 0 &&
                                    pmActivityViewReportDetails?.images?.map((file, idx) => (
                                        <Grid item key={idx}>
                                            <Box sx={{ width: 120, textAlign: 'center', position: 'relative', border: `1px solid ${theme.palette.grey[300]}`, borderRadius: 2, p: 1 }}>
                                                <iframe
                                                    src={file.image_url}
                                                    style={{ width: '100%', height: '120px', borderRadius: '8px' }}
                                                    title={`file-preview-${idx}`}
                                                />
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 1 }}>
                                                    <IconButton aria-label="preview" onClick={() => handlePreview(file.image_url)}>
                                                        <EyeIcon />
                                                    </IconButton>
                                                    <IconButton aria-label="download" onClick={() => handleDownload(file.image_url)}>
                                                        <DownloadIcon />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                            </Grid>
                        </Card>
                    </Box>
                    <Divider sx={{ m: 2 }} />
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ p: 3 }}
                    >
                        <Button
                            sx={{
                                textTransform: "capitalize",
                                px: 6,
                                borderColor: `${theme.palette.grey[300]}`,
                                color: `${theme.palette.grey[700]}`,
                                borderRadius: "8px",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                            onClick={() => {
                                const newWindow = window.open("", "_blank");
                                newWindow.document.write(htmlContent);
                                newWindow.document.close();
                                newWindow.focus();
                                newWindow.print();
                                newWindow.close();
                            }}
                            startIcon={<DownloadIcon />}
                            variant="outlined"
                        >
                            Download Report
                        </Button>
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
                            }}
                            variant="contained"
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                    </Stack>
                </Stack>
            </Drawer>
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <Box sx={{ p: 2 }}>
                    {/* PDF or Image detection. You can use simple check or MIME type if available */}
                    {previewUrl.endsWith(".pdf") ? (
                        <iframe
                            src={previewUrl}
                            width="100%"
                            height="600px"
                            title="File Preview"
                            style={{ border: "none" }}
                        />
                    ) : (
                        <img
                            src={previewUrl}
                            alt="File Preview"
                            style={{ width: "100%", maxHeight: "600px", objectFit: "contain" }}
                        />
                    )}
                </Box>
            </Dialog>
        </React.Fragment>
    )
}