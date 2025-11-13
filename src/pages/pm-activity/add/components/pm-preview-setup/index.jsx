/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SearchIcon from "../../../../../assets/icons/SearchIcon";
import TypographyComponent from "../../../../../components/custom-typography";
import { AntSwitch, SearchInput } from "../../../../../components/common";
import CustomTextField from "../../../../../components/text-field";
import FormLabel from "../../../../../components/form-label";
import EmptyContent from "../../../../../components/empty_content";

import {
  ERROR,
  IMAGES_SCREEN_NO_DATA,
  SERVER_ERROR,
  UNAUTHORIZED,
} from "../../../../../constants";
import {
  actionMasterAssetType,
  resetMasterAssetTypeResponse,
} from "../../../../../store/asset";
import {
  actionRosterData,
  actionAssetTypeWiseList,
  resetAssetTypeWiseListResponse,
} from "../../../../../store/roster";
import { useAuth } from "../../../../../hooks/useAuth";
import { useBranch } from "../../../../../hooks/useBranch";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import DeleteIcon from "../../../../../assets/icons/DeleteIcon";
import DatePicker from "react-datepicker";
import EditIcon from "../../../../../assets/icons/EditIcon";
import { DataGrid } from "@mui/x-data-grid";
import CustomChip from "../../../../../components/custom-chip";
import moment from "moment/moment";
import { getFormattedDuration } from "../../../../../utils";
import EyeIcon from "../../../../../assets/icons/EyeIcon";
import PmUserCircleIcon from "../../../../../assets/icons/PmUserCircleIcon";
import PmEditReschedulerIcon from "../../../../../assets/icons/PMEditReshedulerIcon";
import ReschedulePopup from "../edit-rechedule";
import { actionPMScheduleData } from "../../../../../store/pm-activity";

export default function PMActivityPreviewSetUp() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();

  const branch = useBranch();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pm_activity_title: "",
      frequency: "",
      status: "",
      schedule_start_date: "",
    },
  });

  // ✅ States
  const [searchQuery, setSearchQuery] = useState("");
  const [assetTypeMasterOption, setAssetTypeMasterOption] = useState([]);
  const [assetTypeWiseListOptions, setAssetTypeWiseListOptions] = useState([]);
  const [assetTypeWiseListOriginalData, setAssetTypeWiseListOriginalData] =
    useState([]);
  const [loading, setLoading] = useState(false);

  const { pmScheduleData } = useSelector((state) => state.PmActivityStore);

  // Inside your PMActivityPreviewSetUp component, add this state:
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // console.log("-----pmScheduleData--------", pmScheduleData);

  // Add these functions inside your component:
  const handleRescheduleClick = (activity) => {
    setSelectedActivity(activity);
    setRescheduleOpen(true);
  };

  const handleRescheduleConfirm = (rescheduleData) => {
    console.log("Reschedule data:", rescheduleData);
    // Add your reschedule logic here
    toast.success(
      `Activity #${rescheduleData.activityId} rescheduled successfully`
    );
    setRescheduleOpen(false);
    setSelectedActivity(null);
  };

  const handleRescheduleClose = () => {
    setRescheduleOpen(false);
    setSelectedActivity(null);
  };

  const columns = [
    {
      flex: 0.3,
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
      flex: 0.3,
      field: "date_time",
      headerName: "Date & Time",
      editable: false,
      renderCell: (params) => {
        return (
          <Stack sx={{ height: "100%", justifyContent: "center" }}>
            {params.row.date && params.row.date !== null ? (
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {params.row.date && params.row.date !== null
                  ? moment(params.row.date, "YYYY-MM-DD").format("DD MMM YYYY")
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
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        let color = "primary";
        switch (params?.row?.status) {
          case "Upcoming":
            color = "grey";
            break;
          case "On Hold":
            color = "primary";
            break;
          case "Completed":
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
      field: "supervision_by",
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
            </Box>
          </React.Fragment>
        );
      },
    },
    {
      flex: 0.3,

      field: "time",
      headerName: "Time",
      editable: true,
      renderCell: (params) => {
        return (
          <Stack sx={{ height: "100%", justifyContent: "center" }}>
            {params?.row?.time &&
            params?.row?.time !== null &&
            !["Open"].includes(params.row.time) ? (
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {params?.row?.time && params?.row?.time !== null
                  ? getFormattedDuration(params?.row?.time, params?.row?.time)
                  : ""}
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

      field: "additional_info",
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
            <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
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
            </Box>
          </React.Fragment>
        );
      },
    },
  ];

  const [frequencyExceptionsData, setFrequencyExceptionsData] = useState([]);

  console.log("frequencyExceptionsData", frequencyExceptionsData);
  console.log("pmScheduleData", pmScheduleData);

  /**
   * 🔹 Initial API call to fetch master asset types
   */
  useEffect(() => {
    if (pmScheduleData?.assets !== null && pmScheduleData?.assets.length > 0) {
      let currentAsset = pmScheduleData?.assets.find(
        (obj) => obj?.asset_id === pmScheduleData?.selected_asset_id
      );
      console.log("Current Asset", currentAsset);
      if (currentAsset && currentAsset !== null) {
        setFrequencyExceptionsData(currentAsset?.frequency_exceptions);
      } else {
        setFrequencyExceptionsData([]);
      }
    }
  }, [pmScheduleData?.assets]);

  // Format date for display (from "05-Nov-2025" to "05 Nov 2025")
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.replace("-", " ").replace("-", " ");
  };

  return (
    <Box>
      <Card sx={{ p: 3, borderRadius: 3, boxShadow: "none" }}>
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
                {pmScheduleData?.pm_details?.title || "N/A"}
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
                {pmScheduleData?.pm_details?.frequency || "N/A"}
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
                {pmScheduleData?.pm_details?.schedule_start_date
                  ? formatDisplayDate(
                      pmScheduleData.pm_details.schedule_start_date
                    )
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
                {pmScheduleData?.pm_details?.status || "N/A"}
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
                    ( {pmScheduleData?.assets.length} )
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
                  {pmScheduleData?.assets.length > 0 ? (
                    pmScheduleData?.assets.map((asset, i) => (
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
                          dispatch(actionPMScheduleData(pmData));
                        }}
                      >
                        <TypographyComponent fontSize={14} fontWeight={400}>
                          {asset?.asset_description}
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
                  (asset) => asset.asset_id === pmScheduleData.selected_asset_id
                )?.asset_description + " PM Activity Schedule"
              : "PM Activity Schedule"}
          </Typography>
        </Stack>

        {/* Frequency Exceptions */}
        {frequencyExceptionsData &&
        frequencyExceptionsData !== null &&
        frequencyExceptionsData.length > 0 ? (
          <Box sx={{ height: "330px", width: "100%" }}>
            <DataGrid
              sx={{
                backgroundColor: "white",
                overflowX: "auto",
                border: `1px solid ${theme.palette.grey[300]}`,
                borderRadius: "16px",
                minWidth: "max-content",
                "& .MuiDataGrid-virtualScroller": {
                  overflowX: "auto !important", // enable horizontal scroll
                },
                // header container
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: theme.palette.grey[50],
                },

                // every header cell
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: theme.palette.grey[50],
                  fontWeight: "bold",
                },

                // header text
                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: "bold",
                },
              }}
              rows={frequencyExceptionsData}
              columns={columns}
              disableRowSelectionOnClick
              hideFooter
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
      </Card>

      {/* <Divider sx={{ m: 2 }} />

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
          variant="outlined"
          onClick={onBack}
        >
          Back
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
          onClick={handleSaveSchedule}
          disabled={loading}
        >
          Save Schedule
        </Button>
      </Stack> */}
      <ReschedulePopup
        open={rescheduleOpen}
        onClose={handleRescheduleClose}
        selectedActivity={selectedActivity}
        onConfirm={handleRescheduleConfirm}
      />
    </Box>
  );
}
