/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import {
  Drawer,
  Button,
  Stack,
  Divider,
  CircularProgress,
  IconButton,
  Grid,
  useTheme,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import CustomTextField from "../../../components/text-field";
import FormLabel from "../../../components/form-label";
import {
  ERROR,
  getPriorityArray,
  SERVER_ERROR,
  UNAUTHORIZED,
} from "../../../constants";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import FormHeader from "../../../components/form-header";
import { useSnackbar } from "../../../hooks/useSnackbar";
import { useAuth } from "../../../hooks/useAuth";
import CloseIcon from "../../../assets/icons/CloseIcon";

import { actionMasterAssetType } from "../../../store/asset";
import { useBranch } from "../../../hooks/useBranch";
import { actionAddTicket } from "../../../store/tickets";
import TotalPMIcon from "../../../assets/icons/TotalPMIcon";
import PMActivityAssetSetUp from "./components/pm-assets-setup";
import { actionPMScheduleData } from "../../../store/pm-activity";
import PMActivityPreviewSetUp from "./components/pm-preview-setup";

export default function AddPMSchedule({ open, handleClose }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const branch = useBranch();

  //Stores
  const { masterAssetType, getMasterAssetName, getAssetDetailsByName } =
    useSelector((state) => state.AssetStore);
  const { pmScheduleData } = useSelector((state) => state.PmActivityStore);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pm_activity_title: "",
      frequency: "",
      status: "",
      schedule_start_date: "",
    },
  });

  //States
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["PM Activity", "Preview PM Details"];

  // Handle next step (go to preview)
  const handleNext = () => {
    setActiveStep(1);
  };

  // Handle back step (go back to form)
  const handleBack = () => {
    setActiveStep(0);
  };

  // Handle save and close
  const handleSave = () => {
    // Here you would typically make an API call to save the data
    console.log("Saving PM Schedule Data:", pmScheduleData);

    // Show success message
    toast.success("PM Schedule saved successfully!");

    // Close the drawer
    handleClose();

    // Reset the form for next time
    setTimeout(() => {
      dispatch(
        actionPMScheduleData({
          assets: [],
          asset_type: "",
          pm_details: {},
          frequency_exceptions: [],
          is_active: 0,
        })
      );
      setActiveStep(0);
    }, 500);
  };

  const getStepContent = (step) => {
    console.log("------step------", step);
    switch (step) {
      case 0:
        return <PMActivityAssetSetUp onNext={handleNext} onBack={handleBack} />;
      case 1:
        return (
          <PMActivityPreviewSetUp onBack={handleBack} onSave={handleSave} />
        );
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
      dispatch(actionPMScheduleData(pmData));

      dispatch(
        actionMasterAssetType({
          client_uuid: branch?.currentBranch?.client_uuid,
        })
      );
    }

    return () => {};
  }, [open]);

  // Reset everything when drawer closes
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
    }
  }, [open]);

  return (
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
        <Stack
          sx={{
            px: 4,
            pb: 4,
            flexGrow: 1,
            "&::-webkit-scrollbar": { width: "2px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: "2px",
            },
          }}
        >
          {activeStep !== steps.length && getStepContent(activeStep)}
        </Stack>
      </Stack>
    </Drawer>
  );
}
