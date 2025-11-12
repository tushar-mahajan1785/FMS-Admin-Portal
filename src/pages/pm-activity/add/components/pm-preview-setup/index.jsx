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
import { actionPMScheduleData } from "../../../../../store/pm-activity";
import { DataGrid } from "@mui/x-data-grid";

export default function PMActivityPreviewSetUp({ onBack, onSave }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const branch = useBranch();

  const {
    control,
    setValue,
    handleSubmit,
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

  // ✅ Redux Store
  const { masterAssetType } = useSelector((state) => state.AssetStore);
  const { rosterData = {}, assetTypeWiseList } = useSelector(
    (state) => state.rosterStore
  );

  const { pmScheduleData } = useSelector((state) => state.PmActivityStore);

  console.log("-----pmScheduleData--------", pmScheduleData);
  const columns = [
    {
      flex: 0.3,
      field: "activity",
      headerName: "Activity #",
      width: 100,
    },
    {
      flex: 0.5,
      field: "date_time",
      headerName: "Date & Time",
      editable: false,
    },
    {
      flex: 0.3,
      field: "status",
      headerName: "Status",
      editable: true,
      width: 120,
    },
    {
      flex: 0.4,
      field: "completed_date",
      headerName: "Completed Date",
      editable: true,
    },
    {
      flex: 0.4,
      field: "supervision_by",
      headerName: "Supervision By",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
    },
    {
      flex: 0.3,

      field: "time",
      headerName: "Time",
      editable: true,
    },
    {
      flex: 0.5,

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
    },
  ];

  const rows = [
    {
      id: 1,
      activity: "#1",
      date_time: "05 Nov 2025",
      status: "Upcoming",
      completed_date: "--",
      supervision_by: "💬",
      time: "--",
      additional_info: "--",
      actions: "💬 Mark Done | On Hold | Reschedule",
    },
    {
      id: 2,
      activity: "#2",
      date_time: "05 Dec 2025",
      status: "Upcoming",
      completed_date: "--",
      supervision_by: "💬",
      time: "--",
      additional_info: "--",
      actions: "💬 Mark Done | On Hold | Reschedule",
    },
    {
      id: 3,
      activity: "#3",
      date_time: "05 Jan 2026",
      status: "Upcoming",
      completed_date: "--",
      supervision_by: "💬",
      time: "--",
      additional_info: "--",
      actions: " Mark Done  Reschedule",
    },
    {
      id: 4,
      activity: "#4",
      date_time: "05 Feb 2026",
      status: "Upcoming",
      completed_date: "--",
      supervision_by: "💬",
      time: "--",
      additional_info: "--",
      actions: "💬 Mark Done | On Hold | Reschedule",
    },
    {
      id: 5,
      activity: "#5",
      date_time: "05 Mar 2026",
      status: "Upcoming",
      completed_date: "--",
      supervision_by: "💬",
      time: "--",
      additional_info: "--",
      actions: "💬 Mark Done | On Hold | Reschedule",
    },
    {
      id: 6,
      activity: "#6",
      date_time: "05 Apr 2026",
      status: "Upcoming",
      completed_date: "--",
      supervision_by: "💬",
      time: "--",
      additional_info: "--",
      actions: "💬 Mark Done | On Hold | Reschedule",
    },
  ];

  /**
   * 🔹 Initial API call to fetch master asset types
   */
  useEffect(() => {
    if (branch?.currentBranch?.client_uuid) {
      dispatch(
        actionMasterAssetType({
          client_uuid: branch.currentBranch.client_uuid,
        })
      );
    }
  }, [branch?.currentBranch]);

  /**
   * 🔹 Fetch asset-type-wise list when asset type changes
   */
  useEffect(() => {
    if (branch?.currentBranch?.uuid && rosterData?.asset_type) {
      dispatch(
        actionAssetTypeWiseList({
          branch_uuid: branch.currentBranch.uuid,
          asset_type: rosterData.asset_type,
        })
      );
    }
  }, [branch?.currentBranch, rosterData?.asset_type]);

  /**
   * 🔹 Handle Master Asset Type Response
   */
  useEffect(() => {
    if (!masterAssetType) return;
    dispatch(resetMasterAssetTypeResponse());

    if (masterAssetType?.result === true) {
      setAssetTypeMasterOption(masterAssetType?.response ?? []);
      if (masterAssetType?.response?.length > 0) {
        const firstAsset = masterAssetType.response[0];
        setValue("asset_type", firstAsset?.id);
        const updated = { ...rosterData, asset_type: firstAsset?.name };
        dispatch(actionRosterData(updated));
      } else {
        console.log("here we are ");
      }
    } else {
      setAssetTypeMasterOption([]);
      switch (masterAssetType?.status) {
        case UNAUTHORIZED:
          logout();
          break;
        case ERROR:
          break;
        case SERVER_ERROR:
          toast.dismiss();
          showSnackbar({
            message: masterAssetType?.message,
            severity: "error",
          });
          break;
        default:
          break;
      }
    }
  }, [masterAssetType]);

  /**
   * 🔹 Handle Asset Type Wise List Response
   */
  useEffect(() => {
    if (!assetTypeWiseList) return;
    dispatch(resetAssetTypeWiseListResponse());

    if (assetTypeWiseList?.result === true) {
      const data = assetTypeWiseList?.response ?? [];
      setAssetTypeWiseListOptions(data);
      setAssetTypeWiseListOriginalData(data);
    } else {
      setAssetTypeWiseListOptions([]);
      setAssetTypeWiseListOriginalData([]);
      switch (assetTypeWiseList?.status) {
        case UNAUTHORIZED:
          logout();
          break;
        case SERVER_ERROR:
          toast.dismiss();
          showSnackbar({
            message: assetTypeWiseList?.message,
            severity: "error",
          });
          break;
        default:
          break;
      }
    }
  }, [assetTypeWiseList]);

  /**
   * 🔹 Filter search results
   */
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered =
        assetTypeWiseListOriginalData?.filter(
          (item) =>
            item?.asset_description
              ?.toLowerCase()
              ?.includes(searchQuery.toLowerCase()) ||
            item?.type?.toLowerCase()?.includes(searchQuery.toLowerCase())
        ) ?? [];
      setAssetTypeWiseListOptions(filtered);
    } else {
      setAssetTypeWiseListOptions(assetTypeWiseListOriginalData ?? []);
    }
  }, [searchQuery]);

  // ✅ Search input handler
  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const onSubmit = () => {};

  // Handle save schedule
  const handleSaveSchedule = () => {
    setLoading(true);

    // Create a single object with all the data
    const scheduleData = {
      // PM Activity Details
      pm_activity_details: {
        title: pmScheduleData?.pm_details?.pm_activity_title || "N/A",
        frequency: pmScheduleData?.pm_details?.frequency || "N/A",
        schedule_start_date:
          pmScheduleData?.pm_details?.schedule_start_date || "N/A",
        status: pmScheduleData?.pm_details?.status || "N/A",
        is_active: pmScheduleData?.is_active || false,
      },

      // Asset Information
      asset_info: {
        asset_type: pmScheduleData?.asset_type || "N/A",
        selected_assets_count: pmScheduleData?.assets?.length || 0,
        selected_assets:
          pmScheduleData?.assets?.map((asset) => ({
            asset_id: asset.asset_id,
            asset_type: asset.asset_type,
            asset_description: asset.asset_description,
          })) || [],
      },

      // Schedule Data
      schedule_data: {
        frequency_exceptions_count:
          pmScheduleData?.frequency_exceptions?.length || 0,
        frequency_exceptions:
          pmScheduleData?.frequency_exceptions?.map((exception, index) => ({
            sequence: index + 1,
            title: exception.title,
            date: exception.date,
            formatted_date: formatDisplayDate(exception.date),
          })) || [],

        // Generated dates summary
        date_range:
          pmScheduleData?.frequency_exceptions?.length > 0
            ? {
                start_date: formatDisplayDate(
                  pmScheduleData.frequency_exceptions[0]?.date
                ),
                end_date: formatDisplayDate(
                  pmScheduleData.frequency_exceptions[
                    pmScheduleData.frequency_exceptions.length - 1
                  ]?.date
                ),
                total_activities: pmScheduleData.frequency_exceptions.length,
              }
            : null,
      },
    };

    // Console the complete object
    console.log("PM ACTIVITY SCHEDULE - COMPLETE DATA:", scheduleData);

    // Simulate API call
    //  setTimeout(() => {
    // setLoading(false);
    //showSnackbar({
    //  message: "PM Activity Schedule saved successfully!",
    // severity: "success",
    //});

    //if (onSave) {
    // onSave();
    //}
    //}, 1500);
  };

  // Format date for display (from "05-Nov-2025" to "05 Nov 2025")
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "N/A";
    return dateString.replace("-", " ").replace("-", " ");
  };

  // Get selected asset names
  const selectedAssetNames = (pmScheduleData?.assets || []).map(
    (asset) => asset.asset_description || "N/A"
  );

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
                {pmScheduleData?.pm_details?.pm_activity_title || "N/A"}
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
                    ( {selectedAssetNames.length} )
                  </Typography>
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, sm: 12 }}>
                <Box
                  sx={{
                    borderRadius: "16px",
                    padding: "24px",

                    minHeight: "80px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  {selectedAssetNames.length > 0 ? (
                    selectedAssetNames.map((asset, i) => (
                      <Chip
                        key={i}
                        label={asset}
                        sx={{
                          bgcolor: "#f6f1ff",
                          color: "#6f42c1",
                          borderRadius: "8px",
                          fontWeight: 500,
                        }}
                      />
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

        <Divider sx={{ my: 3 }} />

        {/* Frequency Exceptions */}
        <Box sx={{ height: "330px", width: "100%" }}>
          <DataGrid
            sx={{
              backgroundColor: "white",
              overflowX: "auto",
              border: "none",
              borderBottom: ` 1px solid ${theme.palette.grey[300]}`,
              borderRadius: "1px",
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
            rows={rows}
            columns={columns}
            disableRowSelectionOnClick
            hideFooter
          />
        </Box>
      </Card>

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
          {/* {loading ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : (
            "Save Schedule"
          )} */}
          Save Schedule
        </Button>
      </Stack>
    </Box>
  );
}
