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
import { actionPMScheduleData } from "../../../../../store/pm-activity";

export default function ReschedulePopup({
  open,
  handleClose,
  selectedActivity,
}) {
  const theme = useTheme();
  const isMDDown = useMediaQuery(theme.breakpoints.down("md"));
  const [arrUploadedFiles, setArrUploadedFiles] = useState([]);
  const { showSnackbar } = useSnackbar();
  const inputRef = useRef();
  const dispatch = useDispatch();

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

  const { pmScheduleData } = useSelector((state) => state.pmActivityStore);

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
    },
  });

  useEffect(() => {
    if (open === true) {
      console.log("----selectedActivity-------", selectedActivity);
      if (selectedActivity && selectedActivity !== null) {
        let ObjData = Object.assign({}, pmScheduleData);
        ObjData.pm_details = selectedActivity?.pm_details;
        console.log("----ObjData-------", ObjData);
        dispatch(actionPMScheduleData(ObjData));
      }
      if (
        selectedActivity !== null &&
        selectedActivity?.frequency_data !== null &&
        selectedActivity?.frequency_data?.date !== null
      ) {
        setValue(
          "current_schedule_date",
          moment(selectedActivity?.frequency_data?.date, "YYYY-MM-DD").format(
            "DD/MM/YYYY"
          )
        );
      }
      if (
        selectedActivity !== null &&
        selectedActivity?.frequency_data !== null &&
        selectedActivity?.frequency_data?.scheduled_date !== null
      ) {
        setValue(
          "current_schedule_date",
          moment(
            selectedActivity?.frequency_data?.scheduled_date,
            "YYYY-MM-DD"
          ).format("DD/MM/YYYY")
        );
      }
    }
  }, [selectedActivity, open]);

  const onSubmit = (data) => {
    reset();
    handleClose(data, "save");
  };

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

  return (
    <Dialog
      fullWidth
      fullScreen={isMDDown}
      maxWidth="md"
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          overflow: "visible",
          borderRadius: 3,
        },
      }}
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
          <Stack flexDirection="row" alignItems="center">
            <Stack columnGap={1}>
              <TypographyComponent fontSize={16} fontWeight={600}>
                Reschedule #{selectedActivity?.frequency_data?.id} PM Activity
              </TypographyComponent>
              <TypographyComponent
                fontSize={14}
                fontWeight={400}
                sx={{ color: theme.palette.grey[700] }}
              >
                Reschedule PM Activity #{selectedActivity?.frequency_data?.id}
              </TypographyComponent>
            </Stack>
          </Stack>
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
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
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
                >
                  {selectedActivity?.asset_description}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
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
                  {pmScheduleData?.pm_details?.frequency}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
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
                  {console.log(
                    "----pmScheduleData---4444444444444----",
                    pmScheduleData
                  )}
                  {pmScheduleData?.pm_details?.schedule_start_date !== null &&
                    moment(
                      pmScheduleData?.pm_details?.schedule_start_date,
                      "DD/MM/YYYY"
                    ).format("DD MMM YYYY")}
                </TypographyComponent>
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
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
                  {selectedActivity?.location}
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
                      render={({ field }) => (
                        <DatePicker
                          id="new_date"
                          customInput={
                            <CustomTextField
                              size="small"
                              label={
                                <FormLabel label="New Date" required={false} />
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
                              error={Boolean(errors.new_date)}
                              {...(errors.new_date && {
                                helperText: errors.new_date.message,
                              })}
                            />
                          }
                          value={field.value}
                          minDate={moment().toDate()}
                          maxDate={moment().endOf("month").toDate()}
                          selected={
                            field?.value
                              ? moment(field.value, "DD/MM/YYYY").toDate()
                              : null
                          }
                          showYearDropdown={true}
                          onChange={(date) => {
                            const formattedDate =
                              moment(date).format("DD/MM/YYYY");
                            field.onChange(formattedDate);
                          }}
                        />
                      )}
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
                  <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="completion_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          id="completion_date"
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
                              error={Boolean(errors.completion_date)}
                              {...(errors.completion_date && {
                                helperText: errors.completion_date.message,
                              })}
                            />
                          }
                          value={field.value}
                          minDate={moment().toDate()}
                          maxDate={moment().endOf("month").toDate()}
                          selected={
                            field?.value
                              ? moment(field.value, "DD/MM/YYYY").toDate()
                              : null
                          }
                          showYearDropdown={true}
                          onChange={(date) => {
                            const formattedDate =
                              moment(date).format("DD/MM/YYYY");
                            field.onChange(formattedDate);
                          }}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="completed_by"
                      control={control}
                      rules={{
                        // required: "Address is required",
                        maxLength: {
                          value: 500,
                          message: "Maximum length is 500 characters",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          value={field?.value}
                          label={
                            <FormLabel
                              label="Completed By"
                              placeholder={"Vendor Name"}
                              required={true}
                            />
                          }
                          onChange={field?.onChange}
                          inputProps={{ maxLength: 500 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton
                                  edge="start"
                                  onMouseDown={(e) => e.preventDefault()}
                                >
                                  <AddressIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={Boolean(errors.completed_by)}
                          {...(errors.address && {
                            helperText: errors.completed_by.message,
                          })}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="supervised_by"
                      control={control}
                      rules={{
                        required: "Please select Supervisor",
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          select
                          fullWidth
                          value={field?.value ?? ""}
                          label={
                            <FormLabel label="Supervised By" required={true} />
                          }
                          onChange={field?.onChange}
                          SelectProps={{
                            displayEmpty: true,
                            IconComponent: ChevronDownIcon,
                            MenuProps: {
                              PaperProps: {
                                style: {
                                  maxHeight: 220, // Set your desired max height
                                  scrollbarWidth: "thin",
                                },
                              },
                            },
                          }}
                          error={Boolean(errors.supervised_by)}
                          {...(errors.supervised_by && {
                            helperText: errors.supervised_by.message,
                          })}
                        >
                          <MenuItem value="">
                            <em>Select Supervisor</em>
                          </MenuItem>
                          {/* {supervisorMasterOptions &&
                        supervisorMasterOptions !== null &&
                        supervisorMasterOptions.length > 0 &&
                        supervisorMasterOptions.map((option) => ( */}
                          <MenuItem
                            sx={{
                              whiteSpace: "normal", // allow wrapping
                              wordBreak: "break-word", // break long words if needed
                              maxWidth: 600, // control dropdown width
                              display: "-webkit-box",
                              WebkitLineClamp: 2, // limit to 2 lines
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          ></MenuItem>
                          {/* ))} */}
                        </CustomTextField>
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3, xl: 3 }}>
                    <Controller
                      name="duration"
                      control={control}
                      rules={{
                        required: "Address is required",
                        maxLength: {
                          value: 500,
                          message: "Maximum length is 500 characters",
                        },
                      }}
                      render={({ field }) => (
                        <CustomTextField
                          fullWidth
                          value={field?.value}
                          label={<FormLabel label="Duration" required={true} />}
                          onChange={field?.onChange}
                          inputProps={{ maxLength: 500 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <IconButton
                                  edge="start"
                                  onMouseDown={(e) => e.preventDefault()}
                                ></IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={Boolean(errors.duration)}
                          {...(errors.duration && {
                            helperText: errors.duration.message,
                          })}
                        />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
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
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }}>
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
          {selectedActivity?.type === "reschedule"
            ? "Confirm Reschedule"
            : "Mark Done"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
