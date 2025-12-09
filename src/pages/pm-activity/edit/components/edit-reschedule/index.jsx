/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TextField,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
  Grid,
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import moment from "moment";
import TypographyComponent from "../../../../../components/custom-typography";
import { Controller, useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import FormLabel from "../../../../../components/form-label";
import CalendarIcon from "../../../../../assets/icons/CalendarIcon";
import CustomTextField from "../../../../../components/text-field";
import DatePickerWrapper from "../../../../../components/datapicker-wrapper";
import { useDispatch, useSelector } from "react-redux";
import ChevronDownIcon from "../../../../../assets/icons/ChevronDown";
import AddressIcon from "../../../../../assets/icons/AddressIcon";
import { useSnackbar } from "../../../../../hooks/useSnackbar";
import DeleteIcon from "../../../../../assets/icons/DeleteIcon";
import FileIcon from "../../../../../assets/icons/FileIcon";
import _ from "lodash";
import CustomAutocomplete from "../../../../../components/custom-autocomplete";
import {
  actionAssetCustodianList,
  resetAssetCustodianListResponse,
} from "../../../../../store/asset";
import { ERROR, SERVER_ERROR, UNAUTHORIZED } from "../../../../../constants";
import { useBranch } from "../../../../../hooks/useBranch";
import { useAuth } from "../../../../../hooks/useAuth";
import SectionHeader from "../../../../../components/section-header";
import {
  actionPMScheduleDetails,
  actionPMScheduleMarkDone,
  resetPmScheduleMarkDoneResponse,
} from "../../../../../store/pm-activity";
import ClockIcon from "../../../../../assets/icons/ClockIcon";
import { compressFile, getFormData } from "../../../../../utils";
import { BootstrapDialog } from "../../../../../components/common";

export default function ReschedulePopup({
  open,
  selectedActivity,
  handleClose,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { showSnackbar } = useSnackbar();
  const branch = useBranch();
  const isMDDown = useMediaQuery(theme.breakpoints.down("md"));
  const [arrUploadedFiles, setArrUploadedFiles] = useState([]);
  const [supervisorMasterOptions, setSupervisorMasterOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const ALLOWED_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "xlsx",
    "csv",
    "pdf",
    "docx",
  ];
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes

  const { pmScheduleMarkDone } = useSelector((state) => state.pmActivityStore);

  const { assetCustodianList } = useSelector((state) => state.AssetStore);

  // Trigger file dialog
  const handleTriggerInput = () => {
    inputRef.current.click();
  };

  const {
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      current_schedule_date: "",
      new_date: "",
      reason_for_reschedule: "",
      supervised_by: ""
    },
  });

  useEffect(() => {
    if (open === true) {
      if (
        selectedActivity &&
        selectedActivity !== null &&
        selectedActivity?.type === "reschedule"
      ) {
        setValue(
          "current_schedule_date",
          moment(selectedActivity?.frequency_data?.scheduled_date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          )
        );
      }
    }
  }, [selectedActivity, open]);

  //handle delete function
  const handleDelete = (index) => {
    const newFiles = [...arrUploadedFiles];
    newFiles.splice(index, 1);
    setArrUploadedFiles(newFiles);
  };

  /**
   * Check if the selected files extension is valid or not
   * @param {*} fileName
   * @returns
   */
  const isValidExtension = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(ext);
  };

  //handle file change function
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    let filesToAdd = [];
    for (let file of selectedFiles) {
      if (!isValidExtension(file.name)) {
        showSnackbar({
          message: `File "${file.name}" has an invalid file type.`,
          severity: "error",
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        showSnackbar({
          message: `File "${file.name}" exceeds the 50MB size limit.`,
          severity: "error",
        });
        continue;
      }
      // Add is_new anf file name key here
      filesToAdd.push({ file, is_new: 1, name: file?.name });
    }
    if (filesToAdd.length > 0) {
      setArrUploadedFiles((prev) => [...prev, ...filesToAdd]);
    }
    event.target.value = null;
  };

  //handle drag drop function
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const droppedFiles = Array.from(event.dataTransfer.files);
    let filesToAdd = [];
    for (let file of droppedFiles) {
      if (!isValidExtension(file.name)) {
        showSnackbar({
          message: `File "${file.name}" has an invalid file type.`,
          severity: "error",
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        showSnackbar({
          message: `File "${file.name}" exceeds the 50MB size limit.`,
          severity: "error",
        });
        continue;
      }
      filesToAdd.push({ file, is_new: 1 });
    }
    if (filesToAdd.length > 0) {
      setArrUploadedFiles((prev) => [...prev, ...filesToAdd]);
    }
  };

  //handle drag over
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    if (
      branch?.currentBranch?.uuid &&
      branch?.currentBranch?.uuid !== null &&
      selectedActivity?.client_id
    ) {
      dispatch(
        actionAssetCustodianList({
          branch_uuid: branch?.currentBranch?.uuid,
          client_id: selectedActivity?.client_id,
        })
      );
    }
  }, [branch?.currentBranch, selectedActivity?.client_id]);

  useEffect(() => {
    if (assetCustodianList && assetCustodianList !== null) {
      dispatch(resetAssetCustodianListResponse());
      if (assetCustodianList?.result === true) {
        setSupervisorMasterOptions(assetCustodianList?.response);
      } else {
        setSupervisorMasterOptions([]);
        switch (assetCustodianList?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetAssetCustodianListResponse());
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: assetCustodianList?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [assetCustodianList]);

  useEffect(() => {
    if (pmScheduleMarkDone && pmScheduleMarkDone !== null) {
      dispatch(resetPmScheduleMarkDoneResponse());
      if (pmScheduleMarkDone?.result === true) {
        showSnackbar({
          message: pmScheduleMarkDone?.message,
          severity: "success",
        });
        reset();
        handleClose("save");
        setLoading(false);
        if (selectedActivity && selectedActivity !== null && selectedActivity?.pm_activity_uuid) {
          dispatch(actionPMScheduleDetails({ uuid: selectedActivity?.pm_activity_uuid }));
        }
      } else {
        setLoading(false);

        switch (pmScheduleMarkDone?.status) {
          case UNAUTHORIZED:
            logout();
            break;
          case ERROR:
            dispatch(resetPmScheduleMarkDoneResponse());
            break;
          case SERVER_ERROR:
            showSnackbar({
              message: pmScheduleMarkDone?.message,
              severity: "error",
            });
            break;
          default:
            break;
        }
      }
    }
  }, [pmScheduleMarkDone]);

  const durationOptions = [];
  for (let hour = 1; hour <= 24; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`;
    durationOptions.push(time);
  }

  const onSubmit = async (data) => {
    if (selectedActivity?.type === "markAsDone") {
      // Build the main payload
      let input = {
        branch_uuid: branch?.currentBranch?.uuid,
        activity_date: selectedActivity?.frequency_data?.scheduled_date,
        completion_date: data?.completion_date
          ? moment(data?.completion_date, "DD/MM/YYYY").format("YYYY-MM-DD")
          : null,

        duration: data.duration,
        supervised_by: data.supervised_by,
        completed_by: selectedActivity?.pm_details?.vendor?.vendor_id,
        remark: data.completion_notes,
        sequence: selectedActivity?.frequency_data?.sequence,
        pm_activity_id: selectedActivity?.pm_activity_id,
        asset_id: selectedActivity?.asset_id,
      };

      // -------------------------------
      // FILE HANDLING
      // -------------------------------
      const files = [];

      const newFiles = arrUploadedFiles?.filter((f) => f?.is_new === 1) || [];

      if (newFiles.length > 0) {
        for (const fileObj of newFiles) {
          const compressedFile = await compressFile(fileObj.file);

          files.push({
            title: "history_file", // previously undefined
            data: compressedFile,
          });
        }
      }

      setLoading(true);

      // Create formData
      const formData = getFormData(input, files);

      dispatch(actionPMScheduleMarkDone(formData));
    } else if (selectedActivity?.type === "reschedule") {
      handleClose(data, "save");
      reset()
    }
  };

  return (
    <BootstrapDialog
      fullWidth
      fullScreen={isMDDown}
      maxWidth={'xl'}
      onClose={() => handleClose()}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      scroll="paper"
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
          {selectedActivity?.type === "reschedule" && (
            <React.Fragment>
              <Stack flexDirection="row" alignItems="center">
                <Stack columnGap={1}>
                  <TypographyComponent fontSize={16} fontWeight={600}>
                    Reschedule #{selectedActivity?.frequency_data?.id} PM
                    Activity
                  </TypographyComponent>
                  <TypographyComponent
                    fontSize={14}
                    fontWeight={400}
                    sx={{ color: theme.palette.grey[700] }}
                  >
                    Reschedule PM Activity #
                    {selectedActivity?.frequency_data?.id}
                  </TypographyComponent>
                </Stack>
              </Stack>
            </React.Fragment>
          )}
          {selectedActivity?.type === "markAsDone" && (
            <React.Fragment>
              <Stack flexDirection="row" alignItems="center">
                <Stack columnGap={1}>
                  <TypographyComponent fontSize={16} fontWeight={600}>
                    Mark #{selectedActivity?.frequency_data?.id} PM Activity as
                    Completed
                  </TypographyComponent>
                  <TypographyComponent
                    fontSize={14}
                    fontWeight={400}
                    sx={{ color: theme.palette.grey[700] }}
                  >
                    Record completion details for PM Activity #
                    {selectedActivity?.frequency_data?.id}
                  </TypographyComponent>
                </Stack>
              </Stack>
            </React.Fragment>
          )}
        </Stack>
      </DialogTitle>
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        <DialogContent
          sx={{
            borderRadius: 2,
            scrollbarWidth: "thin",
            backgroundColor: "white",
            px: "24px",
            whiteSpace: "nowrap",
            width: "100%",
          }}
        >
          <DatePickerWrapper>
            <Grid
              container
              sx={{
                borderRadius: "16px",
                border: `1px solid ${theme.palette.grey[300]}`,
                padding: "24px",
              }}
            >
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{
                    color: theme.palette.grey[700],
                  }}
                >
                  Asset Name
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                  title={selectedActivity?.pm_details?.title}
                >
                  {_.truncate(selectedActivity?.pm_details?.title, {
                    length: 35,
                  })}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  Frequency
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {selectedActivity?.pm_details?.frequency}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  Schedule Date
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {selectedActivity?.frequency_data?.scheduled_date !== null &&
                    moment(
                      selectedActivity?.frequency_data?.scheduled_date,
                      "YYYY-MM-DD"
                    ).format("DD MMM YYYY")}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3, xl: 3 }}>
                <TypographyComponent
                  fontSize={14}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  Location
                </TypographyComponent>
                <TypographyComponent
                  fontSize={16}
                  fontWeight={500}
                  sx={{ color: theme.palette.grey[700] }}
                >
                  {selectedActivity?.pm_details?.location}
                </TypographyComponent>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ my: 2 }}>
              {selectedActivity?.type === "reschedule" && (
                <React.Fragment>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Controller
                      name="current_schedule_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="current_schedule_date"
                          customInput={
                            <CustomTextField
                              size="small"
                              label={
                                <FormLabel
                                  label="Current Schedule Date"
                                  required={false}
                                />
                              }
                              fullWidth
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <IconButton
                                      edge="start"
                                      onMouseDown={(e) => e.preventDefault()}
                                    >
                                      <CalendarIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              error={Boolean(errors.current_schedule_date)}
                              {...(errors.current_schedule_date && {
                                helperText:
                                  errors.current_schedule_date.message,
                              })}
                            />
                          }
                          value={field.value}
                          selected={
                            field?.value
                              ? moment(field.value, "DD/MM/YYYY").toDate()
                              : null
                          }
                          showYearDropdown={true}
                          disabled={true}
                          onChange={(date) => {
                            const formattedDate =
                              moment(date).format("DD/MM/YYYY");
                            field.onChange(formattedDate);
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6, xl: 6 }}>
                    <Controller
                      name="new_date"
                      control={control}
                      render={({ field }) => {

                        const scheduledDate = selectedActivity?.frequency_data?.scheduled_date;
                        const frequency = selectedActivity?.pm_details?.frequency;

                        const scheduledMoment = scheduledDate
                          ? moment(scheduledDate, "YYYY-MM-DD")
                          : moment(); // fallback

                        let minDate, maxDate;

                        switch (frequency) {
                          case "Monthly":
                            minDate = scheduledMoment.startOf("month").toDate();
                            maxDate = scheduledMoment.endOf("month").toDate();
                            break;

                          case "Quarterly":
                            minDate = scheduledMoment.startOf("quarter").toDate();
                            maxDate = scheduledMoment.endOf("quarter").toDate();
                            break;

                          case "Half Yearly":
                            minDate = scheduledMoment.startOf("quarter").subtract(1, "quarter").toDate();
                            maxDate = scheduledMoment.endOf("quarter").add(1, "quarter").toDate();
                            break;

                          case "Yearly":
                            minDate = scheduledMoment.startOf("year").toDate();
                            maxDate = scheduledMoment.endOf("year").toDate();
                            break;

                          default:
                            minDate = scheduledMoment.startOf("month").toDate();
                            maxDate = scheduledMoment.endOf("month").toDate();
                        }

                        const selectedDate = field.value
                          ? moment(field.value, "DD/MM/YYYY").toDate()
                          : null;

                        return (
                          <DatePicker
                            id="new_date"
                            customInput={
                              <CustomTextField
                                size="small"
                                label={<FormLabel label="New Date" />}
                                fullWidth
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton edge="start" onMouseDown={(e) => e.preventDefault()}>
                                        <CalendarIcon />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                                error={Boolean(errors.new_date)}
                                {...(errors.new_date && { helperText: errors.new_date.message })}
                              />
                            }
                            minDate={minDate}
                            maxDate={maxDate}
                            selected={selectedDate}
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              field.onChange(moment(date).format("DD/MM/YYYY"));
                            }}
                          />
                        );
                      }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
                    <Controller
                      name="reason_for_reschedule"
                      control={control}
                      rules={{
                        required: "Name is required",
                        maxLength: {
                          value: 255,
                          message: "Maximum length is 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          placeholder={"Enter note"}
                          inputProps={{ maxLength: 255 }}
                          value={field?.value}
                          minRows={3}
                          multiline
                          label={
                            <FormLabel
                              label="Reason For Reschedule"
                              required={true}
                            />
                          }
                          onChange={field.onChange}
                          error={Boolean(errors.reason_for_reschedule)}
                          {...(errors.reason_for_reschedule && {
                            helperText: errors.reason_for_reschedule.message,
                          })}
                        />
                      )}
                    />
                  </Grid>
                </React.Fragment>
              )}
              {selectedActivity?.type === "markAsDone" && (
                <React.Fragment>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="completion_date"
                      control={control}
                      render={({ field }) => {
                        // read scheduled_date from selectedActivity
                        const scheduledDate =
                          selectedActivity?.frequency_data?.scheduled_date;

                        // convert YYYY-MM-DD → moment date
                        const scheduledMoment = scheduledDate
                          ? moment(scheduledDate, "YYYY-MM-DD")
                          : moment(); // fallback current date

                        // set min & max based on scheduled_date month
                        const minDate = scheduledMoment
                          .startOf("month")
                          .toDate();
                        const maxDate = scheduledMoment.endOf("month").toDate();

                        // Convert stored DD/MM/YYYY → Date object safely
                        const selectedDate = field.value
                          ? moment(field.value, "DD/MM/YYYY").toDate()
                          : null;

                        return (
                          <DatePicker
                            id="completion_date"
                            placeholder="Completion Date"
                            customInput={
                              <CustomTextField
                                size="small"
                                label={
                                  <FormLabel
                                    label="Completion Date"
                                    required={false}
                                  />
                                }
                                fullWidth
                                error={Boolean(errors.completion_date)}
                                {...(errors.completion_date && {
                                  helperText: errors.completion_date.message,
                                })}
                              />
                            }
                            minDate={minDate}
                            maxDate={maxDate}
                            selected={selectedDate}
                            dateFormat="dd/MM/yyyy"
                            onChange={(date) => {
                              // Save to form as DD/MM/YYYY
                              const formatted =
                                moment(date).format("DD/MM/YYYY");
                              field.onChange(formatted);
                            }}
                          />
                        );
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="completed_by"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          value={
                            selectedActivity?.pm_details?.vendor?.vendor_name
                          }
                          placeholder={"Vendor Name"}
                          label={
                            <FormLabel label="Completed By" required={false} />
                          }
                          onChange={field?.onChange}
                          disabled
                          error={Boolean(errors.completed_by)}
                          {...(errors.address && {
                            helperText: errors.completed_by.message,
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="supervised_by"
                      control={control}
                      rules={{
                        required: "Please select Supervisor",
                      }}
                      render={({ field }) => (
                        <CustomAutocomplete
                          {...field}
                          label="Supervisor"
                          is_required={false}
                          displayName1="name"
                          displayName2="role"
                          options={supervisorMasterOptions}
                          error={Boolean(errors.supervised_by)}
                          helperText={errors.supervised_by?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          size="small"
                          label={<FormLabel label="Duration" />}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          error={Boolean(errors.duration)}
                          {...(errors.duration && { helperText: errors.duration.message })}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ClockIcon />
                              </InputAdornment>
                            ),
                          }}
                          SelectProps={{
                            MenuProps: {
                              PaperProps: {
                                style: {
                                  maxHeight: 220, // Set your desired max height
                                  scrollbarWidth: "thin",
                                },
                              },
                            },
                          }}
                        >
                          {durationOptions.map((time) => (
                            <MenuItem
                              key={time}
                              value={time}
                              sx={{
                                whiteSpace: "normal",
                                wordBreak: "break-word",
                                maxWidth: 440,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {time}
                            </MenuItem>
                          ))}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="completion_notes"
                      control={control}
                      rules={{
                        required: "Name is required",
                        maxLength: {
                          value: 255,
                          message: "Maximum length is 255 characters",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          placeholder={"Enter note"}
                          inputProps={{ maxLength: 255 }}
                          value={field?.value}
                          minRows={3}
                          multiline
                          label={
                            <FormLabel
                              label="Completion Notes"
                              required={true}
                            />
                          }
                          onChange={field.onChange}
                          error={Boolean(errors.completion_notes)}
                          {...(errors.completion_notes && {
                            helperText: errors.completion_notes.message,
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3, xl: 3 }}>
                    <SectionHeader
                      title="Upload Files"
                      show_progress={0}
                      sx={{ marginTop: 1 }}
                    />

                    <Stack
                      sx={{
                        borderRadius: "8px",
                        border: `1px solid ${theme.palette.grey[300]}`,
                        p: 2,
                        marginTop: "-4px",
                        pb: 0,
                      }}
                    >
                      <Stack
                        onClick={handleTriggerInput}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        sx={{
                          cursor: "pointer",
                          border: `1px dashed ${theme.palette.primary[600]}`,
                          borderRadius: "8px",
                          background: theme.palette.primary[100],
                          p: "16px",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <input
                          hidden
                          accept=".jpg,.jpeg,.png,.xlsx,.csv,.pdf,.docx"
                          type="file"
                          multiple
                          ref={inputRef}
                          onChange={handleFileChange}
                        />
                        <TypographyComponent
                          fontSize={14}
                          fontWeight={400}
                          sx={{ mr: 1 }}
                        >
                          Drag & Drop file(s) to upload or{" "}
                        </TypographyComponent>
                        <TypographyComponent
                          fontSize={14}
                          fontWeight={500}
                          sx={{
                            color: theme.palette.primary[600],
                            textDecoration: "underline",
                          }}
                        >
                          Browse
                        </TypographyComponent>
                      </Stack>
                      <List>
                        {arrUploadedFiles &&
                          arrUploadedFiles !== null &&
                          arrUploadedFiles.length > 0 ? (
                          arrUploadedFiles.map((file, idx) => (
                            <React.Fragment key={file.name}>
                              <ListItem
                                sx={{ mb: "-8px" }}
                                secondaryAction={
                                  <>
                                    <IconButton
                                      edge="end"
                                      aria-label="delete"
                                      onClick={() => handleDelete(idx)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </>
                                }
                              >
                                <FileIcon sx={{ mr: 1 }} />
                                <ListItemText
                                  primary={
                                    <TypographyComponent
                                      fontSize={14}
                                      fontWeight={500}
                                      sx={{ textDecoration: "underline" }}
                                    >
                                      {file?.name && file?.name !== null
                                        ? _.truncate(file?.name, { length: 25 })
                                        : ""}
                                    </TypographyComponent>
                                  }
                                />
                              </ListItem>
                            </React.Fragment>
                          ))
                        ) : (
                          <></>
                        )}
                      </List>
                    </Stack>
                  </Grid>
                </React.Fragment>
              )}
            </Grid>
          </DatePickerWrapper>
        </DialogContent>
      </form>
      <DialogActions sx={{ mx: 1, mb: 1, gap: 2 }}>
        <Button
          onClick={() => {
            reset();
            handleClose();
          }}
          variant="outlined"
          sx={{
            borderColor: theme.palette.grey[300],
            color: theme.palette.grey[700],
            borderRadius: "8px",
            px: 4,
            textTransform: "capitalize",
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          disabled={loading}
          sx={{
            backgroundColor: theme.palette.primary[600],
            color: theme.palette.common.white,
            borderRadius: "8px",
            px: 4,
            textTransform: "capitalize",
            fontWeight: 600,
            "&:disabled": {
              backgroundColor: theme.palette.grey[300],
              color: theme.palette.grey[500],
            },
          }}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: "white" }} />
          ) : selectedActivity?.type === "reschedule" ? (
            "Confirm Reschedule"
          ) : (
            "Mark Done"
          )}
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
