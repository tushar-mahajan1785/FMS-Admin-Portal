/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import TypographyComponent from "../../../components/custom-typography";
import EmptyContent from "../../../components/empty_content";
import PmEditReschedulerIcon from "../../../assets/icons/PMEditReshedulerIcon";
import {
  ERROR,
  IMAGES_SCREEN_NO_DATA,
  SERVER_ERROR,
  UNAUTHORIZED,
} from "../../../constants";
import CustomChip from "../../../components/custom-chip";
import ReschedulePopup from "../add/components/edit-reschedule";
import {
  actionPMScheduleData,
  actionPMScheduleDetails,
  resetPmScheduleDetailsResponse,
  actionPMScheduleReschedule,
  resetPmScheduleRescheduleResponse
} from "../../../store/pm-activity";
import FormHeader from "../../../components/form-header";
import TotalPMIcon from "../../../assets/icons/TotalPMIcon";
import CloseIcon from "../../../assets/icons/CloseIcon";
import { useAuth } from "../../../hooks/useAuth";
import { useSnackbar } from "../../../hooks/useSnackbar";
import PmUserCircleIcon from "../../../assets/icons/PmUserCircleIcon";
import PmActivityMarkAsDone from "../../../assets/icons/PMActivityMarkAsDone";
import PMActivityEdit from "../edit";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReportAnalyticsIcon from "../../../assets/icons/ReportAnalyticsIcon";
import PMActivityViewReport from "./components/view-report";
import ListComponents from "../../../components/list-components";

export default function PMActivityDetails({ open, objData, handleClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout, hasPermission } = useAuth();
  const { showSnackbar } = useSnackbar();

  const { pmScheduleData, pmScheduleDetails, pmScheduleReschedule } = useSelector(
    (state) => state.pmActivityStore
  );

  // Inside your PMActivityPreviewSetUp component, add this state:
  const [openPmActivityViewReportPopup, setOpenPmActivityViewReportPopup] =
    useState(false);
  const [selectedActivityReport, setSelectedActivityReport] = useState(null);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [pmScheduleActivityDetails, setPmScheduleActivityDetails] =
    useState(null);
  // Inside the PMActivityDetails component, add this state with your other states
  const [openEditPmSchedule, setOpenEditPmSchedule] = useState(false);
  const [frequencyExceptionsData, setFrequencyExceptionsData] = useState([]);

  // Add these functions inside your component:
  const handleRescheduleClick = (activity) => {
    let currentAssetData = pmScheduleData?.assets.find(
      (obj) => obj?.asset_id === pmScheduleData?.selected_asset_id
    );
    let activityData = {
      ...currentAssetData,
      frequency_data: activity,
      type: "reschedule",
      pm_details: {
        title: pmScheduleData?.selected_asset_id
          ? // Find the selected asset and get its description
          pmScheduleActivityDetails?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.asset_name
          : "",
        frequency: pmScheduleActivityDetails?.frequency,
        schedule_start_date: moment(
          pmScheduleActivityDetails?.schedule_start_date,
          "YYYY-MM-DD"
        ).format("DD/MM/YYYY"),
        status: pmScheduleActivityDetails?.status,
        assets: pmScheduleActivityDetails?.assets,
        location: pmScheduleData?.selected_asset_id
          ? // Find the selected asset and get its description
          pmScheduleActivityDetails?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.location
          : "",
      },
    };
    setSelectedActivity(activityData);
    setRescheduleOpen(true);
  };

  const handleMarkAsDoneClick = (activity) => {
    let currentAssetData = pmScheduleData?.assets.find(
      (obj) => obj?.asset_id === pmScheduleData?.selected_asset_id
    );
    let activityData = {
      ...currentAssetData,
      frequency_data: activity,
      type: "markAsDone",
      client_id: pmScheduleActivityDetails?.client_id,
      pm_activity_id: pmScheduleActivityDetails?.id,
      pm_details: {
        title: pmScheduleData?.selected_asset_id
          ? // Find the selected asset and get its description
          pmScheduleActivityDetails?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.asset_name
          : "",
        frequency: pmScheduleActivityDetails?.frequency,
        schedule_start_date: moment(
          pmScheduleActivityDetails?.schedule_start_date,
          "YYYY-MM-DD"
        ).format("DD/MM/YYYY"),
        status: pmScheduleActivityDetails?.status,
        location: pmScheduleData?.selected_asset_id
          ? // Find the selected asset and get its description
          pmScheduleActivityDetails?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.location
          : "",

        vendor: pmScheduleData?.selected_asset_id
          ? // Find the selected asset and get its description
          pmScheduleActivityDetails?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.vendor
          : null,
      },
    };
    setSelectedActivity(activityData);
    setRescheduleOpen(true);
  };

  useEffect(() => {
    if (pmScheduleReschedule && pmScheduleReschedule !== null) {
      dispatch(resetPmScheduleRescheduleResponse());
      if (pmScheduleReschedule?.result === true) {
        showSnackbar({
          message: pmScheduleReschedule?.message,
          severity: "success",
        });
        if (objData && objData !== null && objData?.uuid) {
          dispatch(actionPMScheduleDetails({ uuid: objData?.uuid }));
        }
      } else {
        switch (pmScheduleReschedule?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetPmScheduleRescheduleResponse());
            showSnackbar({
              message: pmScheduleReschedule?.message,
              severity: "error",
            });
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: pmScheduleReschedule?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [pmScheduleReschedule]);

  useEffect(() => {
    if (open === true) {
      if (objData && objData !== null && objData?.uuid) {
        dispatch(actionPMScheduleDetails({ uuid: objData?.uuid }));
      }
    }
  }, [objData, open]);

  const today = moment().startOf("day"); // Get today's date at the start of the day

  // Check if the schedule start date is today or later
  const showButton = moment(
    pmScheduleActivityDetails?.schedule_start_date
  ).isSameOrAfter(today);

  // Check if there is at least one status that is "Completed"
  const hasCompletedStatus = frequencyExceptionsData?.some(
    (obj) => obj.status === "Completed"
  );

  // Check if there is at least one status that is NOT "Completed"
  const hasNonCompletedStatus = frequencyExceptionsData?.some(
    (obj) => obj.status !== "Completed"
  );

  useEffect(() => {
    if (pmScheduleDetails && pmScheduleDetails !== null) {
      dispatch(resetPmScheduleDetailsResponse());
      if (pmScheduleDetails?.result === true) {
        setPmScheduleActivityDetails(pmScheduleDetails?.response);
        let objData = Object.assign({}, pmScheduleData);
        objData.pm_details = {
          title: pmScheduleDetails?.response?.activity_title,
          frequency: pmScheduleDetails?.response?.frequency,
          schedule_start_date: pmScheduleDetails?.response?.schedule_start_date,
          status: pmScheduleDetails?.response?.status,
        };
        objData.assets = pmScheduleDetails?.response?.assets;
        if (
          pmScheduleDetails?.response?.assets &&
          pmScheduleDetails?.response?.assets !== null &&
          pmScheduleDetails?.response?.assets.length > 0
        ) {
          objData.selected_asset_id =
            pmScheduleDetails?.response?.assets[0]?.asset_id;
        } else {
          objData.selected_asset_id = null;
        }

        dispatch(actionPMScheduleData(objData));
      } else {
        setPmScheduleActivityDetails(null);
        switch (pmScheduleDetails?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetPmScheduleDetailsResponse());
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: pmScheduleDetails?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [pmScheduleDetails]);

  const columns = [
    {
      flex: 0.2,
      field: "activity",
      headerName: "Activity #",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <Stack sx={{ justifyContent: "center", height: "100%" }}>
              <TypographyComponent fontSize={14} fontWeight={400}>
                {`#${params?.row?.id}`}
              </TypographyComponent>
            </Stack>
          </>
        );
      },
    },
    {
      flex: 0.2,
      field: "scheduled_date",
      headerName: "Date & Time",
      editable: false,
      renderCell: (params) => {
        return (
          <Stack
            sx={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              columnGap: 1,
            }}
          >
            {params.row.scheduled_date && params.row.scheduled_date !== null ? (
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {params.row.scheduled_date && params.row.scheduled_date !== null
                  ? moment(params.row.scheduled_date, "YYYY-MM-DD").format(
                    "DD MMM YYYY"
                  )
                  : ""}
              </TypographyComponent>
            ) : (
              <></>
            )}
            {params?.row?.remark && params?.row?.remark !== null && (
              <Tooltip title={params?.row?.remark}>
                <InfoOutlinedIcon
                  fontSize="20"
                  sx={{ color: theme.palette.primary[600] }}
                />
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
    {
      flex: 0.2,
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        let color = "primary";
        switch (params?.row?.status) {
          case "Upcoming":
            color = "grey";
            break;
          case "Completed":
            color = "success";
            break;
          case "On Hold":
            color = "warning";
            break;
          default:
            color = "primary";
        }
        return (
          <React.Fragment>
            <CustomChip text={params?.row?.status} colorName={color} />
          </React.Fragment>
        );
      },
    },
    {
      flex: 0.3,
      field: "completed_date",
      headerName: "Completed Date",
      editable: true,
      renderCell: (params) => {
        return (
          <Stack sx={{ height: "100%", justifyContent: "center" }}>
            {params.row.completed_date && params.row.completed_date !== null ? (
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {params.row.completed_date && params.row.completed_date !== null
                  ? moment(params.row.completed_date, "YYYY-MM-DD").format(
                    "DD MMM YYYY"
                  )
                  : ""}
              </TypographyComponent>
            ) : (
              <></>
            )}
          </Stack>
        );
      },
    },
    {
      flex: 0.3,
      field: "supervised_by",
      headerName: "Supervision By",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
              <IconButton>
                <PmUserCircleIcon stroke={"#101828"} />
              </IconButton>
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {params?.row?.supervised_by}
              </TypographyComponent>
            </Box>
          </React.Fragment>
        );
      },
    },
    {
      flex: 0.2,

      field: "duration",
      headerName: "Time",
      editable: true,
      renderCell: (params) => {
        return (
          <Stack sx={{ height: "100%", justifyContent: "center" }}>
            {params?.row?.duration && params?.row?.duration !== null ? (
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {`${params?.row?.duration} Hrs`}
              </TypographyComponent>
            ) : (
              <>--:-- Hrs</>
            )}
          </Stack>
        );
      },
    },
    {
      flex: 0.4,

      field: "remark",
      headerName: "Additional Information",
      editable: true,
    },
    {
      flex: 0.5,
      field: "actions",
      headerName: "Actions",
      editable: true,
      sortable: false,
      renderCell: (params) => {
        return (
          <React.Fragment>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                direction: "row",
                gap: 2,
              }}
            >
              {params.row.status === "Completed" ? (
                <Stack
                  sx={{
                    flexDirection: "row",
                    gap: 1,
                    border: `1px solid${theme.palette.grey[500]}`,
                    background: theme.palette.grey[50],
                    borderRadius: "6px",
                    padding: "5px 8px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setOpenPmActivityViewReportPopup(true);
                    setSelectedActivityReport(params?.row);
                  }}
                >
                  <ReportAnalyticsIcon stroke={"#101828"} />
                  <TypographyComponent
                    fontSize={14}
                    fontWeight={500}
                    sx={{ color: theme.palette.text.primary[700] }}
                  >
                    View Report
                  </TypographyComponent>
                </Stack>
              ) : (
                <React.Fragment>
                  {params?.row?.scheduled_date && params?.row?.scheduled_date !== null &&
                    moment(params?.row?.scheduled_date).isSame(moment(), "month") && (
                      <Stack
                        sx={{
                          flexDirection: "row",
                          gap: 1,
                          border: `1px solid${theme.palette.success[400]}`,
                          background: theme.palette.success[50],
                          borderRadius: "6px",
                          padding: "5px 8px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleMarkAsDoneClick(params.row)}
                      >
                        <PmActivityMarkAsDone stroke={"#32D583"} />
                        <TypographyComponent
                          fontSize={14}
                          fontWeight={500}
                          sx={{ color: theme.palette.success[600] }}
                        >
                          Mark Done
                        </TypographyComponent>
                      </Stack>
                    )}
                  <Stack
                    sx={{
                      flexDirection: "row",
                      gap: 1,
                      border: `1px solid${theme.palette.grey[500]}`,
                      background: theme.palette.grey[50],
                      borderRadius: "6px",
                      padding: "5px 8px",
                      cursor: "pointer",
                    }}
                    onClick={() => handleRescheduleClick(params.row)}
                  >
                    <PmEditReschedulerIcon stroke={"#101828"} />
                    <TypographyComponent
                      fontSize={14}
                      fontWeight={500}
                      sx={{ color: theme.palette.text.primary[700] }}
                    >
                      Reschedule
                    </TypographyComponent>
                  </Stack>
                </React.Fragment>
              )}
            </Box>
          </React.Fragment>
        );
      },
    },
  ];

  useEffect(() => {
    if (
      pmScheduleData?.assets &&
      pmScheduleData?.assets !== null &&
      pmScheduleData?.assets?.length > 0
    ) {
      setFrequencyExceptionsData(
        pmScheduleData?.assets[0]?.frequency_exceptions
      );
    } else {
      setFrequencyExceptionsData([]);
    }
  }, [pmScheduleData?.assets]);

  return (
    <React.Fragment>
      <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', sm: '100%', md: '100%', lg: '100%', xl: '86%' } } }}
      >
        <Stack sx={{ height: '100%' }} justifyContent={'flex-start'} flexDirection={'column'}>
          <FormHeader
            color={theme.palette.primary[600]}
            size={48}
            icon={<TotalPMIcon stroke={theme.palette.primary[600]} size={20} />}
            title={
              pmScheduleActivityDetails?.activity_title &&
                pmScheduleActivityDetails?.activity_title !== null
                ? pmScheduleActivityDetails?.activity_title
                : "PM Activity"
            }
            subtitle="View or Edit details of PM schedule"
            actions={[
              <IconButton onClick={handleClose}>
                <CloseIcon size={16} />
              </IconButton>,
            ]}
          />
          <Divider sx={{ m: 2 }} />
          <Stack
            sx={{
              px: 4,
              flexGrow: 1,
              overflowY: 'auto'
            }}
          >
            {/* Schedule Details */}
            <Stack>
              <Typography fontSize={16} fontWeight={600} mb={2}>
                Schedule Details
              </Typography>
            </Stack>

            <Grid
              spacing={4}
              mb={3}
              direction="row"
              sx={{
                borderRadius: "16px",
                padding: "24px",
                border: `1px solid ${theme.palette.grey[300]}`,
                height: "100%",
              }}
              size={{ xs: 12, sm: 12, md: 8 }}
            >
              <Grid container spacing={4} sx={{ width: "100%" }}>
                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                  <Typography
                    fontSize={14}
                    fontWeight={500}
                    variant="body2"
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    PM Activity Title
                  </Typography>
                  <Typography fontSize={16} fontWeight={500}>
                    {pmScheduleActivityDetails?.activity_title || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={14}
                    fontWeight={500}
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    Frequency
                  </Typography>
                  <Typography fontSize={16} fontWeight={500}>
                    {pmScheduleActivityDetails?.frequency || "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 3 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={14}
                    fontWeight={500}
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    Schedule Start Date
                  </Typography>
                  <Typography fontSize={16} fontWeight={500}>
                    {pmScheduleActivityDetails?.schedule_start_date
                      ? moment(
                        pmScheduleActivityDetails?.schedule_start_date,
                        "YYYY-MM-DD"
                      ).format("DD MMM YYYY")
                      : "N/A"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 12, md: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontSize={14}
                    fontWeight={500}
                    sx={{ color: theme.palette.grey[500] }}
                  >
                    Status
                  </Typography>
                  <Typography fontSize={16} fontWeight={500}>
                    {pmScheduleActivityDetails?.status || "N/A"}
                  </Typography>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3, width: "100%" }} />
              <Grid>
                {/* Second Row - Assets Section */}
                <Grid size={{ xs: 12, sm: 12 }} spacing={4}>
                  <Grid size={{ xs: 12 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ width: "100%", color: theme.palette.grey[500] }}
                    >
                      <Typography fontSize={16} fontWeight={600}>
                        Assets in this PM Activity
                      </Typography>
                      <Typography fontSize={16} fontWeight={600}>
                        ( {pmScheduleActivityDetails?.assets?.length} )
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12 }}>
                    <Box
                      sx={{
                        borderRadius: "16px",
                        minHeight: "80px",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 2,
                        my: 1,
                        alignItems: "flex-start",
                      }}
                    >
                      {pmScheduleActivityDetails?.assets?.length > 0 ? (
                        pmScheduleActivityDetails?.assets.map((asset) => (
                          <Stack
                            sx={{
                              background:
                                pmScheduleData?.selected_asset_id ===
                                  asset?.asset_id
                                  ? theme.palette.primary[600]
                                  : theme.palette.common.white,
                              border:
                                pmScheduleData?.selected_asset_id ===
                                  asset?.asset_id
                                  ? "none"
                                  : `1px solid ${theme.palette.grey[500]}`,
                              color:
                                pmScheduleData?.selected_asset_id ===
                                  asset?.asset_id
                                  ? theme.palette.common.white
                                  : theme.palette.grey[500],
                              borderRadius: "8px",
                              padding: "8px 16px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              let pmData = Object.assign({}, pmScheduleData);
                              pmData.selected_asset_id = asset?.asset_id;
                              let currentAssetIndex = pmData.assets.findIndex(
                                (obj) => obj?.asset_id === asset?.asset_id
                              );
                              if (currentAssetIndex > -1) {
                                setFrequencyExceptionsData(
                                  pmData.assets[currentAssetIndex]
                                    .frequency_exceptions
                                );
                              }

                              dispatch(actionPMScheduleData(pmData));
                            }}
                          >
                            <TypographyComponent
                              fontSize={14}
                              fontWeight={400}
                            >
                              {asset?.asset_name}
                            </TypographyComponent>
                          </Stack>
                        ))
                      ) : (
                        <Typography color="text.secondary">
                          No assets selected
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Stack>
              <Typography fontSize={16} fontWeight={600} mb={2}>
                {pmScheduleData?.selected_asset_id
                  ? // Find the selected asset and get its description
                  pmScheduleData.assets.find(
                    (asset) =>
                      asset.asset_id === pmScheduleData.selected_asset_id
                  )?.asset_name + " PM Activity Schedule"
                  : "PM Activity Schedule"}
              </Typography>
            </Stack>

            {/* Frequency Exceptions */}
            {frequencyExceptionsData &&
              frequencyExceptionsData !== null &&
              frequencyExceptionsData?.length > 0 ? (
              <Box sx={{ height: "450px", width: "100%" }}>
                <ListComponents
                  rows={frequencyExceptionsData}
                  columns={columns}
                  isCheckbox={false}
                  hasPagination={false}
                  pageSizes={12}
                  onChange={(selectedIds) => {
                    console.log("Selected row IDs in UsersList:", selectedIds);
                  }}
                />
              </Box>
            ) : (
              <Stack sx={{ height: 480 }}>
                <EmptyContent
                  imageUrl={IMAGES_SCREEN_NO_DATA.NO_DATA_FOUND}
                  title={"No Frequency Exceptions Found"}
                  subTitle={""}
                />
              </Stack>
            )}
          </Stack>
          <Divider sx={{ m: 2 }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ px: 2, pb: 2 }}
          >
            {showButton &&
              frequencyExceptionsData !== null &&
              frequencyExceptionsData.length > 0 &&
              hasNonCompletedStatus &&
              !hasCompletedStatus && hasPermission('PM_ACTIVITY_EDIT') && (
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
                    setOpenEditPmSchedule(true);
                  }}
                  variant="outlined"
                >
                  Edit
                </Button>
              )}
            {/* Close Button with margin-left auto to always align to the right */}
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
                ml: "auto", // This pushes the Close button to the right
              }}
              variant="contained"
              onClick={handleClose}
            >
              Close
            </Button>
          </Stack>
          <ReschedulePopup
            open={rescheduleOpen}
            selectedActivity={selectedActivity}
            handleClose={(data, type) => {
              setRescheduleOpen(false);
              if (type === "save") {
                const newDate = data.new_date ? moment(data.new_date, "DD/MM/YYYY").format("YYYY-MM-DD") : null;
                const remark = data.reason_for_reschedule || "";

                /* ------------------------------
                   1. Update frequencyExceptionsData
                --------------------------------*/
                const updatedFrequencyExceptionsData = frequencyExceptionsData.map((item) => {
                  if (item.scheduled_date === selectedActivity?.frequency_data?.scheduled_date) {
                    return {
                      ...item,
                      scheduled_date: newDate,
                      ...(remark && { remark })
                    };
                  }
                  return item;
                });

                setFrequencyExceptionsData(updatedFrequencyExceptionsData);

                /* ------------------------------
                   2. Update selectedActivity
                --------------------------------*/
                const updatedSelectedActivity = {
                  ...selectedActivity,
                  frequency_data: {
                    ...selectedActivity.frequency_data,
                    scheduled_date: newDate,
                    ...(remark && { remark })
                  },
                  frequency_exceptions: selectedActivity.frequency_exceptions.map((item) => {
                    if (item.scheduled_date === selectedActivity?.frequency_data?.scheduled_date) {
                      return {
                        ...item,
                        scheduled_date: newDate,
                        ...(remark && { remark })
                      };
                    }
                    return item;
                  })
                };

                setSelectedActivity(updatedSelectedActivity);

                let input = {
                  pm_activity_id: objData?.id,
                  asset_id: selectedActivity?.asset_id,
                  old_date: data?.current_schedule_date ? moment(data?.current_schedule_date, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
                  new_date: newDate,
                  reason_for_reschedule: remark
                };
                dispatch(actionPMScheduleReschedule(input));
              }
            }}
          />
        </Stack>
      </Drawer>

      {/* Edit PM Schedule Drawer */}
      <PMActivityEdit
        open={openEditPmSchedule}
        objData={pmScheduleActivityDetails}
        handleClose={(data) => {
          if (data && data !== null && data === "save") {
            dispatch(actionPMScheduleDetails({ uuid: objData?.uuid }));
          }
          setOpenEditPmSchedule(false);
        }}
      />
      <PMActivityViewReport
        open={openPmActivityViewReportPopup}
        objData={selectedActivityReport}
        handleClose={() => {
          setOpenPmActivityViewReportPopup(false);
        }}
      />
    </React.Fragment>
  );
}
