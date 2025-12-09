/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import TypographyComponent from "../../../../../components/custom-typography";
import EmptyContent from "../../../../../components/empty_content";
import { IMAGES_SCREEN_NO_DATA } from "../../../../../constants";
import { DataGrid } from "@mui/x-data-grid";
import CustomChip from "../../../../../components/custom-chip";
import moment from "moment/moment";
import { getFormattedDuration } from "../../../../../utils";
import PmUserCircleIcon from "../../../../../assets/icons/PmUserCircleIcon";
import PmEditReschedulerIcon from "../../../../../assets/icons/PMEditReshedulerIcon";
import ReschedulePopup from "../edit-reschedule";
import { actionPMScheduleData } from "../../../../../store/pm-activity";
import ListComponents from "../../../../../components/list-components";

export default function PMActivityPreviewSetUp() {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { pmScheduleData } = useSelector((state) => state.pmActivityStore);

  // Inside your PMActivityPreviewSetUp component, add this state:
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

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
          pmScheduleData?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.asset_name
          : "",
        frequency: pmScheduleData?.pm_details?.frequency,
        schedule_start_date: pmScheduleData?.pm_details?.schedule_start_date,
        status: pmScheduleData?.pm_details?.status,
        location: pmScheduleData?.selected_asset_id
          ? // Find the selected asset and get its description
          pmScheduleData?.assets.find(
            (asset) => asset.asset_id === pmScheduleData.selected_asset_id
          )?.location
          : "",
      },
    };

    setSelectedActivity(activityData);
    setRescheduleOpen(true);
  };

  const columns = [
    {
      flex: 0.1,
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
      flex: 0.1,
      field: "date_time",
      headerName: "Date & Time",
      editable: false,
      renderCell: (params) => {
        return (
          <Stack sx={{ height: "100%", justifyContent: "center" }}>
            {params.row.scheduled_date && params.row.scheduled_date !== null ? (
              <TypographyComponent
                color={theme.palette.grey.primary}
                fontSize={14}
                fontWeight={400}
                sx={{ py: "10px" }}
              >
                {params.row.scheduled_date && params.row.scheduled_date !== null
                  ? moment(params.row.scheduled_date, "YYYY-MM-DD").format("DD MMM YYYY")
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
      flex: 0.1,
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
      flex: 0.1,
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
      flex: 0.1,
      field: "supervision_by",
      headerName: "Supervision By",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      renderCell: () => {
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
      flex: 0.1,
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
      flex: 0.1,
      field: "remark",
      headerName: "Additional Information",
      editable: true,
    },
    {
      flex: 0.2,
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

  useEffect(() => {
    if (pmScheduleData?.is_active == 1) {
      if (pmScheduleData?.assets !== null && pmScheduleData?.assets?.length > 0) {
        const assetData = pmScheduleData.assets.find((asset) => asset.asset_id === pmScheduleData.selected_asset_id);
        const frequencies = (assetData?.frequency_exceptions || []).map((objFrequency) => ({
          ...objFrequency,
          scheduled_date: objFrequency.scheduled_date,
          remark: objFrequency.remark
        }));

        setFrequencyExceptionsData(frequencies);
      }
    } else {
      setFrequencyExceptionsData([]);
    }
  }, [pmScheduleData?.is_active]);

  return (
    <React.Fragment>
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
                ? moment(pmScheduleData.pm_details.schedule_start_date, "YYYY-MM-DD").format("DD MMM YYYY")
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
                  ( {pmScheduleData?.assets?.length} )
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
                {pmScheduleData?.assets?.length > 0 ? (
                  pmScheduleData?.assets?.map((asset) => (
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
                        let currentAssetIndex = pmData.assets.findIndex((obj) => obj?.asset_id === asset?.asset_id);
                        let currentData = pmData?.assets[currentAssetIndex]?.frequency_exceptions
                        let frequencies = currentData.map((objFrequency) => ({
                          ...objFrequency,
                          scheduled_date: objFrequency.scheduled_date,
                          remark: objFrequency.remark
                        }));

                        if (currentAssetIndex > -1) {
                          setFrequencyExceptionsData(frequencies);
                        }
                        dispatch(actionPMScheduleData(pmData));
                      }}
                    >
                      <TypographyComponent fontSize={14} fontWeight={400}>
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
              (asset) => asset.asset_id === pmScheduleData.selected_asset_id
            )?.asset_name + " PM Activity Schedule"
            : "PM Activity Schedule"}
        </Typography>
      </Stack>

      {/* Frequency Exceptions */}
      {frequencyExceptionsData &&
        frequencyExceptionsData !== null &&
        frequencyExceptionsData.length > 0 ? (
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

      <ReschedulePopup
        open={rescheduleOpen}
        selectedActivity={selectedActivity}
        handleClose={(data, type) => {
          setRescheduleOpen(false);
          if (type === "save") {
            const newDate = data.new_date
              ? moment(data.new_date, "DD/MM/YYYY").format("YYYY-MM-DD")
              : null;

            const remark = data.reason_for_reschedule || "";

            /* ------------------------------
               1. Update frequencyExceptionsData
            --------------------------------*/
            const updatedFrequencyExceptionsData = frequencyExceptionsData.map((item) => {
              if (item.scheduled_date === selectedActivity?.frequency_data?.scheduled_date) {
                return {
                  ...item,
                  scheduled_date: newDate,
                  remark: remark
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

            /* ------------------------------
               3. Update pmScheduleData
            --------------------------------*/
            const updatedPmScheduleData = {
              ...pmScheduleData,
              assets: pmScheduleData.assets.map((asset) => {
                if (asset.asset_id === selectedActivity.asset_id) {
                  return {
                    ...asset,
                    frequency_exceptions: asset.frequency_exceptions.map((item) => {
                      const updatedItem = {
                        ...item
                      };

                      // only update the selected one
                      if (item.scheduled_date === selectedActivity?.frequency_data?.scheduled_date) {
                        updatedItem.scheduled_date = newDate;
                        updatedItem.remark = remark;
                      }

                      return updatedItem;
                    })
                  };
                }
                return asset;
              })
            };
            dispatch(actionPMScheduleData(updatedPmScheduleData));
          }
        }}
      />
    </React.Fragment>
  );
}
