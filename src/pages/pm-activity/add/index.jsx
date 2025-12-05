/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, FormProvider } from "react-hook-form";
import {
  Drawer,
  Button,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  useTheme,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import FormHeader from "../../../components/form-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import CloseIcon from "../../../assets/icons/CloseIcon";

import { actionMasterAssetType } from "../../../store/asset";
import { useBranch } from "../../../hooks/useBranch";
import TotalPMIcon from "../../../assets/icons/TotalPMIcon";
import PMActivityAssetSetUp from "./components/pm-assets-setup";
import {
  actionPMScheduleAdd,
  actionPMScheduleData,
  resetPmScheduleAddAssetResponse,
  resetPmScheduleDataResponse,
} from "../../../store/pm-activity";
import PMActivityPreviewSetUp from "./components/pm-preview-setup";
import moment from "moment";

export default function AddPMSchedule({ open, handleClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const branch = useBranch();
  const { showSnackbar } = useSnackbar();

  //Stores
  const { pmScheduleData, pmScheduleAdd } = useSelector(
    (state) => state.pmActivityStore
  );

  const methods = useForm({
    mode: "onSubmit",
    defaultValues: {
      pm_activity_title: "",
      frequency: "",
      status: "",
      schedule_start_date: "",
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  //States
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["PM Activity", "Preview PM Details"];

  useEffect(() => {
    if (pmScheduleAdd && pmScheduleAdd !== null) {
      dispatch(resetPmScheduleAddAssetResponse());
      if (pmScheduleAdd?.result === true) {
        handleClose("save");
        reset();
        setLoading(false);
        showSnackbar({
          message: pmScheduleAdd?.message,
          severity: "success",
        });
        dispatch(resetPmScheduleDataResponse())
      } else {
        setLoading(false);
        switch (pmScheduleAdd?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetPmScheduleAddAssetResponse());
            showSnackbar({
              message: pmScheduleAdd?.message,
              severity: "error",
            });
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: pmScheduleAdd?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [pmScheduleAdd]);

  // Handle next step (go to preview)
  const handleNext = () => {
    setActiveStep(1);
    let objData = Object.assign({}, pmScheduleData)
    objData.is_active = 1
    dispatch(actionPMScheduleData(objData))
  };

  // Handle back step (go back to form)
  const handleBack = () => {
    setActiveStep(0);
    let objData = Object.assign({}, pmScheduleData)
    objData.is_active = 0
    dispatch(actionPMScheduleData(objData))
  };
  // Helper function to format date as "2025-11-05"
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Helper function to get ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
  const getOrdinalSuffix = (number) => {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return "th";
    }

    switch (lastDigit) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Helper function to create activity object with proper title and date format
  const createActivityObject = (index, date) => {
    const ordinal = getOrdinalSuffix(index);
    const formattedDate = formatDate(date);

    return {
      id: index,
      title: `${index}${ordinal} Activity Date`,
      date: formattedDate,
      status: "Upcoming",
      completed_date: "",
      supervision_by: "",
      time: "",
      additional_info: "",
    };
  };

  // Function to generate dates based on frequency
  const generateFrequencyDates = (frequency, startDate) => {
    // Validate inputs
    if (!frequency || !startDate) {
      console.error("Missing frequency or startDate:", {
        frequency,
        startDate,
      });
      return [];
    }

    const dates = [];

    try {
      // Parse date from DD/MM/YYYY format
      const dateParts = startDate.split("/");
      if (dateParts.length !== 3) {
        console.error(
          "Invalid date format. Expected DD/MM/YYYY, got:",
          startDate
        );
        return [];
      }
      const [day, month, year] = dateParts.map(Number);
      const start = new Date(year, month - 1, day);

      if (isNaN(start.getTime())) {
        console.error("Invalid start date:", startDate);
        return [];
      }

      // Normalize frequency string for case-insensitive matching
      const normalizedFrequency = frequency.toLowerCase().trim();

      // Handle different frequency types
      if (
        normalizedFrequency.includes("monthly") ||
        (normalizedFrequency.includes("month") &&
          !normalizedFrequency.includes("3") &&
          !normalizedFrequency.includes("6"))
      ) {
        // Monthly frequency - generate for 12 months (1 year)
        for (let i = 0; i < 12; i++) {
          const newDate = new Date(start);
          newDate.setMonth(start.getMonth() + i);

          // Handle edge case where day doesn't exist in target month
          if (newDate.getDate() !== day) {
            newDate.setDate(0); // Last day of previous month
          }

          dates.push(createActivityObject(i + 1, newDate));
        }
      } else if (
        normalizedFrequency.includes("quarterly") ||
        normalizedFrequency.includes("3 month")
      ) {
        // Quarterly frequency - generate for 4 quarters (1 year)
        for (let i = 0; i < 4; i++) {
          const newDate = new Date(start);
          newDate.setMonth(start.getMonth() + i * 3);

          if (newDate.getDate() !== day) {
            newDate.setDate(0);
          }

          dates.push(createActivityObject(i + 1, newDate));
        }
      } else if (
        normalizedFrequency.includes("half yearly") ||
        normalizedFrequency.includes("6 month")
      ) {
        // Half Yearly frequency - generate for 2 half-years (1 year)
        for (let i = 0; i < 2; i++) {
          const newDate = new Date(start);
          newDate.setMonth(start.getMonth() + i * 6);

          if (newDate.getDate() !== day) {
            newDate.setDate(0);
          }

          dates.push(createActivityObject(i + 1, newDate));
        }
      } else if (
        normalizedFrequency.includes("yearly") ||
        normalizedFrequency.includes("1 year")
      ) {
        // Yearly frequency - generate for 1 year
        const oneYearDate = new Date(start);
        oneYearDate.setFullYear(start.getFullYear() + 1);

        if (oneYearDate.getDate() !== day) {
          oneYearDate.setDate(0);
        }

        dates.push(createActivityObject(1, oneYearDate));
      } else if (normalizedFrequency.includes("week")) {
        // Weekly frequency - generate 52 weeks (1 year)
        for (let i = 0; i < 52; i++) {
          const newDate = new Date(start);
          newDate.setDate(start.getDate() + i * 7);
          dates.push(createActivityObject(i + 1, newDate));
        }
      } else {
        console.warn("Unknown frequency:", frequency);
        dates.push(createActivityObject(1, start));
      }
    } catch (error) {
      console.error("Error generating frequency dates:", error);
      return [];
    }

    return dates;
  };

  useEffect(() => {
    if (pmScheduleData?.pm_details && pmScheduleData?.pm_details !== null) {
      setValue('pm_activity_title', pmScheduleData?.pm_details?.title)
      setValue('frequency', pmScheduleData?.pm_details?.frequency)
      setValue('schedule_start_date', moment(pmScheduleData?.pm_details?.schedule_start_date, "YYYY-MM-DD").format("DD/MM/YYYY"))
      setValue('status', pmScheduleData?.pm_details?.status)
    }
  }, [pmScheduleData?.pm_details])

  const onStep1Submit = (data) => {
    // setLoading(true);

    let pmData = Object.assign({}, pmScheduleData);
    let objData = {
      title: data?.pm_activity_title,
      frequency: data?.frequency,
      schedule_start_date: data?.schedule_start_date && data?.schedule_start_date !== null ? moment(data?.schedule_start_date, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
      status: data?.status,
      is_active: data?.is_active,
    };
    pmData.pm_details = objData;

    // Generate frequency dates for each selected asset separately
    if (data && data?.frequency && data?.schedule_start_date) {
      const assetsWithGeneratedDates =
        pmData?.assets && pmData?.assets !== null && pmData?.assets.length > 0
          ? pmData?.assets?.map((asset) => ({
            ...asset,
            frequency_exceptions: generateFrequencyDates(
              data.frequency,
              data.schedule_start_date
            ),
          }))
          : [];

      pmData.assets = assetsWithGeneratedDates;
    } else {
      console.error("Missing frequency or start date in data:", data);
      // Ensure each asset has empty frequency_exceptions
      pmData.assets =
        pmData?.assets && pmData?.assets !== null && pmData?.assets.length > 0
          ? pmData?.assets?.map((asset) => ({
            ...asset,
          }))
          : [];
    }

    pmData.is_active = 1; // Set to 1 for preview step
    pmData.selected_asset_id = pmData?.assets[0]?.asset_id || 0;
    // Dispatch the data to Redux store
    dispatch(actionPMScheduleData(pmData));
    setActiveStep(1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <form
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onStep1Submit)}
          >
            <PMActivityAssetSetUp onNext={handleNext} onBack={handleBack} />
          </form>
        );
      case 1:
        return <PMActivityPreviewSetUp onBack={handleBack} />;
      default:
        return (
          <Typography>
            {" "}
            <Stack>
              <Typography>This is default Page!!</Typography>
            </Stack>{" "}
          </Typography>
        );
    }
  };

  useEffect(() => {
    if (open === true) {
      // Reset to first step when drawer opens
      setActiveStep(0);
      let pmData = Object.assign({}, pmScheduleData);
      pmData.is_active = 0;
      pmData.pm_details = null;
      pmData.assets = [];
      pmData.selected_asset_id = null;
      dispatch(actionPMScheduleData(pmData));

      dispatch(
        actionMasterAssetType({
          client_uuid: branch?.currentBranch?.client_uuid,
        })
      );
    }

    return () => {
      let pmData = Object.assign({}, pmScheduleData);
      pmData.is_active = 0;
      pmData.pm_details = null;
      pmData.assets = [];
      pmData.selected_asset_id = null;
      dispatch(actionPMScheduleData(pmData));
    };
  }, [open]);

  // Handle save schedule
  const handleSaveSchedule = () => {
    setLoading(false);

    let objData = {
      branch_uuid: branch?.currentBranch?.uuid,
      pm_activity_details: pmScheduleData?.pm_details,
      assets: pmScheduleData?.assets,
    };
    setLoading(true);
    dispatch(actionPMScheduleAdd(objData));
  };

  return (
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
          title="Create New PM Schedule"
          subtitle="Fill below form to create new PM schedule"
          actions={[
            <IconButton onClick={handleClose}>
              <CloseIcon size={16} />
            </IconButton>,
          ]}
        />
        <Divider sx={{ m: 2 }} />
        <FormProvider {...methods}>
          <Stack
            sx={{
              px: 4,
              flexGrow: 1,
              overflowY: 'auto'
            }}
          >
            {activeStep !== steps.length && getStepContent(activeStep)}
          </Stack>
          <Divider sx={{ m: 2 }} />
          {activeStep == 1 ? (
            <>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: 2, pb: 2 }}
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
                  onClick={handleBack}
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
                  {loading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    "Save Schedule"
                  )}
                </Button>
              </Stack>
            </>
          ) : (
            <React.Fragment>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: 2, pb: 2 }}
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
                  onClick={handleBack}
                >
                  Reset
                </Button>
                <Button
                  sx={{
                    textTransform: "capitalize",
                    px: 6,
                    borderRadius: "8px",
                    backgroundColor: pmScheduleData?.assets?.length === 0 ? theme.palette.grey[400] : theme.palette.primary[600],
                    color: theme.palette.common.white,
                    fontSize: 16,
                    fontWeight: 600,
                    borderColor: pmScheduleData?.assets?.length === 0 ? theme.palette.grey[600] : theme.palette.primary[600],
                  }}
                  variant="contained"
                  onClick={handleSubmit(onStep1Submit)}
                  disabled={loading || pmScheduleData?.assets?.length === 0}
                >
                  {loading ? (
                    <CircularProgress size={18} sx={{ color: "white" }} />
                  ) : (
                    "Preview"
                  )}
                </Button>
              </Stack>
            </React.Fragment>
          )}
        </FormProvider>
      </Stack>
    </Drawer>
  );
}
